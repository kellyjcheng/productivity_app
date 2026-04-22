/* Productivity App — main React shell */
const { useState, useEffect, useRef, useCallback } = React;

// ---------- ICONS (inline, original) ----------
const IconX = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);
const IconMinus = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <path d="M4 8h8" />
  </svg>
);
const IconMax = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <rect x="4" y="4" width="8" height="8" rx="1" />
  </svg>
);
const IconCheck = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 8.5l3.5 3.5L13 5" />
  </svg>
);
const IconCloud = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14 34h22a8 8 0 0 0 1-15.9A11 11 0 0 0 15 20a7 7 0 0 0-1 14z" fill="currentColor" fillOpacity="0.12" />
  </svg>
);
const IconCloudRain = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14 28h22a8 8 0 0 0 1-15.9A11 11 0 0 0 15 14a7 7 0 0 0-1 14z" fill="currentColor" fillOpacity="0.12" />
    <path d="M18 34l-2 6M26 34l-2 6M34 34l-2 6" />
  </svg>
);
const IconSun = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <circle cx="24" cy="24" r="8" fill="currentColor" fillOpacity="0.15" />
    <path d="M24 6v4M24 38v4M6 24h4M38 24h4M11 11l3 3M34 34l3 3M37 11l-3 3M14 34l-3 3" />
  </svg>
);
const IconPartly = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="18" cy="18" r="6" fill="currentColor" fillOpacity="0.15" />
    <path d="M18 8v2M18 26v2M8 18h2M26 18h2M11 11l1.5 1.5M23.5 23.5L25 25" />
    <path d="M20 36h16a6 6 0 0 0 .5-11.9A9 9 0 0 0 21 27a5 5 0 0 0-1 9z" fill="currentColor" fillOpacity="0.12" />
  </svg>
);

// ---------- SPARKLINE ----------
function Sparkline({ data, up, color }) {
  if (!data || data.length < 2) return null;
  const w = 100, h = 40, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const d = 'M ' + pts.map(p => p.join(' ')).join(' L ');
  const stroke = color || (up ? '#10b981' : '#ef4444');
  const fill = up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
  const areaD = d + ` L ${pts[pts.length-1][0]} ${h} L ${pts[0][0]} ${h} Z`;
  return (
    <svg className="stock-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={areaD} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- WOOPER ----------
function Wooper() {
  const [broken, setBroken] = useState(false);
  return (
    <div className="wooper-strip" aria-hidden="true">
      <div className="wooper">
        {!broken ? (
          <img
            src="assets/wooper/wooper.gif"
            alt=""
            onError={() => setBroken(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div className="wooper-fallback" title="Drop wooper.gif at assets/wooper/wooper.gif">
            WOOP
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- TITLE BAR ----------
function TitleBar({ onClose, onPointerDown }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const [greetFlip, setGreetFlip] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setGreetFlip(f => !f), 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="titlebar" onPointerDown={onPointerDown}>
      <div className="titlebar-left">
        <div className="app-dot" />
        <div className="greet-wrap">
          <span className={`greet ${!greetFlip ? 'show' : 'hide'}`}>Morning Brief</span>
          <span className={`greet ${greetFlip ? 'show' : 'hide'}`}>Good morning</span>
        </div>
        <div className="app-sub">— {dateStr}</div>
      </div>
      <Wooper />
      <div className="titlebar-right">
        <button className="tb-btn" aria-label="Minimize" onClick={(e) => e.stopPropagation()}>
          <IconMinus />
        </button>
        <button className="tb-btn" aria-label="Maximize" onClick={(e) => e.stopPropagation()}>
          <IconMax />
        </button>
        <button className="tb-btn" aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          <IconX />
        </button>
      </div>
    </div>
  );
}

// ---------- NEWS PANEL ----------
function NewsPanel() {
  return (
    <section className="panel panel-news">
      <div className="panel-head">
        <div>
          <div className="panel-label">I · World & Politics</div>
          <div className="panel-title">Breaking</div>
        </div>
        <div className="panel-meta">Updated 2 min ago</div>
      </div>
      <div className="panel-scroll">
        <div className="news-lead">
          <span className="news-tag live">LIVE</span>
          <h3 className="news-headline">Iran war live: Trump says ceasefire extended as talks with Tehran in limbo</h3>
          <div className="news-source">Al Jazeera · Live blog · 04:42 GMT</div>
        </div>
        <div className="news-item">
          <div className="news-time">08:12</div>
          <div className="news-item-title">EU foreign ministers to meet in Brussels over emergency Gulf response package</div>
        </div>
        <div className="news-item">
          <div className="news-time">07:48</div>
          <div className="news-item-title">Oil futures climb 3.2% on ceasefire uncertainty; Brent crosses $94</div>
        </div>
        <div className="news-item">
          <div className="news-time">07:21</div>
          <div className="news-item-title">Senate committee advances bipartisan sanctions bill in late-night vote</div>
        </div>
        <div className="news-item">
          <div className="news-time">06:55</div>
          <div className="news-item-title">UN Security Council calls closed-door session for Wednesday afternoon</div>
        </div>
        <div className="news-item">
          <div className="news-time">06:30</div>
          <div className="news-item-title">State Department issues travel advisory update for regional airspace</div>
        </div>
      </div>
    </section>
  );
}

// ---------- WEATHER PANEL ----------
function WeatherPanel() {
  // Build 9 hours starting from the current hour
  const now = new Date();
  const startHour = now.getHours();
  const hourConds = [
    { cond: 'rain',   t: 54, icon: <IconCloudRain />, pop: 78 },
    { cond: 'rain',   t: 55, icon: <IconCloudRain />, pop: 72 },
    { cond: 'cloudy', t: 56, icon: <IconCloud />,     pop: 40 },
    { cond: 'cloudy', t: 57, icon: <IconCloud />,     pop: 28 },
    { cond: 'partly', t: 58, icon: <IconPartly />,    pop: 15 },
    { cond: 'partly', t: 58, icon: <IconPartly />,    pop: 10 },
    { cond: 'partly', t: 57, icon: <IconPartly />,    pop: 12 },
    { cond: 'cloudy', t: 55, icon: <IconCloud />,     pop: 22 },
    { cond: 'rain',   t: 53, icon: <IconCloudRain />, pop: 55 },
  ];
  const fmtHour = (h) => {
    const hr = ((h % 24) + 24) % 24;
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const disp = hr % 12 === 0 ? 12 : hr % 12;
    return disp + ampm;
  };
  const hourly = hourConds.map((hc, i) => ({
    ...hc,
    label: i === 0 ? 'Now' : fmtHour(startHour + i),
  }));
  return (
    <section className="panel panel-weather">
      <div className="panel-head">
        <div>
          <div className="panel-label">II · Weather</div>
          <div className="panel-title">Seattle, WA</div>
        </div>
        <div className="panel-meta">Capitol Hill · 47.62°N</div>
      </div>
      <div className="weather-main">
        <div>
          <div className="temp-big">54<sup>°F</sup></div>
          <div className="weather-cond">Light rain · Overcast</div>
          <div className="weather-hi-lo">H 58° · L 49° · Feels 51°</div>
        </div>
        <div className="weather-icon"><IconCloudRain width="72" height="72" /></div>
      </div>
      <div className="weather-stats">
        <div>
          <div className="wstat-label">Wind</div>
          <div className="wstat-value">9 mph SW</div>
        </div>
        <div>
          <div className="wstat-label">Humidity</div>
          <div className="wstat-value">82%</div>
        </div>
        <div>
          <div className="wstat-label">UV Index</div>
          <div className="wstat-value">2 · Low</div>
        </div>
      </div>
      <div className="hourly">
        {hourly.map((h, i) => (
          <div className={`hourly-slot${i === 0 ? ' now' : ''}`} key={i}>
            <div className="hr-label">{h.label}</div>
            <div className="hr-icon">{React.cloneElement(h.icon, { width: 22, height: 22 })}</div>
            <div className="hr-temp">{h.t}°</div>
            <div className="hr-pop" style={{ opacity: h.pop >= 20 ? 1 : 0.35 }}>
              <span className="hr-pop-dot" />{h.pop}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- TO-DO PANEL ----------
const INITIAL_TODOS = [
  { id: 1, title: 'Standup with eng team', time: '9:30 – 9:45 AM', cal: 'work', done: true, section: 'Today' },
  { id: 2, title: 'Review Q2 roadmap draft & leave comments', time: '10:00 AM', cal: 'work', done: false, section: 'Today' },
  { id: 3, title: 'Lunch w/ Priya — Cafe Presse', time: '12:30 PM', cal: 'personal', done: false, section: 'Today' },
  { id: 4, title: '1:1 with Marcus', time: '2:00 – 2:30 PM', cal: 'work', done: false, section: 'Today' },
  { id: 5, title: 'Gym — upper body', time: '6:00 PM', cal: 'health', done: false, section: 'Today' },
  { id: 6, title: 'Finish investor deck outline', time: 'EOD', cal: 'work', done: false, section: 'Today' },
  { id: 7, title: 'Design review — onboarding v3', time: '10:30 AM', cal: 'work', done: false, section: 'Tomorrow' },
  { id: 8, title: 'Dentist appointment', time: '3:15 PM', cal: 'health', done: false, section: 'Tomorrow' },
  { id: 9, title: 'Mom\'s birthday dinner', time: '7:00 PM', cal: 'personal', done: false, section: 'Tomorrow' },
];

function TodoPanel() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const toggle = (id) => setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const sections = ['Today', 'Tomorrow'];
  const doneCount = todos.filter(t => t.done && t.section === 'Today').length;
  const totalToday = todos.filter(t => t.section === 'Today').length;

  return (
    <section className="panel panel-todo">
      <div className="panel-head">
        <div>
          <div className="panel-label">III · Calendar</div>
          <div className="panel-title">To-do</div>
        </div>
        <div className="panel-meta">{doneCount}/{totalToday} today</div>
      </div>
      <div className="panel-scroll">
        <div className="todo-list">
          {sections.map(section => (
            <React.Fragment key={section}>
              <div className="todo-section-label">{section}</div>
              {todos.filter(t => t.section === section).map(t => (
                <div
                  key={t.id}
                  className={`todo-item ${t.done ? 'done' : ''}`}
                  onClick={() => toggle(t.id)}
                >
                  <div className="todo-check"><IconCheck /></div>
                  <div className="todo-content">
                    <div className="todo-title">{t.title}</div>
                    <div className="todo-meta">
                      <span className={`todo-cal-dot cal-${t.cal}`} />
                      <span>{t.time}</span>
                      <span>·</span>
                      <span>{t.cal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- STOCKS ----------
function genSpark(seed, trend) {
  const arr = [];
  let v = 100;
  for (let i = 0; i < 24; i++) {
    const wiggle = (Math.sin(seed + i * 0.7) + Math.cos(seed * 1.3 + i * 0.4)) * 1.5;
    v += wiggle + trend;
    arr.push(v);
  }
  return arr;
}

const STOCKS = [
  {
    sym: 'NDAQ',
    name: 'Nasdaq Inc.',
    price: 78.42,
    changePct: 0.84,
    spark: genSpark(1, 0.15),
    news: 'Nasdaq beats Q1 estimates on record trading volume; exchange revenue up 9% YoY.',
  },
  {
    sym: 'POWL',
    name: 'Powell Industries',
    price: 241.18,
    changePct: 2.34,
    spark: genSpark(3, 0.45),
    news: 'Powell Industries wins $180M data-center switchgear contract; backlog hits all-time high.',
  },
  {
    sym: 'PLTR',
    name: 'Palantir Tech.',
    price: 32.77,
    changePct: -1.52,
    spark: genSpark(7, -0.3),
    news: 'Palantir slides on defense-budget resolution uncertainty despite AIP customer growth.',
  },
  {
    sym: 'RGTI',
    name: 'Rigetti Computing',
    price: 14.09,
    changePct: 4.61,
    spark: genSpark(11, 0.6),
    news: 'Rigetti demonstrates 99.5% 2-qubit gate fidelity on Ankaa-3; shares pop pre-market.',
  },
];

function StocksPanel() {
  return (
    <section className="panel panel-stocks">
      <div className="panel-head">
        <div>
          <div className="panel-label">IV · Markets</div>
          <div className="panel-title">Watchlist</div>
        </div>
        <div className="panel-meta">Pre-market · {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="stocks-grid">
        {STOCKS.map(s => {
          const up = s.changePct >= 0;
          return (
            <div className="stock-card" key={s.sym}>
              <div>
                <div className="stock-top">
                  <div className="stock-sym">{s.sym}</div>
                  <div className={`stock-chip ${up ? 'up' : 'down'}`}>
                    {up ? '▲' : '▼'} {Math.abs(s.changePct).toFixed(2)}%
                  </div>
                </div>
                <div className="stock-price">${s.price.toFixed(2)}</div>
              </div>
              <Sparkline data={s.spark} up={up} />
              <div className="stock-news">{s.news}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- WINDOW ----------
function PopupWindow({ onClose }) {
  const [pos, setPos] = useState({ x: null, y: null }); // null = centered
  const dragRef = useRef(null);
  const windowRef = useRef(null);

  const onPointerDown = useCallback((e) => {
    if (e.target.closest('.tb-btn')) return; // don't drag from buttons
    const rect = windowRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
      w: rect.width,
      h: rect.height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const { startX, startY, origX, origY, w, h } = dragRef.current;
    const nx = origX + (e.clientX - startX);
    const ny = origY + (e.clientY - startY);
    // keep some of the window visible
    const clampedX = Math.max(-w + 100, Math.min(window.innerWidth - 100, nx));
    const clampedY = Math.max(0, Math.min(window.innerHeight - 40, ny));
    setPos({ x: clampedX, y: clampedY });
  }, []);

  const onPointerUp = useCallback((e) => {
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
  }, []);

  const centered = pos.x === null;
  const style = centered
    ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
    : { left: pos.x + 'px', top: pos.y + 'px' };

  return (
    <div
      ref={windowRef}
      className="window opening"
      style={style}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <TitleBar onClose={onClose} onPointerDown={onPointerDown} />
      <div className="window-body">
        <NewsPanel />
        <WeatherPanel />
        <TodoPanel />
        <StocksPanel />
      </div>
      <div className="statusbar">
        <span><span className="sb-dot" />Connected</span>
        <span>Google Calendar · synced</span>
        <span>Reuters · Al Jazeera · AP</span>
        <span className="spacer" />
        <span>v1.0.0</span>
      </div>
    </div>
  );
}

// ---------- TWEAKS ----------
const ACCENTS = [
  '#ff7a5c', // coral (default)
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
];

function TweaksPanel({ open, tweaks, setTweaks }) {
  const updateKey = (k, v) => {
    setTweaks(t => {
      const next = { ...t, [k]: v };
      try {
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      } catch (_) {}
      return next;
    });
  };

  return (
    <div className={`tweaks ${open ? 'open' : ''}`}>
      <div className="tweaks-title">
        Tweaks <span className="mono">LIVE</span>
      </div>

      <div className="tweak-row">
        <div className="tweak-label">Theme</div>
        <div className="seg">
          {['light', 'dark', 'retro'].map(th => (
            <button
              key={th}
              className={tweaks.theme === th ? 'active' : ''}
              onClick={() => updateKey('theme', th)}
            >{th[0].toUpperCase() + th.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <div className="tweak-label">Accent</div>
        <div className="accent-row">
          {ACCENTS.map(c => (
            <div
              key={c}
              className={`accent-swatch ${tweaks.accent === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => updateKey('accent', c)}
            />
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <div className="tweak-label">
          Wooper speed <span className="val">{tweaks.wooperSpeedSec}s</span>
        </div>
        <input
          type="range"
          className="slider"
          min="1.5" max="15" step="0.5"
          value={tweaks.wooperSpeedSec}
          onChange={(e) => updateKey('wooperSpeedSec', parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

// ---------- APP ----------
function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState(window.__TWEAKS__);

  // apply tweaks to :root
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-light', 'theme-dark', 'theme-retro');
    html.classList.add('theme-' + tweaks.theme);
    html.style.setProperty('--accent', tweaks.accent);
    // derive accent-soft from accent
    const soft = hexToRgba(tweaks.accent, 0.12);
    html.style.setProperty('--accent-soft', soft);
    html.style.setProperty('--wooper-speed', tweaks.wooperSpeedSec + 's');
  }, [tweaks]);

  // tweak mode wiring — listener FIRST, then announce
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (_) {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleReopen = () => setIsOpen(true);

  return (
    <>
      {isOpen && <PopupWindow key="w" onClose={handleClose} />}
      {!isOpen && (
        <button className="reopen-btn" onClick={handleReopen}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          Reopen Morning Brief
        </button>
      )}
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
    </>
  );
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
