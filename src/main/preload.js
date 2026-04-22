/**
 * CLAUDE CODE INSTRUCTIONS — preload.js
 *
 * Exposes a safe IPC bridge to the renderer via contextBridge.
 *
 * TASKS:
 * Expose window.electronAPI with the following methods (all return Promises):
 *  - getTodos()             → ipcRenderer.invoke('get-todos')
 *  - saveTodos(todos)       → ipcRenderer.invoke('save-todos', todos)
 *  - toggleStartup(enable)  → ipcRenderer.invoke('toggle-startup', enable)
 *  - getStartupEnabled()    → ipcRenderer.invoke('get-startup')
 *  - closeWindow()          → ipcRenderer.send('close-window')
 *  - minimizeWindow()       → ipcRenderer.send('minimize-window')
 *
 * Use contextBridge.exposeInMainWorld('electronAPI', { ... })
 * Import contextBridge and ipcRenderer from 'electron'.
 */