/* =========================================================
   Absolute Cinema — reboot
   Reads window.ACMovies (data/movies.js).
   Opening · search / filter / sort · detail panel · statistics.
   ========================================================= */

(function () {
  "use strict";

  var ALL = [];
  var SHOWN = [];                          // post-filter, index-aligned with the cards
  var state = { q: "", year: "all", lang: "all", dir: "desc" };

  var CURRENCY = "₹";                 // shown before every price

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

  /* Price is optional and may be a number or a numeric string. */
  function priceOf(movie) {
    var p = movie && movie.price;
    if (p == null || p === "") return null;
    var n = typeof p === "number" ? p : parseFloat(String(p).replace(/[^0-9.]/g, ""));
    return isNaN(n) ? null : n;
  }
  function money(n) {
    // Whole rupees stay whole; paise are kept when a price has them.
    var exact = n % 1 === 0 ? 0 : 2;
    return CURRENCY + n.toLocaleString("en-IN", {
      minimumFractionDigits: exact, maximumFractionDigits: exact
    });
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

  /* Title and watched date only — theatre and city live in the detail panel. */
  function cardMarkup(movie, idx) {
    var date = shortDate(movie.watchedDate);
    return (
      '<button class="film" type="button" data-idx="' + idx + '" ' +
        'aria-label="Details for ' + esc(movie.title) + '">' +
        artMarkup(movie, "film__art") +
        '<div class="film__info">' +
          '<h3 class="film__title">' + esc(movie.title) + "</h3>" +
          (date ? '<p class="film__date">' + esc(date) + "</p>" : "") +
        "</div>" +
      "</button>"
    );
  }

  /* A missing poster falls back to the film's title on a plain tile. Used by
     the cards, the opening feature and the detail panel alike, so an asset
     that has not been uploaded yet never shows a broken image. */
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

  function posterImg(movie) {
    return '<img src="' + esc(posterURL(movie)) + '" alt="" data-title="' +
      esc(movie.title) + '">';
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

  /* -------------------------- Opening ---------------------------- */

  function buildHero(movies) {
    if (!movies.length) return;

    var latest = movies.slice().sort(function (a, b) {
      return String(b.watchedDate || "").localeCompare(String(a.watchedDate || ""));
    })[0];

    if (latest && latest.poster) {
      var url = posterURL(latest);
      var backdrop = $("#hero-backdrop");
      backdrop.style.backgroundImage = "url('" + url + "')";

      // Fade the wash in once the poster is actually decoded.
      var pre = new Image();
      pre.onload = pre.onerror = function () { backdrop.classList.add("is-ready"); };
      pre.src = url;

      $("#hero-feature").hidden = false;
      $("#hero-art").innerHTML = posterImg(latest);
      handlePosterErrors($("#hero-art"));
      $("#hero-title").textContent = latest.title;
      $("#hero-sub").textContent = shortDate(latest.watchedDate);
      $("#hero-card").addEventListener("click", function () { openModal(latest); });
    }

    var langs = countBy(movies, "language");
    var span = yearSpan(movies);
    $("#hero-stats").innerHTML = [
      [movies.length, "Films"],
      [Object.keys(langs).length, "Languages"],
      [span, "On record"]
    ].map(function (p) {
      return '<span class="hero__stat"><b>' + p[0] + "</b><span>" + p[1] + "</span></span>";
    }).join("");
  }

  function countBy(movies, key) {
    var out = {};
    movies.forEach(function (m) { if (m[key]) out[m[key]] = (out[m[key]] || 0) + 1; });
    return out;
  }
  function yearSpan(movies) {
    var years = movies.map(watchedYear).filter(Boolean);
    if (!years.length) return "—";
    var lo = Math.min.apply(null, years), hi = Math.max.apply(null, years);
    return lo === hi ? String(lo) : lo + "–" + hi;
  }

  /* ---------------------------- Modal ---------------------------- */

  var lastFocused = null;

  function fact(label, value, cls) {
    return '<div class="fact"><dt>' + esc(label) + "</dt>" +
      '<dd' + (cls ? ' class="' + cls + '"' : "") + ">" + esc(value) + "</dd></div>";
  }

  function openModal(movie) {
    if (!movie) return;
    lastFocused = document.activeElement;

    var art = $("#modal-art");
    art.innerHTML = movie.poster ? posterImg(movie) : "";
    handlePosterErrors(art);
    $("#modal-title").textContent = movie.title;

    var rows = fact("Watched", longDate(movie.watchedDate), true);

    var place = venue(movie);
    if (place) rows += fact("Theatre", place);

    // Screen and seat read as one line when both are filled in.
    var seat = [
      movie.screen ? (/^\d+$/.test(String(movie.screen).trim())
        ? "Screen " + movie.screen : String(movie.screen)) : "",
      movie.seat ? "Seat " + movie.seat : ""
    ].filter(Boolean).join(" · ");
    if (seat) rows += fact("Seat", seat, "num");

    if (movie.language) rows += fact("Language", movie.language);
    if (movie.year) rows += fact("Released", String(movie.year), "num");

    var fmt = [movie.format, movie.rerelease ? "Re-release" : ""]
      .filter(Boolean).join(" · ");
    if (fmt) rows += fact("Format", fmt);

    var price = priceOf(movie);
    if (price != null) rows += fact("Ticket", money(price), "money");

    $("#modal-facts").innerHTML = rows;

    var note = $("#modal-note");
    note.textContent = movie.note || "";
    note.hidden = !movie.note;

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

  function onModalKey(e) { if (e.key === "Escape") closeModal(); }

  /* -------------------------- Statistics -------------------------- */

  function renderStats(movies) {
    var section = $("#stats");
    if (!movies.length) { section.hidden = true; return; }
    section.hidden = false;

    var langs = countBy(movies, "language");
    var priced = movies.map(priceOf).filter(function (p) { return p != null; });
    var spend = priced.reduce(function (a, b) { return a + b; }, 0);

    var cells =
      cell("Films archived", String(movies.length)) +
      cell("Languages", String(Object.keys(langs).length)) +
      cell("Years on record", yearSpan(movies));

    if (priced.length) {
      cells += cell("Total spent", money(spend),
        priced.length === movies.length
          ? "across every ticket"
          : "across " + priced.length + " of " + movies.length + " tickets", "money");
      cells += cell("Average ticket", money(spend / priced.length), null, "money");
    } else {
      var rr = movies.filter(function (m) { return m.rerelease; }).length;
      cells += cell("Re-releases", String(rr), "seen on the big screen again");
    }

    $("#stats-grid").innerHTML = cells;

    var langPairs = Object.keys(langs)
      .map(function (k) { return [k, langs[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; });

    var byYear = {};
    movies.forEach(function (m) {
      var y = watchedYear(m);
      byYear[y] = (byYear[y] || 0) + 1;
    });
    var yearPairs = Object.keys(byYear).map(Number)
      .sort(function (a, b) { return b - a; })
      .map(function (y) { return [String(y), byYear[y]]; });

    $("#bars-lang").innerHTML = '<p class="bars__title">By language</p>' + bars(langPairs);
    $("#bars-year").innerHTML = '<p class="bars__title">By year</p>' + bars(yearPairs);
  }

  function cell(label, value, sub, cls) {
    return '<dl class="cell"><dt>' + esc(label) + "</dt>" +
      '<dd' + (cls ? ' class="' + cls + '"' : "") + ">" + esc(value) +
      (sub ? "<small>" + esc(sub) + "</small>" : "") + "</dd></dl>";
  }

  function bars(pairs) {
    var max = Math.max.apply(null, pairs.map(function (p) { return p[1]; }));
    return pairs.map(function (p) {
      var pct = Math.round((p[1] / max) * 100);
      return (
        '<div class="bar">' +
          '<span class="bar__label">' + esc(p[0]) + "</span>" +
          '<span class="bar__track"><span class="bar__fill" style="width:' + pct + '%"></span></span>' +
          '<span class="bar__n">' + p[1] + "</span>" +
        "</div>"
      );
    }).join("");
  }

  /* --------------------------- Filtering -------------------------- */

  function sortKey(m) { return String(m.watchedDate || (m.year + "-12-31")); }

  function apply() {
    var q = state.q.trim().toLowerCase();

    var list = ALL.filter(function (m) {
      if (state.year !== "all" && String(watchedYear(m)) !== state.year) return false;
      if (state.lang !== "all" && (m.language || "") !== state.lang) return false;
      if (!q) return true;
      var hay = [m.title, m.language, m.theatre || m.theater, m.city,
                 m.note, watchedYear(m)].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    list.sort(function (a, b) {
      var c = sortKey(a).localeCompare(sortKey(b));
      if (c === 0) c = String(a.title).localeCompare(String(b.title));
      return state.dir === "asc" ? c : -c;
    });

    render(list);
    renderStats(list);

    var filtered = q || state.year !== "all" || state.lang !== "all";
    $("#summary").textContent = filtered
      ? list.length + " of " + ALL.length + " films"
      : ALL.length + " films";
    $("#clear").hidden = !filtered;
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

    buildHero(movies);
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
    else $("#gallery").innerHTML = '<p class="note">data/movies.js is missing or malformed.</p>';
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
