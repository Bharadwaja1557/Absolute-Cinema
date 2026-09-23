/* =========================================================
   Absolute Cinema — reboot
   Reads window.ACMovies (data/movies.js). Search, filter,
   sort, and a detail panel. Nothing else.
   ========================================================= */

(function () {
  "use strict";

  var ALL = [];
  var SHOWN = [];                                   // post-filter, index-aligned with the cards
  var state = { q: "", year: "all", lang: "all", dir: "desc" };

  function $(s) { return document.querySelector(s); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* Posters live in GitHub Releases, one release tag per language, so the
     repo stays light. "poster" in the data file is just the asset filename;
     the tag is the film's language, lowercased. A full URL passes through. */
  var POSTER_BASE =
    "https://github.com/Bharadwaja1557/Absolute-Cinema/releases/download";

  function posterURL(movie) {
    var poster = movie && movie.poster;
    if (!poster) return "";
    if (/^https?:\/\//i.test(poster)) return poster;
    var file = poster.replace(/^.*\//, "").replace(/[()]/g, "");
    var tag = String(movie.language || "").trim().toLowerCase();
    return tag ? POSTER_BASE + "/" + tag + "/" + encodeURIComponent(file) : file;
  }

  var MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

  function parseDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ""));
    return m ? { y: +m[1], mo: +m[2], d: +m[3] } : null;
  }
  function watchedYear(m) {
    var p = parseDate(m.watchedDate);
    return p ? p.y : (parseInt(m.year, 10) || 0);
  }
  function shortDate(str) {
    var p = parseDate(str);
    return p ? p.d + " " + MONTHS[p.mo - 1].slice(0, 3) + " " + p.y : "";
  }
  function longDate(str) {
    var p = parseDate(str);
    return p ? p.d + " " + MONTHS[p.mo - 1] + " " + p.y : "—";
  }

  function venue(movie) {
    return [movie.theatre || movie.theater || "", movie.city].filter(Boolean).join(", ");
  }
  function specialFormat(movie) {
    var f = String(movie.format || "").trim();
    return f && f.toUpperCase() !== "2D" ? f : "";
  }

  /* ---------------------------- Cards ---------------------------- */

  function artMarkup(movie, cls) {
    var fmt = specialFormat(movie);
    var chip = fmt ? '<span class="film__fmt">' + esc(fmt) + "</span>" : "";
    if (!movie.poster) {
      return '<div class="' + cls + '">' + chip +
        '<div class="film__ph">' + esc(movie.title) + "</div></div>";
    }
    return '<div class="' + cls + '">' + chip +
      '<img src="' + esc(posterURL(movie)) + '" alt="" loading="lazy" ' +
      'data-title="' + esc(movie.title) + '"></div>';
  }

  function cardMarkup(movie, idx) {
    var meta = [shortDate(movie.watchedDate), venue(movie)].filter(Boolean).join(" · ");
    return (
      '<button class="film" type="button" data-idx="' + idx + '" ' +
        'aria-label="Details for ' + esc(movie.title) + '">' +
        artMarkup(movie, "film__art") +
        '<div class="film__info">' +
          '<h3 class="film__title">' + esc(movie.title) + "</h3>" +
          (meta ? '<p class="film__meta">' + esc(meta) + "</p>" : "") +
        "</div>" +
      "</button>"
    );
  }

  /* A missing poster falls back to the film's title on a plain tile. */
  function handlePosterErrors(root) {
    root.querySelectorAll("img[data-title]").forEach(function (img) {
      img.addEventListener("error", function () {
        var art = img.parentNode;
        if (!art) return;
        var chip = art.querySelector(".film__fmt");
        art.innerHTML = (chip ? chip.outerHTML : "") +
          '<div class="film__ph">' + esc(img.getAttribute("data-title")) + "</div>";
      });
    });
  }

  /* --------------------------- Gallery --------------------------- */

  function render(list) {
    var mount = $("#gallery");
    SHOWN = list;

    if (!list.length) {
      mount.innerHTML = '<p class="note">No films match.</p>';
      return;
    }

    var byYear = {};
    list.forEach(function (m, i) {
      var y = watchedYear(m);
      (byYear[y] = byYear[y] || []).push(i);
    });

    var years = Object.keys(byYear).map(Number)
      .sort(function (a, b) { return state.dir === "asc" ? a - b : b - a; });

    mount.innerHTML = years.map(function (y) {
      var group = byYear[y];
      var cards = group.map(function (i) { return cardMarkup(list[i], i); }).join("");
      return (
        '<section class="year">' +
          '<div class="year__head">' +
            '<h2 class="year__num">' + y + "</h2>" +
            '<span class="year__count">' + group.length +
              " film" + (group.length === 1 ? "" : "s") + "</span>" +
          "</div>" +
          '<div class="grid">' + cards + "</div>" +
        "</section>"
      );
    }).join("");

    handlePosterErrors(mount);
  }

  /* ---------------------------- Modal ---------------------------- */

  var lastFocused = null;

  function fact(label, value) {
    return '<div class="fact"><dt>' + esc(label) + "</dt><dd>" + esc(value) + "</dd></div>";
  }

  function openModal(movie) {
    if (!movie) return;
    lastFocused = document.activeElement;

    $("#modal-art").innerHTML = movie.poster
      ? '<img src="' + esc(posterURL(movie)) + '" alt="">' : "";
    $("#modal-title").textContent = movie.title;

    var rows = fact("Watched", longDate(movie.watchedDate));
    var place = venue(movie);
    if (place) rows += fact("Theatre", place);
    if (movie.language) rows += fact("Language", movie.language);
    if (movie.year) rows += fact("Released", String(movie.year));
    if (movie.format) rows += fact("Format", movie.format + (movie.rerelease ? " · Re-release" : ""));
    else if (movie.rerelease) rows += fact("Format", "Re-release");
    $("#modal-facts").innerHTML = rows;

    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
    $("#modal-close").focus();
    document.addEventListener("keydown", onModalKey);
  }

  function closeModal() {
    var modal = $("#modal");
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKey);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onModalKey(e) {
    if (e.key === "Escape") closeModal();
  }

  /* --------------------------- Filtering -------------------------- */

  function sortKey(m) {
    return String(m.watchedDate || (m.year + "-12-31"));
  }

  function apply() {
    var q = state.q.trim().toLowerCase();

    var list = ALL.filter(function (m) {
      if (state.year !== "all" && String(watchedYear(m)) !== state.year) return false;
      if (state.lang !== "all" && (m.language || "") !== state.lang) return false;
      if (!q) return true;
      var hay = [m.title, m.language, m.theatre || m.theater, m.city, watchedYear(m)]
        .join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    list.sort(function (a, b) {
      var c = sortKey(a).localeCompare(sortKey(b));
      if (c === 0) c = String(a.title).localeCompare(String(b.title));
      return state.dir === "asc" ? c : -c;
    });

    render(list);

    var filtered = q || state.year !== "all" || state.lang !== "all";
    $("#summary").textContent = filtered
      ? list.length + " of " + ALL.length + " films"
      : summaryLine(ALL);
    $("#clear").hidden = !filtered;
  }

  function summaryLine(movies) {
    var langs = {};
    movies.forEach(function (m) { if (m.language) langs[m.language] = 1; });
    var years = movies.map(watchedYear).filter(Boolean);
    var lo = Math.min.apply(null, years), hi = Math.max.apply(null, years);
    return movies.length + " films · " + Object.keys(langs).length + " languages · " +
      (lo === hi ? lo : lo + "–" + hi);
  }

  /* --------------------------- Controls --------------------------- */

  function buildFilters(movies) {
    var years = {}, langs = {};
    movies.forEach(function (m) {
      years[watchedYear(m)] = 1;
      if (m.language) langs[m.language] = 1;
    });

    var ySel = $("#filter-year");
    Object.keys(years).map(Number).sort(function (a, b) { return b - a; })
      .forEach(function (y) { ySel.add(new Option(y, String(y))); });

    var lSel = $("#filter-lang");
    Object.keys(langs).sort().forEach(function (l) { lSel.add(new Option(l, l)); });
  }

  /* ----------------------------- Boot ----------------------------- */

  function init(movies) {
    if (!Array.isArray(movies)) {
      $("#gallery").innerHTML = '<p class="note">The data file must contain a list of films.</p>';
      return;
    }
    ALL = movies;

    buildFilters(movies);
    apply();

    var search = $("#search"), t;
    search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = search.value; apply(); }, 100);
    });

    $("#filter-year").addEventListener("change", function () { state.year = this.value; apply(); });
    $("#filter-lang").addEventListener("change", function () { state.lang = this.value; apply(); });

    var sortBtn = $("#sort");
    sortBtn.addEventListener("click", function () {
      state.dir = state.dir === "desc" ? "asc" : "desc";
      sortBtn.textContent = state.dir === "desc" ? "Newest first" : "Oldest first";
      apply();
    });

    $("#clear").addEventListener("click", function () {
      state.q = ""; state.year = "all"; state.lang = "all";
      search.value = "";
      $("#filter-year").value = "all";
      $("#filter-lang").value = "all";
      apply();
    });

    $("#gallery").addEventListener("click", function (e) {
      var btn = e.target.closest(".film");
      if (!btn) return;
      openModal(SHOWN[+btn.getAttribute("data-idx")]);
    });

    $("#modal-close").addEventListener("click", closeModal);
    $("#modal-scrim").addEventListener("click", closeModal);
  }

  function load() {
    if (Array.isArray(window.ACMovies)) init(window.ACMovies);
    else $("#gallery").innerHTML =
      '<p class="note">data/movies.js is missing or malformed.</p>';
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
