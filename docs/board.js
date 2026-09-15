(() => {
  const canvas = document.getElementById("scope");
  const ctx = canvas.getContext("2d", { alpha: false });
  const readout = document.getElementById("scope-readout");
  const clock = document.getElementById("clock");
  const nodesEl = document.getElementById("nodes");
  const kicker = document.getElementById("kicker");
  const copy = document.getElementById("copy");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VOID = "#000000";
  const HAIR = "#2e2e2e";
  const DIM = "#8a8a8a";
  const WHITE = "#ffffff";

  const NODES = [
    {
      n: "01",
      title: "local tools",
      copy: "Software that runs on the machine in front of you. ChorusDraft drafts. AdAegis blocks. Nothing important lives only in someone else's tab.",
    },
    {
      n: "02",
      title: "human review",
      copy: "Models draft. People ship. Read the diff, keep the keys, refuse the autopilot.",
    },
    {
      n: "03",
      title: "linux",
      copy: "The default box. A tty, a compiler, a long uptime. If it will not run here it does not count yet.",
    },
  ];

  let selected = 0;
  const pointer = { x: 0.5, y: 0.5, on: false };
  const samples = new Float32Array(320);
  let phase = 0;
  let last = performance.now();
  let cssW = 720;
  let cssH = 280;

  function dock(i) {
    selected = i;
    const node = NODES[i];
    kicker.textContent = node.n + " // " + node.title;
    copy.textContent = node.copy;
    nodesEl.querySelectorAll("button").forEach((btn, idx) => {
      btn.classList.toggle("on", idx === i);
    });
  }

  function renderNodes() {
    nodesEl.innerHTML = NODES.map(
      (node, i) =>
        "<li><button type=\"button\" data-i=\"" +
        i +
        "\" class=\"" +
        (i === selected ? "on" : "") +
        "\"><span>" +
        node.n +
        "</span> " +
        node.title +
        "</button></li>"
    ).join("");
    dock(0);
  }

  function tickClock() {
    clock.textContent = new Date().toISOString().slice(11, 19) + "Z";
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(rect.width, 1);
    cssH = Math.max(rect.height, 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGrid() {
    ctx.fillStyle = VOID;
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.strokeStyle = HAIR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 8; i += 1) {
      const x = (cssW / 8) * i + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssH);
    }
    for (let i = 0; i <= 4; i += 1) {
      const y = (cssH / 4) * i + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(cssW, y);
    }
    ctx.stroke();
    ctx.strokeStyle = DIM;
    ctx.beginPath();
    ctx.moveTo(0, cssH / 2 + 0.5);
    ctx.lineTo(cssW, cssH / 2 + 0.5);
    ctx.stroke();
  }

  function drawTrace() {
    ctx.beginPath();
    for (let i = 0; i < samples.length; i += 1) {
      const x = (i / (samples.length - 1)) * cssW;
      const y = cssH / 2 - samples[i] * (cssH * 0.42);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = pointer.on ? 1.6 : 1.2;
    ctx.stroke();
    const y = cssH / 2 - samples[samples.length - 1] * (cssH * 0.42);
    ctx.fillStyle = WHITE;
    ctx.fillRect(cssW - 3, y - 3, 6, 6);
  }

  function frame(now) {
    const dt = Math.min(32, now - last);
    last = now;
    const freq = pointer.on ? 1.1 + pointer.x * 8 : 2.2;
    const amp = pointer.on ? 0.12 + (1 - pointer.y) * 0.72 : 0.26;
    phase += ((freq * dt) / 1000) * Math.PI * 2;
    const sample =
      Math.sin(phase) * amp + Math.sin(phase * 2.17) * amp * 0.2;
    samples.copyWithin(0, 1);
    samples[samples.length - 1] = sample;
    drawGrid();
    drawTrace();
    readout.textContent = pointer.on
      ? "f " + freq.toFixed(2) + "  a " + amp.toFixed(2)
      : "idle sine";
    if (!reduced) requestAnimationFrame(frame);
  }

  nodesEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    dock(Number(btn.dataset.i));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "1" || event.key === "2" || event.key === "3") {
      dock(Number(event.key) - 1);
    }
    if (event.key === "j" || event.key === "ArrowDown") {
      dock((selected + 1) % NODES.length);
    }
    if (event.key === "k" || event.key === "ArrowUp") {
      dock((selected - 1 + NODES.length) % NODES.length);
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
    pointer.on = true;
  });
  canvas.addEventListener("pointerleave", () => {
    pointer.on = false;
  });

  window.addEventListener("resize", resize);
  renderNodes();
  tickClock();
  setInterval(tickClock, 1000);
  resize();
  if (reduced) {
    for (let i = 0; i < samples.length; i += 1) {
      samples[i] = Math.sin(i / 18) * 0.26;
    }
    drawGrid();
    drawTrace();
    readout.textContent = "static";
  } else {
    requestAnimationFrame(frame);
  }
})();
