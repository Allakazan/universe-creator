import * as THREE from "three";
import React, { useMemo } from "react";
import { Line } from "@react-three/drei";

interface OrbitRingProps {
  center?: THREE.Vector3;
  radius: number;
  segments?: number;
  color?: string;
  inclination?: number; // radianos, opcional
}

export const OrbitRing: React.FC<OrbitRingProps> = ({
  center = new THREE.Vector3(0, 0, 0),
  radius,
  segments = 128,
  color = "grey",
  inclination = 0,
}) => {
  // calcula os pontos só quando props mudarem
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      pts.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }

    return pts;
  }, [radius, segments]);

  const points2 = useMemo(() => {
    // cria uma curva elíptica (pode usar raios diferentes se quiser elipses)
    const curve = new THREE.EllipseCurve(
      0, // xCenter
      0, // yCenter
      radius, // raio X
      radius, // raio Y
      0, // ângulo inicial
      2 * Math.PI, // ângulo final
      false, // sentido horário?
      0 // rotação da elipse
    );

    // converte os pontos 2D (x, y) em 3D (x, 0, y)
    const points2D = curve.getPoints(segments * 4);
    return points2D.map((p) => new THREE.Vector3(p.x, 0, p.y));
  }, [radius, segments]);

  return (
    <group position={center} rotation={[-inclination, 0, 0]}>
      <Line points={points2} color={color} lineWidth={1} />
    </group>
  );
};
