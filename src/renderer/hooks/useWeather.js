import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
const LAT     = import.meta.env.VITE_LATITUDE  || '47.6553'
const LON     = import.meta.env.VITE_LONGITUDE || '-122.3035'
const UNIT    = import.meta.env.VITE_TEMP_UNIT || 'imperial'
const REFRESH_MS = 30 * 60 * 1000

function degToCompass(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function parseForecast(data) {
  const items = data.list.slice(0, 9)
  const first = items[0]

  const allTemps = items.flatMap(i => [i.main.temp_max, i.main.temp_min])
  const tempMax = Math.round(Math.max(...allTemps))
  const tempMin = Math.round(Math.min(...allTemps))

  return {
    current: {
      temp:        Math.round(first.main.temp),
      feelsLike:   Math.round(first.main.feels_like),
      tempMax,
      tempMin,
      description: first.weather[0].description,
      icon:        first.weather[0].icon,
      humidity:    first.main.humidity,
      windSpeed:   Math.round(first.wind?.speed ?? 0),
      windDir:     degToCompass(first.wind?.deg ?? 0),
    },
    hourly: items.map(item => ({
      time:        new Date(item.dt * 1000),
      temp:        Math.round(item.main.temp),
      description: item.weather[0].description,
      icon:        item.weather[0].icon,
      pop:         Math.round((item.pop ?? 0) * 100),
    })),
  }
}

export function useWeather() {
  const [current, setCurrent]     = useState(null)
  const [hourly, setHourly]       = useState([])
  const [cityName, setCityName]   = useState('')
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchWeather = async () => {
    if (!API_KEY) {
      setError('No API key configured')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=${UNIT}&cnt=9`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`OWM ${res.status}`)
      const data = await res.json()
      const parsed = parseForecast(data)
      setCurrent(parsed.current)
      setHourly(parsed.hourly)
      setCityName(data.city?.name || 'Your Location')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const id = setInterval(fetchWeather, REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  return { current, hourly, cityName, loading, error }
}
