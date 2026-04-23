import { useState, useEffect, useCallback } from 'react'

const API_KEY    = import.meta.env.VITE_GNEWS_API_KEY
const REFRESH_MS = 10 * 60 * 1000

export const CATEGORIES = [
  { label: 'General',       topic: null            },
  { label: 'Tech',          topic: 'technology'    },
  { label: 'Business',      topic: 'business'      },
  { label: 'Science',       topic: 'science'       },
  { label: 'Health',        topic: 'health'        },
  { label: 'Sports',        topic: 'sports'        },
  { label: 'Entertainment', topic: 'entertainment' },
]

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function useNews() {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [articles, setArticles]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  const fetchNews = useCallback(async () => {
    if (!API_KEY) {
      setError('No API key configured')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const { topic } = CATEGORIES[categoryIndex]
      const base = `https://gnews.io/api/v4/top-headlines?lang=en&max=8&token=${API_KEY}`
      const url  = topic ? `${base}&topic=${topic}` : base
      const res  = await fetch(url)
      if (!res.ok) throw new Error(`GNews ${res.status}`)
      const data = await res.json()
      setArticles((data.articles || []).map(a => ({
        title:       a.title,
        sourceName:  a.source?.name || 'Unknown',
        publishedAt: a.publishedAt,
        timeAgo:     timeAgo(a.publishedAt),
        url:         a.url,
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [categoryIndex])

  useEffect(() => {
    fetchNews()
    const id = setInterval(fetchNews, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchNews])

  return {
    articles,
    loading,
    error,
    refresh:       fetchNews,
    categoryIndex,
    setCategoryIndex,
  }
}
