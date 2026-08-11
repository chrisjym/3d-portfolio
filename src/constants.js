// The Sketchfab export's voxel grid has a block edge of ~0.1042 units
// (measured from the mesh's vertex spacing). Scale the whole map up so
// one voxel block is roughly as large as the player's 15-unit footprint
// (15 / 0.1042 ≈ 144), i.e. the player reads as "one tile" on the map.
export const mapScale = 144;

// One grid step for tile-based player movement. Matches the voxel
// block edge at mapScale (0.1042 * 144 ≈ 15), i.e. one move = one
// block, and it's also the player's own footprint size.
export const tileSize = 15;

// Isometric camera: fixed diagonal offset from the player (equal
// offset on all three axes gives the classic isometric angle), and
// how far above the player's feet it looks.
export const cameraOffset = { x: 250, y: 250, z: 250 };
export const cameraLookHeight = 10;

// Orthographic frustum half-extent (world units visible top-to-bottom
// at 1:1 aspect).
export const cameraSize = 300;
