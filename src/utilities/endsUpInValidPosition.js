import { calculateFinalPosition } from "./calculateFinalPosition";
import { bounds } from "../components/Map";
import { tileSize } from "../constants";

// Same shape as the crossy-road original, but checked against the
// loaded map's actual world-space footprint instead of static
// min/max tile-index constants (we don't have a procedural row map
// to bound against).
export function endsUpInValidPosition(currentPosition, moves) {
  const finalPosition = calculateFinalPosition(currentPosition, moves);

  const worldX = finalPosition.tileIndex * tileSize;
  const worldZ = -finalPosition.rowIndex * tileSize;

  return (
    worldX >= bounds.minX &&
    worldX <= bounds.maxX &&
    worldZ >= bounds.minZ &&
    worldZ <= bounds.maxZ
  );
}
