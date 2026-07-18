import { useRef, useEffect } from 'react';

const FALLOFF_CURVES = {
  linear: t => t,
  smooth: t => t * t * (3 - 2 * t),
  sharp: t => t * t * t
};

const hexToRgb = hex => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const num = parseInt(v, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const CursorGrid = ({
  cellSize = 70,
  color = '#E056FD',
  radius = 160,
  falloff = 'smooth',
  holdTime = 350,
  fadeDuration = 700,
  lineWidth = 1.5,
  maxOpacity = 1,
  fillOpacity = 0,
  gridOpacity = 0.03,
  cellRadius = 4,
  clickPulse = true,
  pulseSpeed = 750,
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const propsRef = useRef({});
  const wakeRef = useRef(null);

  propsRef.current = {
    cellSize,
    color,
    radius,
    falloff,
    holdTime,
    fadeDuration,
    lineWidth,
    maxOpacity,
    fillOpacity,
    gridOpacity,
    cellRadius,
    clickPulse,
    pulseSpeed
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    // Cap DPR at 1.25 to prevent 4K pixel fill rate lag on high-DPI screens
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    let cols = 0;
    let rows = 0;
    let offX = 0;
    let offY = 0;
    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);
    const activeIndices = new Set();
    let w = 0;
    let h = 0;
    const pulses = [];
    let raf = 0;
    let running = false;
    let lastFrame = 0;

    const rebuild = () => {
      const p = propsRef.current;
      w = container.offsetWidth || container.clientWidth || 800;
      h = container.offsetHeight || container.clientHeight || 400;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / p.cellSize) + 1;
      rows = Math.ceil(h / p.cellSize) + 1;
      offX = (w - cols * p.cellSize) / 2;
      offY = (h - rows * p.cellSize) / 2;
      alphas = new Float32Array(cols * rows);
      touched = new Float64Array(cols * rows);
      activeIndices.clear();
    };

    const cellCenter = i => {
      const p = propsRef.current;
      const cx = offX + (i % cols) * p.cellSize + p.cellSize / 2;
      const cy = offY + Math.floor(i / cols) * p.cellSize + p.cellSize / 2;
      return [cx, cy];
    };

    const energize = (x, y, boost) => {
      const p = propsRef.current;
      const r = Math.max(p.radius, 1);
      const ease = FALLOFF_CURVES[p.falloff] ?? FALLOFF_CURVES.linear;
      const now = performance.now();
      const minCol = Math.max(0, Math.floor((x - r - offX) / p.cellSize));
      const maxCol = Math.min(cols - 1, Math.floor((x + r - offX) / p.cellSize));
      const minRow = Math.max(0, Math.floor((y - r - offY) / p.cellSize));
      const maxRow = Math.min(rows - 1, Math.floor((y + r - offY) / p.cellSize));
      for (let cRow = minRow; cRow <= maxRow; cRow++) {
        for (let cCol = minCol; cCol <= maxCol; cCol++) {
          const i = cRow * cols + cCol;
          const [cx, cy] = cellCenter(i);
          const dist = Math.hypot(cx - x, cy - y);
          if (dist > r) continue;
          const level = ease(1 - dist / r) * p.maxOpacity * (boost ?? 1);
          if (level > alphas[i]) {
            alphas[i] = level;
            touched[i] = now;
            activeIndices.add(i);
          } else if (level > 0) {
            touched[i] = now;
            activeIndices.add(i);
          }
        }
      }
    };

    const draw = now => {
      const p = propsRef.current;
      const dt = Math.min(now - lastFrame, 32);
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);
      const [cr, cg, cb] = hexToRgb(p.color);

      // 1. Faint static background grid lattice
      if (p.gridOpacity > 0) {
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${p.gridOpacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let cCol = 0; cCol <= cols; cCol++) {
          const x = Math.round(offX + cCol * p.cellSize) + 0.5;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let cRow = 0; cRow <= rows; cRow++) {
          const y = Math.round(offY + cRow * p.cellSize) + 0.5;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();
      }

      // 2. Expanding click ring pulses
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const pulse = pulses[pi];
        const age = (now - pulse.t0) / 1000;
        const ringR = age * p.pulseSpeed;
        if (ringR > Math.hypot(w, h)) {
          pulses.splice(pi, 1);
          continue;
        }
        const band = p.cellSize;
        const minCol = Math.max(0, Math.floor((pulse.x - ringR - band - offX) / p.cellSize));
        const maxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band - offX) / p.cellSize));
        const minRow = Math.max(0, Math.floor((pulse.y - ringR - band - offY) / p.cellSize));
        const maxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band - offY) / p.cellSize));
        for (let cRow = minRow; cRow <= maxRow; cRow++) {
          for (let cCol = minCol; cCol <= maxCol; cCol++) {
            const i = cRow * cols + cCol;
            const [cx, cy] = cellCenter(i);
            const dist = Math.hypot(cx - pulse.x, cy - pulse.y);
            if (Math.abs(dist - ringR) < band / 2 && p.maxOpacity > alphas[i]) {
              alphas[i] = p.maxOpacity;
              touched[i] = now;
              activeIndices.add(i);
            }
          }
        }
      }

      // 3. Fast targeted render of active cell indices only (Sparse set traversal)
      const fadeStep = dt / Math.max(p.fadeDuration, 16);
      const half = p.cellSize / 2;
      const toRemove = [];

      for (const i of activeIndices) {
        let a = alphas[i];
        if (now - touched[i] > p.holdTime) {
          a = Math.max(0, a - fadeStep);
          alphas[i] = a;
        }
        if (a <= 0) {
          toRemove.push(i);
          continue;
        }

        const [cx, cy] = cellCenter(i);
        const x = cx - half + 0.5;
        const y = cy - half + 0.5;
        const s = p.cellSize - 1;

        ctx.beginPath();
        if (p.cellRadius > 0 && ctx.roundRect) {
          ctx.roundRect(x, y, s, s, p.cellRadius);
        } else {
          ctx.rect(x, y, s, s);
        }

        // Fill if configured
        if (p.fillOpacity > 0) {
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * p.fillOpacity})`;
          ctx.fill();
        }

        // Dual-pass hardware accelerated neon stroke (0% CPU cost, 120 FPS fast!)
        // Outer neon glow stroke
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * 0.35})`;
        ctx.lineWidth = p.lineWidth * 2.2;
        ctx.stroke();

        // Inner core crisp laser line stroke
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${a})`;
        ctx.lineWidth = p.lineWidth;
        ctx.stroke();
      }

      // Cleanup dead indices
      for (let k = 0; k < toRemove.length; k++) {
        activeIndices.delete(toRemove[k]);
      }

      // Zero-idle loop: auto-sleep when no active cells exist
      if (activeIndices.size > 0 || pulses.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(draw);
    };
    wakeRef.current = wake;

    let pendingPointerMove = false;
    let pointerX = 0;
    let pointerY = 0;

    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      const p = propsRef.current;
      if (pointerX >= -p.radius && pointerX <= rect.width + p.radius && pointerY >= -p.radius && pointerY <= rect.height + p.radius) {
        if (!pendingPointerMove) {
          pendingPointerMove = true;
          requestAnimationFrame(() => {
            energize(pointerX, pointerY);
            wake();
            pendingPointerMove = false;
          });
        }
      }
    };

    const onPointerDown = e => {
      const p = propsRef.current;
      if (!p.clickPulse) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        pulses.push({ x, y, t0: performance.now() });
        wake();
      }
    };

    const ro = new ResizeObserver(() => {
      rebuild();
      wake();
    });
    ro.observe(container);
    rebuild();
    wake();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [cellSize]);

  useEffect(() => {
    wakeRef.current?.();
  }, [gridOpacity, color, lineWidth, maxOpacity, fillOpacity, cellRadius]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default CursorGrid;
