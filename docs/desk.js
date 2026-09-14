(function () {
  var ALIASES = {
    chorusdraft: "chorus",
    adaegis: "aegis",
    languages: "lang",
    language: "lang",
    sky: "lang",
    field: "lang",
    gate: "holdfast",
    linux: "holdfast",
    drafts: "chorus",
    ads: "aegis"
  };

  var FALLBACK = {
    desk: { name: "buntos", tag: "local tools. human review. linux." },
    bots: [
      {
        id: "holdfast",
        name: "Holdfast",
        title: "Linux gate",
        idleLine: "Queue empty. Listening.",
        workingLine: "Intercepting a call.",
        waitingLine: "Needs a human.",
        about:
          "Agents propose. You decide. A Linux gate under the coding-agent process. File, shell, and net wait for policy or a human. The default is fail-closed.",
        href: "https://github.com/buntatoes/holdfast",
        hrefLabel: "Holdfast on GitHub",
        avatar: "./bots/holdfast.svg",
        prompts: [
          {
            id: "who",
            label: "Who decides?",
            answer:
              "You. The model proposes open, exec, and connect. Policy or a human allows them. Missing daemon, timeout, unknown op: deny."
          },
          {
            id: "prompt",
            label: "Why not a prompt?",
            answer:
              "Prompts are not a security boundary. Holdfast does not read them. It intercepts the call."
          },
          {
            id: "where",
            label: "Where does it run?",
            answer:
              "Linux. A daemon, a preload, a desk for the pending queue. Fail-closed. It does not phone home."
          }
        ]
      },
      {
        id: "chorus",
        name: "ChorusDraft",
        title: "Social drafts",
        idleLine: "Review-first. Queue quiet.",
        workingLine: "Drafting a post.",
        waitingLine: "Waiting on review.",
        about:
          "Human-reviewed drafts for Bluesky and Mastodon. Models write. You ship. Voice is dry wit; serious topics stay sincere. ChorusDraft is Elixir.",
        href: "https://github.com/buntatoes/chorusdraft",
        hrefLabel: "ChorusDraft on GitHub",
        avatar: "./bots/chorus.svg",
        prompts: [
          {
            id: "post",
            label: "What gets posted?",
            answer:
              "Nothing until you review it — unless you opted into automatic, which still screens. Older queue items and owner text stay review-only."
          },
          {
            id: "nets",
            label: "Which networks?",
            answer:
              "Bluesky and Mastodon. Local queues, split by service and account. It does not auto-like, favourite, boost, or repost."
          },
          {
            id: "guard",
            label: "What is Guard?",
            answer:
              "Publication screening. Official builds include it and sign it. The bot refuses to run if Guard is missing."
          }
        ]
      },
      {
        id: "aegis",
        name: "AdAegis",
        title: "Ad block",
        idleLine: "Network block on.",
        workingLine: "Checking a request.",
        waitingLine: "Filter list is local.",
        about:
          "A small ad blocker for desktop Chrome and Chromium 120+. Network blocking is on. Page cleanup and YouTube filtering start off until you say so.",
        href: "https://github.com/buntatoes/adaegis",
        hrefLabel: "AdAegis on GitHub",
        avatar: "./bots/aegis.svg",
        prompts: [
          {
            id: "block",
            label: "What does it block?",
            answer:
              "Bundled network rules for common ad-tech domains, on by default. Optional page cleanup hides recognized ad containers."
          },
          {
            id: "home",
            label: "Does it phone home?",
            answer:
              "No account, no telemetry, no remote filter list, no auto-update. Settings stay on the machine in front of you."
          },
          {
            id: "install",
            label: "How do I install it?",
            answer:
              "Load unpacked from the GitHub zip. Not listed on the Chrome Web Store. Leave the folder where Chrome can keep finding it."
          }
        ]
      },
      {
        id: "lang",
        name: "Lang",
        title: "Language field",
        idleLine: "Sky is up.",
        workingLine: "Placing an orb.",
        waitingLine: "Pick a year.",
        about:
          "A night field of languages this profile actually ships. Year drifts east. Rank hangs higher. Ruby and Elixir sit with the usual suspects.",
        href: "./langs.html",
        hrefLabel: "Open the language sky",
        avatar: "./bots/lang.svg",
        prompts: [
          {
            id: "who",
            label: "Who lives here?",
            answer:
              "Python, JavaScript, TypeScript, Java, C, C++, C#, Go, PHP, Rust, Kotlin, SQL, Swift, Ruby, Elixir. Ranks mix public indexes with languages this profile ships."
          },
          {
            id: "elixir",
            label: "Where is Elixir?",
            answer:
              "2011. José Valim. Ruby-like syntax on the Erlang VM. Phoenix for long-lived connections. ChorusDraft is Elixir."
          },
          {
            id: "sky",
            label: "Open the sky",
            answer:
              "The constellation is next door. Click an orb or scrub the year. j / k still works there.",
            link: { href: "./langs.html", label: "languages" }
          }
        ]
      }
    ]
  };

  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = motion.matches;
  var bots = [];
  var selectedId = "";
  var statusById = {};
  var logs = {};
  var statusTimer = 0;
  var waitTimer = 0;
  var workTimer = 0;
  var syncingHash = false;

  var rosterEl = document.getElementById("roster");
  var nameEl = document.getElementById("bot-name");
  var titleEl = document.getElementById("bot-title");
  var aboutEl = document.getElementById("bot-about");
  var visitEl = document.getElementById("bot-visit");
  var chipsEl = document.getElementById("chips");
  var transcriptEl = document.getElementById("transcript");
  var emptyEl = document.getElementById("empty-hint");
  var verbEl = document.getElementById("status-verb");
  var workFaceEl = document.getElementById("work-face");

  function validRoster(data) {
    return data && Array.isArray(data.bots) && data.bots.length > 0 && data.bots.every(function (bot) {
      return bot && typeof bot.id === "string" && typeof bot.name === "string";
    });
  }

  function findBot(id) {
    var i;
    for (i = 0; i < bots.length; i++) {
      if (bots[i].id === id) return bots[i];
    }
    return null;
  }

  function resolveId(raw) {
    var key = String(raw || "").replace(/^#/, "").toLowerCase();
    if (!key) return "";
    if (ALIASES[key]) key = ALIASES[key];
    var bot = findBot(key);
    if (bot) return bot.id;
    for (var i = 0; i < bots.length; i++) {
      var aliases = bots[i].aliases || [];
      if (aliases.indexOf(key) !== -1) return bots[i].id;
    }
    return "";
  }

  function indexOf(id) {
    var i;
    for (i = 0; i < bots.length; i++) {
      if (bots[i].id === id) return i;
    }
    return 0;
  }

  function hashId() {
    return resolveId((location.hash || "").replace(/^#/, ""));
  }

  function setHash(id) {
    var next = "#" + id;
    if (location.hash === next) return;
    syncingHash = true;
    if (history.replaceState) {
      history.replaceState(null, "", next);
    } else {
      location.hash = id;
    }
    window.setTimeout(function () {
      syncingHash = false;
    }, 0);
  }

  function delay(fast, slow) {
    return reduce ? fast : slow;
  }

  function clearTimers() {
    if (statusTimer) window.clearTimeout(statusTimer);
    if (waitTimer) window.clearTimeout(waitTimer);
    if (workTimer) window.clearTimeout(workTimer);
    statusTimer = 0;
    waitTimer = 0;
    workTimer = 0;
  }

  function verbFor(status) {
    if (status === "working") return "working";
    if (status === "waiting") return "waiting";
    return "idle";
  }

  function lineFor(bot, status) {
    if (!bot) return verbFor(status);
    if (status === "working") return bot.workingLine || "working";
    if (status === "waiting") return bot.waitingLine || "waiting";
    return bot.idleLine || "idle";
  }

  function applyAvatarClass(el, status) {
    if (!el) return;
    el.classList.remove("is-idle", "is-working", "is-waiting");
    el.classList.add("is-" + verbFor(status));
  }

  function setStatus(id, status) {
    var next = verbFor(status);
    statusById[id] = next;
    var opt = document.getElementById("bot-" + id);
    var avatar = opt ? opt.querySelector(".avatar") : null;
    var bot = findBot(id);
    if (avatar) applyAvatarClass(avatar, next);
    if (id === selectedId) applyAvatarClass(workFaceEl, next);
    if (opt && bot) {
      var line = lineFor(bot, next);
      opt.setAttribute("aria-label", bot.name + ", " + (bot.title || "") + ", " + line);
      opt.title = line;
    }
    if (id === selectedId && verbEl) {
      verbEl.textContent = lineFor(bot, next);
      verbEl.setAttribute("data-status", next);
    }
  }

  function pulseSelect(id) {
    clearTimers();
    setStatus(id, "working");
    statusTimer = window.setTimeout(function () {
      setStatus(id, "idle");
    }, delay(40, 780));
  }

  function stripMotion(svg) {
    var doomed = svg.querySelectorAll("animate, animateTransform, animateMotion, style");
    for (var i = 0; i < doomed.length; i++) {
      if (doomed[i].parentNode) doomed[i].parentNode.removeChild(doomed[i]);
    }
  }

  function mountSvg(host, svg, size) {
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("aria-hidden", "true");
    svg.removeAttribute("role");
    svg.removeAttribute("aria-label");
    stripMotion(svg);
    host.textContent = "";
    host.appendChild(document.importNode(svg, true));
  }

  function cloneFace(id) {
    if (!workFaceEl) return;
    var opt = document.getElementById("bot-" + id);
    var svg = opt ? opt.querySelector("svg") : null;
    workFaceEl.textContent = "";
    if (!svg) return;
    var copy = svg.cloneNode(true);
    copy.setAttribute("width", "72");
    copy.setAttribute("height", "72");
    workFaceEl.appendChild(copy);
    applyAvatarClass(workFaceEl, statusById[id] || "idle");
  }

  function inlineAvatar(avatar, src, id) {
    fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error("svg");
        return res.text();
      })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, "image/svg+xml");
        var svg = doc.documentElement;
        if (!svg || svg.nodeName.toLowerCase() !== "svg") return;
        mountSvg(avatar, svg, 48);
        applyAvatarClass(avatar, statusById[id] || "idle");
        if (id === selectedId) cloneFace(id);
      })
      .catch(function () {
        /* keep the img fallback */
      });
  }

  function optionEl(bot) {
    var option = document.createElement("button");
    option.type = "button";
    option.className = "option";
    option.id = "bot-" + bot.id;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.id = bot.id;
    option.title = lineFor(bot, "idle");

    var avatar = document.createElement("span");
    avatar.className = "avatar is-idle";
    avatar.setAttribute("aria-hidden", "true");
    var img = document.createElement("img");
    img.src = bot.avatar || "./bots/" + bot.id + ".svg";
    img.alt = "";
    img.width = 48;
    img.height = 48;
    avatar.appendChild(img);
    inlineAvatar(avatar, img.src, bot.id);

    var copy = document.createElement("span");
    copy.className = "opt-copy";
    var name = document.createElement("span");
    name.className = "opt-name";
    name.textContent = bot.name;
    var title = document.createElement("span");
    title.className = "opt-title";
    title.textContent = bot.title || "";
    copy.appendChild(name);
    copy.appendChild(title);

    option.appendChild(avatar);
    option.appendChild(copy);
    return option;
  }

  function renderRoster() {
    rosterEl.textContent = "";
    bots.forEach(function (bot) {
      if (!Object.prototype.hasOwnProperty.call(statusById, bot.id)) {
        statusById[bot.id] = "idle";
      }
      if (!logs[bot.id]) logs[bot.id] = [];
      rosterEl.appendChild(optionEl(bot));
    });
  }

  function safeHref(href) {
    if (!href || typeof href !== "string") return "";
    if (href.indexOf("./") === 0) return href;
    if (href.indexOf("https://github.com/buntatoes") === 0) return href;
    if (href.indexOf("https://buntatoes.github.io/") === 0) return href;
    return "";
  }

  function renderChips(bot) {
    chipsEl.textContent = "";
    (bot.prompts || []).forEach(function (prompt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.dataset.prompt = prompt.id;
      btn.textContent = prompt.label;
      chipsEl.appendChild(btn);
    });
  }

  function turnNode(entry) {
    var wrap = document.createElement("article");
    wrap.className = "turn" + (entry.kind === "you" ? " is-you" : "");
    var who = document.createElement("p");
    who.className = "turn-who";
    who.textContent = entry.who;
    var body = document.createElement("p");
    body.className = "turn-body";
    body.textContent = entry.text;
    if (entry.link && safeHref(entry.link.href)) {
      body.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = safeHref(entry.link.href);
      a.textContent = entry.link.label || entry.link.href;
      body.appendChild(a);
    }
    wrap.appendChild(who);
    wrap.appendChild(body);
    return wrap;
  }

  function renderTranscript(id) {
    var entries = logs[id] || [];
    transcriptEl.textContent = "";
    entries.forEach(function (entry) {
      transcriptEl.appendChild(turnNode(entry));
    });
    if (emptyEl) emptyEl.classList.toggle("is-hidden", entries.length > 0);
  }

  function paintWorkspace(bot) {
    nameEl.textContent = bot.name;
    titleEl.textContent = bot.title || "";
    aboutEl.textContent = bot.about || "";
    var href = safeHref(bot.href);
    if (href) {
      visitEl.hidden = false;
      visitEl.href = href;
      visitEl.textContent = bot.hrefLabel || href;
    } else {
      visitEl.hidden = true;
      visitEl.removeAttribute("href");
      visitEl.textContent = "";
    }
    renderChips(bot);
    renderTranscript(bot.id);
    cloneFace(bot.id);
    setStatus(bot.id, statusById[bot.id] || "idle");
  }

  function markSelected(id) {
    var nodes = rosterEl.querySelectorAll('[role="option"]');
    nodes.forEach(function (node) {
      var on = node.dataset.id === id;
      node.classList.toggle("is-selected", on);
      node.setAttribute("aria-selected", on ? "true" : "false");
    });
    rosterEl.setAttribute("aria-activedescendant", "bot-" + id);
  }

  function select(id, opts) {
    var bot = findBot(id);
    if (!bot) return;
    var same = selectedId === bot.id;
    selectedId = bot.id;
    markSelected(bot.id);
    paintWorkspace(bot);
    setHash(bot.id);
    if (opts && opts.pulse && (!same || opts.forcePulse)) pulseSelect(bot.id);
  }

  function move(dir) {
    if (!bots.length) return;
    var i = indexOf(selectedId);
    var next = (i + dir + bots.length) % bots.length;
    select(bots[next].id, { pulse: true });
  }

  function findPrompt(bot, promptId) {
    var list = bot.prompts || [];
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === promptId) return list[i];
    }
    return null;
  }

  function ask(promptId) {
    var bot = findBot(selectedId);
    if (!bot) return;
    var prompt = findPrompt(bot, promptId);
    if (!prompt) return;

    chipsEl.querySelectorAll(".chip").forEach(function (chip) {
      chip.classList.toggle("is-on", chip.dataset.prompt === promptId);
    });

    logs[bot.id].push({
      kind: "you",
      who: "you",
      text: prompt.label
    });
    renderTranscript(bot.id);

    clearTimers();
    setStatus(bot.id, "waiting");
    waitTimer = window.setTimeout(function () {
      setStatus(bot.id, "working");
      workTimer = window.setTimeout(function () {
        logs[bot.id].push({
          kind: "bot",
          who: bot.name,
          text: prompt.answer || "",
          link: prompt.link || null
        });
        renderTranscript(bot.id);
        setStatus(bot.id, "idle");
      }, delay(40, 640));
    }, delay(40, 280));
  }

  function onRosterClick(event) {
    var option = event.target.closest('[role="option"]');
    if (!option || !rosterEl.contains(option)) return;
    select(option.dataset.id, { pulse: true, forcePulse: true });
  }

  function fromField(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }

  function onDocumentKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
    if (fromField(event.target)) return;
    var k = event.key;
    if (k === "1" || k === "2" || k === "3" || k === "4") {
      var bot = bots[Number(k) - 1];
      if (bot) {
        event.preventDefault();
        select(bot.id, { pulse: true, forcePulse: true });
      }
      return;
    }
    if (k === "ArrowDown" || k === "ArrowRight" || k === "j" || k === "J") {
      event.preventDefault();
      move(1);
      return;
    }
    if (k === "ArrowUp" || k === "ArrowLeft" || k === "k" || k === "K") {
      event.preventDefault();
      move(-1);
      return;
    }
    if (k === "Home") {
      event.preventDefault();
      select(bots[0].id, { pulse: true });
      return;
    }
    if (k === "End") {
      event.preventDefault();
      select(bots[bots.length - 1].id, { pulse: true });
    }
  }

  function onChipsClick(event) {
    var btn = event.target.closest(".chip");
    if (!btn) return;
    ask(btn.dataset.prompt);
  }

  function onHash() {
    if (syncingHash) return;
    var id = hashId() || (bots[0] && bots[0].id);
    if (id) select(id, { pulse: false });
  }

  function onMotion() {
    reduce = motion.matches;
  }

  function start(data) {
    bots = data.bots.slice();
    renderRoster();
    var initial = hashId() || bots[0].id;
    select(initial, { pulse: true });

    rosterEl.addEventListener("click", onRosterClick);
    chipsEl.addEventListener("click", onChipsClick);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onDocumentKey);
    if (motion.addEventListener) motion.addEventListener("change", onMotion);
    else if (motion.addListener) motion.addListener(onMotion);
  }

  fetch("./bots/roster.json")
    .then(function (res) {
      if (!res.ok) throw new Error("roster");
      return res.json();
    })
    .then(function (data) {
      if (!validRoster(data)) throw new Error("shape");
      start(data);
    })
    .catch(function () {
      start(FALLBACK);
    });
})();
