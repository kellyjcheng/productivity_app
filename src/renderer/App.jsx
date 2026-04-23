import React, { useState, useEffect } from 'react'
import wooperGif from './assets/wooper/wooper.gif'
import { useWeather }           from './hooks/useWeather.js'
import { useNews, CATEGORIES }  from './hooks/useNews.js'
import { useStocks }            from './hooks/useStocks.js'
import { useTodos }             from './hooks/useTodos.js'
import './styles/globals.css'

// ---------- ICONS ----------
const IconX = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
)
const IconMinus = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <path d="M4 8h8" />
  </svg>
)
const IconMax = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <rect x="4" y="4" width="8" height="8" rx="1" />
  </svg>
)
const IconCheck = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 8.5l3.5 3.5L13 5" />
  </svg>
)
const IconCloud = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14 34h22a8 8 0 0 0 1-15.9A11 11 0 0 0 15 20a7 7 0 0 0-1 14z" fill="currentColor" fillOpacity="0.12" />
  </svg>
)
const IconCloudRain = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14 28h22a8 8 0 0 0 1-15.9A11 11 0 0 0 15 14a7 7 0 0 0-1 14z" fill="currentColor" fillOpacity="0.12" />
    <path d="M18 34l-2 6M26 34l-2 6M34 34l-2 6" />
  </svg>
)
const IconSun = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <circle cx="24" cy="24" r="8" fill="currentColor" fillOpacity="0.15" />
    <path d="M24 6v4M24 38v4M6 24h4M38 24h4M11 11l3 3M34 34l3 3M37 11l-3 3M14 34l-3 3" />
  </svg>
)
const IconPartly = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="18" cy="18" r="6" fill="currentColor" fillOpacity="0.15" />
    <path d="M18 8v2M18 26v2M8 18h2M26 18h2M11 11l1.5 1.5M23.5 23.5L25 25" />
    <path d="M20 36h16a6 6 0 0 0 .5-11.9A9 9 0 0 0 21 27a5 5 0 0 0-1 9z" fill="currentColor" fillOpacity="0.12" />
  </svg>
)
const IconSnow = (p) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <path d="M14 30h22a8 8 0 0 0 1-15.9A11 11 0 0 0 15 16a7 7 0 0 0-1 14z" fill="currentColor" fillOpacity="0.12" />
    <path d="M20 36l2 4M26 36l2 4M23 37v4" />
  </svg>
)

// OWM icon code → SVG component
function WeatherIcon({ code, ...props }) {
  const prefix = (code || '01').substring(0, 2)
  if (prefix === '01') return <IconSun {...props} />
  if (prefix === '02' || prefix === '03') return <IconPartly {...props} />
  if (prefix === '04') return <IconCloud {...props} />
  if (prefix === '09' || prefix === '10' || prefix === '11') return <IconCloudRain {...props} />
  if (prefix === '13') return <IconSnow {...props} />
  return <IconCloud {...props} />
}

function Sparkline({ data = [], up = true }) {
  const w = 100, h = 40
  if (!data.length) return null
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ])
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const stroke = up ? '#10b981' : '#ef4444'
  const fill = up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
  const areaD = d + ` L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`
  return (
    <svg className="stock-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={areaD} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------- WOOPER (title bar slide) ----------
function Wooper() {
  const [broken, setBroken] = useState(false)
  return (
    <div className="wooper-strip" aria-hidden="true">
      <div className="wooper">
        {!broken ? (
          <img
            src={wooperGif}
            alt=""
            onError={() => setBroken(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div className="wooper-fallback" title="Drop wooper.gif at src/renderer/assets/wooper/wooper.gif">
            WOOP
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- TITLE BAR ----------
function getTimePhase() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return { brief: 'Morning Brief',   greet: 'Good morning'   }
  if (h >= 12 && h < 17) return { brief: 'Afternoon Brief', greet: 'Good afternoon' }
  if (h >= 17 && h < 21) return { brief: 'Evening Brief',   greet: 'Good evening'   }
  return                         { brief: 'Night Brief',     greet: 'Good night'     }
}

function TitleBar() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const [greetFlip, setGreetFlip] = useState(false)
  const [phase, setPhase] = useState(getTimePhase)

  useEffect(() => {
    const id = setInterval(() => setGreetFlip(f => !f), 4200)
    return () => clearInterval(id)
  }, [])

  // Re-evaluate time phase every minute so it updates without a restart
  useEffect(() => {
    const id = setInterval(() => setPhase(getTimePhase()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="titlebar">
      <div className="titlebar-left">
        <div className="app-dot" />
        <div className="greet-wrap">
          <span className={`greet ${!greetFlip ? 'show' : 'hide'}`}>{phase.brief}</span>
          <span className={`greet ${greetFlip ? 'show' : 'hide'}`}>{phase.greet}</span>
        </div>
        <div className="app-sub">— {dateStr}</div>
      </div>
      <Wooper />
      <div className="titlebar-right">
        <button
          className="tb-btn"
          aria-label="Minimize"
          onClick={() => window.electronAPI?.minimizeWindow()}
        >
          <IconMinus />
        </button>
        <button className="tb-btn" aria-label="Maximize">
          <IconMax />
        </button>
        <button
          className="tb-btn"
          aria-label="Close"
          onClick={() => window.electronAPI?.closeWindow()}
        >
          <IconX />
        </button>
      </div>
    </div>
  )
}

// ---------- NEWS PANEL ----------
function NewsPanel() {
  const { articles, loading, error, refresh, categoryIndex, setCategoryIndex } = useNews()

  const openArticle = (url) => {
    if (url) window.open(url, '_blank')
  }

  return (
    <section className="panel panel-news">
      <div className="panel-head">
        <div>
          <div className="panel-label">I · World & Politics</div>
          <div className="panel-title">Breaking</div>
        </div>
        <div className="panel-meta" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Auto-refresh 10m</span>
          <button
            onClick={refresh}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 14, padding: 0,
              transition: 'color 0.2s',
            }}
            title="Refresh now"
          >↻</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="news-categories">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            className={`news-cat-btn${categoryIndex === i ? ' active' : ''}`}
            onClick={() => setCategoryIndex(i)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="panel-scroll">
        {loading && (
          <div className="news-lead">
            <div className="skeleton-line" style={{ width: '40%', height: 12, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: '90%', height: 18, marginBottom: 6 }} />
            <div className="skeleton-line" style={{ width: '60%', height: 10 }} />
          </div>
        )}

        {!loading && error && (
          <div className="news-lead">
            <p style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>
              {error === 'No API key configured'
                ? 'Add VITE_GNEWS_API_KEY to .env'
                : `News unavailable: ${error}`}
            </p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="news-lead">
            <p style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>
              No headlines found.
            </p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <div className="news-lead" onClick={() => openArticle(articles[0].url)} style={{ cursor: 'pointer' }}>
              <span className="news-tag live">LIVE</span>
              <h3 className="news-headline">{articles[0].title}</h3>
              <div className="news-source">{articles[0].sourceName} · {articles[0].timeAgo}</div>
            </div>
            {articles.slice(1).map((a, i) => (
              <div
                key={i}
                className="news-item"
                onClick={() => openArticle(a.url)}
                style={{ cursor: 'pointer' }}
              >
                <div className="news-time">{a.timeAgo}</div>
                <div className="news-item-title">{a.title}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  )
}

// ---------- WEATHER PANEL ----------
function WeatherPanel() {
  const { current, hourly, cityName, loading, error } = useWeather()
  const unitSymbol = import.meta.env.VITE_TEMP_UNIT === 'metric' ? '°C' : '°F'

  const fmtHour = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
  }

  return (
    <section className="panel panel-weather">
      <div className="panel-head">
        <div>
          <div className="panel-label">II · Weather</div>
          <div className="panel-title">{cityName || 'Loading…'}</div>
        </div>
        <div className="panel-meta">
          {current ? `${current.humidity}% humidity` : '—'}
        </div>
      </div>

      {loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>Loading weather…</p>
        </div>
      )}

      {!loading && error && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic', textAlign: 'center', padding: '0 8px' }}>
            {error === 'No API key configured'
              ? 'Add VITE_OWM_API_KEY to .env'
              : `Weather unavailable: ${error}`}
          </p>
        </div>
      )}

      {!loading && !error && current && (
        <>
          <div className="weather-main">
            <div>
              <div className="temp-big">
                {current.temp}<sup>{unitSymbol}</sup>
              </div>
              <div className="weather-cond" style={{ textTransform: 'capitalize' }}>
                {current.description}
              </div>
              <div className="weather-hi-lo">
                H {current.tempMax}{unitSymbol} · L {current.tempMin}{unitSymbol} · Feels {current.feelsLike}{unitSymbol}
              </div>
            </div>
            <div className="weather-icon">
              <WeatherIcon code={current.icon} width="72" height="72" />
            </div>
          </div>

          <div className="weather-stats">
            <div>
              <div className="wstat-label">Wind</div>
              <div className="wstat-value">{current.windSpeed} mph {current.windDir}</div>
            </div>
            <div>
              <div className="wstat-label">Humidity</div>
              <div className="wstat-value">{current.humidity}%</div>
            </div>
            <div>
              <div className="wstat-label">Precip</div>
              <div className="wstat-value">{hourly[0]?.pop ?? 0}%</div>
            </div>
          </div>

          <div className="hourly">
            {hourly.map((h, i) => (
              <div className={`hourly-slot${i === 0 ? ' now' : ''}`} key={i}>
                <div className="hr-label">{i === 0 ? 'Now' : fmtHour(h.time)}</div>
                <div className="hr-icon">
                  <WeatherIcon code={h.icon} width="22" height="22" />
                </div>
                <div className="hr-temp">{h.temp}°</div>
                <div className="hr-pop" style={{ opacity: h.pop >= 20 ? 1 : 0.35 }}>
                  <span className="hr-pop-dot" />{h.pop}%
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

// ---------- TO-DO PANEL ----------
function TodoPanel() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos()
  const [inputText, setInputText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return
    addTodo({ text: trimmed, dueDate: null })
    setInputText('')
  }

  const doneCount = todos.filter(t => t.completed).length

  return (
    <section className="panel panel-todo">
      <div className="panel-head">
        <div>
          <div className="panel-label">III · Tasks</div>
          <div className="panel-title">To-do</div>
        </div>
        <div className="panel-meta">{doneCount}/{todos.length} done</div>
      </div>

      <form onSubmit={handleSubmit} className="todo-add-form">
        <input
          className="todo-add-input"
          type="text"
          placeholder="Add a task…"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <button className="todo-add-submit" type="submit" aria-label="Add">+</button>
      </form>

      <div className="panel-scroll">
        <div className="todo-list">
          {todos.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic', padding: '8px 4px' }}>
              No tasks yet — add one above!
            </p>
          )}
          {todos.map(t => (
            <div
              key={t.id}
              className={`todo-item${t.completed ? ' done' : ''}`}
              onClick={() => toggleTodo(t.id)}
            >
              <div className="todo-check"><IconCheck /></div>
              <div className="todo-content">
                <div className="todo-title">{t.text}</div>
                {t.dueDate && (
                  <div className="todo-meta">
                    <span>Due {new Date(t.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>
              <button
                className="todo-item-delete"
                onClick={e => { e.stopPropagation(); deleteTodo(t.id) }}
                aria-label="Delete"
              >×</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- STOCKS ----------
function genSpark(seed, trend) {
  const arr = []
  let v = 100
  for (let i = 0; i < 24; i++) {
    const wiggle = (Math.sin(seed + i * 0.7) + Math.cos(seed * 1.3 + i * 0.4)) * 1.5
    v += wiggle + trend
    arr.push(v)
  }
  return arr
}

const STOCK_DEFS = [
  { sym: 'NDAQ', price: 78.42,  changePct:  0.84, seed: 1,  trend:  0.15, news: 'Nasdaq beats Q1 estimates on record trading volume; exchange revenue up 9% YoY.' },
  { sym: 'POWL', price: 241.18, changePct:  2.34, seed: 3,  trend:  0.45, news: 'Powell Industries wins $180M data-center switchgear contract; backlog hits all-time high.' },
  { sym: 'PLTR', price: 32.77,  changePct: -1.52, seed: 7,  trend: -0.30, news: 'Palantir slides on defense-budget resolution uncertainty despite AIP customer growth.' },
  { sym: 'RGTI', price: 14.09,  changePct:  4.61, seed: 11, trend:  0.60, news: 'Rigetti demonstrates 99.5% 2-qubit gate fidelity on Ankaa-3; shares pop pre-market.' },
]

function buildStocks(offset = 0) {
  return STOCK_DEFS.map(s => ({ ...s, spark: genSpark(s.seed + offset, s.trend) }))
}

function StocksPanel() {
  const { stocks, loading, error, refresh, refreshTime } = useStocks()
  return (
    <section className="panel panel-stocks">
      <div className="panel-head">
        <div>
          <div className="panel-label">IV · Markets</div>
          <div className="panel-title">Watchlist</div>
        </div>
        <div className="panel-meta stocks-meta">
          <span>{loading ? 'Loading…' : `Updated · ${refreshTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}</span>
          <button className="stocks-refresh-btn" onClick={refresh} title="Refresh charts" disabled={loading}>↻</button>
        </div>
      </div>
      {error && <div className="panel-error">{error}</div>}
      <div className="stocks-grid">
        {stocks.map(s => {
          const up = s.changePct >= 0
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
          )
        })}
      </div>
    </section>
  )
}

// ---------- TWEAKS PANEL ----------
const ACCENTS = ['#ff7a5c', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']

function TweaksPanel({ open, tweaks, setTweaks }) {
  const [startupEnabled, setStartupEnabled] = useState(false)

  useEffect(() => {
    if (!open) return
    window.electronAPI?.getStartupEnabled()
      .then(v => setStartupEnabled(!!v))
      .catch(() => {})
  }, [open])

  const updateKey = (k, v) => setTweaks(t => ({ ...t, [k]: v }))

  const handleStartupToggle = async (e) => {
    const val = e.target.checked
    setStartupEnabled(val)
    try { await window.electronAPI?.toggleStartup(val) } catch (_) {}
  }

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
            >
              {th[0].toUpperCase() + th.slice(1)}
            </button>
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
          onChange={e => updateKey('wooperSpeedSec', parseFloat(e.target.value))}
        />
      </div>

      {window.electronAPI && (
        <div className="tweak-row">
          <label className="startup-label-row">
            <input
              type="checkbox"
              checked={startupEnabled}
              onChange={handleStartupToggle}
            />
            <span>Launch on startup</span>
          </label>
        </div>
      )}
    </div>
  )
}

// ---------- HELPERS ----------
function hexToRgba(hex, a) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// ---------- APP ----------
export default function App() {
  const defaultTweaks = window.__TWEAKS__ || { theme: 'dark', accent: '#0ea5e9', wooperSpeedSec: 13.5 }
  const [tweaks, setTweaks]       = useState(defaultTweaks)
  const [tweaksOpen, setTweaksOpen] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('theme-light', 'theme-dark', 'theme-retro')
    html.classList.add('theme-' + tweaks.theme)
    html.style.setProperty('--accent', tweaks.accent)
    html.style.setProperty('--accent-soft', hexToRgba(tweaks.accent, 0.12))
    html.style.setProperty('--wooper-speed', tweaks.wooperSpeedSec + 's')
  }, [tweaks])

  // Ctrl+, toggles tweaks panel
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault()
        setTweaksOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="window opening">
        <TitleBar />
        <div className="window-body">
          <NewsPanel />
          <WeatherPanel />
          <TodoPanel />
          <StocksPanel />
        </div>
        <div className="statusbar">
          <span><span className="sb-dot" />Connected</span>
          <span>Todos synced</span>
          <span>Reuters · GNews · OWM</span>
          <span className="spacer" />
          <span
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setTweaksOpen(o => !o)}
            title="Tweaks (Ctrl+,)"
          >
            ⚙ v1.0.0
          </span>
        </div>
      </div>
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
    </>
  )
}
