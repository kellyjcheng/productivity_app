/**
 * CLAUDE CODE INSTRUCTIONS — Weather.jsx
 *
 * Shows hourly weather for the NEXT 9 HOURS using OpenWeatherMap API.
 *
 * PROPS: none (uses useWeather hook)
 *
 * FEATURES:
 * 1. Import useWeather from '../hooks/useWeather'.
 * 2. Display a HORIZONTAL scrollable row of hour cards.
 *    Each card shows:
 *    - Time (e.g. "3 PM")
 *    - Weather icon: use OpenWeatherMap icon URL:
 *      https://openweathermap.org/img/wn/{icon}@2x.png
 *    - Temperature in °F (or °C — read from .env VITE_TEMP_UNIT, default °F)
 *    - Short description (e.g. "Partly Cloudy")
 * 3. Show a loading skeleton while fetching.
 * 4. Show an error message if the API call fails.
 * 5. Show city name as the section header (from API response).
 *
 * Import './Weather.css'.
 */