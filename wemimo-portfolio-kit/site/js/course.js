/* ==========================================================================
   Course player — builds a course page from window.COURSE (course-data.js).
   Lessons, knowledge checks, quizzes, and activities; progress is saved in
   the visitor's own browser.
   ========================================================================== */

(function () {
  "use strict";

  var C = window.COURSE;
  var lessonEl = document.getElementById("lesson");
  if (!C || !lessonEl) return;

  /* ---------- Pages and modules ---------- */
  var pages = [];
  var module = null;
  C.lessons.forEach(function (l) {
    if (l.kind === "section") { module = l.title || null; return; }
    pages.push({ lesson: l, module: module });
  });

  /* ---------- Progress (saved in this browser only) ---------- */
  var KEY = "course-progress:" + C.title;
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { done = {}; }
  function markDone(i) {
    done[i] = true;
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
    updateProgress();
  }
  function updateProgress() {
    var n = Object.keys(done).filter(function (k) { return done[k] && pages[k]; }).length;
    var fill = document.getElementById("course-progress-fill");
    var text = document.getElementById("course-progress-text");
    if (fill) fill.style.width = Math.round((n / pages.length) * 100) + "%";
    if (text) text.textContent = n + " of " + pages.length + " lessons complete";
    document.querySelectorAll(".course-nav__link").forEach(function (a) {
      a.classList.toggle("is-done", !!done[a.getAttribute("data-index")]);
    });
  }

  /* ---------- Small helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function button(label, cls) {
    var b = el("button", cls || "btn btn--sm btn--primary", label);
    b.type = "button";
    return b;
  }
  function plain(html) { var d = document.createElement("div"); d.innerHTML = html; return d.textContent.trim(); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var uid = 0;

  /* ======================================================================
     Questions — each returns { node, answered(), correct(), reveal(isRight), reset() }
     ====================================================================== */

  function choiceQuestion(b) {
    var name = "q" + (++uid);
    var box = el("fieldset", "question");
    box.appendChild(el("legend", "question__prompt", b.q));
    if (b.multi) box.appendChild(el("p", "question__hint", "Select all that apply."));
    var opts = el("div", "question__options");
    b.answers.forEach(function (a, i) {
      var label = el("label", "option");
      var input = el("input");
      input.type = b.multi ? "checkbox" : "radio";
      input.name = name;
      input.value = i;
      label.appendChild(input);
      label.appendChild(el("span", "option__text", a.html));
      opts.appendChild(label);
    });
    box.appendChild(opts);
    var inputs = opts.querySelectorAll("input");
    return {
      node: box,
      answered: function () { return opts.querySelector("input:checked") !== null; },
      correct: function () {
        return Array.prototype.every.call(inputs, function (inp, i) { return inp.checked === !!b.answers[i].correct; });
      },
      reveal: function () {
        inputs.forEach(function (inp, i) {
          var row = inp.parentNode;
          row.classList.toggle("is-correct", !!b.answers[i].correct);
          row.classList.toggle("is-wrong", inp.checked && !b.answers[i].correct);
          inp.disabled = true;
        });
      },
      reset: function () {
        inputs.forEach(function (inp) { inp.checked = false; inp.disabled = false; inp.parentNode.classList.remove("is-correct", "is-wrong"); });
      }
    };
  }

  function matchQuestion(b) {
    var box = el("fieldset", "question");
    box.appendChild(el("legend", "question__prompt", b.q));
    var list = el("div", "match");
    var options = shuffle(b.pairs.map(function (p) { return p.b; }));
    var selects = b.pairs.map(function (p, i) {
      var row = el("div", "match__row");
      var id = "m" + (++uid);
      row.appendChild(el("label", "match__left", p.a)).setAttribute("for", id);
      var sel = el("select", "match__select");
      sel.id = id;
      sel.appendChild(el("option", null, "Choose…")).value = "";
      options.forEach(function (o) { var op = el("option", null, plain(o)); op.value = plain(o); sel.appendChild(op); });
      row.appendChild(sel);
      list.appendChild(row);
      return sel;
    });
    box.appendChild(list);
    return {
      node: box,
      answered: function () { return selects.every(function (s) { return s.value; }); },
      correct: function () { return selects.every(function (s, i) { return s.value === plain(b.pairs[i].b); }); },
      reveal: function () {
        selects.forEach(function (s, i) {
          var ok = s.value === plain(b.pairs[i].b);
          var row = s.parentNode;
          row.classList.toggle("is-correct", ok);
          row.classList.toggle("is-wrong", !ok);
          if (!ok) row.appendChild(el("span", "match__answer", "Answer: " + plain(b.pairs[i].b)));
          s.disabled = true;
        });
      },
      reset: function () {
        selects.forEach(function (s) {
          s.value = ""; s.disabled = false;
          var row = s.parentNode;
          row.classList.remove("is-correct", "is-wrong");
          var ans = row.querySelector(".match__answer"); if (ans) ans.remove();
        });
      }
    };
  }

  function fillQuestion(b) {
    var box = el("div", "question");
    var id = "f" + (++uid);
    var prompt = el("label", "question__prompt", b.q);
    prompt.setAttribute("for", id);
    box.appendChild(prompt);
    var input = el("input", "fill__input");
    input.id = id; input.type = "text"; input.autocomplete = "off"; input.placeholder = "Type your answer";
    box.appendChild(input);
    var norm = function (s) { return s.toLowerCase().replace(/[.,!?;:"“”'’]/g, "").replace(/\s+/g, " ").trim(); };
    var answerNote = null;
    return {
      node: box,
      answered: function () { return input.value.trim() !== ""; },
      correct: function () { return b.accepted.some(function (a) { return norm(a) === norm(input.value); }); },
      reveal: function (ok) {
        box.classList.toggle("is-correct", ok);
        box.classList.toggle("is-wrong", !ok);
        input.disabled = true;
        if (!ok) { answerNote = el("p", "match__answer", "Answer: " + b.accepted.join(" / ")); box.appendChild(answerNote); }
      },
      reset: function () {
        input.value = ""; input.disabled = false;
        box.classList.remove("is-correct", "is-wrong");
        if (answerNote) { answerNote.remove(); answerNote = null; }
      }
    };
  }

  function makeQuestion(b) {
    if (b.t === "choice") return choiceQuestion(b);
    if (b.t === "match") return matchQuestion(b);
    if (b.t === "fill") return fillQuestion(b);
    return null;
  }

  function feedbackFor(b, ok) {
    var specific = ok ? b.feedbackCorrect : b.feedbackIncorrect;
    var text = specific || b.feedback || "";
    return (ok ? "<strong>Correct.</strong> " : "<strong>Not quite.</strong> ") + text.replace(/^<p>|<\/p>$/g, "");
  }

  /* A knowledge check inside a lesson: answer, check, try again */
  function knowledgeCheck(b) {
    var q = makeQuestion(b);
    var wrap = el("div", "course-block knowledge-check");
    wrap.appendChild(el("p", "knowledge-check__label", "Knowledge check"));
    wrap.appendChild(q.node);
    var fb = el("div", "question__feedback");
    fb.setAttribute("role", "status");
    var submit = button("Check answer");
    var again = button("Try again", "btn btn--sm btn--secondary");
    again.hidden = true;
    submit.addEventListener("click", function () {
      if (!q.answered()) { fb.className = "question__feedback is-wrong"; fb.innerHTML = "Please choose an answer first."; return; }
      var ok = q.correct();
      q.reveal(ok);
      fb.className = "question__feedback " + (ok ? "is-correct" : "is-wrong");
      fb.innerHTML = feedbackFor(b, ok);
      submit.hidden = true; again.hidden = false;
    });
    again.addEventListener("click", function () {
      q.reset(); fb.className = "question__feedback"; fb.innerHTML = "";
      submit.hidden = false; again.hidden = true;
    });
    var row = el("div", "button-row");
    row.appendChild(submit); row.appendChild(again);
    wrap.appendChild(row);
    wrap.appendChild(fb);
    return wrap;
  }

  /* ======================================================================
     Content blocks
     ====================================================================== */

  function tabs(b) {
    var wrap = el("div", "course-block course-tabs");
    var list = el("div", "course-tabs__list");
    list.setAttribute("role", "tablist");
    var panels = [];
    var btns = b.items.map(function (it, i) {
      var id = "t" + (++uid);
      var tab = el("button", "course-tabs__tab", it.title);
      tab.type = "button"; tab.id = id + "-tab";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", id);
      var panel = el("div", "course-tabs__panel", it.html);
      panel.id = id; panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", id + "-tab");
      panels.push(panel);
      list.appendChild(tab);
      return tab;
    });
    function select(i, focus) {
      btns.forEach(function (t, j) {
        t.setAttribute("aria-selected", String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        panels[j].hidden = i !== j;
      });
      if (focus) btns[i].focus();
    }
    btns.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") select((i + 1) % btns.length, true);
        if (e.key === "ArrowLeft") select((i - 1 + btns.length) % btns.length, true);
      });
    });
    wrap.appendChild(list);
    panels.forEach(function (p) { wrap.appendChild(p); });
    select(0);
    return wrap;
  }

  function accordion(b) {
    var wrap = el("div", "course-block course-accordion");
    b.items.forEach(function (it) {
      var d = el("details");
      d.appendChild(el("summary", null, it.title));
      d.appendChild(el("div", "course-accordion__body", it.html));
      wrap.appendChild(d);
    });
    return wrap;
  }

  function flashcards(b) {
    var wrap = el("div", "course-block");
    wrap.appendChild(el("p", "question__hint", "Tap a card to flip it."));
    var grid = el("div", "flashcards");
    b.items.forEach(function (it) {
      var card = el("button", "flashcard");
      card.type = "button";
      card.setAttribute("aria-pressed", "false");
      var inline = function (h) { return h.replace(/<\/p>\s*<p>/g, "<br>").replace(/<\/?p>/g, ""); };
      card.appendChild(el("span", "flashcard__face flashcard__front", inline(it.front)));
      card.appendChild(el("span", "flashcard__face flashcard__back", inline(it.back)));
      card.addEventListener("click", function () {
        card.setAttribute("aria-pressed", String(card.getAttribute("aria-pressed") !== "true"));
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function processSteps(b) {
    var wrap = el("div", "course-block process");
    var stage = el("div", "process__stage");
    stage.setAttribute("aria-live", "polite");
    var dots = el("div", "process__dots");
    var back = button("← Back", "btn btn--sm btn--secondary");
    var next = button("Next →");
    var i = 0;
    var steps = b.items.filter(function (s) { return s.kind === "step"; });
    function show() {
      var s = b.items[i];
      var label = s.kind === "intro" ? "Overview" : s.kind === "summary" ? "Wrap-up" : "Step " + (steps.indexOf(s) + 1) + " of " + steps.length;
      stage.innerHTML = "";
      stage.appendChild(el("p", "process__label", label));
      stage.appendChild(el("h4", "process__title", s.title));
      stage.appendChild(el("div", "process__body", s.html));
      back.disabled = i === 0;
      next.disabled = i === b.items.length - 1;
      dots.querySelectorAll("span").forEach(function (d, j) { d.classList.toggle("is-active", j === i); });
    }
    b.items.forEach(function () { dots.appendChild(el("span")); });
    back.addEventListener("click", function () { if (i > 0) { i--; show(); } });
    next.addEventListener("click", function () { if (i < b.items.length - 1) { i++; show(); } });
    var controls = el("div", "process__controls");
    controls.appendChild(back); controls.appendChild(dots); controls.appendChild(next);
    wrap.appendChild(stage); wrap.appendChild(controls);
    show();
    return wrap;
  }

  function sorting(b) {
    var wrap = el("div", "course-block sorting");
    var left = b.items.length;
    var status = el("p", "sorting__status");
    status.setAttribute("role", "status");
    var bins = el("div", "sorting__piles");
    var pileLists = b.piles.map(function (p) {
      var col = el("div", "sorting__pile");
      col.appendChild(el("h4", "sorting__pile-title", p));
      var ul = el("ul", "sorting__placed");
      col.appendChild(ul);
      bins.appendChild(col);
      return ul;
    });
    var pool = el("ul", "sorting__pool");
    shuffle(b.items).forEach(function (it) {
      var li = el("li", "sorting__item");
      li.appendChild(el("span", "sorting__text", it.html));
      var choices = el("div", "sorting__choices");
      b.piles.forEach(function (p, pi) {
        var btn = button(p, "sorting__choice");
        btn.addEventListener("click", function () {
          if (pi === it.pile) {
            li.remove();
            var placed = el("li", "sorting__done", it.html);
            pileLists[pi].appendChild(placed);
            left--;
            status.textContent = left ? "Correct! " + left + " left." : "All sorted. Well done!";
          } else {
            li.classList.remove("is-wrong"); void li.offsetWidth; li.classList.add("is-wrong");
            status.textContent = "Not quite. Try the other group.";
          }
        });
        choices.appendChild(btn);
      });
      li.appendChild(choices);
      pool.appendChild(li);
    });
    wrap.appendChild(pool); wrap.appendChild(status); wrap.appendChild(bins);
    return wrap;
  }

  function block(b) {
    switch (b.t) {
      case "text": {
        var w = el("div", "course-block course-text");
        if (b.heading) w.appendChild(el(b.level === 3 ? "h4" : "h3", null, b.heading));
        if (b.html) w.appendChild(el("div", "course-text__body", b.html));
        return w;
      }
      case "note": return el("aside", "course-block course-note", b.html);
      case "statement": return el("blockquote", "course-block course-statement", b.html);
      case "divider": return el("hr", "course-divider");
      case "list": {
        if (b.style === "check") {
          var ul = el("ul", "course-block course-checklist");
          b.items.forEach(function (h) {
            var li = el("li"); var lab = el("label"); var cb = el("input"); cb.type = "checkbox";
            lab.appendChild(cb); lab.appendChild(el("span", null, h)); li.appendChild(lab); ul.appendChild(li);
          });
          return ul;
        }
        var list = el(b.style === "number" ? "ol" : "ul", "course-block course-list");
        b.items.forEach(function (h) { list.appendChild(el("li", null, h)); });
        return list;
      }
      case "tabs": return tabs(b);
      case "accordion": return accordion(b);
      case "flashcards": return flashcards(b);
      case "process": return processSteps(b);
      case "sorting": return sorting(b);
      case "button": {
        var bw = el("div", "course-block course-action");
        if (b.desc) bw.appendChild(el("p", null, b.desc));
        var a = el("a", "btn btn--primary", b.label);
        a.href = b.href;
        bw.appendChild(a);
        return bw;
      }
      case "choice": case "match": case "fill": return knowledgeCheck(b);
    }
    return el("div");
  }

  /* ======================================================================
     Quiz lesson: answer everything, submit, see score
     ====================================================================== */

  function quiz(page, index) {
    var l = page.lesson;
    var wrap = el("div", "quiz");
    if (l.intro) wrap.appendChild(el("div", "course-block course-text__body", l.intro));
    var pass = l.passingScore || 80;
    wrap.appendChild(el("p", "quiz__meta", l.blocks.length + " questions · pass mark " + pass + "%"));
    var qs = l.blocks.map(function (b, i) {
      var q = makeQuestion(b);
      var card = el("div", "course-block quiz__question");
      card.appendChild(el("p", "knowledge-check__label", "Question " + (i + 1)));
      card.appendChild(q.node);
      var fb = el("div", "question__feedback");
      card.appendChild(fb);
      wrap.appendChild(card);
      return { q: q, b: b, fb: fb };
    });
    var result = el("div", "quiz__result");
    result.setAttribute("role", "status");
    result.tabIndex = -1;
    var submit = button("Submit quiz", "btn btn--primary");
    var retake = button("Retake quiz", "btn btn--secondary");
    retake.hidden = true;
    submit.addEventListener("click", function () {
      var missing = qs.filter(function (x) { return !x.q.answered(); }).length;
      if (missing && !submit.dataset.warned) {
        submit.dataset.warned = "1";
        result.className = "quiz__result is-wrong";
        result.textContent = missing + (missing === 1 ? " question is" : " questions are") + " unanswered. Press Submit quiz again to submit anyway.";
        return;
      }
      var right = 0;
      qs.forEach(function (x) {
        var ok = x.q.answered() && x.q.correct();
        if (ok) right++;
        x.q.reveal(ok);
        x.fb.className = "question__feedback " + (ok ? "is-correct" : "is-wrong");
        x.fb.innerHTML = feedbackFor(x.b, ok);
      });
      var score = Math.round((right / qs.length) * 100);
      var passed = score >= pass;
      result.className = "quiz__result " + (passed ? "is-correct" : "is-wrong");
      result.innerHTML = "<strong>Your score: " + score + "%</strong> (" + right + " of " + qs.length + ")." +
        (passed ? " You passed. Well done!" : " The pass mark is " + pass + "%. Review the feedback and try again.");
      if (passed) markDone(index);
      submit.hidden = true; retake.hidden = false;
      result.focus();
    });
    retake.addEventListener("click", function () {
      qs.forEach(function (x) { x.q.reset(); x.fb.className = "question__feedback"; x.fb.innerHTML = ""; });
      delete submit.dataset.warned;
      result.className = "quiz__result"; result.textContent = "";
      submit.hidden = false; retake.hidden = true;
      wrap.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    var row = el("div", "button-row quiz__submit");
    row.appendChild(submit); row.appendChild(retake);
    wrap.appendChild(row);
    wrap.appendChild(result);
    return wrap;
  }

  /* ======================================================================
     Navigation and routing (#lesson-1, #lesson-2, …)
     ====================================================================== */

  var navList = document.getElementById("course-nav-list");
  function buildNav() {
    var group = navList;
    var lastModule;
    pages.forEach(function (p, i) {
      if (p.module !== lastModule) {
        lastModule = p.module;
        if (p.module) {
          var li = el("li", "course-nav__module");
          li.appendChild(el("span", "course-nav__module-title", p.module));
          group = el("ol", "course-nav__sub");
          li.appendChild(group);
          navList.appendChild(li);
        } else {
          group = navList;   // an untitled section (e.g. the course summary) sits outside any module
        }
      }
      var item = el("li");
      var a = el("a", "course-nav__link" + (p.lesson.kind === "quiz" ? " is-quiz" : ""), p.lesson.title);
      a.href = "#lesson-" + (i + 1);
      a.setAttribute("data-index", i);
      item.appendChild(a);
      group.appendChild(item);
    });
  }

  function render(i, moveFocus) {
    var p = pages[i];
    lessonEl.innerHTML = "";
    var head = el("header", "lesson__head");
    head.appendChild(el("p", "eyebrow", p.module || (i === 0 ? "Getting started" : "Course complete")));
    head.appendChild(el("h2", "lesson__title", p.lesson.title));
    head.appendChild(el("p", "lesson__count", (p.lesson.kind === "quiz" ? "Self-check" : "Lesson") + " · " + (i + 1) + " of " + pages.length));
    lessonEl.appendChild(head);

    if (p.lesson.kind === "quiz") lessonEl.appendChild(quiz(p, i));
    else p.lesson.blocks.forEach(function (b) { lessonEl.appendChild(block(b)); });

    var nav = el("nav", "lesson__pager");
    nav.setAttribute("aria-label", "Lesson navigation");
    if (i > 0) {
      var prev = el("a", "btn btn--secondary", "← " + pages[i - 1].lesson.title);
      prev.href = "#lesson-" + i;
      nav.appendChild(prev);
    } else nav.appendChild(el("span"));
    if (i < pages.length - 1) {
      var next = el("a", "btn btn--primary", (p.lesson.kind === "quiz" ? "Continue: " : "Next: ") + pages[i + 1].lesson.title + " →");
      next.href = "#lesson-" + (i + 2);
      if (p.lesson.kind !== "quiz") next.addEventListener("click", function () { markDone(i); });
      nav.appendChild(next);
    } else {
      var fin = el("a", "btn btn--primary", "Finish course");
      fin.href = "../../learning-design.html#courses";
      if (p.lesson.kind !== "quiz") fin.addEventListener("click", function () { markDone(i); });
      nav.appendChild(fin);
    }
    lessonEl.appendChild(nav);

    document.querySelectorAll(".course-nav__link").forEach(function (a) {
      if (a.getAttribute("data-index") === String(i)) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = p.lesson.title + " | " + C.title;
    if (moveFocus) {
      lessonEl.focus({ preventScroll: true });
      lessonEl.scrollIntoView({ block: "start" });
    }
    closeNav();
  }

  function route(moveFocus) {
    var m = /^#lesson-(\d+)$/.exec(location.hash);
    var i = m ? Math.min(Math.max(parseInt(m[1], 10) - 1, 0), pages.length - 1) : 0;
    render(i, moveFocus);
  }

  /* Lesson list toggle on small screens */
  var navToggle = document.querySelector(".course-nav__toggle");
  function closeNav() {
    if (navToggle) { navToggle.setAttribute("aria-expanded", "false"); navList.classList.remove("is-open"); }
  }
  if (navToggle) navToggle.addEventListener("click", function () {
    var open = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(open));
    navList.classList.toggle("is-open", open);
  });

  var desc = document.getElementById("course-description");
  if (desc) desc.innerHTML = C.description;
  buildNav();
  updateProgress();
  route(false);
  window.addEventListener("hashchange", function () { route(true); });
})();
