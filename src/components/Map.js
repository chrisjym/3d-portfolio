import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mapScale } from "../constants";
import mapUrl from "../assets/minecraft/source/Untitled.glb?url";

const loader = new GLTFLoader();

export const map = new THREE.Group();

// The map's world-space footprint (X/Z), used to stop the player from
// walking off the edge — see utilities/endsUpInValidPosition. Open
// (unbounded) until the model finishes loading, so moves aren't
// wrongly blocked before we know the real footprint.
export const bounds = {
  minX: -Infinity,
  maxX: Infinity,
  minZ: -Infinity,
  maxZ: Infinity,
};

export async function initializeMap() {
  let gltf;
  try {
    gltf = await loader.loadAsync(mapUrl);
  } catch (error) {
    console.error("Failed to load map model:", error);
    return null;
  }

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  gltf.scene.scale.setScalar(mapScale);
  map.add(gltf.scene);

  // Approximates the island as its rectangular bounding footprint —
  // the actual terrain is an irregular blob, so a few corner tiles
  // inside this box may not have real ground under them. Good enough
  // for a walk-off-the-edge guard; a per-tile occupancy check would
  // be needed for pixel-perfect edges.
  const box = new THREE.Box3().setFromObject(gltf.scene);
  bounds.minX = box.min.x;
  bounds.maxX = box.max.x;
  bounds.minZ = box.min.z;
  bounds.maxZ = box.max.z;

  return gltf.scene;
}
