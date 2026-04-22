import { useNews } from '../hooks/useNews.js'
import '../styles/News.css'

export default function News() {
  const { articles, loading, error, refresh } = useNews()

  const openArticle = (url) => {
    window.open(url, '_blank')
  }

  return (
    <section className="news-section">
      <h2 className="section-header">
        News
        <button className="news-refresh-btn" onClick={refresh} title="Refresh">↻</button>
      </h2>

      {loading && <p className="news-status">Loading news...</p>}

      {!loading && error && (
        <div className="news-error">
          {error === 'No API key configured' ? (
            <p>Add VITE_GNEWS_API_KEY to .env to see news.</p>
          ) : (
            <p>
              Couldn't load news.{' '}
              <button className="news-retry" onClick={refresh}>Retry</button>
            </p>
          )}
        </div>
      )}

      {!loading && !error && (
        <ul className="news-list">
          {articles.length === 0 && (
            <li className="news-empty">No news available.</li>
          )}
          {articles.map((article, i) => (
            <li key={i} className="news-item" onClick={() => openArticle(article.url)}>
              <p className="news-title">{article.title}</p>
              <span className="news-meta">{article.source.name} · {article.timeAgo}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
