/* ==========================================================================
   bywemimo.com — shared script
   Navigation, header shadow, footer year, scroll reveals,
   lesson cards + slide viewer (Learning Design), booking calendar (Contact).
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ICON_PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"></path></svg>';
  var ICON_DOWNLOAD = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"></path></svg>';

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Back-to-top button (appears after scrolling; ring shows progress) ---------- */
  var toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';
  document.body.appendChild(toTop);
  var onScrollTop = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    toTop.classList.toggle("is-visible", window.scrollY > 400);
    toTop.style.setProperty("--p", (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + "%");
  };
  onScrollTop();
  window.addEventListener("scroll", onScrollTop, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    var target = document.querySelector(".brand") || document.querySelector("a, button");
    if (target) target.focus({ preventScroll: true });
  });

  /* ---------- Interactive motion (skipped entirely for reduced motion) ---------- */
  if (!reduceMotion) {
    document.querySelectorAll(".marquee__row").forEach(function (row) {
      var track = row.querySelector(".marquee__track");
      if (track) row.appendChild(track.cloneNode(true));
    });
    initParallax();
    initCursorPill();
    initPageFade();
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      if (!open && returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !header.contains(e.target)) setOpen(false);
    });
    window.matchMedia("(min-width: 820px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- Lessons (Learning Design page) ---------- */
  var lessonGrid = document.getElementById("lesson-grid");
  if (lessonGrid && typeof LESSONS !== "undefined") renderLessons(lessonGrid, LESSONS);

  var courses = document.getElementById("courses");
  if (courses && typeof SHOW_COURSES !== "undefined" && SHOW_COURSES) courses.hidden = false;

  /* ---------- Scroll reveals (after lessons render, so cards are included) ---------- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add("reveal");
      child.style.setProperty("--reveal-delay", Math.min(i, 5) * 0.08 + "s");
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });

    /* Labels flicker into place; numbers count up when they come into view */
    var onceSeen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        onceSeen.unobserve(entry.target);
        if (entry.target.classList.contains("eyebrow")) scramble(entry.target);
        else countUp(entry.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(".eyebrow").forEach(function (el) {
      if (!el.children.length) onceSeen.observe(el);
    });
    document.querySelectorAll(".glance__value").forEach(function (el) {
      if (/^\d/.test(el.textContent)) onceSeen.observe(el);
    });
  }

  /* ---------- Booking calendar (Contact page) ---------- */
  var booking = document.getElementById("cal-booking");
  if (booking) initBooking(booking);

  /* ======================================================================
     Helpers
     ====================================================================== */

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (html != null) node.innerHTML = html;
    return node;
  }

  function stripTags(s) { return s.replace(/<[^>]*>/g, ""); }

  /* Scrambles a label through random letters before settling on the real text */
  function scramble(node) {
    var text = node.textContent, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ·+*", frame = 0, total = 18;
    var tick = function () {
      var shown = Math.floor(frame / total * text.length);
      node.textContent = text.split("").map(function (c, k) {
        return k < shown || c === " " ? c : chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      if (frame++ < total) requestAnimationFrame(tick); else node.textContent = text;
    };
    tick();
  }

  /* Counts the leading number of "4+ years" up from zero */
  function countUp(node) {
    var m = node.textContent.match(/^(\d+)(.*)$/);
    if (!m) return;
    var end = parseInt(m[1], 10), rest = m[2], start = null;
    var step = function (t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / 1200);
      node.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + rest;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Elements with data-parallax drift at their own speed while scrolling */
  function initParallax() {
    var items = document.querySelectorAll("[data-parallax]");
    if (!items.length) return;
    var queued = false;
    var update = function () {
      queued = false;
      var mid = window.innerHeight / 2;
      items.forEach(function (node) {
        var r = node.getBoundingClientRect();
        var d = (r.top + r.height / 2 - mid) * parseFloat(node.getAttribute("data-parallax"));
        node.style.translate = "0 " + d.toFixed(1) + "px";
      });
    };
    window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* A "View" bubble follows the mouse over clickable cards (mouse users only) */
  function initCursorPill() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var pill = el("div", { "class": "cursor-pill", "aria-hidden": "true" });
    document.body.appendChild(pill);
    var x = 0, y = 0, px = 0, py = 0, running = false;
    var move = function () {
      px += (x - px) * 0.2; py += (y - py) * 0.2;
      pill.style.transform = "translate(" + (px + 16) + "px," + (py + 16) + "px)";
      if (Math.abs(x - px) > 0.5 || Math.abs(y - py) > 0.5) requestAnimationFrame(move); else running = false;
    };
    document.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      var target = e.target.closest("a.card, a.work-card, a.work-tile, [data-cursor]");
      if (target && !e.target.closest(".btn")) {
        pill.textContent = target.getAttribute("data-cursor") || (target.target === "_blank" ? "Open ↗" : "View →");
        if (!pill.classList.contains("is-on")) { px = x; py = y; }
        pill.classList.add("is-on");
      } else {
        pill.classList.remove("is-on");
      }
      if (!running) { running = true; requestAnimationFrame(move); }
    });
  }

  /* Fades the page out before following a link to another page on this site */
  function initPageFade() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || /\.(pdf|jpe?g|png|webp|docx?)$/i.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(function () { location.href = url.href; }, 220);
    });
    window.addEventListener("pageshow", function () { document.body.classList.remove("is-leaving"); });
  }

  function renderLessons(grid, lessons) {
    grid.innerHTML = "";

    lessons.forEach(function (lesson) {
      var card = el("article", { "class": "card lesson-card", "data-skill": lesson.tags.skill });
      card.style.setProperty("--lesson-stripe", lesson.stripe || "");

      var body = el("div", { "class": "lesson-card__body" });
      var tags = el("ul", { "class": "lesson-card__tags", "aria-label": "Lesson details" });
      ["level", "skill", "length", "audience"].forEach(function (k) {
        if (lesson.tags[k]) tags.appendChild(el("li", null, lesson.tags[k]));
      });
      body.appendChild(tags);
      body.appendChild(el("h3", null, lesson.title));
      body.appendChild(el("p", { "class": "lesson-card__desc" }, lesson.description));

      var actions = el("div", { "class": "lesson-card__actions" });
      actions.appendChild(slidesButton(lesson));
      (lesson.downloads || []).forEach(function (d, i) {
        var cls = "btn btn--sm " + (i === 0 ? "btn--primary" : "btn--secondary");
        if (d.file) {
          var a = el("a", { "class": cls, href: d.file, target: "_blank", rel: "noopener" },
            (i === 0 ? ICON_DOWNLOAD : "") + d.label);
          actions.appendChild(a);
        } else {
          actions.appendChild(el("span", { "class": cls, "aria-disabled": "true" }, d.label + ": Coming soon"));
        }
      });
      body.appendChild(actions);

      card.appendChild(el("div", { "class": "lesson-card__stripe", "aria-hidden": "true" }));
      card.appendChild(body);
      grid.appendChild(card);
    });

    if (lessons.length > 6) renderFilters(grid, lessons);
  }

  function slidesButton(lesson) {
    var s = lesson.slides || {};
    var titleText = stripTags(lesson.title);
    if (!s.file) {
      return el("span", { "class": "btn btn--sm btn--secondary", "aria-disabled": "true" }, "Slides coming soon");
    }
    var a = el("a", {
      "class": "btn btn--sm btn--slides",
      href: s.file,
      target: "_blank",
      rel: "noopener",
      "aria-label": "View slides: " + titleText
    }, ICON_PLAY + "View slides");
    a.style.setProperty("--deck-bg", s.bg);
    a.style.setProperty("--deck-text", s.text);
    a.style.setProperty("--deck-icon", s.icon);

    var isLink = /^https?:\/\//.test(s.file);   // e.g. a Prezi, rather than a PDF on this site
    a.addEventListener("click", function (e) {
      // Prezi pages open in their own tab (they don't display cleanly inside another site).
      // Phones and tablets can't show PDFs inside a page, so PDFs open directly there too.
      if (isLink || window.matchMedia("(max-width: 760px), (pointer: coarse)").matches) return;
      e.preventDefault();
      openSlides(s.file, titleText, a);
    });

    // When served from a web host, check a slide PDF exists; if not, show "Slides coming soon".
    if (!isLink && /^https?:$/.test(location.protocol) && window.fetch) {
      fetch(s.file, { method: "HEAD" }).then(function (res) {
        if (!res.ok) a.replaceWith(el("span", { "class": "btn btn--sm btn--secondary", "aria-disabled": "true" }, "Slides coming soon"));
      }).catch(function () {});
    }
    return a;
  }

  function renderFilters(grid, lessons) {
    var skills = [];
    lessons.forEach(function (l) { if (skills.indexOf(l.tags.skill) === -1) skills.push(l.tags.skill); });

    var bar = el("div", { "class": "filter-chips", role: "group", "aria-label": "Filter lessons by skill" });
    ["All"].concat(skills).forEach(function (skill) {
      var chip = el("button", { type: "button", "class": "filter-chip", "aria-pressed": skill === "All" ? "true" : "false" }, skill);
      chip.addEventListener("click", function () {
        bar.querySelectorAll(".filter-chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        grid.querySelectorAll(".lesson-card").forEach(function (card) {
          card.hidden = skill !== "All" && card.getAttribute("data-skill") !== skill;
        });
      });
      bar.appendChild(chip);
    });
    grid.parentNode.insertBefore(bar, grid);
  }

  /* ---------- Slide viewer modal ---------- */
  var modal, modalFrame, modalTitle, modalNewTab, modalReturn;

  function openSlides(file, title, trigger) {
    if (!modal) {
      modal = document.getElementById("slides-modal");
      modalFrame = modal.querySelector("iframe");
      modalTitle = modal.querySelector(".slides-modal__title");
      modalNewTab = modal.querySelector("[data-newtab]");
      modal.querySelector("[data-close]").addEventListener("click", closeSlides);
      modal.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeSlides();
        if (e.key === "Tab") trapFocus(e);
      });
    }
    modalReturn = trigger;
    modalTitle.textContent = title;
    modalNewTab.href = file;
    modalFrame.src = file;
    modalFrame.title = "Slides: " + title;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("[data-close]").focus();
  }

  function closeSlides() {
    modal.hidden = true;
    modalFrame.src = "about:blank";
    document.body.classList.remove("modal-open");
    if (modalReturn) modalReturn.focus();
  }

  function trapFocus(e) {
    var items = modal.querySelectorAll("a[href], button, iframe");
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Booking calendar (Cal.com inline embed) ---------- */
  function initBooking(box) {
    var calLink = box.getAttribute("data-cal-link");
    // Cal.com's standard loader: queues calls until embed.js has loaded.
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // The calendar appears once a topic is chosen; the topic is pre-filled into the booking notes.
    var renders = 0;
    function showCalendar(topic) {
      var ns = "booking" + (++renders);   // fresh namespace each time so the calendar re-renders cleanly
      box.innerHTML = "";
      Cal("init", ns, { origin: "https://cal.com" });
      Cal.ns[ns]("inline", {
        elementOrSelector: "#" + box.id,
        calLink: calLink,
        config: { layout: "month_view", notes: "Inquiry: " + topic }
      });
      Cal.ns[ns]("ui", {
        layout: "month_view",
        hideEventTypeDetails: true,  // our own heading explains the booking; keeps the calendar from overflowing
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#A84B26" } }
      });
    }

    box.innerHTML = '<p class="booking__hint">Choose a topic above to see available times.</p>';
    document.querySelectorAll('.topic-picker input[name="inquiry"]').forEach(function (input) {
      input.addEventListener("change", function () { showCalendar(input.value); });
    });
  }
})();
