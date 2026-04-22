import { app } from 'electron'
import AutoLaunch from 'auto-launch'

let autoLauncher = null

function getLauncher() {
  if (!autoLauncher) {
    autoLauncher = new AutoLaunch({
      name: 'Wooper Dashboard',
      path: app.getPath('exe')
    })
  }
  return autoLauncher
}

export async function enableStartup() {
  try {
    await getLauncher().enable()
  } catch (err) {
    console.error('Failed to enable startup:', err)
  }
}

export async function disableStartup() {
  try {
    await getLauncher().disable()
  } catch (err) {
    console.error('Failed to disable startup:', err)
  }
}

export async function isStartupEnabled() {
  try {
    return await getLauncher().isEnabled()
  } catch (err) {
    console.error('Failed to check startup status:', err)
    return false
  }
}
