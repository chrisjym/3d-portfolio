import * as THREE from "three";

export function Renderer() {
  const canvas = document.getElementById("3d-portfolio-1");
  if (!canvas) throw new Error("canvas not found");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  return renderer;
}
