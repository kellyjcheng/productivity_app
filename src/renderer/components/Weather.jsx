import { useWeather } from '../hooks/useWeather.js'
import '../styles/Weather.css'

const UNIT_SYMBOL = import.meta.env.VITE_TEMP_UNIT === 'metric' ? '°C' : '°F'

function formatHour(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
}

export default function Weather() {
  const { hourlyData, cityName, loading, error } = useWeather()

  return (
    <section className="weather-section">
      <h2 className="section-header">
        Weather
        {cityName && <span className="city-name">— {cityName}</span>}
      </h2>

      {loading && (
        <div className="weather-row">
          {[0, 1, 2].map(i => (
            <div key={i} className="weather-card skeleton" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="weather-error">
          {error === 'No API key configured'
            ? 'Add VITE_OWM_API_KEY to .env to see weather.'
            : `Weather unavailable: ${error}`}
        </p>
      )}

      {!loading && !error && hourlyData.length > 0 && (
        <div className="weather-row">
          {hourlyData.map((hour, i) => (
            <div key={i} className="weather-card">
              <span className="weather-time">{formatHour(hour.time)}</span>
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                alt={hour.description}
              />
              <span className="weather-temp">{hour.temp}{UNIT_SYMBOL}</span>
              <span className="weather-desc">{hour.description}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
