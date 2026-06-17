/* =========================================================
   ABSOLUTE CINEMA — script.js
   Loads data/movies.json and renders the whole archive.
   No frameworks, no build step. Plain ES modules-free JS.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------- State ---------------------------- */
  var ALL_MOVIES = [];

  /* ------------------------- DOM helpers ------------------------- */
  var $ = function (sel) { return document.querySelector(sel); };

  function escapeHTML(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* -------------------------- Formatters ------------------------- */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Parse "YYYY-MM-DD" safely (avoids timezone shifts of new Date(str)).
  function parseDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ""));
    if (!m) return null;
    return { y: +m[1], mo: +m[2], d: +m[3] };
  }

  function watchedYear(movie) {
    var p = parseDate(movie.watchedDate);
    return p ? p.y : (parseInt(movie.year, 10) || 0);
  }

  function formatDate(str) {
    var p = parseDate(str);
    if (!p) return String(str || "—");
    return p.d + " " + (MONTHS[p.mo - 1] || "") + " " + p.y;
  }

  // Deterministic faux ticket serial from the movie fields.
  function serial(movie) {
    var base = (movie.title || "") + (movie.watchedDate || "") + (movie.theater || "");
    var h = 0;
    for (var i = 0; i < base.length; i++) {
      h = (h * 31 + base.charCodeAt(i)) >>> 0;
    }
    var n = (h % 1000000).toString().padStart(6, "0");
    return "AC-" + n;
  }

  /* ------------------------- Rendering --------------------------- */

  function heroStats(movies) {
    var el = $("#hero-stats");
    if (!movies.length) {
      el.innerHTML =
        statBlock("Films archived", "0") +
        statBlock("First entry", "—") +
        statBlock("Latest entry", "—");
      return;
    }
    var years = movies.map(watchedYear).filter(Boolean);
    var first = Math.min.apply(null, years);
    var last = Math.max.apply(null, years);
    el.innerHTML =
      statBlock("Films archived", String(movies.length)) +
      statBlock("First entry", String(first)) +
      statBlock("Latest entry", String(last));
  }

  function statBlock(label, value) {
    return '<div class="hero__stat"><dt>' + escapeHTML(label) +
           "</dt><dd>" + escapeHTML(value) + "</dd></div>";
  }

  // Clapperboard SVG used for the missing-poster fallback.
  var CLAP_SVG =
    '<svg class="clap" viewBox="0 0 24 24" aria-hidden="true">' +
    '<rect x="2" y="8" width="20" height="13" rx="1"/>' +
    '<path d="M2 8 L6 3 L10 7 L14 3 L18 7 L22 3 L22 8 Z"/>' +
    "</svg>";

  function posterMarkup(movie) {
    var rating = (movie.rating != null && movie.rating !== "")
      ? '<div class="ticket__rating"><b>' + escapeHTML(movie.rating) +
        "</b><span>/10</span></div>"
      : "";

    if (movie.poster) {
      // Real <img> with graceful fallback to the clapperboard placeholder.
      return (
        '<div class="ticket__poster">' +
          rating +
          '<img src="' + escapeHTML(movie.poster) + '" alt="Poster for ' +
            escapeHTML(movie.title) + '" loading="lazy" ' +
            'onerror="ACfallback(this)" data-title="' + escapeHTML(movie.title) + '">' +
        "</div>"
      );
    }
    return emptyPoster(movie, rating);
  }

  function emptyPoster(movie, rating) {
    return (
      '<div class="ticket__poster ticket__poster--empty">' +
        rating +
        CLAP_SVG +
        '<span class="ph-title">' + escapeHTML(movie.title) + "</span>" +
      "</div>"
    );
  }

  function row(key, value) {
    if (value == null || value === "") return "";
    return '<div class="ticket__row"><span class="k">' + escapeHTML(key) +
           '</span><span class="v">' + escapeHTML(value) + "</span></div>";
  }

  function ticketCard(movie) {
    var notes = movie.notes
      ? '<p class="ticket__notes">' + escapeHTML(movie.notes) + "</p>"
      : "";

    var place = [movie.theater, movie.city].filter(Boolean).join(" · ");

    return (
      '<article class="ticket reveal" tabindex="0">' +
        posterMarkup(movie) +
        '<div class="ticket__tear" aria-hidden="true"></div>' +
        '<div class="ticket__stub">' +
          '<h3 class="ticket__title">' + escapeHTML(movie.title) + "</h3>" +
          '<div class="ticket__rows">' +
            row("Seen", formatDate(movie.watchedDate)) +
            (place ? row("At", place) : "") +
            row("Language", movie.language) +
            row("Format", movie.format) +
          "</div>" +
          notes +
          '<p class="ticket__serial">' + serial(movie) + " · Admit One</p>" +
        "</div>" +
      "</article>"
    );
  }

  function renderTimeline(movies) {
    var mount = $("#timeline");

    if (!movies.length) {
      mount.innerHTML =
        '<div class="empty"><strong>No matching tickets.</strong>' +
        "Try another title, theater, or city.</div>";
      return;
    }

    // Group by watched year.
    var byYear = {};
    movies.forEach(function (m) {
      var y = watchedYear(m);
      (byYear[y] = byYear[y] || []).push(m);
    });

    // Years descending (most recent first).
    var years = Object.keys(byYear).map(Number).sort(function (a, b) { return b - a; });

    var html = years.map(function (y) {
      var group = byYear[y].slice().sort(function (a, b) {
        return String(b.watchedDate).localeCompare(String(a.watchedDate));
      });
      var count = group.length + " film" + (group.length === 1 ? "" : "s");
      return (
        '<div class="year-group">' +
          '<div class="year-head">' +
            '<span class="year-head__num">' + y + "</span>" +
            '<span class="year-head__count">' + count + "</span>" +
            '<span class="year-head__strip" aria-hidden="true"></span>' +
          "</div>" +
          '<div class="cards">' + group.map(ticketCard).join("") + "</div>" +
        "</div>"
      );
    }).join("");

    mount.innerHTML = html;
    observeReveals();
  }

  function renderStats(movies) {
    var section = $("#stats");
    if (!movies.length) { section.hidden = true; return; }
    section.hidden = false;

    var total = movies.length;

    // Average rating (ignore blanks).
    var rated = movies.filter(function (m) {
      return m.rating != null && m.rating !== "" && !isNaN(+m.rating);
    });
    var avg = rated.length
      ? (rated.reduce(function (s, m) { return s + +m.rating; }, 0) / rated.length)
      : null;

    // Most visited theater.
    var theaters = {};
    movies.forEach(function (m) {
      if (m.theater) theaters[m.theater] = (theaters[m.theater] || 0) + 1;
    });
    var topTheater = null, topCount = 0;
    Object.keys(theaters).forEach(function (t) {
      if (theaters[t] > topCount) { topCount = theaters[t]; topTheater = t; }
    });

    // Distinct cities + years for a little extra texture.
    var cities = {};
    movies.forEach(function (m) { if (m.city) cities[m.city] = 1; });
    var cityCount = Object.keys(cities).length;

    $("#stats-grid").innerHTML =
      cell("Films archived", '<span class="accent">' + total + "</span>") +
      cell("Average rating",
        avg != null ? avg.toFixed(1) + '<small>out of 10</small>' : "—") +
      cell("Most visited",
        topTheater
          ? escapeHTML(topTheater) + '<small>' + topCount + " visit" +
            (topCount === 1 ? "" : "s") + "</small>"
          : "—") +
      cell("Cities", String(cityCount) +
        '<small>across the country</small>');

    // Per-year bars.
    var byYear = {};
    movies.forEach(function (m) {
      var y = watchedYear(m);
      byYear[y] = (byYear[y] || 0) + 1;
    });
    var years = Object.keys(byYear).map(Number).sort(function (a, b) { return b - a; });
    var max = Math.max.apply(null, years.map(function (y) { return byYear[y]; }));

    $("#peryear").innerHTML = years.map(function (y) {
      var pct = Math.round((byYear[y] / max) * 100);
      return (
        '<div class="peryear__row">' +
          '<span class="peryear__yr">' + y + "</span>" +
          '<span class="peryear__track"><span class="peryear__fill" data-pct="' +
            pct + '"></span></span>' +
          '<span class="peryear__n">' + byYear[y] + "</span>" +
        "</div>"
      );
    }).join("");

    // Animate the bars once visible.
    if (!prefersReducedMotion()) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            section.querySelectorAll(".peryear__fill").forEach(function (f) {
              f.style.width = f.getAttribute("data-pct") + "%";
            });
            io.disconnect();
          }
        });
      }, { threshold: 0.2 });
      io.observe(section);
    } else {
      section.querySelectorAll(".peryear__fill").forEach(function (f) {
        f.style.width = f.getAttribute("data-pct") + "%";
      });
    }
  }

  function cell(label, value) {
    return '<dl class="stat-cell"><dt>' + escapeHTML(label) +
           "</dt><dd>" + value + "</dd></dl>";
  }

  /* --------------------------- Search ---------------------------- */
  function applySearch(query) {
    var q = query.trim().toLowerCase();
    var list = ALL_MOVIES;

    if (q) {
      list = ALL_MOVIES.filter(function (m) {
        return (
          String(m.title || "").toLowerCase().indexOf(q) !== -1 ||
          String(m.theater || "").toLowerCase().indexOf(q) !== -1 ||
          String(m.city || "").toLowerCase().indexOf(q) !== -1
        );
      });
    }

    renderTimeline(list);

    var countEl = $("#result-count");
    if (!q) {
      countEl.textContent = "";
    } else {
      countEl.textContent =
        list.length + " of " + ALL_MOVIES.length + " films";
    }
  }

  /* ----------------------- Reveal on scroll ---------------------- */
  var revealObserver = null;

  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function observeReveals() {
    var items = document.querySelectorAll(".reveal:not(.is-in)");

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    items.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------- Poster fallback ------------------------ */
  // Global so the inline onerror handler can reach it.
  window.ACfallback = function (img) {
    var poster = img.parentNode;        // .ticket__poster
    var title = img.getAttribute("data-title") || "";
    var ratingEl = poster.querySelector(".ticket__rating");
    var ratingHTML = ratingEl ? ratingEl.outerHTML : "";
    poster.classList.add("ticket__poster--empty");
    poster.innerHTML = ratingHTML + CLAP_SVG +
      '<span class="ph-title">' + escapeHTML(title) + "</span>";
  };

  /* ----------------------------- Boot ---------------------------- */
  function showError(msg) {
    $("#timeline").innerHTML =
      '<div class="empty"><strong>The archive could not be opened.</strong>' +
      escapeHTML(msg) + "</div>";
  }

  function init(movies) {
    if (!Array.isArray(movies)) {
      showError("data/movies.json must contain a list of films.");
      return;
    }
    ALL_MOVIES = movies;

    heroStats(movies);
    renderTimeline(movies);
    renderStats(movies);

    var input = $("#search-input");
    var t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { applySearch(input.value); }, 80);
    });

    // Animate the hero stats / first cards in.
    observeReveals();
  }

  function load() {
    // Preferred path: data/movies.js sets window.ACMovies via a <script> tag.
    // This works everywhere — including opening index.html straight from disk
    // (file://), where fetch() is blocked by the browser.
    if (Array.isArray(window.ACMovies)) {
      init(window.ACMovies);
      return;
    }

    // Fallback: fetch the JSON. Works when served over http (GitHub Pages or a
    // local server), for setups that prefer a plain .json file.
    fetch("data/movies.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(init)
      .catch(function (err) {
        var fileMode = location.protocol === "file:";
        showError(
          fileMode
            ? "Opening from disk needs the data/movies.js file (a script the " +
              "browser is allowed to load). If it's missing, run a local " +
              "server instead: python3 -m http.server"
            : "Make sure data/movies.js or data/movies.json exists. (" +
              err.message + ")"
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
