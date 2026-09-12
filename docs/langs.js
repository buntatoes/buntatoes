(function () {
  "use strict";

  var YEAR_MIN = 1950;
  var YEAR_MAX = 2026;

  var LANGS = [
    {
      id: "python",
      name: "Python",
      rank: 1,
      index: 100,
      year: 1991,
      originators: "Guido van Rossum",
      org: "CWI, Netherlands",
      history: [
        "Released in 1991 as a successor to the teaching language ABC.",
        "It spread on readability, a large standard library, and later scientific and web stacks (NumPy, Django).",
        "CPython is still the reference implementation."
      ],
      now: "Data science, automation, backends, and AI tooling."
    },
    {
      id: "javascript",
      name: "JavaScript",
      rank: 2,
      index: 92,
      year: 1995,
      originators: "Brendan Eich",
      org: "Netscape",
      history: [
        "Written in 1995 for Netscape Navigator as a lightweight page-scripting language.",
        "ECMA standardized it as ECMAScript; every browser then ran some dialect of it.",
        "Node.js (2009) moved the same language onto servers and tooling."
      ],
      now: "Web clients, and a major share of backends and build tools."
    },
    {
      id: "typescript",
      name: "TypeScript",
      rank: 3,
      index: 84,
      year: 2012,
      originators: "Anders Hejlsberg",
      org: "Microsoft",
      history: [
        "Introduced in 2012 as a typed superset of JavaScript that compiles to it.",
        "It spread because large JS codebases needed types, and because Angular and VS Code adopted it early.",
        "Structural typing and file-by-file adoption let teams migrate without a rewrite."
      ],
      now: "Default language for many new web apps and Node services."
    },
    {
      id: "java",
      name: "Java",
      rank: 4,
      index: 78,
      year: 1995,
      originators: "James Gosling et al.",
      org: "Sun Microsystems",
      history: [
        "Designed at Sun and released in 1995 for portable bytecode on a virtual machine.",
        "Write-once-run-anywhere and a conservative standard library made it the default enterprise language of the 2000s.",
        "Google's Android SDK used it as the app language for a decade."
      ],
      now: "Large backends, Android (with Kotlin), and JVM data platforms."
    },
    {
      id: "c",
      name: "C",
      rank: 5,
      index: 71,
      year: 1972,
      originators: "Dennis Ritchie",
      org: "Bell Labs",
      history: [
        "Developed around 1972 to rewrite Unix in a higher-level language than assembly.",
        "Unix's later spread made C the lingua franca of systems programming.",
        "OS and library APIs are still described in C calling conventions."
      ],
      now: "Kernels, embedded software, and anything that must talk to the metal."
    },
    {
      id: "cpp",
      name: "C++",
      rank: 6,
      index: 68,
      year: 1985,
      originators: "Bjarne Stroustrup",
      org: "Bell Labs",
      history: [
        "Began as C with Classes and was named C++ in 1983; commercial use by 1985.",
        "It added abstraction (later templates, RAII, and a standard library) without giving up C's control over memory.",
        "Games, browsers, and finance adopted it for that mix of speed and structure."
      ],
      now: "Performance-critical software, games, browsers, and native toolkits."
    },
    {
      id: "csharp",
      name: "C#",
      rank: 7,
      index: 62,
      year: 2000,
      originators: "Anders Hejlsberg",
      org: "Microsoft",
      history: [
        "Shipped with .NET in 2000 as a Java-like language bound to the CLR.",
        "Windows enterprise shops and later Unity made it widely used.",
        "After .NET was open-sourced and ported off Windows, the language followed."
      ],
      now: "Backends, desktop software, games, and cloud services on modern .NET."
    },
    {
      id: "go",
      name: "Go",
      rank: 8,
      index: 54,
      year: 2009,
      originators: "Robert Griesemer, Rob Pike, Ken Thompson",
      org: "Google",
      history: [
        "Announced in 2009 for fast compiles, a small language, and built-in concurrency.",
        "Goroutines and a batteries-included net stack targeted large networked services.",
        "Docker, Kubernetes, and a wave of cloud CLIs were written in it."
      ],
      now: "Infrastructure, APIs, and command-line tools."
    },
    {
      id: "php",
      name: "PHP",
      rank: 9,
      index: 49,
      year: 1995,
      originators: "Rasmus Lerdorf",
      org: "independent, later Zend",
      history: [
        "Began in 1995 as CGI scripts (Personal Home Page Tools) and grew into a server-side language.",
        "Cheap shared hosting and MySQL made it the default way to put a database on the web.",
        "Wikipedia, Facebook's early stack, and WordPress locked in a large installed base."
      ],
      now: "Web backends, especially WordPress and Laravel."
    },
    {
      id: "rust",
      name: "Rust",
      rank: 10,
      index: 38,
      year: 2010,
      originators: "Graydon Hoare",
      org: "Mozilla, later Rust Foundation",
      history: [
        "Started at Mozilla and announced in 2010; 1.0 shipped in 2015.",
        "Ownership and borrowing give memory safety without a garbage collector.",
        "It spread from Firefox/Servo components into systems teams leaving C++ unsafety behind."
      ],
      now: "Systems software, CLIs, WebAssembly, and growing kernel and cloud use."
    },
    {
      id: "kotlin",
      name: "Kotlin",
      rank: 11,
      index: 33,
      year: 2011,
      originators: "JetBrains",
      org: "JetBrains",
      history: [
        "Announced in 2011, with 1.0 in 2016, as a pragmatic JVM language.",
        "Google made it a first-class Android language in 2017 and the preferred one in 2019.",
        "Java interop let Android and server teams adopt it incrementally."
      ],
      now: "New Android apps, plus some JVM backends."
    },
    {
      id: "sql",
      name: "SQL",
      rank: 12,
      index: 30,
      year: 1974,
      originators: "Donald Chamberlin, Raymond Boyce",
      org: "IBM",
      history: [
        "Defined at IBM in the early 1970s (SEQUEL, then SQL) from Codd's relational model.",
        "ANSI standardized it in 1986; vendors diverged but kept the SELECT/JOIN core.",
        "Relational databases became the default business store."
      ],
      now: "Queries against Postgres, MySQL, SQL Server, and warehouse engines."
    },
    {
      id: "swift",
      name: "Swift",
      rank: 13,
      index: 26,
      year: 2014,
      originators: "Chris Lattner et al.",
      org: "Apple",
      history: [
        "Announced in 2014 as a successor to Objective-C on Apple platforms.",
        "Safer defaults and Xcode integration moved iOS work onto it within a few years.",
        "It is open source and runs on Linux, but the center of gravity remains Apple's platforms."
      ],
      now: "iOS, macOS, and related Apple UI work."
    }
  ];

  var rankEl = document.getElementById("rank");
  var dockName = document.getElementById("dock-name");
  var dockMeta = document.getElementById("dock-meta");
  var dockBody = document.getElementById("dock-body");
  var dockNow = document.getElementById("dock-now");
  var yearInput = document.getElementById("year");
  var yearReadout = document.getElementById("year-readout");
  var timeFill = document.getElementById("time-fill");
  var timeMarks = document.getElementById("time-marks");

  var selectedId = LANGS[0].id;
  var year = LANGS[0].year;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function yearPct(y) {
    return ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
  }

  function byId(id) {
    var i;
    for (i = 0; i < LANGS.length; i += 1) {
      if (LANGS[i].id === id) {
        return LANGS[i];
      }
    }
    return LANGS[0];
  }

  function nearestByYear(y, preferId) {
    var i;
    var lang;
    var dist;
    var best = LANGS[0];
    var bestDist = Math.abs(LANGS[0].year - y);
    var prefer = preferId ? byId(preferId) : null;

    for (i = 1; i < LANGS.length; i += 1) {
      lang = LANGS[i];
      dist = Math.abs(lang.year - y);
      if (dist < bestDist || (dist === bestDist && lang.rank < best.rank)) {
        best = lang;
        bestDist = dist;
      }
    }

    if (prefer && Math.abs(prefer.year - y) === bestDist) {
      return prefer;
    }
    return best;
  }

  function renderList() {
    var html = "";
    var i;
    var lang;
    for (i = 0; i < LANGS.length; i += 1) {
      lang = LANGS[i];
      html +=
        '<li>' +
        '<button type="button" class="row" role="option" id="lang-' + lang.id + '" data-id="' + lang.id + '" aria-selected="false">' +
        '<span class="n">' + pad(lang.rank) + "</span>" +
        '<span class="lang">' + lang.name + "</span>" +
        '<span class="track" aria-hidden="true"><span class="fill" style="width:' + lang.index + '%"></span></span>' +
        '<span class="idx">' + lang.index + "</span>" +
        "</button></li>";
    }
    rankEl.innerHTML = html;
  }

  function renderMarks() {
    var html = "";
    var i;
    var lang;
    var used = {};
    var key;
    var bump;
    for (i = 0; i < LANGS.length; i += 1) {
      lang = LANGS[i];
      key = String(lang.year);
      bump = used[key] || 0;
      used[key] = bump + 1;
      html +=
        '<span class="mark" data-id="' + lang.id + '" style="left:' + yearPct(lang.year) + "%;top:" + (0.15 + bump * 0.22) + 'rem"></span>';
    }
    timeMarks.innerHTML = html;
  }

  function renderDock(lang) {
    var i;
    var p;
    dockName.textContent = lang.name;
    dockMeta.textContent =
      lang.year + "  ·  " + lang.originators + "  ·  " + lang.org + "  ·  rank " + pad(lang.rank);
    dockBody.textContent = "";
    for (i = 0; i < lang.history.length; i += 1) {
      p = document.createElement("p");
      p.textContent = lang.history[i];
      dockBody.appendChild(p);
    }
    dockNow.textContent = "now // " + lang.now;
  }

  function setYearChrome(y, lang) {
    var marks = timeMarks.querySelectorAll(".mark");
    var i;
    yearReadout.textContent = String(y);
    timeFill.style.width = yearPct(y) + "%";
    for (i = 0; i < marks.length; i += 1) {
      marks[i].classList.toggle("is-on", marks[i].getAttribute("data-id") === lang.id);
    }
    var on = timeMarks.querySelector(".mark.is-on");
    var oldLab = timeMarks.querySelector(".mark-lab");
    if (oldLab) {
      oldLab.parentNode.removeChild(oldLab);
    }
    if (on) {
      var lab = document.createElement("span");
      lab.className = "mark-lab";
      lab.textContent = lang.name;
      lab.style.left = "calc(" + yearPct(lang.year) + "% + 6px)";
      on.parentNode.appendChild(lab);
    }
  }

  function select(id, opts) {
    var lang = byId(id);
    var rows;
    var i;
    var row;
    var snapYear = !(opts && opts.keepYear);

    selectedId = lang.id;
    if (snapYear) {
      year = lang.year;
      yearInput.value = String(year);
    }

    rows = rankEl.querySelectorAll(".row");
    for (i = 0; i < rows.length; i += 1) {
      row = rows[i];
      row.setAttribute("aria-selected", row.getAttribute("data-id") === lang.id ? "true" : "false");
      row.tabIndex = row.getAttribute("data-id") === lang.id ? 0 : -1;
    }
    rankEl.setAttribute("aria-activedescendant", "lang-" + lang.id);

    renderDock(lang);
    setYearChrome(year, lang);

    if (opts && opts.focus) {
      var el = document.getElementById("lang-" + lang.id);
      if (el) {
        el.focus();
      }
    }

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + lang.id);
    } else {
      window.location.hash = lang.id;
    }
  }

  function move(delta) {
    var lang = byId(selectedId);
    var next = lang.rank - 1 + delta;
    if (next < 0) {
      next = LANGS.length - 1;
    }
    if (next >= LANGS.length) {
      next = 0;
    }
    select(LANGS[next].id, { focus: true });
  }

  function applySlider(y) {
    year = y;
    var lang = nearestByYear(y, selectedId);
    yearInput.value = String(y);
    if (lang.id !== selectedId) {
      select(lang.id, { keepYear: true });
    } else {
      setYearChrome(y, lang);
    }
  }

  rankEl.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".row") : null;
    if (!btn) {
      return;
    }
    select(btn.getAttribute("data-id"), { focus: true });
  });

  yearInput.addEventListener("input", function () {
    applySlider(Number(yearInput.value));
  });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }
    var k = e.key;
    if (k === "j" || k === "J" || k === "ArrowDown") {
      e.preventDefault();
      move(1);
      return;
    }
    if (k === "k" || k === "K" || k === "ArrowUp") {
      e.preventDefault();
      move(-1);
      return;
    }
    if (k === "Home") {
      e.preventDefault();
      select(LANGS[0].id, { focus: true });
      return;
    }
    if (k === "End") {
      e.preventDefault();
      select(LANGS[LANGS.length - 1].id, { focus: true });
      return;
    }
    if (k === "ArrowLeft" || k === "ArrowRight") {
      if (e.target === yearInput) {
        return;
      }
      e.preventDefault();
      applySlider(Math.max(YEAR_MIN, Math.min(YEAR_MAX, year + (k === "ArrowRight" ? 1 : -1))));
    }
  });

  function boot() {
    var hash = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    var start = LANGS[0].id;
    var i;
    renderList();
    renderMarks();
    for (i = 0; i < LANGS.length; i += 1) {
      if (LANGS[i].id === hash) {
        start = LANGS[i].id;
        break;
      }
    }
    select(start);
  }

  boot();
})();
