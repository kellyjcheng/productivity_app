import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import Store from 'electron-store'
import { enableStartup, disableStartup, isStartupEnabled } from './autolaunch.js'

const store = new Store({
  schema: {
    todos: { type: 'array', default: [] }
  }
})

const STOCK_SYMBOLS = ['NDAQ', 'POWL', 'PLTR', 'RGTI']
const STOCK_NEWS = {
  NDAQ: 'Nasdaq beats Q1 estimates on record trading volume; exchange revenue up 9% YoY.',
  POWL: 'Powell Industries wins $180M data-center switchgear contract; backlog hits all-time high.',
  PLTR: 'Palantir slides on defense-budget resolution uncertainty despite AIP customer growth.',
  RGTI: 'Rigetti demonstrates 99.5% 2-qubit gate fidelity on Ankaa-3; shares pop pre-market.',
}

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

  win.on('maximize',   () => win.webContents.send('window-maximized', true))
  win.on('unmaximize', () => win.webContents.send('window-maximized', false))

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

ipcMain.handle('get-stock-quotes', async () => {
  const token = process.env.VITE_YAHOO_FINANCE_API_KEY
  if (!token) throw new Error('VITE_YAHOO_FINANCE_API_KEY not set in .env')

  const toDate = new Date().toISOString().slice(0, 10)
  const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const results = await Promise.all(
    STOCK_SYMBOLS.map(async (sym) => {
      const [quote, newsItems] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${token}`).then(r => r.json()),
        fetch(`https://finnhub.io/api/v1/company-news?symbol=${sym}&from=${fromDate}&to=${toDate}&token=${token}`)
          .then(r => r.json()).catch(() => []),
      ])

      if (typeof quote.c !== 'number') throw new Error(`No quote for ${sym}`)

      const headlines = Array.isArray(newsItems)
        ? newsItems.slice(0, 4).map(n => ({ title: n.headline, url: n.url }))
        : []

      return {
        sym,
        price: quote.c,
        changePct: quote.dp ?? 0,
        headlines,
      }
    })
  )

  return results
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

ipcMain.on('maximize-window', () => {
  if (!win) return
  if (win.isMaximized()) win.restore()
  else win.maximize()
})
