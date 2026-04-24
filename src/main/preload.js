import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
  saveTodos: (todos) => ipcRenderer.invoke('save-todos', todos),
  getStockQuotes: () => ipcRenderer.invoke('get-stock-quotes'),
  toggleStartup: (enable) => ipcRenderer.invoke('toggle-startup', enable),
  getStartupEnabled: () => ipcRenderer.invoke('get-startup'),
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  onMaximized: (cb) => ipcRenderer.on('window-maximized', (_, val) => cb(val))
})
