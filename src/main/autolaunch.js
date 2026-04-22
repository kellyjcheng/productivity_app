/**
 * CLAUDE CODE INSTRUCTIONS — autolaunch.js
 *
 * Handles system startup registration using the `auto-launch` npm package.
 *
 * TASKS:
 * 1. Import AutoLaunch from 'auto-launch'.
 * 2. Create an AutoLaunch instance:
 *    { name: 'Wooper Dashboard', path: app.getPath('exe') }
 * 3. Export two async functions:
 *    - enableStartup()  → calls autoLauncher.enable()
 *    - disableStartup() → calls autoLauncher.disable()
 *    - isStartupEnabled() → returns autoLauncher.isEnabled() (boolean)
 * 4. Wrap all calls in try/catch and log errors to console.
 */