// DotField Interactive Dot Grid Effect
(function() {
  const canvas = document.getElementById('dotfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Configuration
  const config = {
    dotRadius: 4,
    dotSpacing: 18,
    cursorRadius: 600,
    bulgeStrength: 120,
    glowRadius: 200,
    gradientFrom: 'rgba(150, 150, 150, 0.2)',
    gradientTo: 'rgba(180, 180, 180, 0.15)',
    glowColor: '#1a1a1a'
  };

  let dots = [];
  let mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
  let size = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
  let glowOpacity = 0;
  let engagement = 0;
  let frameCount = 0;
  let rafId = null;
  let isVisible = true;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    size = {
      w,
      h,
      offsetX: rect.left + window.scrollX,
      offsetY: rect.top + window.scrollY,
    };

    buildDots(w, h);
  }

  function buildDots(w, h) {
    const step = config.dotRadius + config.dotSpacing;
    const cols = Math.floor(w / step);
    const rows = Math.floor(h / step);
    const padX = (w % step) / 2;
    const padY = (h % step) / 2;
    dots = new Array(rows * cols);
    let idx = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ax = padX + col * step + step / 2;
        const ay = padY + row * step + step / 2;
        dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0 };
      }
    }
  }

  function onMouseMove(e) {
    mouse.x = e.pageX - size.offsetX;
    mouse.y = e.pageY - size.offsetY;
  }

  // 鼠标速度计算合并到 tick 中，移除独立 setInterval
  function updateMouseSpeed() {
    const dx = mouse.prevX - mouse.x;
    const dy = mouse.prevY - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    mouse.speed += (dist - mouse.speed) * 0.5;
    if (mouse.speed < 0.001) mouse.speed = 0;
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
  }

  function tick() {
    // 不可见时暂停渲染，但保留 rAF 以便恢复
    if (!isVisible) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    frameCount++;
    const { w, h } = size;
    const len = dots.length;
    const t = frameCount * 0.02;

    // 将鼠标速度计算合并到 tick，移除 setInterval 开销
    updateMouseSpeed();

    // Update engagement
    const targetEngagement = Math.min(mouse.speed / 5, 1);
    engagement += (targetEngagement - engagement) * 0.06;
    if (engagement < 0.001) engagement = 0;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Create gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, config.gradientFrom);
    grad.addColorStop(1, config.gradientTo);
    ctx.fillStyle = grad;

    const cr = config.cursorRadius;
    const crSq = cr * cr;
    const rad = config.dotRadius / 2;

    ctx.beginPath();

    for (let i = 0; i < len; i++) {
      const d = dots[i];
      const dx = mouse.x - d.ax;
      const dy = mouse.y - d.ay;
      const distSq = dx * dx + dy * dy;

      if (distSq < crSq && engagement > 0.01) {
        const dist = Math.sqrt(distSq);
        const t = 1 - dist / cr;
        const push = t * t * config.bulgeStrength * engagement;
        const angle = Math.atan2(dy, dx);
        d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
        d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
      } else {
        d.sx += (d.ax - d.sx) * 0.1;
        d.sy += (d.ay - d.sy) * 0.1;
      }

      let drawX = d.sx;
      let drawY = d.sy;

      ctx.moveTo(drawX + rad, drawY);
      ctx.arc(drawX, drawY, rad, 0, Math.PI * 2);
    }

    ctx.fill();

    rafId = requestAnimationFrame(tick);
  }

  // IntersectionObserver: hero 不可见时暂停 canvas 渲染
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0 });

  heroObserver.observe(canvas.parentElement);

  // 页面隐藏时也暂停（切标签页）
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Initialize
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  rafId = requestAnimationFrame(tick);
})();
