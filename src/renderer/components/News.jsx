/**
 * CLAUDE CODE INSTRUCTIONS — News.jsx
 *
 * Shows the latest breaking news headlines using the GNews API.
 *
 * PROPS: none (uses useNews hook)
 *
 * FEATURES:
 * 1. Import useNews from '../hooks/useNews'.
 * 2. Display a scrollable vertical list of up to 8 news items.
 *    Each item shows:
 *    - Headline (bold, truncated to 2 lines with ellipsis)
 *    - Source name + published time ("2 hours ago" format using date-fns or manual)
 *    - Clicking a headline opens it in the user's browser:
 *      use shell.openExternal from electron via a preload bridge,
 *      OR use window.open(url, '_blank') as fallback.
 * 3. Max height: 200px, overflow-y: auto.
 * 4. Auto-refreshes every 10 minutes.
 * 5. Loading state: show "Loading news..." text.
 * 6. Error state: show "Couldn't load news." with a Retry button.
 *
 * Import './News.css'.
 *
 * GNews API free endpoint:
 * https://gnews.io/api/v4/top-headlines?lang=en&token={VITE_GNEWS_API_KEY}
 */