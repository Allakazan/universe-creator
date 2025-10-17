import * as THREE from "three";

export function getOrbitalPosition(
  center: THREE.Vector3,
  radius: number,
  angle: number,
  inclination: number = 0 // em radianos
): THREE.Vector3 {
  const x = center.x + radius * Math.cos(angle);
  const z = center.z + radius * Math.sin(angle);
  const y = center.y + radius * Math.sin(inclination) * Math.sin(angle);
  return new THREE.Vector3(x, y, z);
}
