# Wooper Dashboard

A tiny always-available desktop dashboard with weather, todos, news, and a dancing Wooper.

Built with Electron + React + Vite.

---

## Prerequisites

- Node.js 18+
- npm 9+

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

Then fill in your API keys in `.env`:

| Variable | Where to get it |
|---|---|
| `VITE_OWM_API_KEY` | Free at [openweathermap.org](https://openweathermap.org/api) |
| `VITE_LATITUDE` / `VITE_LONGITUDE` | Your coordinates (decimal degrees) |
| `VITE_OWM_TIER` | `forecast` (free) or `onecall` (paid) |
| `VITE_TEMP_UNIT` | `imperial` (°F) or `metric` (°C) |
| `VITE_GNEWS_API_KEY` | Free at [gnews.io](https://gnews.io) |

### 3. Add Wooper

Drop a `wooper.gif` into `src/renderer/assets/wooper/`.  
You can find animated Pokémon sprites at [pkparaiso.com](https://www.pkparaiso.com/imagenes/xy/sprites/animados/wooper.gif).

---

## Running

### Development mode

```bash
npm run dev
```

This launches the Electron window with hot-reload via Vite.

### Build a distributable installer

```bash
npm run dist
```

Output goes to `dist-electron/`. On Windows this produces an NSIS `.exe` installer.

---

## For teammates cloning fresh

```bash
git clone <repo-url>
cd productivity-app
npm install
cp .env.example .env
# Edit .env and fill in your API keys
npm run dev
```

---

## Features

- **News** — Live headlines from GNews with 7 category filters. Auto-refreshes every 10 minutes.
- **Weather** — 9-hour forecast from OpenWeatherMap. Refreshes every 30 minutes.
- **Todos** — Persisted via electron-store (falls back to localStorage in browser).
- **Stocks** — Watchlist with sparklines (static demo data).
- **Wooper** — Slides across the title bar. Speed adjustable in the Tweaks panel.
- **Tweaks** — Press `Ctrl+,` or click `⚙ v1.0.0` in the status bar: switch themes (light/dark/retro), change accent color, adjust Wooper speed, toggle launch-on-startup.

---

## App structure

```
src/
  main/         Electron main process + auto-launch
  renderer/
    hooks/      useWeather, useNews, useTodos
    components/ Legacy component files (not active in current design)
    styles/     globals.css — full design system
    App.jsx     Main UI — Morning Brief dashboard
```
