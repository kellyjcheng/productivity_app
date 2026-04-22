import { useState, useEffect } from 'react'
import Weather from './components/Weather.jsx'
import TodoList from './components/TodoList.jsx'
import News from './components/News.jsx'
import Wooper from './components/Wooper.jsx'
import './styles/globals.css'

export default function App() {
  const [startupEnabled, setStartupEnabled] = useState(false)

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getStartupEnabled().then(setStartupEnabled).catch(() => {})
    }
  }, [])

  const handleStartupToggle = async (e) => {
    const enabled = e.target.checked
    setStartupEnabled(enabled)
    if (window.electronAPI) {
      await window.electronAPI.toggleStartup(enabled)
    }
  }

  return (
    <div className="app">
      <Wooper windowWidth={420} windowHeight={720} />

      <div className="title-bar" style={{ WebkitAppRegion: 'drag' }}>
        <span className="title-bar-name">Wooper Dashboard</span>
        <div className="title-bar-controls" style={{ WebkitAppRegion: 'no-drag' }}>
          <label className="startup-toggle">
            <input
              type="checkbox"
              checked={startupEnabled}
              onChange={handleStartupToggle}
            />
            <span className="startup-label">On startup</span>
          </label>
          <button
            className="title-btn"
            onClick={() => window.electronAPI?.minimizeWindow()}
            title="Minimize"
          >
            —
          </button>
          <button
            className="title-btn title-btn-close"
            onClick={() => window.electronAPI?.closeWindow()}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="content">
        <Weather />
        <TodoList />
        <News />
      </div>
    </div>
  )
}
