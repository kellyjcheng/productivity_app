/**
 * CLAUDE CODE INSTRUCTIONS — electron.vite.config.js
 *
 * Configure electron-vite for the project.
 *
 * TASKS:
 * 1. Import { defineConfig } from 'electron-vite'.
 * 2. Import react from '@vitejs/plugin-react'.
 * 3. Export a config with:
 *    - main: { build: { rollupOptions: { input: 'src/main/main.js' } } }
 *    - preload: { build: { rollupOptions: { input: 'src/main/preload.js' } } }
 *    - renderer: {
 *        plugins: [react()],
 *        build: { rollupOptions: { input: 'src/renderer/index.html' } }
 *      }
 * 4. For the renderer, set resolve.alias so '@' maps to 'src/renderer'.
 */