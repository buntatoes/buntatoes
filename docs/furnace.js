(() => {
  const canvas = document.getElementById("field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;
  const countEl = document.getElementById("count");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VOID = [5, 5, 8];
  const OXBLOOD = [122, 36, 51];
  const VIOLET = [110, 74, 122];
  const PHOSPHOR = [110, 163, 122];
  const ASH = [168, 158, 148];

  const KIND_BLOOD = 0;
  const KIND_VIOLET = 1;
  const KIND_PHOS = 2;
  const KIND_ASH = 3;

  const state = {
    w: 0,
    h: 0,
    particles: [],
    pointer: { x: 0, y: 0, px: 0, py: 0, active: false },
    burst: 0,
  };

  function rgba(rgb, a) {
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
  }

  function setCount(n) {
    const padded = String(Math.min(n, 9999)).padStart(4, "0");
    if (countEl) countEl.textContent = "ASH " + padded;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    state.w = Math.max(1, Math.floor(rect.width));
    state.h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(state.w * dpr);
    canvas.height = Math.floor(state.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pickKind(burst) {
    const roll = Math.random();
    if (roll < 0.14) return KIND_PHOS;
    if (roll < 0.34) return KIND_ASH;
    if (roll < 0.58) return KIND_VIOLET;
    if (burst && roll < 0.62) return KIND_VIOLET;
    return KIND_BLOOD;
  }

  function colorFor(kind) {
    if (kind === KIND_PHOS) return PHOSPHOR;
    if (kind === KIND_ASH) return ASH;
    if (kind === KIND_VIOLET) return VIOLET;
    return OXBLOOD;
  }

  function spawn(n, burst, origin) {
    const ox = origin ? origin.x : state.pointer.active ? state.pointer.x : state.w * 0.42;
    const oy = origin ? origin.y : state.pointer.active ? state.pointer.y : state.h * 0.62;
    for (let i = 0; i < n; i += 1) {
      const kind = pickKind(burst);
      const speck = kind === KIND_PHOS || kind === KIND_ASH;
      const angle = Math.random() * Math.PI * 2;
      const speed = burst
        ? 0.45 + Math.random() * 1.85
        : 0.05 + Math.random() * 0.38;
      const spread = burst ? 28 + Math.random() * 54 : 10 + Math.random() * 36;
      state.particles.push({
        x: ox + Math.cos(angle) * spread * (burst ? 0.35 : 1),
        y: oy + Math.sin(angle) * spread * 0.55,
        vx: Math.cos(angle) * speed * (speck ? 0.7 : 1),
        vy: Math.sin(angle) * speed * 0.55 - (speck ? 0 : 0.08),
        life: 1,
        decay: burst ? 0.01 + Math.random() * 0.012 : 0.0035 + Math.random() * 0.006,
        r: speck
          ? 0.6 + Math.random() * (kind === KIND_PHOS ? 1.4 : 1.8)
          : (burst ? 5 : 3) + Math.random() * (burst ? 8 : 7),
        kind,
        ashFall: kind === KIND_ASH,
      });
    }
  }

  function seed(n) {
    for (let i = 0; i < n; i += 1) {
      const kind = pickKind(false);
      const speck = kind === KIND_PHOS || kind === KIND_ASH;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.04 + Math.random() * 0.28;
      state.particles.push({
        x: Math.random() * state.w,
        y: Math.random() * state.h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.45 - 0.05,
        life: 0.4 + Math.random() * 0.6,
        decay: 0.002 + Math.random() * 0.0045,
        r: speck ? 0.7 + Math.random() * 1.5 : 3 + Math.random() * 9,
        kind,
        ashFall: kind === KIND_ASH,
      });
    }
  }

  function haze() {
    const gx = state.pointer.active ? state.pointer.x : state.w * 0.45;
    const gy = state.pointer.active ? state.pointer.y : state.h * 0.58;
    const g = ctx.createRadialGradient(gx, gy, 8, gx, gy, Math.max(state.w, state.h) * 0.55);
    g.addColorStop(0, rgba(OXBLOOD, 0.1));
    g.addColorStop(0.35, rgba(VIOLET, 0.06));
    g.addColorStop(0.7, rgba(PHOSPHOR, 0.02));
    g.addColorStop(1, rgba(VOID, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, state.w, state.h);
  }

  function paintStill() {
    ctx.fillStyle = rgba(VOID, 1);
    ctx.fillRect(0, 0, state.w, state.h);
    haze();
    seed(160);
    for (let i = 0; i < state.particles.length; i += 1) {
      const p = state.particles[i];
      const rgb = colorFor(p.kind);
      const a = p.kind === KIND_PHOS ? 0.55 : p.kind === KIND_ASH ? 0.35 : 0.22;
      ctx.beginPath();
      ctx.fillStyle = rgba(rgb, a);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    setCount(state.particles.length);
  }

  function stoke() {
    const ptr = state.pointer;
    if (!ptr.active) return;
    const sx = ptr.x - ptr.px;
    const sy = ptr.y - ptr.py;
    ptr.px = ptr.x;
    ptr.py = ptr.y;
    const stroke = Math.hypot(sx, sy);
    if (stroke < 0.2) return;
    const radius = 150;
    for (let i = 0; i < state.particles.length; i += 1) {
      const p = state.particles[i];
      const dx = p.x - ptr.x;
      const dy = p.y - ptr.y;
      const dist = Math.hypot(dx, dy);
      if (dist > radius || dist < 1) continue;
      const falloff = 1 - dist / radius;
      p.vx += sx * 0.06 * falloff;
      p.vy += sy * 0.06 * falloff;
      p.vx += (-dy / dist) * 0.035 * falloff;
      p.vy += (dx / dist) * 0.035 * falloff;
    }
  }

  function frame() {
    ctx.fillStyle = rgba(VOID, 0.16);
    ctx.fillRect(0, 0, state.w, state.h);
    haze();

    if (state.pointer.active) spawn(3, false);
    else spawn(2, false, {
      x: state.w * Math.random(),
      y: state.h * (0.22 + Math.random() * 0.62),
    });

    if (state.burst > 0) {
      spawn(18, true);
      state.burst -= 1;
    }

    stoke();

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.ashFall) p.vy += 0.006;
      else p.vy -= 0.003;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life -= p.decay;
      if (p.life <= 0 || p.x < -40 || p.y < -40 || p.x > state.w + 40 || p.y > state.h + 40) {
        state.particles.splice(i, 1);
        continue;
      }
      const rgb = colorFor(p.kind);
      const alpha = Math.max(p.life, 0);
      const a =
        p.kind === KIND_PHOS
          ? alpha * 0.7
          : p.kind === KIND_ASH
            ? alpha * 0.4
            : alpha * 0.38;
      ctx.beginPath();
      ctx.fillStyle = rgba(rgb, a);
      ctx.arc(p.x, p.y, p.r * (0.55 + 0.45 * alpha), 0, Math.PI * 2);
      ctx.fill();
    }

    if (state.particles.length > 780) state.particles.splice(0, 180);
    setCount(state.particles.length);
    requestAnimationFrame(frame);
  }

  function flare() {
    if (reduced) return;
    state.burst = 5;
  }

  function onPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (!state.pointer.active) {
      state.pointer.px = x;
      state.pointer.py = y;
    }
    state.pointer.x = x;
    state.pointer.y = y;
    state.pointer.active = true;
  }

  window.addEventListener("resize", () => {
    resize();
    if (reduced) {
      state.particles = [];
      paintStill();
    }
  });
  canvas.addEventListener("pointermove", onPointer);
  canvas.addEventListener("pointerdown", (event) => {
    onPointer(event);
    flare();
  });
  canvas.addEventListener("pointerleave", () => {
    state.pointer.active = false;
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      flare();
    }
  });

  resize();
  ctx.fillStyle = rgba(VOID, 1);
  ctx.fillRect(0, 0, state.w, state.h);
  if (reduced) {
    paintStill();
    return;
  }
  seed(120);
  spawn(24, true, { x: state.w * 0.46, y: state.h * 0.58 });
  requestAnimationFrame(frame);
})();
