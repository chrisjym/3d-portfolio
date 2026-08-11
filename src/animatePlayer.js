import * as THREE from "three";
import {
  player,
  position,
  movesQueue,
  completeStep,
} from "./components/Player";
import { getTerrainHeight } from "./utilities/getTerrainHeight";
import { tileSize } from "./constants";

const moveClock = new THREE.Clock(false);

// Terrain heights at the step's start and destination tiles, raycast
// once when the step begins (not every frame — the landscape mesh has
// ~13k vertices, and the answer can't change mid-step anyway).
const stepHeights = { start: 0, end: 0 };

export function animatePlayer() {
  if (!movesQueue.length) return;

  if (!moveClock.running) {
    moveClock.start();
    measureStepHeights();
  }

  const stepTime = 0.2;
  const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

  setPosition(progress);
  setRotation(progress);

  if (progress >= 1) {
    completeStep();
    moveClock.stop();
  }
}

// The player's ground plane is X/Z (Y is up, per the rotation fix in
// main.js), unlike the crossy-road original where it's X/Y. "forward"
// moves toward -Z to match the character's rest-facing direction.
function stepEndpoints() {
  const startX = position.currentTile * tileSize;
  const startZ = -position.currentRow * tileSize;
  let endX = startX;
  let endZ = startZ;

  if (movesQueue[0] === "left") endX -= tileSize;
  if (movesQueue[0] === "right") endX += tileSize;
  if (movesQueue[0] === "forward") endZ -= tileSize;
  if (movesQueue[0] === "backward") endZ += tileSize;

  return { startX, startZ, endX, endZ };
}

function measureStepHeights() {
  const { startX, startZ, endX, endZ } = stepEndpoints();
  // Fall back to the player's current height so a missed raycast
  // (e.g. a bounding-box corner tile with no real terrain under it)
  // keeps the player level instead of dropping them to 0.
  stepHeights.start = getTerrainHeight(startX, startZ, player.position.y);
  stepHeights.end = getTerrainHeight(endX, endZ, player.position.y);
}

function setPosition(progress) {
  const { startX, startZ, endX, endZ } = stepEndpoints();

  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.z = THREE.MathUtils.lerp(startZ, endZ, progress);
  // Follow the terrain: rise/sink toward the destination tile's
  // surface height across the step.
  player.position.y = THREE.MathUtils.lerp(
    stepHeights.start,
    stepHeights.end,
    progress,
  );
  // Hop: offset along the inner body group's local Z, which (after
  // main.js's parent rotation) points along world Y — i.e. up.
  player.children[0].position.z = Math.sin(progress * Math.PI) * 8;
}

function setRotation(progress) {
  let endRotation = 0;
  if (movesQueue[0] === "forward") endRotation = 0;
  if (movesQueue[0] === "left") endRotation = Math.PI / 2;
  if (movesQueue[0] === "right") endRotation = -Math.PI / 2;
  if (movesQueue[0] === "backward") endRotation = Math.PI;

  player.children[0].rotation.z = THREE.MathUtils.lerp(
    player.children[0].rotation.z,
    endRotation,
    progress,
  );
}
