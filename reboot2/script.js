/* =========================================================
   Absolute Cinema — reboot2
   Reads window.ACMovies (data/movies.js).
   Three views (grid / timeline / compact), a ticket-stub
   detail panel, and the numbers.
   ========================================================= */

(function () {
  "use strict";

  var ALL = [];                  // every film, numbered, newest first
  var SHOWN = [];                // after search + filters
  var state = { q: "", year: "all", lang: "all", dir: "desc", view: "grid" };

  var CURRENCY = "₹";

  function $(s) { return document.querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }

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

  var MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var MONTHS_LONG = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

  function parseDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ""));
    return m ? { y: +m[1], mo: +m[2], d: +m[3] } : null;
  }
  function watchedYear(m) {
    var p = parseDate(m.watchedDate);
    return p ? p.y : (parseInt(m.year, 10) || 0);
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function shortDate(str) {                       // 24 SEP 2026
    var p = parseDate(str);
    return p ? pad(p.d) + " " + MONTHS[p.mo - 1] + " " + p.y : "";
  }
  function longDate(str) {                        // 24 September 2026
    var p = parseDate(str);
    return p ? p.d + " " + MONTHS_LONG[p.mo - 1] + " " + p.y : "—";
  }

  function venue(movie) {
    return [movie.theatre || movie.theater || "", movie.city].filter(Boolean).join(", ");
  }
  function isSpecial(movie) {
    var f = String(movie.format || "").trim();
    return f && f.toUpperCase() !== "2D";
  }

  /* price is optional and may be a number or a numeric string. */
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

  /* Screen "2" reads as "Screen 2"; anything wordier prints as written. */
  function screenSeat(movie) {
    var screen = movie.screen ? (/^\d+$/.test(String(movie.screen).trim())
      ? "Screen " + movie.screen : String(movie.screen)) : "";
    var seat = movie.seat ? "Seat " + movie.seat : "";
    return [screen, seat].filter(Boolean).join(" · ");
  }

  /* ------------------------- Posters ----------------------------- */

  function posterTag(movie, cls) {
    if (!movie.poster) return '<div class="' + cls + '-fallback">' + esc(movie.title) + "</div>";
    return '<img class="' + cls + '" src="' + esc(posterURL(movie)) +
      '" alt="" loading="lazy" data-title="' + esc(movie.title) + '">';
  }

  /* An asset that has not been uploaded yet shows the title, never a
     broken-image icon. Used by every view and the ticket alike. */
  function handlePosterErrors(root) {
    $$("img[data-title]", root).forEach(function (img) {
      img.addEventListener("error", function () {
        var box = img.parentNode;
        if (!box) return;
        var keep = $$(".number, .tag", box).map(function (el) { return el.outerHTML; }).join("");
        var cls = img.classList.contains("ticket-poster") ? "ticket-poster-fallback"
                : img.classList.contains("timeline-poster") ? "tl-poster-fallback"
                : "poster-fallback";
        box.innerHTML = keep + '<div class="' + cls + '">' + esc(img.getAttribute("data-title")) + "</div>";
      });
    });
  }

  /* ------------------------ Poster grid -------------------------- */

  function filmCard(movie) {
    var bits = [shortDate(movie.watchedDate), movie.format].filter(Boolean).join(" · ");
    return (
      '<button class="film" type="button" data-n="' + movie.n + '" ' +
        'aria-label="Details for ' + esc(movie.title) + '">' +
        '<div class="poster">' +
          '<span class="number">#' + movie.n + "</span>" +
          (movie.rerelease ? '<span class="tag">Re-release</span>' : "") +
          posterTag(movie, "poster-img") +
        "</div>" +
        '<div class="film-title">' + esc(movie.title) + "</div>" +
        '<div class="film-meta">' + esc(bits) + "</div>" +
      "</button>"
    );
  }

  function renderGrid(list) {
    var mount = $("#gridView");
    mount.innerHTML = list.length
      ? '<div class="grid">' + list.map(filmCard).join("") + "</div>"
      : '<p class="empty">No films match</p>';
    handlePosterErrors(mount);
  }

  /* -------------------------- Timeline --------------------------- */

  function renderTimeline(list) {
    var mount = $("#timelineView");

    if (!list.length) { mount.innerHTML = '<p class="empty">No films match</p>'; return; }

    var groups = {};
    list.forEach(function (m) {
      var y = watchedYear(m);
      (groups[y] = groups[y] || []).push(m);
    });

    var years = Object.keys(groups).map(Number)
      .sort(function (a, b) { return state.dir === "asc" ? a - b : b - a; });

    mount.innerHTML =
      '<div class="timeline">' +
        years.map(function (y) {
          var group = groups[y];
          return (
            '<div class="year">' +
              '<div class="year-label">' + y +
                '<span class="year-count">' + group.length +
                  " film" + (group.length === 1 ? "" : "s") + "</span>" +
              "</div>" +
              group.map(function (m) {
                var sub = [venue(m), m.format, m.language].filter(Boolean).join(" · ");
                return (
                  '<button class="timeline-row" type="button" data-n="' + m.n + '" ' +
                    'aria-label="Details for ' + esc(m.title) + '">' +
                    '<span class="timeline-date">' + esc(shortDate(m.watchedDate)) + "</span>" +
                    '<span class="tl-poster">' + posterTag(m, "timeline-poster") + "</span>" +
                    "<span>" +
                      '<span class="timeline-title">' + esc(m.title) + "</span>" +
                      '<span class="timeline-sub">' + esc(sub) + "</span>" +
                    "</span>" +
                    '<span class="timeline-num">#' + m.n + "</span>" +
                  "</button>"
                );
              }).join("") +
            "</div>"
          );
        }).join("") +
      "</div>";

    handlePosterErrors(mount);
  }

  /* --------------------------- Compact --------------------------- */

  function renderCompact(list) {
    $("#compactBody").innerHTML = list.length
      ? list.map(function (m) {
          return (
            '<tr data-n="' + m.n + '">' +
              '<td class="num">#' + m.n + "</td>" +
              '<td class="title">' + esc(m.title) +
                (m.rerelease ? " · RR" : "") + "</td>" +
              '<td class="date">' + esc(shortDate(m.watchedDate)) + "</td>" +
              "<td>" + esc(venue(m)) + "</td>" +
              '<td class="format">' + esc(m.format || "") + "</td>" +
              '<td class="lang">' + esc(m.language || "") + "</td>" +
            "</tr>"
          );
        }).join("")
      : '<tr><td colspan="6"><p class="empty">No films match</p></td></tr>';
  }

  /* --------------------------- Ticket ---------------------------- */

  var lastFocused = null;

  function detail(label, value) {
    return '<div class="detail"><div class="ticket-label">' + esc(label) +
      "</div><strong>" + esc(value) + "</strong></div>";
  }

  function openModal(movie) {
    if (!movie) return;
    lastFocused = document.activeElement;

    var art = $("#modalPoster");
    art.innerHTML = movie.poster
      ? posterTag(movie, "ticket-poster")
      : '<div class="ticket-poster-fallback">' + esc(movie.title) + "</div>";
    handlePosterErrors(art);

    $("#modalTitle").textContent = movie.title;

    var rows = detail("Date", longDate(movie.watchedDate));
    var place = venue(movie);
    if (place) rows += detail("Theatre", place);

    var fmt = [movie.format, movie.rerelease ? "Re-release" : ""].filter(Boolean).join(" · ");
    if (fmt) rows += detail("Format", fmt);
    if (movie.language) rows += detail("Language", movie.language);

    var seat = screenSeat(movie);
    if (seat) rows += detail("Seat", seat);

    var price = priceOf(movie);
    if (price != null) rows += detail("Ticket", money(price));

    if (movie.year) rows += detail("Released", String(movie.year));

    $("#modalDetails").innerHTML = rows;

    var note = $("#modalNote");
    note.textContent = movie.note || "";
    note.hidden = !movie.note;

    $("#modalStub").textContent = isSpecial(movie)
      ? String(movie.format).toUpperCase() + " SCREENING" : "";
    $("#modalNumber").textContent = "ARCHIVE ENTRY #" + movie.n;

    $("#modal").classList.add("open");
    document.body.style.overflow = "hidden";
    $("#close").focus();
    document.addEventListener("keydown", onModalKey);
  }

  function closeModal() {
    var modal = $("#modal");
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKey);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onModalKey(e) { if (e.key === "Escape") closeModal(); }

  /* --------------------------- Numbers --------------------------- */

  function uniqueCount(list, fn) {
    var seen = {};
    list.forEach(function (m) { var v = fn(m); if (v) seen[v] = 1; });
    return Object.keys(seen).length;
  }

  function stat(value, label, sub) {
    return "<div class=\"stat\"><strong>" + esc(value) + "</strong><span>" + esc(label) + "</span>" +
      (sub ? "<em>" + esc(sub) + "</em>" : "") + "</div>";
  }

  function renderStats(list) {
    if (!list.length) {
      $("#statsGrid").innerHTML = "";
      $("#breakdown").innerHTML = '<p class="empty">Nothing to count</p>';
      return;
    }

    var years = list.map(watchedYear).filter(Boolean);
    var lo = Math.min.apply(null, years), hi = Math.max.apply(null, years);
    var thisYear = new Date().getFullYear();
    var thisYearCount = list.filter(function (m) { return watchedYear(m) === thisYear; }).length;

    var priced = list.map(priceOf).filter(function (p) { return p != null; });
    var spend = priced.reduce(function (a, b) { return a + b; }, 0);

    var cells =
      stat(String(list.length), "Films") +
      stat(String(uniqueCount(list, function (m) { return m.theatre || m.theater; })), "Theatres") +
      stat(String(uniqueCount(list, function (m) { return m.city; })), "Cities") +
      stat(String(uniqueCount(list, function (m) { return m.language; })), "Languages") +
      stat(lo === hi ? String(lo) : lo + "–" + hi, "On record") +
      stat(String(thisYearCount), "In " + thisYear);

    if (priced.length) {
      cells += stat(money(spend), "Total spent",
        priced.length === list.length
          ? "across every ticket"
          : "across " + priced.length + " of " + list.length + " tickets");
      cells += stat(money(spend / priced.length), "Average ticket");
    } else {
      cells += stat(String(list.filter(function (m) { return m.rerelease; }).length), "Re-releases");
      cells += stat(String(list.filter(isSpecial).length), "Beyond 2D");
    }

    $("#statsGrid").innerHTML = cells;

    $("#breakdown").innerHTML =
      barBlock("By language", tally(list, function (m) { return m.language; }), true) +
      barBlock("By format", tally(list, function (m) { return m.format; }), true) +
      barBlock("By year", tally(list, function (m) { return String(watchedYear(m)); }), false);
  }

  function tally(list, fn) {
    var counts = {};
    list.forEach(function (m) { var v = fn(m); if (v) counts[v] = (counts[v] || 0) + 1; });
    return counts;
  }

  /* byCount sorts most-seen first; otherwise keys sort descending (years). */
  function barBlock(title, counts, byCount) {
    var pairs = Object.keys(counts).map(function (k) { return [k, counts[k]]; });
    pairs.sort(byCount
      ? function (a, b) { return b[1] - a[1]; }
      : function (a, b) { return Number(b[0]) - Number(a[0]); });

    var max = Math.max.apply(null, pairs.map(function (p) { return p[1]; }));
    return "<div><h3>" + esc(title) + "</h3>" +
      pairs.map(function (p) {
        return (
          '<div class="bar-row">' +
            '<span class="bar-label">' + esc(p[0]) + "</span>" +
            '<span class="bar-track"><span class="bar-fill" style="width:' +
              Math.round((p[1] / max) * 100) + '%"></span></span>' +
            '<span class="bar-n">' + p[1] + "</span>" +
          "</div>"
        );
      }).join("") + "</div>";
  }

  /* -------------------------- Filtering --------------------------- */

  function sortKey(m) { return String(m.watchedDate || (m.year + "-12-31")); }

  function apply() {
    var q = state.q.trim().toLowerCase();

    var list = ALL.filter(function (m) {
      if (state.year !== "all" && String(watchedYear(m)) !== state.year) return false;
      if (state.lang !== "all" && (m.language || "") !== state.lang) return false;
      if (!q) return true;
      var hay = [m.title, m.language, m.theatre || m.theater, m.city, m.format,
                 m.note, m.seat, m.screen, watchedYear(m)].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    list.sort(function (a, b) {
      var c = sortKey(a).localeCompare(sortKey(b));
      if (c === 0) c = String(a.title).localeCompare(String(b.title));
      return state.dir === "asc" ? c : -c;
    });

    SHOWN = list;

    renderGrid(list);
    renderTimeline(list);
    renderCompact(list);
    renderStats(list);

    var filtered = q || state.year !== "all" || state.lang !== "all";
    $("#clearBtn").hidden = !filtered;
    updateMeta();
  }

  var VIEW_LABELS = { grid: "poster grid", timeline: "timeline", compact: "compact table" };

  function updateMeta() {
    var n = SHOWN.length;
    var of = n === ALL.length ? "" : " of " + ALL.length;
    $("#viewMeta").textContent = n + of + " film" + (n === 1 ? "" : "s") +
      " · " + VIEW_LABELS[state.view];
  }

  function switchView(view) {
    state.view = view;
    $("#gridView").classList.toggle("hidden", view !== "grid");
    $("#timelineView").classList.toggle("hidden", view !== "timeline");
    $("#compactView").classList.toggle("hidden", view !== "compact");

    $$(".view-btn").forEach(function (b) {
      var on = b.dataset.view === view;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    updateMeta();
  }

  /* ---------------------------- Boot ------------------------------ */

  function byNumber(n) {
    for (var i = 0; i < ALL.length; i++) if (ALL[i].n === n) return ALL[i];
    return null;
  }

  function delegateOpen(root) {
    root.addEventListener("click", function (e) {
      var hit = e.target.closest("[data-n]");
      if (hit) openModal(byNumber(+hit.getAttribute("data-n")));
    });
  }

  function buildFilters(movies) {
    var years = {}, langs = {};
    movies.forEach(function (m) {
      years[watchedYear(m)] = 1;
      if (m.language) langs[m.language] = 1;
    });

    var ySel = $("#filterYear");
    Object.keys(years).map(Number).sort(function (a, b) { return b - a; })
      .forEach(function (y) { ySel.add(new Option(y, String(y))); });

    var lSel = $("#filterLang");
    Object.keys(langs).sort().forEach(function (l) { lSel.add(new Option(l, l)); });
  }

  function init(movies) {
    if (!Array.isArray(movies) || !movies.length) {
      $("#gridView").innerHTML = '<p class="empty">data/movies.js is missing or empty</p>';
      return;
    }

    /* Number the archive in the order it happened: #1 is the oldest. */
    ALL = movies.slice().sort(function (a, b) {
      return sortKey(a).localeCompare(sortKey(b));
    });
    ALL.forEach(function (m, i) { m.n = i + 1; });
    ALL.reverse();

    var years = ALL.map(watchedYear).filter(Boolean);
    $("#heroEyebrow").textContent = "Personal Theatre Archive · " +
      Math.min.apply(null, years) + "—" + Math.max.apply(null, years);
    $("#heroCount").textContent = ALL.length;
    $("#footCount").textContent = ALL.length + " films — and counting";

    buildFilters(ALL);
    apply();

    var search = $("#search"), t;
    search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = search.value; apply(); }, 100);
    });

    $("#filterYear").addEventListener("change", function () { state.year = this.value; apply(); });
    $("#filterLang").addEventListener("change", function () { state.lang = this.value; apply(); });

    var sortBtn = $("#sortBtn");
    sortBtn.addEventListener("click", function () {
      state.dir = state.dir === "desc" ? "asc" : "desc";
      sortBtn.textContent = state.dir === "desc" ? "Newest first" : "Oldest first";
      apply();
    });

    $("#clearBtn").addEventListener("click", function () {
      state.q = ""; state.year = "all"; state.lang = "all";
      search.value = "";
      $("#filterYear").value = "all";
      $("#filterLang").value = "all";
      apply();
    });

    $$(".view-btn").forEach(function (b) {
      b.addEventListener("click", function () { switchView(b.dataset.view); });
    });

    delegateOpen($("#gridView"));
    delegateOpen($("#timelineView"));
    delegateOpen($("#compactView"));

    $("#close").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", function (e) {
      if (e.target === $("#modal")) closeModal();
    });
  }

  function load() {
    if (Array.isArray(window.ACMovies)) init(window.ACMovies);
    else $("#gridView").innerHTML = '<p class="empty">data/movies.js is missing or malformed</p>';
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
