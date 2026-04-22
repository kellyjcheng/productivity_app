/**
 * CLAUDE CODE INSTRUCTIONS — useWeather.js
 *
 * Custom React hook for fetching hourly weather from OpenWeatherMap.
 *
 * RETURNS: { hourlyData, cityName, loading, error }
 *
 * IMPLEMENTATION:
 * 1. API key from: import.meta.env.VITE_OWM_API_KEY
 * 2. User's lat/lon from: import.meta.env.VITE_LATITUDE and VITE_LONGITUDE
 *    (user must set these in .env — see .env.example)
 * 3. Fetch endpoint (One Call API 3.0 or Forecast):
 *    Use the 5-day/3-hour forecast endpoint as fallback (free tier):
 *    https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={key}&units=imperial&cnt=3
 *    Note: "cnt=3" gives 3 entries × 3hrs = 9 hours ahead.
 *    Alternatively, if the user has One Call API 3.0 access:
 *    https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={key}&units=imperial&exclude=minutely,daily,alerts
 *    Then slice hourly to first 9 entries.
 *    DETECT which API to use based on import.meta.env.VITE_OWM_TIER ('onecall' | 'forecast', default 'forecast').
 * 4. Parse response into array of { time: Date, temp, description, icon } objects.
 * 5. Refresh every 30 minutes.
 * 6. Handle loading and error states.
 */