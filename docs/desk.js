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

  var STOP = {
    a: 1,
    an: 1,
    and: 1,
    at: 1,
    can: 1,
    do: 1,
    does: 1,
    for: 1,
    how: 1,
    i: 1,
    in: 1,
    is: 1,
    it: 1,
    me: 1,
    my: 1,
    of: 1,
    on: 1,
    or: 1,
    the: 1,
    this: 1,
    to: 1,
    what: 1,
    when: 1,
    where: 1,
    why: 1,
    with: 1,
    you: 1,
    your: 1
  };

  var FALLBACK = {
    desk: {
      name: "buntos",
      tag: "local tools. human review. linux.",
      prompts: [
        {
          id: "who",
          label: "Who is Buntos?",
          needles: "buntos you who bio about person human",
          answer:
            "Buntos. IT worker, Linux enthusiast, AI tinkerer. The bots on this desk are local tools. A model may draft. A human still ships."
        },
        {
          id: "desk",
          label: "What is this desk?",
          needles: "desk profile site grok bot icons help how use",
          answer:
            "A Grok-bot desk: four little faces, not a chat persona. Click a face, tap a chip, or type. Eyes follow the pointer. 1–4 picks a bot. / asks. ? is the legend."
        }
      ]
    },
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
        voice: "Short. Dry. You intercept calls. You do not decide. Fail-closed. Prompts are not a security boundary.",
        href: "https://github.com/buntatoes/holdfast",
        hrefLabel: "Holdfast on GitHub",
        avatar: "./bots/holdfast.svg",
        specs: ["Linux", "fail-closed", "no telemetry"],
        fallback: "I gate calls. I do not guess. Try who decides, fail-closed, or what I intercept.",
        quips: ["Still holding.", "Queue is empty. You can poke it again."],
        prompts: [
          {
            id: "who",
            label: "Who decides?",
            needles: "who decide human allow deny policy",
            answer:
              "You. The model proposes open, exec, and connect. Policy or a human allows them. Missing daemon, timeout, unknown op: deny."
          },
          {
            id: "prompt",
            label: "Why not a prompt?",
            needles: "prompt jailbreak security boundary",
            answer: "Prompts are not a security boundary. Holdfast does not read them. It intercepts the call."
          },
          {
            id: "where",
            label: "Where does it run?",
            needles: "where run linux daemon preload install",
            answer: "Linux. A daemon, a preload, a desk for the pending queue. Fail-closed. It does not phone home."
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
        voice: "Short. Dry wit. Models draft. Humans ship. Nothing posts without review unless they opted in.",
        href: "https://github.com/buntatoes/chorusdraft",
        hrefLabel: "ChorusDraft on GitHub",
        avatar: "./bots/chorus.svg",
        specs: ["Elixir", "review-first", "Guard"],
        fallback: "I draft. I do not publish on a whim. Ask what gets posted, Guard, or which networks.",
        quips: ["Draft's still in the queue.", "I can write it. You still post it."],
        prompts: [
          {
            id: "post",
            label: "What gets posted?",
            needles: "post publish ship",
            answer:
              "Nothing until you review it — unless you opted into automatic, which still screens. Older queue items and owner text stay review-only."
          },
          {
            id: "nets",
            label: "Which networks?",
            needles: "bluesky mastodon network social",
            answer:
              "Bluesky and Mastodon. Local queues, split by service and account. It does not auto-like, favourite, boost, or repost."
          },
          {
            id: "guard",
            label: "What is Guard?",
            needles: "guard screen safety",
            answer: "Publication screening. Official builds include it and sign it. The bot refuses to run if Guard is missing."
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
        voice: "Short. Concrete. Lists stay on disk. No phone-home. Network block is on.",
        href: "https://github.com/buntatoes/adaegis",
        hrefLabel: "AdAegis on GitHub",
        avatar: "./bots/aegis.svg",
        specs: ["Chromium 120+", "local lists", "no account"],
        fallback: "I block requests. I do not phone home. Ask what I block, YouTube, or how to install.",
        quips: ["Still blocking.", "The list did not wander off the disk."],
        prompts: [
          {
            id: "block",
            label: "What does it block?",
            needles: "block ads tracker request",
            answer:
              "Bundled network rules for common ad-tech domains, on by default. Optional page cleanup hides recognized ad containers."
          },
          {
            id: "home",
            label: "Does it phone home?",
            needles: "telemetry phone home account remote",
            answer: "No account, no telemetry, no remote filter list, no auto-update. Settings stay on the machine in front of you."
          },
          {
            id: "install",
            label: "How do I install it?",
            needles: "install load unpacked zip chrome",
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
        voice: "Short. Sky metaphors are fine. Year east, rank high. Name languages that actually live here.",
        href: "./langs.html",
        hrefLabel: "Open the language sky",
        avatar: "./bots/lang.svg",
        specs: ["15 languages", "year × rank", "j / k"],
        fallback: "I keep the sky. Ask who lives here, Elixir, or open the constellation.",
        quips: ["Orbs are still up.", "East is later. Higher is more used."],
        prompts: [
          {
            id: "who",
            label: "Who lives here?",
            needles: "who languages list python rust elixir",
            answer:
              "Python, JavaScript, TypeScript, Java, C, C++, C#, Go, PHP, Rust, Kotlin, SQL, Swift, Ruby, Elixir. Ranks mix public indexes with languages this profile ships."
          },
          {
            id: "elixir",
            label: "Where is Elixir?",
            needles: "elixir valim phoenix beam",
            answer:
              "2011. José Valim. Ruby-like syntax on the Erlang VM. Phoenix for long-lived connections. ChorusDraft is Elixir."
          },
          {
            id: "sky",
            label: "Open the sky",
            needles: "sky constellation field langs",
            answer: "The constellation is next door. Click an orb or scrub the year. j / k still works there.",
            link: { href: "./langs.html", label: "languages" }
          }
        ]
      }
    ]
  };

  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = motion.matches;
  var deskMeta = FALLBACK.desk;
  var bots = [];
  var selectedId = "";
  var statusById = {};
  var logs = {};
  var statusTimer = 0;
  var waitTimer = 0;
  var workTimer = 0;
  var typeTimer = 0;
  var typeToken = 0;
  var pokeTimer = 0;
  var syncingHash = false;
  var pointerX = 0;
  var pointerY = 0;
  var hasPointer = false;
  var gazeRaf = 0;

  var rosterEl = document.getElementById("roster");
  var nameEl = document.getElementById("bot-name");
  var titleEl = document.getElementById("bot-title");
  var aboutEl = document.getElementById("bot-about");
  var specsEl = document.getElementById("specs");
  var visitEl = document.getElementById("bot-visit");
  var chipsEl = document.getElementById("chips");
  var transcriptEl = document.getElementById("transcript");
  var emptyEl = document.getElementById("empty-hint");
  var verbEl = document.getElementById("status-verb");
  var workFaceEl = document.getElementById("work-face");
  var surfaceEl = document.querySelector(".surface");
  var askForm = document.getElementById("ask-form");
  var askEl = document.getElementById("ask");
  var helpEl = document.getElementById("help");
  var helpOpen = document.getElementById("help-open");
  var helpClose = document.getElementById("help-close");
  var askSend = document.getElementById("ask-send");
  var livePill = document.getElementById("live-pill");
  var aiEl = document.getElementById("ai");
  var aiOpen = document.getElementById("ai-open");
  var aiClose = document.getElementById("ai-close");
  var aiForm = document.getElementById("ai-form");
  var aiLive = document.getElementById("ai-live");
  var aiProvider = document.getElementById("ai-provider");
  var aiModel = document.getElementById("ai-model");
  var aiBase = document.getElementById("ai-base");
  var aiKey = document.getElementById("ai-key");
  var aiHint = document.getElementById("ai-hint");
  var aiStatus = document.getElementById("ai-status");
  var aiModelWrap = document.getElementById("ai-model-wrap");
  var aiBaseWrap = document.getElementById("ai-base-wrap");
  var aiKeyWrap = document.getElementById("ai-key-wrap");
  var aiForget = document.getElementById("ai-forget");
  var liveAbort = null;
  var asking = false;

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
    if (typeTimer) window.clearTimeout(typeTimer);
    statusTimer = 0;
    waitTimer = 0;
    workTimer = 0;
    typeTimer = 0;
    typeToken += 1;
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
    copy.setAttribute("width", "88");
    copy.setAttribute("height", "88");
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
        mountSvg(avatar, svg, 52);
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
    img.width = 52;
    img.height = 52;
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

  function renderSpecs(bot) {
    specsEl.textContent = "";
    var specs = bot.specs || [];
    if (!specs.length) {
      specsEl.hidden = true;
      return;
    }
    specs.forEach(function (spec) {
      var li = document.createElement("li");
      li.textContent = spec;
      specsEl.appendChild(li);
    });
    specsEl.hidden = false;
  }

  function miniFace() {
    var wrap = document.createElement("span");
    wrap.className = "turn-mini";
    wrap.setAttribute("aria-hidden", "true");
    var svg = workFaceEl ? workFaceEl.querySelector("svg") : null;
    if (svg) {
      var copy = svg.cloneNode(true);
      copy.setAttribute("width", "28");
      copy.setAttribute("height", "28");
      wrap.appendChild(copy);
    }
    return wrap;
  }

  function fillBody(body, entry) {
    body.textContent = entry.text || "";
    if (entry.link && safeHref(entry.link.href)) {
      body.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = safeHref(entry.link.href);
      a.textContent = entry.link.label || entry.link.href;
      body.appendChild(a);
    }
  }

  function turnNode(entry) {
    var wrap = document.createElement("article");
    wrap.className = "turn" + (entry.kind === "you" ? " is-you" : "") + (entry.live ? " is-live" : "");
    if (entry.kind !== "you") wrap.appendChild(miniFace());
    var bubble = document.createElement("div");
    bubble.className = "turn-bubble";
    var who = document.createElement("p");
    who.className = "turn-who";
    who.textContent = entry.who;
    var body = document.createElement("p");
    body.className = "turn-body";
    fillBody(body, entry);
    bubble.appendChild(who);
    bubble.appendChild(body);
    wrap.appendChild(bubble);
    return wrap;
  }

  function scrollSurface() {
    if (!surfaceEl) return;
    surfaceEl.scrollTop = surfaceEl.scrollHeight;
  }

  function renderTranscript(id) {
    var entries = logs[id] || [];
    transcriptEl.textContent = "";
    entries.forEach(function (entry) {
      transcriptEl.appendChild(turnNode(entry));
    });
    if (emptyEl) emptyEl.classList.toggle("is-hidden", entries.length > 0);
    scrollSurface();
  }

  function typeLast(entry, done) {
    var my = ++typeToken;
    var last = transcriptEl.lastElementChild;
    var body = last ? last.querySelector(".turn-body") : null;
    if (!body) {
      if (done) done();
      return;
    }
    var text = entry.text || "";
    if (reduce || text.length < 4) {
      fillBody(body, entry);
      if (done) done();
      return;
    }
    body.textContent = "";
    var caret = document.createElement("span");
    caret.className = "cursor";
    caret.setAttribute("aria-hidden", "true");
    body.appendChild(caret);
    var i = 0;
    function tick() {
      if (my !== typeToken) return;
      if (i >= text.length) {
        fillBody(body, entry);
        scrollSurface();
        if (done) done();
        return;
      }
      i += 1;
      body.textContent = text.slice(0, i);
      body.appendChild(caret);
      scrollSurface();
      typeTimer = window.setTimeout(tick, i < 4 ? 26 : 9 + Math.random() * 14);
    }
    tick();
  }

  function paintWorkspace(bot) {
    nameEl.textContent = bot.name;
    titleEl.textContent = bot.title || "";
    aboutEl.textContent = bot.about || "";
    renderSpecs(bot);
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
    if (askEl) {
      askEl.placeholder = "Ask " + bot.name + "…";
    }
    if (emptyEl && !(logs[bot.id] && logs[bot.id].length)) {
      emptyEl.textContent = liveOn()
        ? "Chips stay on desk facts. Typed questions go to the live model."
        : "Ask " + bot.name + ". Chips, a typed question, or poke the face.";
    }
    if (workFaceEl) {
      workFaceEl.setAttribute("aria-label", "Poke " + bot.name);
      workFaceEl.title = "Poke " + bot.name;
    }
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
    if (selectedId && selectedId !== bot.id) abortLive();
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

  function tokens(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9+#]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(function (t) {
        return t && t.length > 1 && !STOP[t];
      });
  }

  function haystack(prompt) {
    return ((prompt.label || "") + " " + (prompt.needles || "") + " " + (prompt.id || "")).toLowerCase();
  }

  function scorePrompt(query, prompt) {
    var q = String(query || "").toLowerCase().trim();
    if (!q) return 0;
    var hay = haystack(prompt);
    if (hay.indexOf(q) !== -1) return 120;
    var ts = tokens(q);
    if (!ts.length) return 0;
    var hits = 0;
    var i;
    for (i = 0; i < ts.length; i++) {
      if (hay.indexOf(ts[i]) !== -1) hits += 1;
    }
    return (hits / ts.length) * 80 + hits * 5;
  }

  function bestAnswer(bot, query) {
    var scored = [];
    var list = bot.prompts || [];
    var deskPrompts = (deskMeta && deskMeta.prompts) || [];
    var i;
    var s;
    for (i = 0; i < list.length; i++) {
      s = scorePrompt(query, list[i]);
      if (s > 0) scored.push({ prompt: list[i], score: s });
    }
    for (i = 0; i < deskPrompts.length; i++) {
      s = scorePrompt(query, deskPrompts[i]);
      if (s > 0) scored.push({ prompt: deskPrompts[i], score: s * 0.94 });
    }
    scored.sort(function (a, b) {
      return b.score - a.score;
    });
    if (scored[0] && scored[0].score >= 28) return scored[0].prompt;
    return {
      id: "fallback",
      label: query,
      answer: bot.fallback || "I only know this desk."
    };
  }

  function markChip(promptId) {
    chipsEl.querySelectorAll(".chip").forEach(function (chip) {
      chip.classList.toggle("is-on", chip.dataset.prompt === promptId);
    });
  }

  function liveOn() {
    return !!(window.DeskAI && DeskAI.load().live);
  }

  function paintLivePill() {
    if (!livePill || !window.DeskAI) return;
    var cfg = DeskAI.load();
    livePill.textContent = DeskAI.labelFor(cfg);
    livePill.setAttribute("data-live", cfg.live ? "on" : "off");
    livePill.title = "Live reply settings";
  }

  function setAskBusy(on) {
    asking = !!on;
    if (askSend) askSend.disabled = asking;
    if (askEl) askEl.readOnly = asking;
  }

  function lastBody(id) {
    if (id !== selectedId) return null;
    var last = transcriptEl.lastElementChild;
    return last ? last.querySelector(".turn-body") : null;
  }

  function dropReply(id, reply) {
    var list = logs[id];
    var i;
    if (!list) return;
    i = list.indexOf(reply);
    if (i === -1) return;
    if (i > 0 && list[i - 1] && list[i - 1].kind === "you") {
      list.splice(i - 1, 2);
    } else {
      list.splice(i, 1);
    }
    if (id === selectedId) renderTranscript(id);
  }

  function abortLive() {
    if (liveAbort) {
      liveAbort.abort();
      liveAbort = null;
    }
    setAskBusy(false);
  }

  function fillProviderSelect() {
    if (!aiProvider || !window.DeskAI) return;
    aiProvider.textContent = "";
    DeskAI.providers.forEach(function (spec) {
      var opt = document.createElement("option");
      opt.value = spec.id;
      opt.textContent = spec.label;
      aiProvider.appendChild(opt);
    });
  }

  function toggleAiFields() {
    if (!window.DeskAI || !aiProvider) return;
    var spec = DeskAI.byId(aiProvider.value);
    if (aiHint) aiHint.textContent = spec.hint || "";
    if (aiModelWrap) aiModelWrap.hidden = spec.kind === "device";
    if (aiBaseWrap) aiBaseWrap.hidden = spec.kind === "device";
    if (aiKeyWrap) aiKeyWrap.hidden = spec.kind === "device" || spec.id === "ollama";
  }

  function syncAiForm() {
    if (!window.DeskAI) return;
    var cfg = DeskAI.load();
    var spec = DeskAI.byId(cfg.provider);
    if (aiLive) aiLive.checked = !!cfg.live;
    if (aiProvider) aiProvider.value = spec.id;
    if (aiModel) {
      aiModel.value = cfg.model || spec.model || "";
      aiModel.placeholder = spec.model || "model id";
    }
    if (aiBase) {
      aiBase.value = cfg.base || spec.base || "";
      aiBase.placeholder = spec.base || "https://host/v1";
    }
    if (aiKey) aiKey.value = cfg.key || "";
    toggleAiFields();
    if (aiStatus) {
      var ready = DeskAI.canLive(cfg);
      aiStatus.textContent = cfg.live
        ? ready.ok
          ? "Live is on. Typed questions leave this browser for " + spec.label + "."
          : ready.reason
        : "Live is off. The ask bar stays on reviewed desk facts.";
    }
    if (window.DeskAI.availabilityNote) {
      DeskAI.availabilityNote().then(function (note) {
        if (!aiStatus || !aiEl || aiEl.hidden) return;
        if (aiProvider && DeskAI.byId(aiProvider.value).kind === "device") {
          aiStatus.textContent = note;
        }
      });
    }
  }

  function setHelp(on) {
    if (!helpEl) return;
    helpEl.hidden = !on;
    if (on) {
      setAi(false);
      if (helpClose) helpClose.focus();
    }
  }

  function setAi(on) {
    if (!aiEl) return;
    aiEl.hidden = !on;
    if (on) {
      setHelp(false);
      syncAiForm();
      if (aiLive) aiLive.focus();
    }
  }

  function readAiForm() {
    return {
      live: !!(aiLive && aiLive.checked),
      provider: aiProvider ? aiProvider.value : "grok",
      model: aiModel ? aiModel.value : "",
      base: aiBase ? aiBase.value : "",
      key: aiKey ? aiKey.value : ""
    };
  }

  function onAiSave(event) {
    event.preventDefault();
    if (!window.DeskAI) return;
    DeskAI.save(readAiForm());
    paintLivePill();
    syncAiForm();
    var bot = findBot(selectedId);
    if (bot) paintWorkspace(bot);
    if (aiStatus) {
      var ready = DeskAI.canLive(DeskAI.load());
      aiStatus.textContent = ready.ok || !DeskAI.load().live ? "Saved in this browser." : ready.reason;
    }
  }

  function onAiForget() {
    if (!window.DeskAI) return;
    DeskAI.forgetKey();
    if (aiKey) aiKey.value = "";
    paintLivePill();
    syncAiForm();
    if (aiStatus) aiStatus.textContent = "Key forgotten on this machine.";
  }

  function onProviderPick() {
    if (!window.DeskAI || !aiProvider) return;
    var spec = DeskAI.byId(aiProvider.value);
    if (aiModel) {
      aiModel.value = spec.model || "";
      aiModel.placeholder = spec.model || "model id";
    }
    if (aiBase) {
      aiBase.value = spec.base || "";
      aiBase.placeholder = spec.base || "https://host/v1";
    }
    toggleAiFields();
  }

  function streamInto(reply, botId, text) {
    reply.text = text;
    reply.livePending = false;
    var body = lastBody(botId);
    if (!body) return;
    body.textContent = text;
    var caret = document.createElement("span");
    caret.className = "cursor";
    caret.setAttribute("aria-hidden", "true");
    body.appendChild(caret);
    scrollSurface();
  }

  function askLive(bot, q) {
    var history;
    var reply;
    var cfg = DeskAI.load();
    abortLive();
    logs[bot.id].push({
      kind: "you",
      who: "you",
      text: q
    });
    reply = {
      kind: "bot",
      who: bot.name,
      text: "",
      live: true,
      livePending: true
    };
    logs[bot.id].push(reply);
    renderTranscript(bot.id);
    markChip("");
    liveAbort = new window.AbortController();
    history = logs[bot.id].slice(0, -2);
    clearTimers();
    setAskBusy(true);
    setStatus(bot.id, "waiting");
    waitTimer = window.setTimeout(function () {
      setStatus(bot.id, "working");
    }, delay(40, 180));
    DeskAI.complete({
      cfg: cfg,
      bot: bot,
      desk: deskMeta,
      history: history,
      query: q,
      signal: liveAbort.signal,
      onDelta: function (full) {
        streamInto(reply, bot.id, full);
      }
    })
      .then(function (result) {
        reply.text = result.text;
        reply.livePending = false;
        if (bot.id === selectedId) {
          renderTranscript(bot.id);
        }
        setStatus(bot.id, "idle");
        setAskBusy(false);
        liveAbort = null;
      })
      .catch(function (err) {
        var prompt;
        var message = err && err.message ? err.message : "The model missed.";
        setAskBusy(false);
        liveAbort = null;
        if (err && err.name === "AbortError") {
          if (!reply.text) dropReply(bot.id, reply);
          else reply.livePending = false;
          setStatus(bot.id, "idle");
          return;
        }
        prompt = bestAnswer(bot, q);
        reply.live = false;
        reply.livePending = false;
        reply.text =
          message +
          (prompt && prompt.id !== "fallback" ? " Desk fact: " + prompt.answer : "");
        reply.link = prompt && prompt.link ? prompt.link : null;
        if (bot.id === selectedId) {
          renderTranscript(bot.id);
          typeLast(reply, function () {
            setStatus(bot.id, "idle");
          });
        } else {
          setStatus(bot.id, "idle");
        }
      });
  }

  function speak(bot, prompt, opts) {
    var skipYou = opts && opts.skipYou;
    var youText = (opts && opts.youText) || prompt.label;
    if (!skipYou) {
      logs[bot.id].push({
        kind: "you",
        who: "you",
        text: youText
      });
    }
    renderTranscript(bot.id);
    markChip(prompt.id);

    clearTimers();
    setStatus(bot.id, "waiting");
    waitTimer = window.setTimeout(function () {
      setStatus(bot.id, "working");
      workTimer = window.setTimeout(function () {
        var reply = {
          kind: "bot",
          who: bot.name,
          text: prompt.answer || "",
          link: prompt.link || null
        };
        logs[bot.id].push(reply);
        renderTranscript(bot.id);
        typeLast(reply, function () {
          setStatus(bot.id, "idle");
        });
      }, delay(40, 520));
    }, delay(40, 240));
  }

  function ask(promptId) {
    var bot = findBot(selectedId);
    if (!bot) return;
    var prompt = findPrompt(bot, promptId);
    if (!prompt) return;
    if (asking) abortLive();
    speak(bot, prompt);
  }

  function poke() {
    var bot = findBot(selectedId);
    if (!bot || asking) return;
    workFaceEl.classList.remove("is-poked");
    void workFaceEl.offsetWidth;
    workFaceEl.classList.add("is-poked");
    if (pokeTimer) window.clearTimeout(pokeTimer);
    pokeTimer = window.setTimeout(function () {
      workFaceEl.classList.remove("is-poked");
    }, 450);
    var quips = bot.quips || [];
    var line = quips.length ? quips[Math.floor(Math.random() * quips.length)] : bot.idleLine || "Still here.";
    speak(bot, { id: "poke", label: "(poke)", answer: line }, { skipYou: true });
  }

  function onAskSubmit(event) {
    event.preventDefault();
    var q;
    var bot;
    var ready;
    if (asking) return;
    q = (askEl.value || "").replace(/\s+/g, " ").trim();
    if (!q) return;
    bot = findBot(selectedId);
    if (!bot) return;
    if (window.DeskAI && DeskAI.load().live) {
      ready = DeskAI.canLive(DeskAI.load());
      if (!ready.ok) {
        setAi(true);
        if (aiStatus) aiStatus.textContent = ready.reason;
        return;
      }
      askEl.value = "";
      askLive(bot, q);
      return;
    }
    askEl.value = "";
    speak(bot, bestAnswer(bot, q), { youText: q });
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
    var k = event.key;
    var helpOpenNow = helpEl && !helpEl.hidden;
    var aiOpenNow = aiEl && !aiEl.hidden;

    if (k === "Escape") {
      if (helpOpenNow) {
        event.preventDefault();
        setHelp(false);
        return;
      }
      if (aiOpenNow) {
        event.preventDefault();
        setAi(false);
        return;
      }
      if (fromField(event.target) && askEl) {
        askEl.blur();
      }
      return;
    }

    if (helpOpenNow || aiOpenNow) return;
    if (fromField(event.target)) return;

    if (k === "/" ) {
      event.preventDefault();
      if (askEl) askEl.focus();
      return;
    }
    if (k === "?" ) {
      event.preventDefault();
      setHelp(true);
      return;
    }
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

  function applyGaze() {
    gazeRaf = 0;
    if (reduce) return;
    var nodes = document.querySelectorAll(".bot-gaze");
    var i;
    var el;
    var host;
    var rect;
    var dx;
    var dy;
    var tx;
    var ty;
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      host = el.closest(".avatar, .work-face, .turn-mini");
      if (!host) continue;
      if (!hasPointer) {
        el.style.transform = "translate(0px, 0px)";
        continue;
      }
      rect = host.getBoundingClientRect();
      dx = (pointerX - (rect.left + rect.width / 2)) / Math.max(rect.width, 1);
      dy = (pointerY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1);
      tx = Math.max(-1, Math.min(1, dx)) * 5.5;
      ty = Math.max(-1, Math.min(1, dy)) * 4;
      el.style.transform = "translate(" + tx + "px, " + ty + "px)";
    }
  }

  function onPointer(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    hasPointer = true;
    if (!gazeRaf) gazeRaf = window.requestAnimationFrame(applyGaze);
  }

  function onPointerLeave() {
    hasPointer = false;
    if (!gazeRaf) gazeRaf = window.requestAnimationFrame(applyGaze);
  }

  function start(data) {
    deskMeta = data.desk || FALLBACK.desk;
    bots = data.bots.slice();
    renderRoster();
    fillProviderSelect();
    paintLivePill();
    var initial = hashId() || bots[0].id;
    select(initial, { pulse: true });

    rosterEl.addEventListener("click", onRosterClick);
    chipsEl.addEventListener("click", onChipsClick);
    if (workFaceEl) workFaceEl.addEventListener("click", poke);
    if (askForm) askForm.addEventListener("submit", onAskSubmit);
    if (helpOpen) helpOpen.addEventListener("click", function () { setHelp(true); });
    if (helpClose) helpClose.addEventListener("click", function () { setHelp(false); });
    if (helpEl) {
      helpEl.addEventListener("click", function (event) {
        if (event.target === helpEl) setHelp(false);
      });
    }
    if (aiOpen) aiOpen.addEventListener("click", function () { setAi(true); });
    if (aiClose) aiClose.addEventListener("click", function () { setAi(false); });
    if (livePill) livePill.addEventListener("click", function () { setAi(true); });
    if (aiForm) aiForm.addEventListener("submit", onAiSave);
    if (aiForget) aiForget.addEventListener("click", onAiForget);
    if (aiProvider) aiProvider.addEventListener("change", onProviderPick);
    if (aiEl) {
      aiEl.addEventListener("click", function (event) {
        if (event.target === aiEl) setAi(false);
      });
    }
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onDocumentKey);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
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
