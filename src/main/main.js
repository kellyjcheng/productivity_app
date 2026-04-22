/**
 * CLAUDE CODE INSTRUCTIONS — main.js (Electron Main Process)
 *
 * This is the entry point for the Electron app.
 *
 * TASKS:
 * 1. Create a BrowserWindow with:
 *    - width: 420, height: 720
 *    - resizable: true, minWidth: 360, minHeight: 500
 *    - frame: false (frameless; we'll add custom drag region in renderer)
 *    - alwaysOnTop: false (user can toggle via UI)
 *    - transparent: false
 *    - webPreferences: contextIsolation: true, preload: path to preload.js
 * 2. Load the Vite dev server in dev, or dist/renderer/index.html in prod.
 * 3. Register IPC handlers:
 *    - 'get-todos'      → read todos from electron-store
 *    - 'save-todos'     → write todos array to electron-store
 *    - 'toggle-startup' → call autolaunch.js enable/disable based on boolean arg
 *    - 'get-startup'    → return current autolaunch enabled state
 *    - 'close-window'   → app.quit()
 *    - 'minimize-window'→ win.minimize()
 * 4. Import and initialize autolaunch.js.
 * 5. Use electron-store (import Store from 'electron-store') for persistence.
 *    Store schema: { todos: { type: 'array', default: [] } }
 */