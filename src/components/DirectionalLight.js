import * as THREE from "three";

export function DirectionalLight() {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(150, 250, 150);
  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  // Sized to cover the area right around the player/spawn rather than
  // the whole (much larger) map — the chase camera only ever shows a
  // small slice of it at once, so a tight frustum keeps shadow
  // resolution sharp where it's actually visible.
  dirLight.shadow.camera.left = -100;
  dirLight.shadow.camera.right = 100;
  dirLight.shadow.camera.top = 100;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 700;

  return dirLight;
}
