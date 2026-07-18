import { useCallback, useEffect, useRef, useState } from 'react';

const falloffCurves = {
  linear: value => value,
  smooth: value => value * value * (3 - 2 * value),
  sharp: value => value * value * value,
};

function SidebarIcon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 21v-6h6v6" /></>,
    spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    flow: <><path d="M5 5h10a4 4 0 0 1 4 4v1" /><path d="m16 7 3 3-3 3" /><path d="M19 19H9a4 4 0 0 1-4-4v-1" /><path d="m8 17-3-3 3-3" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" /></>,
  };
  return <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.home}</svg>;
}

export default function LineSidebar({ items, onItemClick }) {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const effectsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateEffects = useCallback((event) => {
    const list = listRef.current;
    if (!list) return;
    const bounds = list.getBoundingClientRect();
    const pointerY = event.clientY - bounds.top;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const center = item.offsetTop + item.offsetHeight / 2;
      const distance = Math.abs(pointerY - center);
      const proximity = Math.max(0, 1 - distance / 92);
      const effect = falloffCurves.smooth(proximity);
      effectsRef.current[index] = effect;
      item.style.setProperty('--effect', effect.toFixed(3));
    });
  }, []);

  const resetEffects = useCallback(() => {
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      effectsRef.current[index] = 0;
      item.style.setProperty('--effect', '0');
    });
  }, []);

  useEffect(() => resetEffects, [resetEffects]);

  const selectItem = (index, item) => {
    setActiveIndex(index);
    onItemClick?.(index, item);
  };

  return <aside className="line-sidebar-shell" aria-label="Page sections">
    <span className="sidebar-hint">Explore</span>
    <nav className="line-sidebar" onPointerMove={updateEffects} onPointerLeave={resetEffects}>
      <ul ref={listRef}>
        {items.map((item, index) => <li key={item.label} ref={element => { itemRefs.current[index] = element; }} style={{ '--effect': 0 }} className={activeIndex === index ? 'is-active' : ''}>
          <button type="button" onClick={() => selectItem(index, item)}>
            <span className="line-marker" /><span className="sidebar-icon-wrap"><SidebarIcon name={item.icon} /></span><span className="line-index">{String(index + 1).padStart(2, '0')}</span><span className="line-label">{item.label}</span>
          </button>
        </li>)}
      </ul>
    </nav>
  </aside>;
}
