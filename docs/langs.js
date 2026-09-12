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
    },
    {
      id: "ruby",
      name: "Ruby",
      rank: 14,
      index: 22,
      year: 1995,
      originators: "Yukihiro Matsumoto",
      org: "independent, Japan",
      history: [
        "Matz released Ruby in 1995 as a language meant to feel natural to write.",
        "Ruby on Rails (2004) made it the web stack of the late 2000s; GitHub itself began as a Rails app.",
        "The language stayed small and object-oriented; the ecosystem followed Rails."
      ],
      now: "Rails services, scripting, and a long tail of tools that never left."
    },
    {
      id: "elixir",
      name: "Elixir",
      rank: 15,
      index: 16,
      year: 2011,
      originators: "José Valim",
      org: "Plataformatec",
      history: [
        "Announced in 2011 (1.0 in 2014) with Ruby-like syntax on the Erlang VM.",
        "Actors, supervision trees, and hot code loading come from BEAM; the syntax was meant to be approachable.",
        "Phoenix made it a web language for long-lived connections. ChorusDraft is Elixir."
      ],
      now: "Concurrent services, Phoenix apps, and local tools that should not fall over."
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
  var skyEl = document.getElementById("sky");
  var railLive = document.querySelector(".rail-live");

  var selectedId = LANGS[0].id;
  var year = LANGS[0].year;
  var resizeTimer = 0;

  function yearPct(y) {
    return ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
  }

  function eraClass(y) {
    if (y < 1990) {
      return "era-early";
    }
    if (y < 2010) {
      return "era-mid";
    }
    return "era-late";
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
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

  function placeOrbs() {
    var counts = {};
    var seen = {};
    var placed = [];
    var i;
    var lang;
    var n;
    var slot;
    var spread;
    var x;
    var y;

    for (i = 0; i < LANGS.length; i += 1) {
      counts[LANGS[i].year] = (counts[LANGS[i].year] || 0) + 1;
    }

    for (i = 0; i < LANGS.length; i += 1) {
      lang = LANGS[i];
      n = counts[lang.year];
      slot = seen[lang.year] || 0;
      seen[lang.year] = slot + 1;
      spread = n > 1 ? (slot - (n - 1) / 2) * 5.4 : 0;
      x = yearPct(lang.year) + spread;
      x = Math.max(7, Math.min(93, x));
      y = 18 + ((lang.rank - 1) / (LANGS.length - 1)) * 62;
      y += Math.sin((lang.year - YEAR_MIN) * 0.13 + lang.rank * 0.7) * 6;
      y = Math.max(16, Math.min(82, y));
      placed.push({ lang: lang, x: x, y: y });
    }
    return placed;
  }

  function linksFor(placed) {
    var pairs = {};
    var links = [];
    var i;
    var j;
    var dx;
    var dy;
    var d;
    var nearest;
    var a;
    var b;
    var key;

    for (i = 0; i < placed.length; i += 1) {
      nearest = [];
      for (j = 0; j < placed.length; j += 1) {
        if (i === j) {
          continue;
        }
        dx = placed[i].x - placed[j].x;
        dy = (placed[i].y - placed[j].y) * 0.9;
        d = dx * dx + dy * dy;
        nearest.push({ j: j, d: d });
      }
      nearest.sort(function (p, q) {
        return p.d - q.d;
      });
      for (j = 0; j < 2 && j < nearest.length; j += 1) {
        a = placed[i].lang.id;
        b = placed[nearest[j].j].lang.id;
        key = a < b ? a + ":" + b : b + ":" + a;
        if (!pairs[key]) {
          pairs[key] = true;
          links.push({ a: a, b: b, i: i, j: nearest[j].j });
        }
      }
    }
    return links;
  }

  function renderSky() {
    var placed = placeOrbs();
    var links = linksFor(placed);
    var i;
    var p;
    var lang;
    var r;
    var html;
    var sx;
    var sy;
    var sr;

    html = '<div class="sky-field">';
    html += '<svg class="sky-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
    for (i = 0; i < 32; i += 1) {
      sx = (i * 37 + 11) % 100;
      sy = (i * 53 + 19) % 100;
      sr = 0.16 + (i % 4) * 0.07;
      html += '<circle class="speck" cx="' + sx + '" cy="' + sy + '" r="' + sr + '" />';
    }
    for (i = 0; i < links.length; i += 1) {
      html +=
        '<line class="sky-link" data-a="' +
        links[i].a +
        '" data-b="' +
        links[i].b +
        '" x1="' +
        placed[links[i].i].x +
        '" y1="' +
        placed[links[i].i].y +
        '" x2="' +
        placed[links[i].j].x +
        '" y2="' +
        placed[links[i].j].y +
        '" />';
    }
    html += "</svg>";

    for (i = 0; i < placed.length; i += 1) {
      p = placed[i];
      lang = p.lang;
      r = 0.58 + (lang.index / 100) * 0.82;
      html +=
        '<button type="button" class="star ' +
        eraClass(lang.year) +
        '" id="star-' +
        lang.id +
        '" data-id="' +
        lang.id +
        '" aria-pressed="false" aria-label="' +
        esc(lang.name) +
        ", " +
        lang.year +
        '" style="left:' +
        p.x +
        "%;top:" +
        p.y +
        "%;--star-r:" +
        r +
        '">';
      html += '<span class="star-halo" aria-hidden="true"></span>';
      html += '<span class="star-core" aria-hidden="true"></span>';
      html += '<span class="star-name">' + esc(lang.name) + "</span>";
      html += "</button>";
    }
    html += "</div>";
    skyEl.innerHTML = html;
  }

  function paintSky(id) {
    var stars = skyEl.querySelectorAll(".star");
    var lines = skyEl.querySelectorAll(".sky-link");
    var i;
    var on;
    for (i = 0; i < stars.length; i += 1) {
      on = stars[i].getAttribute("data-id") === id;
      stars[i].setAttribute("aria-pressed", on ? "true" : "false");
      stars[i].classList.toggle("is-on", on);
    }
    for (i = 0; i < lines.length; i += 1) {
      lines[i].classList.toggle(
        "is-on",
        lines[i].getAttribute("data-a") === id || lines[i].getAttribute("data-b") === id
      );
    }
  }

  function renderList() {
    var html = "";
    var i;
    var lang;
    for (i = 0; i < LANGS.length; i += 1) {
      lang = LANGS[i];
      html +=
        "<li>" +
        '<button type="button" class="row" role="option" id="lang-' + lang.id + '" data-id="' + lang.id + '" aria-selected="false">' +
        '<span class="n">' + lang.rank + "</span>" +
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
        '<span class="mark" data-id="' + lang.id + '" style="left:' + yearPct(lang.year) + "%;top:" + (0.35 + bump * 0.22) + 'rem"></span>';
    }
    timeMarks.innerHTML = html;
  }

  function renderDock(lang) {
    var i;
    var p;
    dockName.textContent = lang.name;
    dockMeta.textContent =
      lang.year + "  ·  " + lang.originators + "  ·  " + lang.org + "  ·  rank " + lang.rank;
    dockBody.textContent = "";
    for (i = 0; i < lang.history.length; i += 1) {
      p = document.createElement("p");
      p.textContent = lang.history[i];
      dockBody.appendChild(p);
    }
    dockNow.textContent = "now — " + lang.now;
    if (railLive) {
      railLive.textContent = lang.name;
    }
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
      lab.style.left = "calc(" + yearPct(lang.year) + "% + 8px)";
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
    paintSky(lang.id);

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
      paintSky(lang.id);
    }
  }

  rankEl.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".row") : null;
    if (!btn) {
      return;
    }
    select(btn.getAttribute("data-id"), { focus: true });
  });

  skyEl.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".star") : null;
    if (!btn) {
      return;
    }
    select(btn.getAttribute("data-id"));
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

  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      renderSky();
      paintSky(selectedId);
    }, 90);
  });

  function boot() {
    var hash = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    var start = LANGS[0].id;
    var i;
    renderList();
    renderMarks();
    renderSky();
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
