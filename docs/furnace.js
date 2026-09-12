(() => {
  const canvas = document.getElementById("crt");
  const ctx = canvas.getContext("2d", { alpha: false });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VOID = "#050508";
  const HAIR = "rgba(42, 45, 54, 0.38)";
  const PHOS = [110, 163, 122];
  const BLOOD = [122, 36, 51];
  const VIOLET = [110, 74, 122];

  const state = {
    w: 0,
    h: 0,
    particles: [],
    rings: [],
    pointer: { x: 0, y: 0, px: 0, py: 0, active: false },
    burst: 0,
    t: 0,
  };

  function rgba(c, a) {
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.w = window.innerWidth;
    state.h = window.innerHeight;
    canvas.width = Math.floor(state.w * dpr);
    canvas.height = Math.floor(state.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function mote(x, y, burst) {
    const roll = Math.random();
    const tint = roll < 0.18 ? BLOOD : roll < 0.42 ? VIOLET : PHOS;
    const speed = burst ? 2.4 + Math.random() * 3.8 : 0.25 + Math.random() * 0.9;
    const ang = burst ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * 0.8;
    state.particles.push({
      x,
      y,
      vx: Math.cos(ang) * speed * (burst ? 1 : (Math.random() < 0.5 ? -1 : 1)),
      vy: burst ? Math.sin(ang) * speed : (Math.random() - 0.55) * 0.35,
      life: 1,
      decay: burst ? 0.012 + Math.random() * 0.02 : 0.006 + Math.random() * 0.01,
      w: burst ? 1 + Math.random() * 7 : 6 + Math.random() * 18,
      h: burst ? 1 + Math.random() * 2 : 1,
      tint,
      trace: !burst,
    });
  }

  function stoke(n, burst) {
    const x = state.pointer.active ? state.pointer.x : state.w * 0.5;
    const y = state.pointer.active ? state.pointer.y : state.h * 0.58;
    for (let i = 0; i < n; i += 1) {
      const jx = x + (Math.random() - 0.5) * (burst ? 28 : 10);
      const jy = y + (Math.random() - 0.5) * (burst ? 28 : 8);
      mote(jx, jy, burst);
    }
  }

  function ring() {
    const x = state.pointer.active ? state.pointer.x : state.w * 0.5;
    const y = state.pointer.active ? state.pointer.y : state.h * 0.58;
    state.rings.push({ x, y, r: 6, life: 1, tint: Math.random() < 0.35 ? BLOOD : PHOS });
  }

  function grid() {
    ctx.strokeStyle = HAIR;
    ctx.lineWidth = 1;
    const step = 48;
    ctx.beginPath();
    for (let x = 0; x <= state.w; x += step) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, state.h);
    }
    for (let y = 0; y <= state.h; y += step) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(state.w, y + 0.5);
    }
    ctx.stroke();
  }

  function beam() {
    if (reduced) return;
    const y = (state.t * 1.35) % state.h;
    ctx.fillStyle = rgba(PHOS, 0.045);
    ctx.fillRect(0, y, state.w, 2);
  }

  function reticle() {
    if (!state.pointer.active) return;
    const { x, y } = state.pointer;
    ctx.strokeStyle = rgba(PHOS, 0.7);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x - 4, y);
    ctx.moveTo(x + 4, y);
    ctx.lineTo(x + 14, y);
    ctx.moveTo(x, y - 14);
    ctx.lineTo(x, y - 4);
    ctx.moveTo(x, y + 4);
    ctx.lineTo(x, y + 14);
    ctx.stroke();
    ctx.strokeStyle = rgba(BLOOD, 0.55);
    ctx.strokeRect(x - 9.5, y - 9.5, 19, 19);
  }

  function frame() {
    state.t += 1;
    ctx.fillStyle = VOID;
    ctx.fillRect(0, 0, state.w, state.h);
    grid();
    beam();

    if (state.pointer.active) {
      const g = ctx.createRadialGradient(
        state.pointer.x,
        state.pointer.y,
        2,
        state.pointer.x,
        state.pointer.y,
        120
      );
      g.addColorStop(0, rgba(PHOS, 0.14));
      g.addColorStop(0.45, rgba(VIOLET, 0.05));
      g.addColorStop(1, "rgba(5, 5, 8, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, state.w, state.h);
    }

    if (!reduced) {
      const dx = state.pointer.x - state.pointer.px;
      const dy = state.pointer.y - state.pointer.py;
      const speed = Math.hypot(dx, dy);
      const idle = state.pointer.active ? 2 : 1;
      stoke(idle + (speed > 6 ? 3 : 0), false);
      state.pointer.px = state.pointer.x;
      state.pointer.py = state.pointer.y;
    }

    if (state.burst > 0) {
      stoke(18, true);
      if (state.burst % 2 === 0) ring();
      state.burst -= 1;
    }

    for (let i = state.rings.length - 1; i >= 0; i -= 1) {
      const r = state.rings[i];
      r.r += 4.2;
      r.life -= 0.03;
      if (r.life <= 0) {
        state.rings.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = rgba(r.tint, r.life * 0.55);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= p.decay;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }
      const a = Math.max(p.life, 0);
      ctx.fillStyle = rgba(p.tint, a * (p.trace ? 0.55 : 0.9));
      if (p.trace) {
        ctx.fillRect(p.x, p.y, p.w * a, p.h);
      } else {
        ctx.fillRect(p.x, p.y, Math.max(p.w * a, 1), Math.max(p.h, 1));
      }
    }

    reticle();

    if (state.particles.length > 1100) state.particles.splice(0, 250);
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    if (!state.pointer.active) {
      state.pointer.px = event.clientX;
      state.pointer.py = event.clientY;
    }
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    state.pointer.active = true;
  });
  window.addEventListener("pointerdown", () => {
    state.burst = 6;
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      state.burst = 8;
    }
  });

  resize();
  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, state.w, state.h);
  grid();
  stoke(reduced ? 48 : 24, true);
  requestAnimationFrame(frame);
})();
