import * as THREE from "three";
import { map } from "../components/Map";

const raycaster = new THREE.Raycaster();
const down = new THREE.Vector3(0, -1, 0);
const origin = new THREE.Vector3();

// Fires a ray straight down from high above (x, z) onto the map and
// returns the terrain's world-space surface height there. Returns
// `fallback` when there's nothing to hit — map not loaded yet, or a
// point past the edge of the mesh.
export function getTerrainHeight(x, z, fallback = 0) {
  origin.set(x, 10000, z);
  raycaster.set(origin, down);

  const hits = raycaster.intersectObject(map, true);
  return hits.length > 0 ? hits[0].point.y : fallback;
}
