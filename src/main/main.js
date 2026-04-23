import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import Store from 'electron-store'
import { enableStartup, disableStartup, isStartupEnabled } from './autolaunch.js'

const store = new Store({
  schema: {
    todos: { type: 'array', default: [] }
  }
})

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1220,
    height: 760,
    resizable: true,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    alwaysOnTop: false,
    transparent: false,
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/preload.js')
    }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../../dist/renderer/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

ipcMain.handle('get-todos', () => store.get('todos'))

ipcMain.handle('save-todos', (_, todos) => {
  store.set('todos', todos)
})

ipcMain.handle('toggle-startup', async (_, enable) => {
  if (enable) await enableStartup()
  else await disableStartup()
})

ipcMain.handle('get-startup', () => isStartupEnabled())

ipcMain.on('close-window', () => app.quit())

ipcMain.on('minimize-window', () => {
  if (win) win.minimize()
})
