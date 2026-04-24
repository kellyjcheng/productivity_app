import { useState, useEffect, useCallback } from 'react'

const LAT = import.meta.env.VITE_LATITUDE  || '47.6562'
const LON = import.meta.env.VITE_LONGITUDE || '-122.3101'
const IS_METRIC = import.meta.env.VITE_TEMP_UNIT === 'metric'
const TEMP_UNIT = IS_METRIC ? 'celsius' : 'fahrenheit'
const WIND_UNIT = IS_METRIC ? 'kmh' : 'mph'
const REFRESH_MS = 30 * 60 * 1000

const WMO_DESC = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Thunderstorm w/ hail',
}

// timeStr and sunrises/sunsets are all local-time ISO strings ("2024-01-15T07:32")
// so string comparison is safe within the same timezone
function wmoToIcon(code, timeStr, sunrises, sunsets) {
  let isDay = true
  if (sunrises?.length && sunsets?.length) {
    const date = timeStr.slice(0, 10)
    const dayIdx = sunrises.findIndex(sr => sr.startsWith(date))
    if (dayIdx >= 0) {
      isDay = timeStr >= sunrises[dayIdx] && timeStr < sunsets[dayIdx]
    }
  }
  if (code === 0) return isDay ? '01' : '00'   // clear: sun or moon
  if (code <= 2)  return isDay ? '02' : '06'   // partly: sun-cloud or moon-cloud
  if (code === 3) return '04'
  if (code <= 48) return '04'
  if (code <= 67) return '10'
  if (code <= 77) return '13'
  if (code <= 82) return '09'
  if (code <= 86) return '13'
  return '11'
}

function degToCompass(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function fmtSunTime(isoStr) {
  if (!isoStr) return ''
  const [, time] = isoStr.split('T')
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function useWeather() {
  const [current, setCurrent]   = useState(null)
  const [hourly, setHourly]     = useState([])
  const [cityName, setCityName] = useState('')
  const [sunrise, setSunrise]   = useState('')
  const [sunset, setSunset]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${LAT}&lon=${LON}&format=json`,
      { headers: { 'User-Agent': 'WooperDashboard/1.0' } }
    )
      .then(r => r.json())
      .then(d => setCityName(d.address?.city || d.address?.town || d.address?.county || 'Your Location'))
      .catch(() => setCityName('Your Location'))
  }, [])

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = [
        'https://api.open-meteo.com/v1/forecast',
        `?latitude=${LAT}&longitude=${LON}`,
        `&hourly=temperature_2m,apparent_temperature,weathercode,precipitation_probability`,
        `,windspeed_10m,winddirection_10m,relative_humidity_2m`,
        `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset`,
        `&temperature_unit=${TEMP_UNIT}&windspeed_unit=${WIND_UNIT}`,
        `&forecast_days=2&timezone=auto`,
      ].join('')

      const res = await fetch(url)
      if (!res.ok) throw new Error(`Weather ${res.status}`)
      const data = await res.json()

      const h = data.hourly
      const times = h.time
      const sunrises = data.daily.sunrise   // ["2024-01-15T07:32", "2024-01-16T07:33"]
      const sunsets  = data.daily.sunset    // ["2024-01-15T17:45", "2024-01-16T17:46"]

      // Set today's sunrise/sunset for display
      setSunrise(fmtSunTime(sunrises[0]))
      setSunset(fmtSunTime(sunsets[0]))

      // Find the slot for the current hour
      const now = new Date()
      const nowHourStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:00`
      let idx = times.indexOf(nowHourStr)
      if (idx < 0) idx = 0

      const code = h.weathercode[idx]
      setCurrent({
        temp:        Math.round(h.temperature_2m[idx]),
        feelsLike:   Math.round(h.apparent_temperature[idx]),
        tempMax:     Math.round(data.daily.temperature_2m_max[0]),
        tempMin:     Math.round(data.daily.temperature_2m_min[0]),
        description: WMO_DESC[code] ?? 'Unknown',
        icon:        wmoToIcon(code, times[idx], sunrises, sunsets),
        humidity:    h.relative_humidity_2m[idx],
        windSpeed:   Math.round(h.windspeed_10m[idx]),
        windDir:     degToCompass(h.winddirection_10m[idx]),
      })

      const hourlySlots = []
      for (let j = 0; j < 9; j++) {
        const i = idx + j
        if (i >= times.length) break
        const c = h.weathercode[i]
        hourlySlots.push({
          time: new Date(times[i]),
          timeStr: times[i],
          temp: Math.round(h.temperature_2m[i]),
          description: WMO_DESC[c] ?? 'Unknown',
          icon: wmoToIcon(c, times[i], sunrises, sunsets),
          pop: h.precipitation_probability[i] ?? 0,
        })
      }
      setHourly(hourlySlots)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh])

  return { current, hourly, cityName, sunrise, sunset, loading, error, refresh }
}
