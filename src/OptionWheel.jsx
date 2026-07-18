import { useRef, useState, useCallback, useEffect } from 'react';

const DEFAULT_ITEMS = [
  'Semantic AI Search',
  'Auto Clip Titling',
  '100% Local Vault',
  'Multi-Clip Merge',
  'Code & Key Recognition',
  'Zero Account Needed',
  'Instant Keyboard Shortcut',
  'AES-256 Encrypted',
  'Smart Categorization'
];

const OptionWheel = ({
  items = DEFAULT_ITEMS,
  defaultSelected = 2,
  onChange,
  textColor = '#8a79a5',
  activeColor = '#f0d6ff',
  side = 'right',
  fontSize = 2.2,
  spacing = 1.35,
  curve = 1,
  tilt = 6.5,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 40,
  loop = true,
  draggable = true,
  soundUrl = '',
  soundVolume = 0.5,
  className = '',
  style = {}
}) => {
  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef(null);
  const dragRef = useRef(null);
  const dragMovedRef = useRef(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef('');
  const lastTickRef = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  const remPx = typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16;

  onChangeRef.current = onChange;
  cfgRef.current = {
    count: items.length,
    items,
    rowH: Math.max(fontSize * spacing * remPx, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    soundUrl,
    soundVolume
  };

  const runFrame = useCallback(now => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const cfg = cfgRef.current;
    const tau = Math.max(cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    const target = targetRef.current;
    const cur = posRef.current;
    let next = cur + (target - cur) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    posRef.current = next;

    const els = itemRefs.current;
    const n = cfg.count;
    const mirror = cfg.side === 'right' ? -1 : 1;
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;
    for (let i = 0; i < n; i++) {
      const el = els[i];
      if (!el) continue;
      let d = i - next;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const dist = Math.abs(d);
      let x = 0;
      let y = d * cfg.rowH;
      let rot = 0;
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
        rot = (mirror * ang * 180) / Math.PI;
      }
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
      
      const isSelected = Math.round(next % n + n) % n === i;
      if (dist < 0.6) {
        el.style.color = activeColor;
        el.style.fontWeight = '600';
        el.style.textShadow = `0 0 24px ${activeColor}b0, 0 0 12px ${activeColor}60`;
      } else {
        el.style.color = textColor;
        el.style.fontWeight = '300';
        el.style.textShadow = 'none';
      }
    }

    rafRef.current = settled ? null : requestAnimationFrame(runFrame);
  }, [activeColor, textColor]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const playSynthesizedTick = (volume = 0.35) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window._stashAudioCtx) {
        window._stashAudioCtx = new AudioCtx();
      }
      const ctx = window._stashAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.018);
      
      gain.gain.setValueAtTime(volume * 0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.018);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.019);
    } catch {
      // Ignore autoplay errors
    }
  };

  const playTick = useCallback(() => {
    const { soundUrl, soundVolume } = cfgRef.current;
    const now = performance.now();
    if (now - lastTickRef.current < 45) return;
    lastTickRef.current = now;

    if (soundUrl) {
      if (!audioRef.current || audioUrlRef.current !== soundUrl) {
        audioRef.current = new Audio(soundUrl);
        audioRef.current.preload = 'auto';
        audioUrlRef.current = soundUrl;
      }
      const audio = audioRef.current;
      audio.volume = Math.min(Math.max(soundVolume, 0), 1);
      audio.currentTime = 0;
      audio.play()?.catch(() => {});
    } else {
      playSynthesizedTick(soundVolume || 0.5);
    }
  }, []);

  const applyTarget = useCallback(
    (value, snap) => {
      const cfg = cfgRef.current;
      let v = value;
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
      if (snap) v = Math.round(v);
      targetRef.current = v;
      const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
      if (idx !== selectedRef.current) {
        selectedRef.current = idx;
        setSelectedIndex(idx);
        onChangeRef.current?.(idx, cfg.items[idx]);
        playTick();
      }
      startLoop();
    },
    [startLoop, playTick]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = e => {
      e.preventDefault();
      const cfg = cfgRef.current;
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  const handlePointerDown = useCallback(e => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!window._stashAudioCtx && AudioCtx) {
        window._stashAudioCtx = new AudioCtx();
      }
      if (window._stashAudioCtx && window._stashAudioCtx.state === 'suspended') {
        window._stashAudioCtx.resume();
      }
    } catch {}
    playTick();
    if (!cfgRef.current.draggable) return;
    dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, [playTick]);

  const handlePointerMove = useCallback(
    e => {
      const drag = dragRef.current;
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(dy) > 4) {
        dragMovedRef.current = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (dragMovedRef.current) applyTarget(drag.start - dy / cfgRef.current.rowH, false);
    },
    [applyTarget]
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleItemClick = useCallback(
    index => {
      if (dragMovedRef.current) return;
      const cfg = cfgRef.current;
      const cur = targetRef.current;
      let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
      if (cfg.loop && cfg.count > 1) {
        if (d > cfg.count / 2) d -= cfg.count;
        else if (d < -cfg.count / 2) d += cfg.count;
      }
      applyTarget(cur + d, true);
    },
    [applyTarget]
  );

  const handleKeyDown = useCallback(
    e => {
      let delta = null;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
      if (delta == null) return;
      e.preventDefault();
      applyTarget(Math.round(targetRef.current) + delta, true);
    },
    [applyTarget]
  );

  useEffect(() => {
    applyTarget(targetRef.current, false);
  }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, applyTarget]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    },
    []
  );

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Stash features wheel"
      className={className}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        userSelect: 'none',
        overflow: 'hidden',
        outline: 'none',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        ...style
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          ref={el => {
            itemRefs.current[index] = el;
          }}
          role="option"
          aria-selected={selectedIndex === index}
          style={{
            position: 'absolute',
            top: '50%',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            willChange: 'transform, opacity, filter',
            fontSize: `${fontSize}rem`,
            fontFamily: '"DM Sans", sans-serif',
            color: selectedIndex === index ? activeColor : textColor,
            fontWeight: selectedIndex === index ? 600 : 300,
            textShadow: selectedIndex === index ? `0 0 24px ${activeColor}b0` : 'none',
            transition: 'color 0.15s ease, text-shadow 0.15s ease',
            ...(side === 'right'
              ? { right: `${inset}px`, transformOrigin: 'right center' }
              : { left: `${inset}px`, transformOrigin: 'left center' })
          }}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default OptionWheel;
