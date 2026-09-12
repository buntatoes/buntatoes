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
    const baseY = state.pointer.active ? state.pointer.y : state.h * 0.74;
    for (let i = 0; i < n; i += 1) {
      const kind = Math.random();
      const violet = kind < 0.28;
      const ash = kind > 0.82;
      state.particles.push({
        x: baseX + (Math.random() - 0.5) * (burst ? 80 : 40),
        y: baseY + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * (burst ? 2.6 : 0.7),
        vy: -Math.random() * (burst ? 4.4 : 2.2) - 0.6,
        life: 1,
        decay: 0.008 + Math.random() * 0.014,
        r: (burst ? 8 : 4) + Math.random() * (burst ? 12 : 6),
        violet,
        ash,
      });
    }
  }

  function spark(n) {
    const x = state.pointer.active ? state.pointer.x : state.w * 0.5;
    const y = state.pointer.active ? state.pointer.y : state.h * 0.72;
    for (let i = 0; i < n; i += 1) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const s = 1.2 + Math.random() * 3.4;
      state.sparks.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1,
      });
    }
  }

  function frame() {
    ctx.fillStyle = "rgba(7, 6, 10, 0.28)";
    ctx.fillRect(0, 0, state.w, state.h);

    const glow = ctx.createRadialGradient(
      state.w * 0.5,
      state.h * 0.82,
      10,
      state.w * 0.5,
      state.h,
      state.w * 0.5
    );
    glow.addColorStop(0, "rgba(122, 36, 51, 0.18)");
    glow.addColorStop(0.45, "rgba(40, 24, 48, 0.08)");
    glow.addColorStop(1, "rgba(7, 6, 10, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, state.w, state.h);

    if (!reduced) spawn(state.pointer.active ? 5 : 3, false);
    if (state.burst > 0) {
      spawn(14, true);
      spark(7);
      state.burst -= 1;
    }

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.015;
      p.vx *= 0.992;
      p.life -= p.decay;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }
      const alpha = Math.max(p.life, 0);
      ctx.beginPath();
      if (p.ash) {
        ctx.fillStyle = `rgba(180, 172, 184, ${alpha * 0.45})`;
      } else if (p.violet) {
        ctx.fillStyle = `rgba(110, 74, 122, ${alpha * 0.8})`;
      } else {
        ctx.fillStyle = `rgba(154, ${36 + Math.floor(40 * alpha)}, 58, ${alpha * 0.9})`;
      }
      ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#e4d6c5";
    for (let i = state.sparks.length - 1; i >= 0; i -= 1) {
      const s = state.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.04;
      s.life -= 0.025;
      if (s.life <= 0) {
        state.sparks.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = s.life * 0.7;
      ctx.fillRect(s.x, s.y, 1.5, 1.5);
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
    state.burst = 6;
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      state.burst = 8;
    }
  });

  resize();
  ctx.fillStyle = "#07060a";
  ctx.fillRect(0, 0, state.w, state.h);
  if (reduced) spawn(36, true);
  requestAnimationFrame(frame);
})();
