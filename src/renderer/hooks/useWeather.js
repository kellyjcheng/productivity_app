import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
const LAT = import.meta.env.VITE_LATITUDE || '40.7128'
const LON = import.meta.env.VITE_LONGITUDE || '-74.0060'
const TIER = import.meta.env.VITE_OWM_TIER || 'forecast'
const UNIT = import.meta.env.VITE_TEMP_UNIT || 'imperial'
const REFRESH_MS = 30 * 60 * 1000

function parseForecast(data) {
  return data.list.slice(0, 3).map(item => ({
    time: new Date(item.dt * 1000),
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon
  }))
}

function parseOneCall(data) {
  return data.hourly.slice(0, 9).map(item => ({
    time: new Date(item.dt * 1000),
    temp: Math.round(item.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon
  }))
}

export function useWeather() {
  const [hourlyData, setHourlyData] = useState([])
  const [cityName, setCityName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeather = async () => {
    if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
      setError('No API key configured')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      if (TIER === 'onecall') {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=${UNIT}&exclude=minutely,daily,alerts`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()
        setHourlyData(parseOneCall(data))
        setCityName('Your Location')
      } else {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=${UNIT}&cnt=3`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()
        setHourlyData(parseForecast(data))
        setCityName(data.city?.name || 'Your Location')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, REFRESH_MS)
    return () => clearInterval(interval)
  }, [])

  return { hourlyData, cityName, loading, error }
}
