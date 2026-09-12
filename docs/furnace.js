(() => {
  const nodes = document.querySelectorAll("canvas#crt, canvas#fire, canvas");
  for (let i = 0; i < nodes.length; i += 1) {
    const canvas = nodes[i];
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) continue;
    const w = window.innerWidth || canvas.width || 1;
    const h = window.innerHeight || canvas.height || 1;
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
  }
})();
