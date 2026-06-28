/* =========================================================
   ABSOLUTE CINEMA — script.js (remastered)
   Poster gallery + search + year/language filters + sort.
   Reads window.ACMovies (data/movies.js); falls back to
   fetching data/movies.json when served over http.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------- State ---------------------------- */
  var ALL = [];
  var state = { q: "", year: "all", lang: "all", dir: "desc" };

  /* ------------------------- Helpers ----------------------------- */
  function $(s) { return document.querySelector(s); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function parseDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ""));
    return m ? { y: +m[1], mo: +m[2], d: +m[3] } : null;
  }
  function watchedYear(m) {
    var p = parseDate(m.watchedDate);
    return p ? p.y : (parseInt(m.year, 10) || 0);
  }
  function formatDate(str) {
    var p = parseDate(str);
    if (!p) return str ? String(str) : "Date to add";
    return p.d + " " + (MONTHS[p.mo - 1] || "") + " " + p.y;
  }

  var CLAP =
    '<svg class="ph__clap" viewBox="0 0 24 24" aria-hidden="true">' +
    '<rect x="2" y="8" width="20" height="13" rx="1"/>' +
    '<path d="M2 8 L6 3 L10 7 L14 3 L18 7 L22 3 L22 8 Z"/></svg>';

  function placeholder(movie, tags) {
    return (
      '<div class="film__poster film__poster--empty">' + tags +
        '<div class="ph">' + CLAP +
          '<span class="ph__title">' + esc(movie.title) + "</span>" +
          '<span class="ph__mark">Absolute Cinema</span>' +
        "</div>" +
      "</div>"
    );
  }

  function tagsMarkup(movie) {
    var t = "";
    if (movie.format && String(movie.format).trim().toUpperCase() !== "2D")
      t += '<span class="tag tag--fmt">' + esc(movie.format) + "</span>";
    if (movie.language) t += '<span class="tag tag--lang">' + esc(movie.language) + "</span>";
    if (movie.rerelease) t += '<span class="tag tag--rr">Re-release</span>';
    return t;
  }

  var PIN =
    '<svg class="pin" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/>' +
    '<circle cx="12" cy="9" r="2.4"/></svg>';

  function venueLine(movie) {
    var place = [movie.theater, movie.city].filter(Boolean).join(", ");
    if (!place) return "";
    return '<p class="film__venue">' + PIN + "<span>" + esc(place) + "</span></p>";
  }

  /* ------------------------- Film card --------------------------- */
  function dateLine(movie) {
    if (movie.watchedDate) return formatDate(movie.watchedDate);
    var y = parseInt(movie.year, 10);
    return y ? String(y) : "";
  }

  function card(movie) {
    var tags = tagsMarkup(movie);
    var poster;
    if (movie.poster) {
      poster =
        '<div class="film__poster">' + tags +
          '<img src="' + esc(movie.poster) + '" alt="Poster for ' + esc(movie.title) +
            '" loading="lazy" data-title="' + esc(movie.title) + '" onerror="ACposterError(this)">' +
        "</div>";
    } else {
      poster = placeholder(movie, tags);
    }
    var dl = dateLine(movie);
    return (
      '<article class="film reveal" tabindex="0">' +
        poster +
        '<div class="film__info">' +
          '<h3 class="film__title">' + esc(movie.title) + "</h3>" +
          (dl ? '<p class="film__date">' + esc(dl) + "</p>" : "") +
          venueLine(movie) +
        "</div>" +
      "</article>"
    );
  }

  /* ----------------------- Gallery render ------------------------ */
  function renderGallery(list) {
    var mount = $("#gallery");

    if (!list.length) {
      mount.innerHTML =
        '<div class="empty"><strong>No films match.</strong>' +
        "Try a different search or clear the filters.</div>";
      return;
    }

    var byYear = {};
    list.forEach(function (m) {
      var y = watchedYear(m);
      (byYear[y] = byYear[y] || []).push(m);
    });

    var years = Object.keys(byYear).map(Number)
      .sort(function (a, b) { return state.dir === "asc" ? a - b : b - a; });

    mount.innerHTML = years.map(function (y) {
      var group = byYear[y].slice().sort(function (a, b) {
        var ka = a.watchedDate || (a.year + "-12-31");
        var kb = b.watchedDate || (b.year + "-12-31");
        var c = String(ka).localeCompare(String(kb));
        if (c === 0) c = String(a.title).localeCompare(String(b.title));
        return state.dir === "asc" ? c : -c;
      });
      var n = group.length + " film" + (group.length === 1 ? "" : "s");
      return (
        '<div class="year-group">' +
          '<div class="year-head">' +
            '<span class="year-head__num">' + y + "</span>" +
            '<span class="year-head__count">' + n + "</span>" +
            '<span class="year-head__strip" aria-hidden="true"></span>' +
          "</div>" +
          '<div class="grid">' + group.map(card).join("") + "</div>" +
        "</div>"
      );
    }).join("");

    observeReveals();
  }

  /* --------------------------- Stats ----------------------------- */
  function renderStats(movies) {
    var section = $("#stats");
    if (!movies.length) { section.hidden = true; return; }
    section.hidden = false;

    var total = movies.length;

    var langs = {};
    movies.forEach(function (m) { if (m.language) langs[m.language] = (langs[m.language] || 0) + 1; });
    var langKeys = Object.keys(langs);

    var years = movies.map(watchedYear).filter(Boolean);
    var first = Math.min.apply(null, years);
    var last = Math.max.apply(null, years);

    var rerel = movies.filter(function (m) { return m.rerelease; }).length;

    // optional rating stat (only if any ratings present)
    var rated = movies.filter(function (m) { return m.rating != null && m.rating !== "" && !isNaN(+m.rating); });
    var avg = rated.length ? (rated.reduce(function (s, m) { return s + +m.rating; }, 0) / rated.length) : null;

    var cells =
      cell("Films archived", '<span class="accent">' + total + "</span>") +
      cell("Languages", String(langKeys.length)) +
      cell("Years on record", (first === last ? String(first) : first + "–" + last));
    cells += avg != null
      ? cell("Average rating", avg.toFixed(1) + "<small>out of 10</small>")
      : cell("Re-releases", String(rerel) + "<small>seen on the big screen again</small>");

    $("#stats-grid").innerHTML = cells;

    // by language
    var langPairs = langKeys.map(function (k) { return [k, langs[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; });
    $("#bars-lang").innerHTML =
      '<p class="bars__title">By language</p>' +
      barRows(langPairs, Math.max.apply(null, langPairs.map(function (p) { return p[1]; })));

    // by year
    var byYear = {};
    movies.forEach(function (m) { var y = watchedYear(m); byYear[y] = (byYear[y] || 0) + 1; });
    var yrPairs = Object.keys(byYear).map(Number).sort(function (a, b) { return b - a; })
      .map(function (y) { return [String(y), byYear[y]]; });
    $("#bars-year").innerHTML =
      '<p class="bars__title">By year</p>' +
      barRows(yrPairs, Math.max.apply(null, yrPairs.map(function (p) { return p[1]; })));

    animateBars(section);
  }

  function cell(label, value) {
    return '<dl class="stat-cell"><dt>' + esc(label) + "</dt><dd>" + value + "</dd></dl>";
  }
  function barRows(pairs, max) {
    return pairs.map(function (p) {
      var pct = Math.round((p[1] / max) * 100);
      return (
        '<div class="bar-row">' +
          '<span class="bar-row__label">' + esc(p[0]) + "</span>" +
          '<span class="bar-row__track"><span class="bar-row__fill" data-pct="' + pct + '"></span></span>' +
          '<span class="bar-row__n">' + p[1] + "</span>" +
        "</div>"
      );
    }).join("");
  }
  function animateBars(section) {
    var fills = section.querySelectorAll(".bar-row__fill");
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      fills.forEach(function (f) { f.style.width = f.getAttribute("data-pct") + "%"; });
      return;
    }
    var fill = function () { fills.forEach(function (f) { f.style.width = f.getAttribute("data-pct") + "%"; }); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { fill(); io.disconnect(); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });
    io.observe(section);
  }

  /* ------------------------- Filtering --------------------------- */
  function apply() {
    var q = state.q.trim().toLowerCase();
    var list = ALL.filter(function (m) {
      if (state.year !== "all" && String(watchedYear(m)) !== state.year) return false;
      if (state.lang !== "all" && (m.language || "") !== state.lang) return false;
      if (q) {
        var hay = (m.title || "") + " " + (m.language || "") + " " +
                  (m.theater || "") + " " + (m.city || "") + " " +
                  String(watchedYear(m));
        if (hay.toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    });

    renderGallery(list);
    renderStats(list);

    var active = q || state.year !== "all" || state.lang !== "all";
    var countEl = $("#result-count");
    countEl.textContent = active
      ? list.length + " of " + ALL.length + " films"
      : ALL.length + " films · every screening on record";
    $("#clear-filters").hidden = !active;
  }

  /* --------------------- Populate filters ------------------------ */
  function buildFilters(movies) {
    var years = {}, langs = {};
    movies.forEach(function (m) {
      years[watchedYear(m)] = 1;
      if (m.language) langs[m.language] = 1;
    });

    var ySel = $("#filter-year");
    Object.keys(years).map(Number).sort(function (a, b) { return b - a; })
      .forEach(function (y) {
        var o = document.createElement("option");
        o.value = String(y); o.textContent = y; ySel.appendChild(o);
      });

    var lSel = $("#filter-lang");
    Object.keys(langs).sort().forEach(function (l) {
      var o = document.createElement("option");
      o.value = l; o.textContent = l; lSel.appendChild(o);
    });
  }

  /* ----------------------- Reveal on scroll ---------------------- */
  var revealObserver = null;
  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function observeReveals() {
    var items = document.querySelectorAll(".reveal:not(.is-in)");
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    }
    items.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------- Poster handling ------------------------ */
  // Posters may be .jpg or .png. Try the other extension once, then fall back
  // to the designed placeholder.
  window.ACposterError = function (img) {
    var src = img.getAttribute("src") || "";
    if (!img.getAttribute("data-ext-tried")) {
      if (/\.jpg$/i.test(src)) { img.setAttribute("data-ext-tried", "1"); img.src = src.replace(/\.jpg$/i, ".png"); return; }
      if (/\.png$/i.test(src)) { img.setAttribute("data-ext-tried", "1"); img.src = src.replace(/\.png$/i, ".jpg"); return; }
    }
    ACfallback(img);
  };

  window.ACfallback = function (img) {
    var poster = img.parentNode;
    var title = img.getAttribute("data-title") || "";
    var tags = poster.querySelectorAll(".tag");
    var tagHTML = "";
    tags.forEach(function (t) { tagHTML += t.outerHTML; });
    poster.classList.add("film__poster--empty");
    poster.innerHTML = tagHTML +
      '<div class="ph">' + CLAP +
        '<span class="ph__title">' + esc(title) + "</span>" +
        '<span class="ph__mark">Absolute Cinema</span>' +
      "</div>";
  };

  /* ----------------------------- Boot ---------------------------- */
  function showError(msg) {
    $("#gallery").innerHTML =
      '<div class="empty"><strong>The archive could not be opened.</strong>' + esc(msg) + "</div>";
  }

  var REQUIRED_FIELDS = ["title", "watchedDate", "year", "language", "poster", "format", "theater", "city"];

  function init(movies) {
    if (!Array.isArray(movies)) { showError("The data file must contain a list of films."); return; }
    ALL = movies;

    movies.forEach(function (m) {
      REQUIRED_FIELDS.forEach(function (f) {
        if (m[f] == null || m[f] === "") {
          console.warn("Absolute Cinema: \"" + (m.title || "unknown") + "\" is missing required field: " + f);
        }
      });
    });

    buildFilters(movies);
    apply();

    var input = $("#search-input"), t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = input.value; apply(); }, 70);
    });

    $("#filter-year").addEventListener("change", function () { state.year = this.value; apply(); });
    $("#filter-lang").addEventListener("change", function () { state.lang = this.value; apply(); });

    var sortBtn = $("#sort-toggle");
    sortBtn.setAttribute("data-dir", state.dir);
    sortBtn.addEventListener("click", function () {
      state.dir = state.dir === "desc" ? "asc" : "desc";
      sortBtn.setAttribute("data-dir", state.dir);
      $("#sort-label").textContent = state.dir === "desc" ? "Newest" : "Oldest";
      apply();
    });

    $("#clear-filters").addEventListener("click", function () {
      state.q = ""; state.year = "all"; state.lang = "all";
      input.value = ""; $("#filter-year").value = "all"; $("#filter-lang").value = "all";
      apply();
    });
  }

  function load() {
    if (Array.isArray(window.ACMovies)) { init(window.ACMovies); return; }
    showError("data/movies.js is missing or malformed. It should define " +
              "window.ACMovies = [ ... ].");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
