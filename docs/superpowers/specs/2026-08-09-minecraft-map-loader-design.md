# Minecraft Map Loader — Design

## Goal
Get the Three.js scene actually rendering, with the downloaded Sketchfab
Minecraft `.glb` scene loaded in as the map, alongside the existing
hand-built `player`.

## Context
- `src/main.js` was a non-functional stub (`THREE.camera()` and
  `Renderer()` aren't real APIs — nothing rendered).
- `index.html` has `<canvas id="3d-portfolio-1">` for the renderer to
  bind to.
- `src/components/Player.js` already exports a hand-built low-poly
  `player` (a `THREE.Group`), added to the scene the same way `map.js`
  will be.
- Model asset: `src/assets/minecraft/source/Untitled.glb` (~7MB,
  glTF 2.0 binary, textures embedded in the file — the sibling
  `src/assets/minecraft/textures/` folder is Sketchfab's raw export and
  is not needed at runtime).

## Components

### `src/components/map.js` (new)
Mirrors `Player.js`'s module style. Exports an async function:

```js
export async function loadMap(scene) { ... }
```

Responsibilities:
1. Create an `AmbientLight` (soft fill) and a `DirectionalLight`
   (`castShadow = true`, shadow-camera frustum sized to cover the map),
   add both to `scene`.
2. Import the model via Vite's `?url` suffix:
   `import mapUrl from "../assets/minecraft/source/Untitled.glb?url"`.
3. Load it with `GLTFLoader`, wrapped in a `Promise` so the caller can
   `await` it.
4. Traverse the loaded scene graph; for every `Mesh`, set
   `castShadow = true` and `receiveShadow = true` (matching `Player.js`'s
   convention).
5. `scene.add(gltf.scene)` and return the loaded model.
6. On load failure, `console.error` a clear message and reject/resolve
   without throwing uncaught — the render loop must not depend on this
   succeeding.

### `src/main.js` (rewritten)
1. Grab the existing canvas: `document.getElementById("3d-portfolio-1")`.
2. Create `THREE.Scene`, `THREE.PerspectiveCamera` (sized to
   `window.innerWidth/innerHeight`), and
   `THREE.WebGLRenderer({ canvas, antialias: true })` with
   `renderer.shadowMap.enabled = true`.
3. `renderer.setSize(window.innerWidth, window.innerHeight)`.
4. `scene.add(player)`.
5. Call `loadMap(scene)` — **not** awaited before starting the render
   loop, so a slow/failed map load doesn't block the player from
   showing up. The map simply pops in once the promise resolves.
6. Start a `requestAnimationFrame` render loop.
7. Add a `resize` listener that updates camera aspect + renderer size.

### `Player.js`
Untouched.

## Error handling
- Map load failure: logged to console, scene still renders (player +
  lights only).
- No retry logic — out of scope for this pass.

## Testing / verification
Run `npm run dev`, open the page, confirm in-browser:
- No console errors.
- Canvas fills the viewport.
- Player mesh and Minecraft map are both visible and lit.
- Window resize doesn't distort the view.

## Out of scope
- Camera controls / movement.
- Player-map collision.
- Positioning/scaling the map relative to the player (default glTF
  transform is used as-is; may need future tuning if scale looks off).
