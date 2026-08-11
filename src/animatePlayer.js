import * as THREE from "three";
import {
  player,
  position,
  movesQueue,
  completeStep,
} from "./components/Player";
import { tileSize } from "./constants";

const moveClock = new THREE.Clock(false);

export function animatePlayer() {
  if (!movesQueue.length) return;

  if (!moveClock.running) moveClock.start();

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
function setPosition(progress) {
  const startX = position.currentTile * tileSize;
  const startZ = -position.currentRow * tileSize;
  let endX = startX;
  let endZ = startZ;

  if (movesQueue[0] === "left") endX -= tileSize;
  if (movesQueue[0] === "right") endX += tileSize;
  if (movesQueue[0] === "forward") endZ -= tileSize;
  if (movesQueue[0] === "backward") endZ += tileSize;

  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.z = THREE.MathUtils.lerp(startZ, endZ, progress);
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
