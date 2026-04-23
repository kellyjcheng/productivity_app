import { useState, useEffect, useCallback } from 'react'

const REFRESH_MS = 5 * 60 * 1000

export function useStocks() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshTime, setRefreshTime] = useState(new Date())

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const quotes = await window.electronAPI?.getStockQuotes?.()
      if (!Array.isArray(quotes)) throw new Error('Stock quotes unavailable')
      setStocks(quotes)
      setRefreshTime(new Date())
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

  return {
    stocks,
    loading,
    error,
    refresh,
    refreshTime,
  }
}
