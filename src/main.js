import * as THREE from "three";
import { Renderer } from "./components/Renderer";
import { Camera, updateFrustum } from "./components/Camera";
import { DirectionalLight } from "./components/DirectionalLight";
import { player } from "./components/Player";
import { map, initializeMap } from "./components/Map";
import { animatePlayer } from "./animatePlayer";
import { getTerrainHeight } from "./utilities/getTerrainHeight";
import { cameraOffset, cameraLookHeight } from "./constants";
import "./collectUserInput";
import "./style.css";

const scene = new THREE.Scene();

// Player.js builds the character with Z as its "up" axis (body height
// runs along z). Rotate it onto the standard Y-up axis so it stands
// upright relative to the map and the default camera orientation.
player.rotation.x = -Math.PI / 2;
scene.add(player);
scene.add(map);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = DirectionalLight();
scene.add(directionalLight);

const camera = Camera();
const renderer = Renderer();

// Don't block the render loop on the map load — the player renders
// immediately, and the map pops in once it's ready. Once it's in,
// stand the player on the actual terrain surface under the spawn
// tile (raycast), not the map's bounding-box top.
initializeMap().then((mapModel) => {
  if (!mapModel) return;
  player.position.y = getTerrainHeight(
    player.position.x,
    player.position.z,
  );
});

// Isometric chase camera: fixed diagonal offset from the player,
// always looking at the player. Recomputed every frame so it keeps
// tracking once the player actually moves.
const offset = new THREE.Vector3(
  cameraOffset.x,
  cameraOffset.y,
  cameraOffset.z,
);

function updateCamera() {
  camera.position.copy(player.position).add(offset);
  camera.lookAt(
    player.position.x,
    player.position.y + cameraLookHeight,
    player.position.z,
  );
}

function animate() {
  requestAnimationFrame(animate);
  animatePlayer();
  updateCamera();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  updateFrustum(camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
});
