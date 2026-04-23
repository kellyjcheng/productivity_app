import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import Store from 'electron-store'
import { enableStartup, disableStartup, isStartupEnabled } from './autolaunch.js'

const store = new Store({
  schema: {
    todos: { type: 'array', default: [] }
  }
})

const STOCK_SYMBOLS = ['NDAQ', 'POWL', 'PLTR', 'RGTI', 'MU', 'CRWD', 'META', 'AMD']

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

ipcMain.handle('get-stock-quotes', async () => {
  const symbols = STOCK_SYMBOLS.join(',')
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
    },
  })

  if (!res.ok) throw new Error(`Yahoo Finance ${res.status}`)

  const data = await res.json()
  const results = data?.quoteResponse?.result
  if (!Array.isArray(results)) throw new Error('Invalid stock quote response')

  const bySymbol = new Map(results.map((quote) => [quote.symbol, quote]))

  return STOCK_SYMBOLS.map((symbol) => {
    const quote = bySymbol.get(symbol)
    if (!quote || typeof quote.regularMarketPrice !== 'number') {
      throw new Error(`Missing quote for ${symbol}`)
    }

    const change = typeof quote.regularMarketChange === 'number' ? quote.regularMarketChange : 0
    const changePct = typeof quote.regularMarketChangePercent === 'number' ? quote.regularMarketChangePercent : 0

    return {
      sym: symbol,
      price: quote.regularMarketPrice,
      change,
      changePct,
      news: `Day change ${change >= 0 ? '+' : '-'}$${Math.abs(change).toFixed(2)}`,
    }
  })
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
