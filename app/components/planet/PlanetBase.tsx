import * as THREE from "three";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import CustomShaderMaterial from "three-custom-shader-material";

import vertex from "~/shaders/planetCSM.vert";

import atmosFrag from "~/shaders/atmosphere.frag";
import atmosVert from "~/shaders/atmosphere.vert";
import { getOrbitalPosition } from "~/helpers/three.helpers";
import { OrbitRing } from "../OrbitRing";
import { useAtom } from "jotai";
import { planetAtom, PlanetAtom, selectedPlanetAtom } from "../atoms/planet.atom";

export type PlanetBaseProps = {
  fragment: string;
  uniforms: { [key: string]: THREE.IUniform<any> };
  size: number;
} & PlanetAtom;

export function PlanetBase({ uniforms, size, fragment, ...planetData }: PlanetBaseProps) {
  const { id, seed, distance, angle, inclination } = planetData;

  const groupRef = useRef<THREE.Group>(null!);
  const angleRef = useRef(angle);

  const meshRef = useRef<THREE.Mesh>(null!);

  const [__, setPlanets] = useAtom(planetAtom);
  const [_, setSelectedPlanet] = useAtom(selectedPlanetAtom);

  const mergedUniforms = useMemo(
    () => ({
      ...uniforms,
      seedValue: { value: seed },
      u_time: { value: 0 },
    }),
    [uniforms, seed]
  );

  useEffect(() => {
    setPlanets((prev) =>
      prev.map((planet) => (planet.id === id ? { ...planet, ref: groupRef.current } : planet))
    );
  }, []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // avance o ângulo sem setState
    angleRef.current += delta * 0.02;

    const pos = getOrbitalPosition(
      new THREE.Vector3(0, 0, 0),
      distance,
      angleRef.current,
      inclination
    );
    groupRef.current.position.copy(pos);

    // atualize uniform sem re-render
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    if (mat?.uniforms?.u_time) mat.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <>
      <OrbitRing radius={distance} inclination={inclination} />
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();

            if (groupRef.current)
              setSelectedPlanet({
                ...planetData,
                mesh: groupRef.current,
              });
          }}
        >
          <sphereGeometry args={[size, 30, 30]} />
          <CustomShaderMaterial
            //ref={materialRef}
            silent
            baseMaterial={THREE.MeshPhysicalMaterial}
            //specularIntensity={0.1}
            //reflectivity={0.5}
            fragmentShader={fragment}
            vertexShader={vertex}
            uniforms={mergedUniforms}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[size * 1.13, 20, 20]} />
          <shaderMaterial
            fragmentShader={atmosFrag}
            vertexShader={atmosVert}
            transparent={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            uniforms={{
              atmOpacity: { value: 0.6 },
              atmPowFactor: { value: 3.0 },
              atmMultiplier: { value: 9 },
              glowColor: { value: (mergedUniforms as any).color1.value },
            }}
          />
        </mesh>
      </group>
    </>
  );
}
