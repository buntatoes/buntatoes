(function (root) {
  var STORE = "buntos-desk-ai";
  var MAX_OUT = 1200;
  var LOCAL_HOSTS = {
    "127.0.0.1": 1,
    localhost: 1,
    "[::1]": 1
  };

  var PROVIDERS = [
    {
      id: "grok",
      label: "xAI Grok",
      kind: "openai",
      base: "https://api.x.ai/v1",
      model: "grok-3-mini",
      needsKey: true,
      hint: "On-theme. Paste an xAI key. It stays in this browser; GitHub never sees it."
    },
    {
      id: "groq",
      label: "Groq",
      kind: "openai",
      base: "https://api.groq.com/openai/v1",
      model: "llama-3.1-8b-instant",
      needsKey: true,
      hint: "Fast, CORS-friendly, free-tier keys. A good first live backend."
    },
    {
      id: "openrouter",
      label: "OpenRouter",
      kind: "openai",
      base: "https://openrouter.ai/api/v1",
      model: "x-ai/grok-3-mini",
      needsKey: true,
      extra: true,
      hint: "One key, many models. Grok still works if api.x.ai blocks this origin."
    },
    {
      id: "openai",
      label: "OpenAI",
      kind: "openai",
      base: "https://api.openai.com/v1",
      model: "gpt-4o-mini",
      needsKey: true,
      hint: "Browser calls are allowed from this origin today. A leaked page key is still a leaked key."
    },
    {
      id: "gemini",
      label: "Google Gemini",
      kind: "openai",
      base: "https://generativelanguage.googleapis.com/v1beta/openai",
      model: "gemini-2.5-flash",
      needsKey: true,
      hint: "OpenAI-compatible Gemini endpoint. Key stays in localStorage."
    },
    {
      id: "ollama",
      label: "Ollama (this machine)",
      kind: "openai",
      base: "http://127.0.0.1:11434/v1",
      model: "llama3.2",
      needsKey: false,
      allowHttp: true,
      hint: "Local. Set OLLAMA_ORIGINS to this site (and http://127.0.0.1:43147 when you serve docs/)."
    },
    {
      id: "device",
      label: "On-device (Chrome)",
      kind: "device",
      base: "",
      model: "",
      needsKey: false,
      hint: "Chrome's built-in LanguageModel when the browser has downloaded it. Nothing leaves the machine."
    },
    {
      id: "custom",
      label: "Custom OpenAI-compatible",
      kind: "openai",
      base: "",
      model: "",
      needsKey: false,
      allowHttp: true,
      hint: "Any /v1/chat/completions host. HTTPS anywhere, HTTP only on this machine."
    }
  ];

  function byId(id) {
    var i;
    for (i = 0; i < PROVIDERS.length; i++) {
      if (PROVIDERS[i].id === id) return PROVIDERS[i];
    }
    return PROVIDERS[0];
  }

  function defaults() {
    return {
      live: false,
      provider: "grok",
      model: "",
      base: "",
      key: ""
    };
  }

  function load() {
    var cfg = defaults();
    try {
      var raw = root.localStorage.getItem(STORE);
      if (!raw) return cfg;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return cfg;
      if (parsed.live === true) cfg.live = true;
      if (typeof parsed.provider === "string" && byId(parsed.provider).id === parsed.provider) {
        cfg.provider = parsed.provider;
      }
      if (typeof parsed.model === "string") cfg.model = parsed.model;
      if (typeof parsed.base === "string") cfg.base = parsed.base;
      if (typeof parsed.key === "string") cfg.key = parsed.key;
    } catch (err) {
      return defaults();
    }
    return cfg;
  }

  function save(cfg) {
    var next = {
      live: !!(cfg && cfg.live),
      provider: byId(cfg && cfg.provider).id,
      model: String((cfg && cfg.model) || ""),
      base: String((cfg && cfg.base) || ""),
      key: String((cfg && cfg.key) || "")
    };
    root.localStorage.setItem(STORE, JSON.stringify(next));
    return next;
  }

  function forgetKey() {
    var cfg = load();
    cfg.key = "";
    return save(cfg);
  }

  function tidyBase(url, allowHttp) {
    var trimmed = String(url || "").trim().replace(/\/+$/, "");
    if (!trimmed) return "";
    var parsed;
    try {
      parsed = new URL(trimmed);
    } catch (err) {
      return "";
    }
    if (parsed.username || parsed.password) return "";
    if (parsed.protocol === "https:") {
      return parsed.origin + (parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, ""));
    }
    if (
      allowHttp &&
      parsed.protocol === "http:" &&
      Object.prototype.hasOwnProperty.call(LOCAL_HOSTS, parsed.hostname)
    ) {
      return parsed.origin + (parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, ""));
    }
    return "";
  }

  function resolved(cfg) {
    var spec = byId(cfg && cfg.provider);
    var allowHttp = !!spec.allowHttp;
    var base = tidyBase((cfg && cfg.base) || spec.base, allowHttp);
    var model = String((cfg && cfg.model) || spec.model || "").trim();
    return {
      spec: spec,
      base: base,
      model: model,
      key: String((cfg && cfg.key) || "").trim()
    };
  }

  function canLive(cfg) {
    var live = cfg || load();
    if (!live.live) return { ok: false, reason: "Live is off. Typed questions stay on desk facts." };
    var got = resolved(live);
    if (got.spec.kind === "device") {
      if (deviceApi()) return { ok: true, reason: "" };
      return { ok: false, reason: "This browser has no on-device LanguageModel. Try Groq or Ollama." };
    }
    if (!got.base) return { ok: false, reason: "Set a base URL for this provider." };
    if (!got.model) return { ok: false, reason: "Set a model id." };
    if (got.spec.needsKey && got.key.length < 8) {
      return { ok: false, reason: "Paste an API key. It stays in this browser." };
    }
    return { ok: true, reason: "" };
  }

  function deviceApi() {
    if (root.LanguageModel) {
      return {
        create: function (opts) {
          return root.LanguageModel.create(opts);
        },
        availability: function () {
          return root.LanguageModel.availability();
        }
      };
    }
    if (root.ai && root.ai.languageModel) {
      return {
        create: function (opts) {
          return root.ai.languageModel.create(opts);
        },
        availability: function () {
          if (root.ai.languageModel.availability) return root.ai.languageModel.availability();
          if (root.ai.languageModel.capabilities) {
            return root.ai.languageModel.capabilities().then(function (cap) {
              if (!cap) return "unavailable";
              return cap.available || cap.defaultAvailable || "unavailable";
            });
          }
          return "unknown";
        }
      };
    }
    return null;
  }

  function tidyText(s) {
    return String(s || "")
      .replace(/\u0000/g, "")
      .replace(/\*\*/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .trim()
      .slice(0, MAX_OUT);
  }

  function persona(bot, desk) {
    var lines = [];
    var i;
    var prompt;
    lines.push("You are " + bot.name + ", " + (bot.title || "a desk bot") + " on Buntos' GitHub profile desk.");
    if (bot.about) lines.push(bot.about);
    if (bot.voice) lines.push("Voice: " + bot.voice);
    lines.push("Buntos: IT worker, Linux enthusiast, AI tinkerer. Local tools. Human review. Linux.");
    lines.push("Stay in character. 1–4 short sentences. Dry, concrete, no hype, no emoji, no markdown.");
    lines.push("You are a mascot for a local tool, not a general assistant.");
    lines.push("If the question is off this desk, say so and point back at what you actually do.");
    lines.push("Do not invent files, APIs, syscalls, or policy. Prefer these reviewed facts:");
    (bot.prompts || []).forEach(function (item) {
      if (item && item.answer) {
        lines.push("- " + (item.label || item.id) + " " + item.answer);
      }
    });
    if (desk && Array.isArray(desk.prompts)) {
      for (i = 0; i < desk.prompts.length; i++) {
        prompt = desk.prompts[i];
        if (prompt && prompt.answer) {
          lines.push("- " + (prompt.label || prompt.id) + " " + prompt.answer);
        }
      }
    }
    return lines.join("\n");
  }

  function historyMessages(entries) {
    var out = [];
    var i;
    var entry;
    var role;
    var list = entries || [];
    var start = Math.max(0, list.length - 8);
    for (i = start; i < list.length; i++) {
      entry = list[i];
      if (!entry || !entry.text) continue;
      if (entry.kind === "you") role = "user";
      else if (entry.kind === "bot") role = "assistant";
      else continue;
      if (entry.livePending) continue;
      out.push({ role: role, content: String(entry.text).slice(0, 800) });
    }
    return out;
  }

  function labelFor(cfg) {
    var live = cfg || load();
    var got = resolved(live);
    if (!live.live) return "scripted · desk facts";
    if (got.spec.kind === "device") return "live · on-device";
    if (got.model) return "live · " + got.model;
    return "live · " + got.spec.label;
  }

  function extractDelta(json) {
    var choice;
    var piece;
    if (!json || !json.choices || !json.choices[0]) return "";
    choice = json.choices[0];
    if (choice.delta && typeof choice.delta.content === "string") return choice.delta.content;
    if (choice.message && typeof choice.message.content === "string") return choice.message.content;
    piece = choice.delta && choice.delta.content;
    if (Array.isArray(piece)) {
      return piece
        .map(function (part) {
          return part && (part.text || part.content || "");
        })
        .join("");
    }
    return "";
  }

  function readSse(res, onDelta) {
    if (!res.body || !res.body.getReader) {
      return res.text().then(function (text) {
        var json = JSON.parse(text);
        var full = tidyText(extractDelta(json) || (json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) || "");
        if (onDelta) onDelta(full);
        return full;
      });
    }
    var reader = res.body.getReader();
    var dec = new TextDecoder();
    var buf = "";
    var full = "";
    function pump() {
      return reader.read().then(function (part) {
        var lines;
        var i;
        var line;
        var data;
        var json;
        var piece;
        if (part.done) return tidyText(full);
        buf += dec.decode(part.value, { stream: true });
        lines = buf.split("\n");
        buf = lines.pop();
        for (i = 0; i < lines.length; i++) {
          line = lines[i].replace(/\r$/, "");
          if (line.indexOf("data:") !== 0) continue;
          data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            json = JSON.parse(data);
          } catch (err) {
            continue;
          }
          piece = extractDelta(json);
          if (piece) {
            full += piece;
            if (onDelta) onDelta(tidyText(full));
          }
        }
        return pump();
      });
    }
    return pump();
  }

  function failHttp(res, body) {
    var snippet = String(body || "").replace(/\s+/g, " ").slice(0, 180);
    if (res.status === 401 || res.status === 403) {
      return "That key was refused (" + res.status + ").";
    }
    if (res.status === 429) return "Rate limited. Wait a moment, then ask again.";
    if (res.status === 404) return "Model or path not found. Check the model id.";
    return "Provider returned " + res.status + (snippet ? ": " + snippet : ".");
  }

  function completeOpenAI(got, messages, onDelta, signal) {
    var headers = { "Content-Type": "application/json" };
    var payload = {
      model: got.model,
      messages: messages,
      temperature: 0.45,
      max_tokens: 280,
      stream: true
    };
    if (got.key) headers.Authorization = "Bearer " + got.key;
    if (got.spec.extra) {
      headers["HTTP-Referer"] = String(root.location.href).split("#")[0];
      headers["X-Title"] = "buntos desk";
    }
    return fetch(got.base + "/chat/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: signal
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (text) {
          throw new Error(failHttp(res, text));
        });
      }
      return readSse(res, onDelta);
    }).then(function (text) {
      if (text) return text;
      payload.stream = false;
      return fetch(got.base + "/chat/completions", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
        signal: signal
      }).then(function (res) {
        if (!res.ok) {
          return res.text().then(function (body) {
            throw new Error(failHttp(res, body));
          });
        }
        return res.json();
      }).then(function (json) {
        var full = tidyText(
          (json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) || ""
        );
        if (onDelta) onDelta(full);
        return full;
      });
    });
  }

  function ingestDeviceChunk(acc, chunk) {
    var s = String(chunk || "");
    if (!s) return acc;
    if (s.indexOf(acc) === 0) return s;
    return acc + s;
  }

  function completeDevice(system, query, onDelta, signal) {
    var api = deviceApi();
    if (!api) return Promise.reject(new Error("This browser has no on-device model."));
    return api
      .create({
        temperature: 0.5,
        topK: 8,
        initialPrompts: [{ role: "system", content: system }]
      })
      .catch(function () {
        return api.create({ systemPrompt: system });
      })
      .then(function (session) {
      if (signal && signal.aborted) {
        if (session && session.destroy) session.destroy();
        var abortErr = new Error("aborted");
        abortErr.name = "AbortError";
        throw abortErr;
      }
      var acc = "";
      function bump(chunk) {
        acc = ingestDeviceChunk(acc, chunk);
        if (onDelta) onDelta(tidyText(acc));
      }
      if (signal) {
        signal.addEventListener("abort", function () {
          if (session && session.destroy) session.destroy();
        });
      }
      if (session.promptStreaming) {
        return Promise.resolve(session.promptStreaming(query)).then(function (stream) {
          var iterator;
          if (stream && typeof stream.next === "function") iterator = stream;
          else if (stream && stream[Symbol.asyncIterator]) iterator = stream[Symbol.asyncIterator]();
          else {
            bump(stream);
            return tidyText(acc);
          }
          function loop() {
            return iterator.next().then(function (step) {
              if (step.done) return tidyText(acc);
              bump(step.value);
              return loop();
            });
          }
          return loop();
        });
      }
      return Promise.resolve(session.prompt(query)).then(function (text) {
        bump(text);
        return tidyText(acc);
      });
    });
  }

  function complete(opts) {
    var cfg = opts.cfg || load();
    var ready = canLive(cfg);
    var got = resolved(cfg);
    var bot = opts.bot;
    var query = String(opts.query || "").trim();
    var system;
    var messages;
    var onDelta = opts.onDelta;
    var signal = opts.signal;
    if (!ready.ok) return Promise.reject(new Error(ready.reason));
    if (!bot || !query) return Promise.reject(new Error("Nothing to ask."));
    system = persona(bot, opts.desk);
    if (got.spec.kind === "device") {
      return completeDevice(system, query, onDelta, signal).then(function (text) {
        if (!text) throw new Error("The on-device model returned an empty reply.");
        return { text: text, source: "device" };
      });
    }
    messages = [{ role: "system", content: system }].concat(historyMessages(opts.history)).concat([
      { role: "user", content: query }
    ]);
    return completeOpenAI(got, messages, onDelta, signal)
      .catch(function (err) {
        if (err && err.name === "AbortError") throw err;
        if (err && /Failed to fetch|NetworkError|Load failed/i.test(String(err.message || err))) {
          throw new Error(
            "This origin could not reach " +
              got.spec.label +
              ". CORS, a blocker, or a downed host. Groq, OpenRouter, and local Ollama usually work."
          );
        }
        throw err;
      })
      .then(function (text) {
        if (!text) throw new Error("The model returned an empty reply.");
        return { text: text, source: got.spec.id };
      });
  }

  function availabilityNote() {
    var api = deviceApi();
    if (!api) return Promise.resolve("On-device model: not in this browser.");
    if (!api.availability) return Promise.resolve("On-device model: present. Ask to see if it runs.");
    return Promise.resolve(api.availability())
      .catch(function () {
        return "unknown";
      })
      .then(function (state) {
        return "On-device model: " + String(state || "unknown") + ".";
      });
  }

  root.DeskAI = {
    STORE: STORE,
    providers: PROVIDERS,
    byId: byId,
    load: load,
    save: save,
    forgetKey: forgetKey,
    resolved: resolved,
    canLive: canLive,
    labelFor: labelFor,
    complete: complete,
    availabilityNote: availabilityNote,
    tidyText: tidyText
  };
})(window);
