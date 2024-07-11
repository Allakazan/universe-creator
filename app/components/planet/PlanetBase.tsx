import * as THREE from "three";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material";

import vertex from "~/shaders/planetCSM.vert";

export type PlanetBaseProps = {
  fragment: string;
  position: Vector3;
  uniforms: { [key: string]: THREE.IUniform<any> };
  seed: number;
};

export function PlanetBase({ uniforms, seed, position, fragment }: PlanetBaseProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  //const materialRef = useRef<THREE.Material>(null!);

  useFrame(({ camera, clock }, delta) => {
    if (!meshRef.current) return;

    //meshRef.current.rotation.y += delta * 0.1;
    //meshRef.current.rotation.x += delta * 0.2;

    const material = meshRef.current.material as THREE.ShaderMaterial;

    material.uniforms.u_time.value = clock.getElapsedTime();
  });
  return (
    <mesh ref={meshRef} position={position} scale={1.5}>
      <sphereGeometry args={[1.5, 60, 60]} />
      <CustomShaderMaterial
        //ref={materialRef}
        silent
        baseMaterial={THREE.MeshPhysicalMaterial}
        //specularIntensity={0.1}
        //reflectivity={0.5}
        fragmentShader={fragment}
        vertexShader={vertex}
        uniforms={{
          ...uniforms,
          seedValue: { value: seed },
          u_time: { value: 0 },
        }}
      />
    </mesh>
  );
}
