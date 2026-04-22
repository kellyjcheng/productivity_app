/**
 * CLAUDE CODE INSTRUCTIONS — useNews.js
 *
 * Custom React hook for fetching breaking news from GNews API.
 *
 * RETURNS: { articles, loading, error, refresh }
 *
 * IMPLEMENTATION:
 * 1. API key from: import.meta.env.VITE_GNEWS_API_KEY
 * 2. Fetch endpoint:
 *    https://gnews.io/api/v4/top-headlines?lang=en&max=8&token={key}
 * 3. Parse response.articles into:
 *    [{ title, source: { name }, publishedAt, url }]
 * 4. Expose a `refresh` function the News component can call.
 * 5. Auto-refresh every 10 minutes using setInterval.
 * 6. Handle loading and error states.
 */