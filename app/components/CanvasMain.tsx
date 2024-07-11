import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Environment, Plane } from "@react-three/drei";
import { useAtom } from "jotai";
import { planetAtom } from "./atoms/planet.atom";
import { Suspense, useEffect } from "react";
import { PlanetType } from "~/interfaces/planet.interface";
import { GasGiant } from "./planet/GasGiant";
import { Dwarf } from "./planet/Dwarf";
import { Star } from "./planet/Star";

export default function CanvasMain() {
  const [planetData, setPlanetData] = useAtom(planetAtom);

  const PlanetComponent = ({ type, id }: { type: PlanetType; id: string }) => {
    switch (type) {
      case PlanetType.GasGiant:
        return <GasGiant id={id} />;
      case PlanetType.Dwarf:
        return <Dwarf id={id} />;
      case PlanetType.Star:
        return <Star id={id} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!window) return;

    const onKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPlanetData((planets) =>
          planets.map((planet) => ({ ...planet, seed: Number((Math.random() * 8000).toFixed(4)) }))
        );
      }
    };

    window.addEventListener("keypress", onKeyPress);

    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      style={{ background: "black" }}
      camera={{
        fov: 70,
        rotation: [0, 0, 0],
        onUpdate: (c) => (c as THREE.PerspectiveCamera).updateProjectionMatrix(),
      }}
    >
      <CameraControls />
      <Environment
        background
        environmentIntensity={1}
        files={["right", "left", "top", "bottom", "front", "back"].map(
          (file) => `/assets/skybox/space4/${file}.png`
        )}
      />
      <ambientLight intensity={0.17} />
      <pointLight position={[0, 0, 0]} decay={0.2} intensity={Math.PI} />
      <Suspense fallback={null}>
        {planetData.map(({ id, type }) => (
          <PlanetComponent key={id} id={id} type={type} />
        ))}
      </Suspense>
    </Canvas>
  );
}
