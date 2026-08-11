import * as THREE from "three";
import { endsUpInValidPosition } from "../utilities/endsUpInValidPosition";

export const player = Player();

function Player() {
  const player = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({
      color: "white",
      flatShading: true,
    }),
  );
  body.position.z = 10;
  body.castShadow = true;
  body.receiveShadow = true;
  player.add(body);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({
      color: 0xf0619a,
      flatShading: true,
    }),
  );
  cap.position.z = 21;
  cap.castShadow = true;
  cap.receiveShadow = true;
  player.add(cap);

  const beak = new THREE.Mesh(
    new THREE.BoxGeometry(3, 4, 2),
    new THREE.MeshLambertMaterial({
      color: "yellow",
      flatShading: true,
    }),
  );
  beak.position.y = 8;
  beak.position.z = 12;
  beak.castShadow = true;
  beak.receiveShadow = true;
  player.add(beak);

  const playerContainer = new THREE.Group();
  playerContainer.add(player);

  return playerContainer;
}

// Tile-grid position, in tile units (not world units) — one tile
// step = one voxel block, see constants.tileSize.
export const position = {
  currentTile: 0,
  currentRow: 0,
};

export const movesQueue = [];

export function queueMove(direction) {
  // Only one move in flight at a time — ignore new input until the
  // current step finishes, rather than queuing moves ahead.
  if (movesQueue.length > 0) return;

  const isValidMove = endsUpInValidPosition(
    {
      rowIndex: position.currentRow,
      tileIndex: position.currentTile,
    },
    [...movesQueue, direction],
  );
  if (!isValidMove) return;

  movesQueue.push(direction);
}

export function completeStep() {
  const direction = movesQueue.shift();

  if (direction === "forward") position.currentRow += 1;
  if (direction === "backward") position.currentRow -= 1;
  if (direction === "right") position.currentTile += 1;
  if (direction === "left") position.currentTile -= 1;
}
