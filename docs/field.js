(function () {
  var canvas = document.getElementById("field");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d", { alpha: false });
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = motion.matches;

  var W = 0;
  var H = 0;
  var dpr = 1;
  var t0 = 0;
  var mx = 0.62;
  var my = 0.38;
  var tx = mx;
  var ty = my;
  var raf = 0;

  var orbs = [
    { x: 0.28, y: 0.22, r: 0.55, rgb: [223, 230, 245], a: 0.2, sx: 0.00011, sy: 0.00007, p: 0.4 },
    { x: 0.72, y: 0.18, r: 0.48, rgb: [155, 176, 212], a: 0.24, sx: 0.00008, sy: 0.0001, p: 1.7 },
    { x: 0.18, y: 0.72, r: 0.5, rgb: [122, 163, 184], a: 0.22, sx: 0.00009, sy: 0.00006, p: 2.8 },
    { x: 0.78, y: 0.68, r: 0.52, rgb: [196, 165, 184], a: 0.2, sx: 0.00007, sy: 0.00009, p: 0.9 },
    { x: 0.5, y: 0.48, r: 0.42, rgb: [232, 228, 240], a: 0.12, sx: 0.00005, sy: 0.00008, p: 3.5 },
    { x: 0.4, y: 0.82, r: 0.36, rgb: [155, 176, 212], a: 0.14, sx: 0.0001, sy: 0.00005, p: 4.2 }
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(reduce ? 0 : (performance.now() - t0));
  }

  function wash() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0c1124");
    g.addColorStop(0.45, "#141a33");
    g.addColorStop(1, "#090b16");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function orbAt(o, now) {
    var ox = o.x * W;
    var oy = o.y * H;
    if (!reduce) {
      ox += Math.sin(now * o.sx + o.p) * W * 0.07;
      oy += Math.cos(now * o.sy + o.p * 0.8) * H * 0.055;
    }

    var dx = mx * W - ox;
    var dy = my * H - oy;
    var dist = Math.hypot(dx, dy) + 1;
    var sigma = Math.min(W, H) * 0.42;
    var inf = Math.exp(-(dist * dist) / (2 * sigma * sigma));
    var nx = dx / dist;
    var ny = dy / dist;
    ox += nx * inf * 56;
    oy += ny * inf * 56;
    ox += -ny * inf * 26;
    oy += nx * inf * 26;

    return { x: ox, y: oy, inf: inf, ang: Math.atan2(dy, dx) };
  }

  function drawOrb(o, now) {
    var p = orbAt(o, now);
    var rad = o.r * Math.min(W, H);
    var stretch = 1 + p.inf * 0.42;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.ang);
    ctx.scale(stretch, 1 / Math.sqrt(stretch));

    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
    g.addColorStop(0, "rgba(" + o.rgb[0] + "," + o.rgb[1] + "," + o.rgb[2] + "," + o.a + ")");
    g.addColorStop(0.45, "rgba(" + o.rgb[0] + "," + o.rgb[1] + "," + o.rgb[2] + "," + o.a * 0.35 + ")");
    g.addColorStop(1, "rgba(" + o.rgb[0] + "," + o.rgb[1] + "," + o.rgb[2] + ",0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function lamp() {
    var px = mx * W;
    var py = my * H;
    var pr = Math.min(W, H) * 0.46;
    var g = ctx.createRadialGradient(px, py, 0, px, py, pr);
    g.addColorStop(0, "rgba(232, 228, 240, 0.26)");
    g.addColorStop(0.18, "rgba(223, 230, 245, 0.14)");
    g.addColorStop(0.38, "rgba(196, 165, 184, 0.1)");
    g.addColorStop(0.62, "rgba(122, 163, 184, 0.06)");
    g.addColorStop(1, "rgba(9, 11, 22, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  function paint(now) {
    wash();
    ctx.globalCompositeOperation = "lighter";
    var i;
    for (i = 0; i < orbs.length; i++) drawOrb(orbs[i], now);
    lamp();
    ctx.globalCompositeOperation = "source-over";
  }

  function tick(ts) {
    if (!t0) t0 = ts;
    mx += (tx - mx) * 0.055;
    my += (ty - my) * 0.055;
    paint(ts - t0);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (reduce) {
      paint(0);
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function onMove(e) {
    if (!W || !H) return;
    tx = e.clientX / W;
    ty = e.clientY / H;
    if (reduce) {
      mx = tx;
      my = ty;
      paint(0);
    }
  }

  function onMotion() {
    reduce = motion.matches;
    start();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove, { passive: true });
  if (motion.addEventListener) motion.addEventListener("change", onMotion);
  else if (motion.addListener) motion.addListener(onMotion);

  resize();
  start();
})();
