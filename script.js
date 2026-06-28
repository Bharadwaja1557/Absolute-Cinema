/* =========================================================
   ABSOLUTE CINEMA — script-new.js (v2 "Reel")
   Hero spotlight · ambient poster glow ·
   detail lightbox · search / filter / sort · stats.
   Reads window.ACMovies (data/movies.js).
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------- State ---------------------------- */
  var ALL = [];
  var CURRENT = [];           // currently rendered (post-filter) list
  var state = { q: "", year: "all", lang: "all", dir: "desc" };

  /* ------------------------- Helpers ----------------------------- */
  function $(s) { return document.querySelector(s); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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
  function formatDateLong(str) {
    var p = parseDate(str);
    if (!p) return str ? String(str) : "Date to add";
    return p.d + " " + (MONTHS_LONG[p.mo - 1] || "") + " " + p.y;
  }

  var CLAP =
    '<svg class="ph__clap" viewBox="0 0 24 24" aria-hidden="true">' +
    '<rect x="2" y="8" width="20" height="13" rx="1"/>' +
    '<path d="M2 8 L6 3 L10 7 L14 3 L18 7 L22 3 L22 8 Z"/></svg>';

  var PIN =
    '<svg class="pin" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/>' +
    '<circle cx="12" cy="9" r="2.4"/></svg>';

  function isFmt(movie) {
    return movie.format && String(movie.format).trim().toUpperCase() !== "2D";
  }

  function tagsMarkup(movie) {
    var t = "";
    if (isFmt(movie)) t += '<span class="tag tag--fmt">' + esc(movie.format) + "</span>";
    if (movie.language) t += '<span class="tag tag--lang">' + esc(movie.language) + "</span>";
    if (movie.rerelease) t += '<span class="tag tag--rr">Re-release</span>';
    return t;
  }

  function placeholderInner(movie) {
    return (
      '<div class="ph">' + CLAP +
        '<span class="ph__title">' + esc(movie.title) + "</span>" +
        '<span class="ph__mark">Absolute Cinema</span>' +
      "</div>"
    );
  }

  function dateLine(movie) {
    if (movie.watchedDate) return formatDate(movie.watchedDate);
    var y = parseInt(movie.year, 10);
    return y ? String(y) : "";
  }

  /* ------------------------- Film card --------------------------- */
  function card(movie, idx) {
    var tags = tagsMarkup(movie);
    var posterInner;
    if (movie.poster) {
      var bg = esc(movie.poster);
      posterInner =
        '<span class="film__glow" style="background-image:url(\'' + bg + '\')"></span>' +
        '<div class="film__poster">' + tags +
          '<img src="' + bg + '" alt="Poster for ' + esc(movie.title) +
            '" loading="lazy" data-title="' + esc(movie.title) + '" onerror="ACposterError(this)">' +
          '<span class="film__view">View ⤢</span>' +
        "</div>";
    } else {
      posterInner =
        '<div class="film__poster film__poster--empty">' + tags + placeholderInner(movie) + "</div>";
    }
    var dl = dateLine(movie);
    var place = uniqueVenue(movie);
    return (
      '<button class="film reveal" type="button" data-idx="' + idx + '" ' +
        'aria-label="View details for ' + esc(movie.title) + '">' +
        posterInner +
        '<div class="film__info">' +
          '<h3 class="film__title">' + esc(movie.title) + "</h3>" +
          (dl ? '<p class="film__date">' + esc(dl) + "</p>" : "") +
          (place ? '<p class="film__venue">' + PIN + "<span>" + esc(place) + "</span></p>" : "") +
        "</div>" +
      "</button>"
    );
  }

  function uniqueVenue(movie) {
    var theatre = movie.theatre || movie.theater || "";
    return [theatre, movie.city].filter(Boolean).join(", ");
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

    var globalIdx = 0; // index into CURRENT for modal lookup
    mount.innerHTML = years.map(function (y) {
      var group = byYear[y].slice().sort(function (a, b) {
        var ka = a.watchedDate || (a.year + "-12-31");
        var kb = b.watchedDate || (b.year + "-12-31");
        var c = String(ka).localeCompare(String(kb));
        if (c === 0) c = String(a.title).localeCompare(String(b.title));
        return state.dir === "asc" ? c : -c;
      });
      var n = group.length + " film" + (group.length === 1 ? "" : "s");
      var cards = group.map(function (m) {
        var html = card(m, globalIdx);
        CURRENT[globalIdx] = m;
        globalIdx++;
        return html;
      }).join("");
      return (
        '<section class="year-group">' +
          '<span class="year-group__ghost" aria-hidden="true">' + y + "</span>" +
          '<div class="year-group__head">' +
            '<span class="year-group__num">' + y + "</span>" +
            '<span class="year-group__rule" aria-hidden="true"></span>' +
            '<span class="year-group__count">' + n + "</span>" +
          "</div>" +
          '<div class="grid">' + cards + "</div>" +
        "</section>"
      );
    }).join("");

    CURRENT.length = globalIdx;
    observeReveals();
  }

  /* --------------------------- Hero ------------------------------ */
  function buildHero(movies) {
    if (!movies.length) return;

    // latest by watchedDate
    var latest = movies.slice().sort(function (a, b) {
      return String(b.watchedDate || "").localeCompare(String(a.watchedDate || ""));
    })[0];

    if (latest && latest.poster) {
      var bd = $("#hero-backdrop");
      bd.style.backgroundImage = "url('" + latest.poster + "')";
      var pre = new Image();
      pre.onload = function () { bd.classList.add("is-ready"); };
      pre.onerror = function () { bd.classList.add("is-ready"); };
      pre.src = latest.poster;

      var feat = $("#hero-feature");
      feat.hidden = false;
      var img = $("#hero-poster");
      img.src = latest.poster;
      img.alt = "Poster for " + latest.title;
      img.setAttribute("data-title", latest.title);
      img.setAttribute("onerror", "ACposterError(this)");
      $("#hero-film-title").textContent = latest.title;
      $("#hero-film-sub").textContent = dateLine(latest);

      $("#hero-card").addEventListener("click", function () { openModal(latest); });
    }

    renderHeroStats(movies);
  }

  function renderHeroStats(movies) {
    var langs = {};
    movies.forEach(function (m) { if (m.language) langs[m.language] = 1; });
    var years = movies.map(watchedYear).filter(Boolean);
    var first = Math.min.apply(null, years);
    var last = Math.max.apply(null, years);

    var parts = [
      { n: movies.length, label: "Films" },
      { n: Object.keys(langs).length, label: "Languages" },
      { n: (first === last ? String(first) : first + "–" + last), label: "On record" }
    ];
    $("#hero-stats").innerHTML = parts.map(function (p, i) {
      return (i ? '<span class="hero__stat-div" aria-hidden="true"></span>' : "") +
        '<span class="hero__stat"><b>' + p.n + "</b><span>" + p.label + "</span></span>";
    }).join("");
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

    var langPairs = langKeys.map(function (k) { return [k, langs[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; });
    $("#bars-lang").innerHTML =
      '<p class="bars__title">By language</p>' +
      barRows(langPairs, Math.max.apply(null, langPairs.map(function (p) { return p[1]; })));

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
      entries.forEach(function (e) { if (e.isIntersecting) { fill(); io.disconnect(); } });
    }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });
    io.observe(section);
  }

  /* --------------------------- Modal ----------------------------- */
  var lastFocused = null;

  function factRow(label, valueHTML) {
    return '<div class="modal__fact"><dt>' + esc(label) + "</dt><dd>" + valueHTML + "</dd></div>";
  }

  function openModal(movie) {
    if (!movie) return;
    lastFocused = document.activeElement;

    var modal = $("#film-modal");
    var bd = $("#modal-backdrop");
    bd.style.backgroundImage = movie.poster ? "url('" + movie.poster + "')" : "none";

    var img = $("#modal-poster-img");
    if (movie.poster) {
      img.src = movie.poster;
      img.alt = "Poster for " + movie.title;
      img.setAttribute("data-title", movie.title);
      img.setAttribute("onerror", "ACposterError(this)");
      img.style.display = "";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
    }
    // no tags on the modal poster — language/format/re-release shown in the facts list
    $("#modal-tags").innerHTML = "";

    $("#modal-eyebrow").textContent = isFmt(movie)
      ? movie.format + " screening" : "From the archive";
    $("#modal-title").textContent = movie.title;

    var facts = "";
    facts += factRow("Watched", esc(formatDateLong(movie.watchedDate)));
    var place = uniqueVenue(movie);
    if (place) facts += factRow("Theatre", PIN.replace('class="pin"', 'class="modal__pin"') + "<span>" + esc(place) + "</span>");
    if (movie.language) facts += factRow("Language", esc(movie.language));
    if (movie.year) facts += factRow("Released", esc(String(movie.year)));
    var bits = [];
    if (movie.format) bits.push('<span class="modal__chip">' + esc(movie.format) + "</span>");
    if (movie.rerelease) bits.push('<span class="modal__chip">Re-release</span>');
    if (bits.length) facts += factRow("Format", bits.join(" "));
    $("#modal-facts").innerHTML = facts;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#modal-close").focus();
    document.addEventListener("keydown", onModalKey);
  }

  function closeModal() {
    var modal = $("#film-modal");
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKey);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onModalKey(e) {
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") {
      // simple focus trap between close button and dialog
      var focusables = $("#film-modal").querySelectorAll("button, [href], img, input");
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* ------------------------- Filtering --------------------------- */
  function apply() {
    var q = state.q.trim().toLowerCase();
    var list = ALL.filter(function (m) {
      if (state.year !== "all" && String(watchedYear(m)) !== state.year) return false;
      if (state.lang !== "all" && (m.language || "") !== state.lang) return false;
      if (q) {
        var hay = (m.title || "") + " " + (m.language || "") + " " +
                  (m.theatre || m.theater || "") + " " + (m.city || "") + " " +
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
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    }
    // stagger within each grid row
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 12, 8) * 40) + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------------------- Poster handling ------------------------ */
  // Posters are .webp; fall back to .jpg / .png, then the designed placeholder.
  window.ACposterError = function (img) {
    var src = img.getAttribute("src") || "";
    if (!img.getAttribute("data-ext-tried")) {
      img.setAttribute("data-ext-tried", "1");
      if (/\.webp$/i.test(src)) { img.src = src.replace(/\.webp$/i, ".jpg"); return; }
      if (/\.jpg$/i.test(src))  { img.src = src.replace(/\.jpg$/i,  ".png"); return; }
      if (/\.png$/i.test(src))  { img.src = src.replace(/\.png$/i,  ".jpg"); return; }
    }
    ACfallback(img);
  };

  window.ACfallback = function (img) {
    var poster = img.closest(".film__poster") || img.parentNode;
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

  var REQUIRED_FIELDS = ["title", "watchedDate", "year", "language", "poster", "format", "city"];

  function init(movies) {
    if (!Array.isArray(movies)) { showError("The data file must contain a list of films."); return; }
    ALL = movies;

    movies.forEach(function (m) {
      REQUIRED_FIELDS.forEach(function (f) {
        if (m[f] == null || m[f] === "") {
          console.warn("Absolute Cinema: \"" + (m.title || "unknown") + "\" is missing required field: " + f);
        }
      });
      if ((m.theatre == null || m.theatre === "") && (m.theater == null || m.theater === ""))
        console.warn("Absolute Cinema: \"" + (m.title || "unknown") + "\" is missing required field: theatre");
    });

    buildHero(movies);
    buildFilters(movies);
    apply();

    /* search */
    var input = $("#search-input"), t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = input.value; apply(); }, 70);
    });

    /* filters + sort */
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

    /* gallery → modal (event delegation) */
    $("#gallery").addEventListener("click", function (e) {
      var btn = e.target.closest(".film");
      if (!btn) return;
      var idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (!isNaN(idx) && CURRENT[idx]) openModal(CURRENT[idx]);
    });

    /* modal close interactions */
    $("#modal-close").addEventListener("click", closeModal);
    $("#modal-scrim").addEventListener("click", closeModal);
    $("#modal-backdrop").addEventListener("click", closeModal);

    /* condensing sticky nav */
    var nav = $("#nav");
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-stuck");
      else nav.classList.remove("is-stuck");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function load() {
    if (Array.isArray(window.ACMovies)) { init(window.ACMovies); return; }
    showError("data/movies.js is missing or malformed. It should define window.ACMovies = [ ... ].");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
