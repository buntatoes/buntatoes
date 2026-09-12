(() => {
  const canvas = document.getElementById("fire");
  const ctx = canvas.getContext("2d", { alpha: false });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    w: 0,
    h: 0,
    particles: [],
    sparks: [],
    pointer: { x: 0, y: 0, active: false },
    burst: 0,
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.w = window.innerWidth;
    state.h = window.innerHeight;
    canvas.width = Math.floor(state.w * dpr);
    canvas.height = Math.floor(state.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(n, burst) {
    const baseX = state.pointer.active ? state.pointer.x : state.w * 0.5;
    const baseY = state.pointer.active ? state.pointer.y : state.h * 0.72;
    for (let i = 0; i < n; i += 1) {
      const blue = Math.random() < (burst ? 0.22 : 0.08);
      state.particles.push({
        x: baseX + (Math.random() - 0.5) * (burst ? 90 : 46),
        y: baseY + (Math.random() - 0.5) * 18,
        vx: (Math.random() - 0.5) * (burst ? 4.2 : 1.1),
        vy: -Math.random() * (burst ? 7 : 3.4) - 1.2,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        r: (burst ? 10 : 5) + Math.random() * (burst ? 16 : 8),
        blue,
      });
    }
  }

  function spark(n) {
    const x = state.pointer.active ? state.pointer.x : state.w * 0.5;
    const y = state.pointer.active ? state.pointer.y : state.h * 0.7;
    for (let i = 0; i < n; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 6;
      state.sparks.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 2,
        life: 1,
      });
    }
  }

  function frame() {
    ctx.fillStyle = "rgba(7, 4, 3, 0.35)";
    ctx.fillRect(0, 0, state.w, state.h);

    const glow = ctx.createRadialGradient(
      state.w * 0.5,
      state.h * 0.78,
      20,
      state.w * 0.5,
      state.h * 0.9,
      state.w * 0.55
    );
    glow.addColorStop(0, "rgba(255, 90, 20, 0.16)");
    glow.addColorStop(1, "rgba(7, 4, 3, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, state.w, state.h);

    if (!reduced) spawn(state.pointer.active ? 7 : 4, false);
    if (state.burst > 0) {
      spawn(18, true);
      spark(10);
      state.burst -= 1;
    }

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.03;
      p.vx *= 0.99;
      p.life -= p.decay;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }
      const alpha = Math.max(p.life, 0);
      ctx.beginPath();
      ctx.fillStyle = p.blue
        ? `rgba(126, 203, 255, ${alpha * 0.85})`
        : `rgba(255, ${90 + Math.floor(120 * alpha)}, 24, ${alpha})`;
      ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffd27a";
    for (let i = state.sparks.length - 1; i >= 0; i -= 1) {
      const s = state.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08;
      s.life -= 0.03;
      if (s.life <= 0) {
        state.sparks.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = s.life;
      ctx.fillRect(s.x, s.y, 2, 2);
    }
    ctx.globalAlpha = 1;

    if (state.particles.length > 900) state.particles.splice(0, 200);
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    state.pointer.active = true;
  });
  window.addEventListener("pointerdown", () => {
    state.burst = 8;
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      state.burst = 10;
    }
  });

  resize();
  ctx.fillStyle = "#070403";
  ctx.fillRect(0, 0, state.w, state.h);
  if (reduced) spawn(40, true);
  requestAnimationFrame(frame);
})();
