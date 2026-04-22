import { useState, useEffect, useCallback } from 'react'

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY
const REFRESH_MS = 10 * 60 * 1000

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function useNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNews = useCallback(async () => {
    if (!API_KEY || API_KEY === 'your_gnews_api_key_here') {
      setError('No API key configured')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const url = `https://gnews.io/api/v4/top-headlines?lang=en&max=8&token=${API_KEY}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      setArticles((data.articles || []).map(a => ({
        title: a.title,
        source: { name: a.source?.name || 'Unknown' },
        publishedAt: a.publishedAt,
        timeAgo: timeAgo(a.publishedAt),
        url: a.url
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchNews])

  return { articles, loading, error, refresh: fetchNews }
}
