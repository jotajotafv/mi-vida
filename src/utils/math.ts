import { Vector3 } from "three";

export function lerp(start: number, end: number, alpha: number): number {
  return start + (end - start) * alpha;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function dampVector(current: Vector3, target: Vector3, alpha: number): Vector3 {
  current.x = lerp(current.x, target.x, alpha);
  current.y = lerp(current.y, target.y, alpha);
  current.z = lerp(current.z, target.z, alpha);
  return current;
}
