import * as THREE from "three";
import { cameraSize } from "../constants";

export function Camera() {
  const camera = new THREE.OrthographicCamera();
  updateFrustum(camera);
  return camera;
}

// Orthographic cameras define their view volume as explicit
// left/right/top/bottom planes rather than an fov+aspect pair, so a
// window resize has to recompute those planes directly.
export function updateFrustum(camera) {
  const viewRatio = window.innerWidth / window.innerHeight;
  const width = viewRatio < 1 ? cameraSize : cameraSize * viewRatio;
  const height = viewRatio < 1 ? cameraSize / viewRatio : cameraSize;

  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;
  camera.near = 0.1;
  camera.far = 3000;
  camera.updateProjectionMatrix();
}
