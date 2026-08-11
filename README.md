# 3d-portfolio-1

A Three.js + Vite project: a chicken-style character (from the
[crossy-road tutorial](https://javascriptgametutorials.com)) explores a
Minecraft-style voxel island
([Sketchfab model](https://sketchfab.com/3d-models/minecraft-36848534e4dd4a88bd6176c874ccc25e))
with tile-by-tile arrow-key movement, terrain-following, and an
isometric chase camera.

## Running

```bash
npm install
npm run dev     # http://localhost:5173
```

Move with the **arrow keys**. One press = one tile. Holding a key does
nothing beyond the first step.

## Project structure

Modeled after the crossy-road tutorial project (thin `main.js`
orchestrator, one factory module per concern):

```
src/
├── main.js                      # scene assembly + render loop
├── constants.js                 # shared tuning values
├── collectUserInput.js          # arrow keys → queueMove()
├── animatePlayer.js             # per-frame step animation
├── components/
│   ├── Camera.js                # orthographic isometric camera
│   ├── Renderer.js              # WebGL renderer bound to the canvas
│   ├── DirectionalLight.js      # shadow-casting sun light
│   ├── Player.js                # character mesh + movement state
│   └── Map.js                   # GLTF island loader + world bounds
├── utilities/
│   ├── calculateFinalPosition.js  # tile position after queued moves
│   ├── endsUpInValidPosition.js   # keeps moves inside the island
│   └── getTerrainHeight.js        # raycast ground height at (x, z)
└── assets/minecraft/source/Untitled.glb   # the island (textures embedded)
```

## Changelog / decisions

### Scene setup
- Rewrote the original `main.js` stub (it called nonexistent APIs like
  `THREE.camera()`) into a working scene: renderer bound to the
  `<canvas id="3d-portfolio-1">` element, ambient + directional
  lighting, shadow maps, resize handling.
- **Map loading** (`Map.js`): the Sketchfab `.glb` (~7 MB, textures
  embedded — the sibling `textures/` folder is not used at runtime) is
  imported with Vite's `?url` suffix and loaded via `GLTFLoader`.
  Loading doesn't block the render loop; the island pops in when ready.
  All map meshes cast/receive shadows.
- **Scale** (`constants.mapScale = 144`): measured the voxel grid in
  the glb's vertex data (block edge ≈ 0.1042 units) and scaled the map
  so one voxel block ≈ the player's 15-unit footprint. One movement
  tile (`tileSize = 15`) = one block.
- **Axis fix**: the tutorial's `Player.js` is authored Z-up; the glTF
  map is Y-up. The player is rotated (`rotation.x = -π/2`) in `main.js`
  so both agree that Y is up. `Player.js` itself is untouched tutorial
  code.

### Camera
- Orthographic camera at a fixed diagonal offset (equal x/y/z →
  classic isometric look, matching the crossy-road tutorial's angle).
- Chase behavior: re-positioned and re-aimed at the player every frame,
  so it tracks all three axes — including height changes — without
  extra wiring. Deliberately **not** parented to the player (the
  tutorial parents it) because the player carries the Z→Y rotation fix,
  which would skew an attached camera.
- Window resizes recompute the orthographic frustum
  (`Camera.updateFrustum`), which needs explicit plane math rather than
  a perspective camera's aspect update.

### Movement
- Ported the tutorial's tile-stepping system (`movesQueue`,
  `queueMove`, `completeStep`, lerp + hop + turn-to-face animation),
  adapted from its X/Y ground plane to this project's X/Z (Y-up).
  "Forward" moves toward −Z.
- **Input hardening**: key auto-repeat is ignored (`event.repeat`), and
  only one move may be in flight — presses during an active step are
  dropped, not queued.
- **Island boundary**: `Map.js` exports the loaded model's world-space
  footprint (`bounds`, from its `Box3`), and `endsUpInValidPosition`
  rejects moves that would leave it. Until the model loads, bounds are
  open so nothing is wrongly blocked.
- **Terrain-following**: at each step's start, `getTerrainHeight`
  raycasts straight down at the start and destination tiles (once per
  step, cached — not per frame), and the player's Y lerps between the
  two surface heights during the hop. Spawn height uses the same
  raycast. If a ray misses (no ground at that spot), the player keeps
  its current height rather than falling to 0.

### Dropped from the tutorial
Not ported because they depend on its procedurally generated row map,
which this project replaces with a static loaded island: row/vehicle
generation, car/truck animation, vehicle collision (`hitTest`),
score/game-over DOM.

## Known limitations
- The boundary is the island's rectangular bounding box, not its
  irregular outline — a few corner tiles inside the box have no real
  terrain (the raycast fallback keeps the player level there).
- The player can climb any height difference in one hop; there's no
  "too tall, blocked" rule yet.
- `THREE.Clock` (used by the ported animation code) logs a deprecation
  warning in newer three.js; harmless, `THREE.Timer` is its successor.

## Docs
- Original scene-setup design spec:
  `docs/superpowers/specs/2026-08-09-minecraft-map-loader-design.md`
