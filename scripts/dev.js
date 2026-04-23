#!/usr/bin/env node
// Unsets ELECTRON_RUN_AS_NODE before launching electron-vite dev.
// This env var (often set by VS Code / Claude Code) causes Electron to start
// in Node.js compat mode, breaking require('electron') in the main process.
const { spawn } = require('child_process')
const { join } = require('path')

const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE

const ext = process.platform === 'win32' ? '.cmd' : ''
const bin = join(__dirname, '..', 'node_modules', '.bin', `electron-vite${ext}`)

const child = spawn(bin, ['dev'], { env, stdio: 'inherit', shell: process.platform === 'win32' })
child.on('close', (code) => process.exit(code ?? 0))
