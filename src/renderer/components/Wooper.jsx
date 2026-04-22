/**
 * CLAUDE CODE INSTRUCTIONS — Wooper.jsx
 *
 * An animated Wooper sprite that wanders randomly around the app window.
 *
 * PROPS:
 *  - windowWidth: number  (e.g. 420)
 *  - windowHeight: number (e.g. 720)
 *
 * BEHAVIOR:
 * 1. Render an <img> with src pointing to '/assets/wooper/wooper.gif'
 *    (or import it directly: import wooperGif from '../../assets/wooper/wooper.gif')
 *    Size: 48×48px.
 * 2. Position: absolute, z-index: 999, pointer-events: none (so it doesn't block clicks).
 * 3. Movement logic using useEffect + setInterval:
 *    - Every 2000ms pick a new random (x, y) target within window bounds
 *      (account for 48px sprite size so it doesn't go off-edge).
 *    - Smoothly transition to the new position using CSS transition:
 *      'left 1.8s ease-in-out, top 1.8s ease-in-out'
 *    - Flip the sprite horizontally (scaleX(-1)) when moving left vs right.
 * 4. Use useState for { x, y, facingLeft }.
 * 5. Clean up interval on unmount.
 *
 * Import './Wooper.css' for any additional animation styles.
 *
 * NOTE: The user needs to supply a wooper.gif (or .png sprite sheet).
 * A suitable animated Wooper GIF can be found on resources like
 * pkparaiso.com or similar Pokémon sprite repositories.
 * Place it at: src/assets/wooper/wooper.gif
 */