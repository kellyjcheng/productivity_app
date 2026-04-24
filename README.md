# Wooper Dashboard

A personal desktop dashboard built with Electron + React + Vite. Aggregates real-time news, weather, tasks, and stock market data into a single always-available window.

---

## Features

- **Breaking News** — Live headlines from GNews with 7 category filters. Auto-refreshes every 10 minutes. Click any article to open it in your browser.
- **Weather** — Hourly forecast (1-hour resolution) via Open-Meteo. Shows current conditions, feels-like, wind, humidity, precipitation, and sunrise/sunset times. Icons switch between sun and moon based on time of day.
- **To-Do** — Tasks persisted via electron-store (falls back to localStorage in browser).
- **Market Watchlist** — Real-time stock quotes and recent company news headlines via Finnhub. Refreshes every 5 minutes.
- **Wooper** — Slides across the title bar. Speed adjustable in the Tweaks panel.
- **Tweaks** — Press `Ctrl+,` or click `⚙ v1.0.0` in the status bar: switch themes (light/dark/retro), change accent color, adjust Wooper speed, toggle launch-on-startup.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 28 |
| UI | React 18 + Vite 5 |
| Build tooling | electron-vite v2 |
| Persistence | electron-store |
| News API | GNews (free tier) |
| Weather API | Open-Meteo (free, no key) + Nominatim reverse geocode |
| Stocks API | Finnhub (free tier) |
| AI assistant | Claude (Anthropic) via Claude Code |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your API keys in `.env`:

| Variable | Where to get it |
|---|---|
| `VITE_OWM_API_KEY` | Free at [openweathermap.org](https://openweathermap.org/api) (legacy, no longer used for main weather fetch) |
| `VITE_LATITUDE` / `VITE_LONGITUDE` | Your coordinates in decimal degrees |
| `VITE_TEMP_UNIT` | `imperial` (°F) or `metric` (°C) |
| `VITE_GNEWS_API_KEY` | Free at [gnews.io](https://gnews.io) |
| `VITE_YAHOO_FINANCE_API_KEY` | Free at [finnhub.io](https://finnhub.io) (despite the variable name, this is a Finnhub key) |

### 3. Add Wooper

Drop a `wooper.gif` into `src/renderer/assets/wooper/`. Animated Pokémon sprites can be found at [pkparaiso.com](https://www.pkparaiso.com).

---

## Running

### Development

```bash
npm run dev
```

Launches the Electron window with hot-reload via Vite.

### Build a distributable

```bash
npm run build && npm run dist
```

Produces a portable `Wooper Dashboard x.x.x.exe` in `dist-electron/`. No installer needed — right-click the exe and send a shortcut to your desktop. Close the app before rebuilding.

---

## App Structure

```
src/
  main/
    main.js         Electron main process — window creation, IPC handlers, stock/weather fetch
    preload.js      Context bridge — exposes electronAPI to the renderer
    autolaunch.js   Launch-on-startup helper
  renderer/
    hooks/
      useWeather.js   Open-Meteo hourly fetch + Nominatim city name
      useNews.js      GNews fetch with category filtering
      useStocks.js    IPC call to main process for Finnhub quotes + news
      useTodos.js     electron-store persistence with localStorage fallback
    styles/
      globals.css     Full design system — 3 themes, all component styles
    App.jsx           Main UI — all panels, title bar, tweaks panel
    index.html        Font imports, theme/tweak defaults via window.__TWEAKS__
scripts/
  dev.js            Unsets ELECTRON_RUN_AS_NODE before spawning electron-vite
                    (required when launching from VS Code / Claude Code)
electron-builder.yml  Portable Windows build config
electron.vite.config.js  Vite config — bakes .env vars into main process at build time
```

---

## Development Process

This app was built entirely through an AI-assisted workflow using **Claude Code** (Anthropic's CLI agent). The process went through several distinct phases:

### Phase 1 — Scaffolding
The initial project was generated with electron-vite. The core layout (title bar, four panels, status bar) was designed in a single `App.jsx` with hardcoded placeholder data. A custom `scripts/dev.js` launcher was added early on to resolve a conflict between VS Code's `ELECTRON_RUN_AS_NODE` environment variable and Electron's module system.

### Phase 2 — Wiring real data
Each panel was progressively connected to a real data source:
- **News** (`useNews.js`) — GNews API with a 7-category filter system
- **Weather** (`useWeather.js`) — Started with OpenWeatherMap's forecast endpoint (3-hour intervals). Later migrated to Open-Meteo for true 1-hour resolution and no API key requirement
- **Todos** (`useTodos.js`) — electron-store with localStorage fallback for browser previews
- **Stocks** (`useStocks.js`) — Initially hardcoded sparklines, then attempted Yahoo Finance (hit a 401 after their API changed), then moved to Finnhub's free quote + company news endpoints

### Phase 3 — Git cleanup
An early commit accidentally included `node_modules/electron/dist/electron.exe` (168 MB), which blocked pushes to GitHub. This was fixed by resetting to the last clean remote commit, re-staging only source files, and force-committing cleanly.

### Phase 4 — Feature iteration
Features added iteratively in response to feedback:
- Time-based greeting (Good morning / afternoon / evening / night) with a crossfade animation
- Floating card UI removed so the app fills the Electron frame directly
- Stock refresh button with updated timestamp
- Roman numerals removed from panel labels
- Weather icons that switch between sun and moon based on actual sunrise/sunset times fetched from the Open-Meteo daily response
- Maximize/restore button wired to Electron's window API with icon state tracking
- Stock sparklines replaced with real per-company news headlines from Finnhub

### Phase 5 — Distribution
electron-builder was configured to produce a portable `.exe` (no NSIS installer, which avoided symlink permission errors on Windows without Developer Mode). A key issue was that `VITE_`-prefixed env vars aren't automatically injected into the Electron main process at build time — this was fixed by parsing `.env` directly in `electron.vite.config.js` and passing values through Vite's `define` option.

---

## Known Limitations

- Stock data is a 15-minute delayed quote (Finnhub free tier)
- Weather auto-refreshes every 30 minutes; click ↻ to refresh immediately
- News auto-refreshes every 10 minutes; click ↻ to refresh immediately
- The `VITE_YAHOO_FINANCE_API_KEY` variable name is a misnomer — it holds a Finnhub key
