/**
 * CLAUDE CODE INSTRUCTIONS — App.jsx (Root React Component)
 *
 * This is the root layout of the app. The window is small (420×720px) and frameless.
 *
 * LAYOUT (top to bottom, all in one scrollable column):
 * ┌─────────────────────────────────────┐
 * │  [Custom Title Bar] drag region,    │
 * │  minimize + close buttons, startup  │
 * │  toggle checkbox                    │
 * ├─────────────────────────────────────┤
 * │  <Weather /> (hourly, next 9 hrs)   │
 * ├─────────────────────────────────────┤
 * │  <TodoList /> (scrollable)          │
 * ├─────────────────────────────────────┤
 * │  <News /> (scrollable headlines)    │
 * └─────────────────────────────────────┘
 *
 * WOOPER:
 * - <Wooper /> renders absolutely positioned OVER the entire app window.
 * - It should NOT be inside the column — it floats on top of everything.
 * - Pass the window dimensions (420, 720) as props so Wooper can bounce.
 *
 * STYLE NOTES:
 * - Dark theme. Background: #1a1a2e. Accent: #4fc3f7 (light blue).
 * - Import globals.css here.
 * - The title bar div must have style={{ WebkitAppRegion: 'drag' }} for frameless dragging.
 *   Buttons inside title bar must have style={{ WebkitAppRegion: 'no-drag' }}.
 *
 * STATE:
 * - startupEnabled (bool) — fetched via window.electronAPI.getStartupEnabled() on mount.
 * - Toggling the checkbox calls window.electronAPI.toggleStartup(bool).
 */