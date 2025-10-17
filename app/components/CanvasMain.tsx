import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  OrbitControls,
  PerformanceMonitor,
  Plane,
  Stats,
} from "@react-three/drei";
import { useAtom } from "jotai";
import { planetAtom, selectedPlanetAtom } from "./atoms/planet.atom";
import { Suspense, useEffect, useRef, useState } from "react";
import { PlanetType } from "~/interfaces/planet.interface";
import { GasGiant } from "./planet/GasGiant";
import { Dwarf } from "./planet/Dwarf";
import { Star } from "./planet/Star";
import { Terrestrial } from "./planet/Terrestrial";
import { clamp } from "three/src/math/MathUtils.js";

const PlanetComponent = ({ type, id }: { type: PlanetType; id: string }) => {
  switch (type) {
    case PlanetType.GasGiant:
      return <GasGiant id={id} />;
    case PlanetType.Dwarf:
      return <Dwarf id={id} />;
    case PlanetType.Star:
      return <Star id={id} />;
    case PlanetType.Terrestrial:
      return <Terrestrial id={id} />;
    default:
      return null;
  }
};

const CameraController = () => {
  const DEFAULT_ZOOM_OFFSET = 5;

  const [selectedPlanet] = useAtom(selectedPlanetAtom);

  const cameraControlsRef = useRef<any>(null);
  const orbitControlsRef = useRef<any>(null);
  const [mode, setMode] = useState<"camera" | "orbit">("camera");
  const [planetRadius, setPlanetRadius] = useState<number>(0);

  const [zoomOffset, setZoomOffset] = useState<number>(DEFAULT_ZOOM_OFFSET);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (mode === "orbit") setZoomOffset((prev) => clamp(prev + event.deltaY * 0.01, 2, 10));
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [mode]);

  useEffect(() => {
    if (selectedPlanet) {
      setMode("orbit");
      setZoomOffset(DEFAULT_ZOOM_OFFSET);
      // Dirty workaround to grab the planet radius without global state manipulation
      setPlanetRadius(
        (selectedPlanet.mesh.children[0] as unknown as any).geometry.parameters.radius
      );
    } else {
      setMode("camera");
    }
  }, [selectedPlanet]);

  useFrame(() => {
    if (mode === "orbit" && selectedPlanet && orbitControlsRef.current) {
      orbitControlsRef.current.target.copy(selectedPlanet.mesh.position);
      orbitControlsRef.current.update();
    }
  });

  return (
    <>
      {mode === "camera" && <CameraControls ref={cameraControlsRef} makeDefault />}
      {mode === "orbit" && (
        <OrbitControls
          ref={orbitControlsRef}
          makeDefault
          enablePan={false}
          zoomToCursor
          minDistance={zoomOffset * planetRadius}
          maxDistance={zoomOffset * planetRadius}
          // TODO: Same method for zoom should be applied for rotation
          /*minAzimuthAngle={1}
          maxAzimuthAngle={1}
          minPolarAngle={1}
          maxPolarAngle={1}*/
        />
      )}
    </>
  );
};

export default function CanvasMain() {
  const [planetData] = useAtom(planetAtom);
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={dpr}
      //frameloop="demand"
      style={{ background: "black" }}
      camera={{
        fov: 30,
        far: 10000,
        rotation: [0, 0, 0],
        onUpdate: (c) => (c as THREE.PerspectiveCamera).updateProjectionMatrix(),
      }}
    >
      <Stats showPanel={0} />
      <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
      <Environment
        background
        environmentIntensity={1}
        files={["right", "left", "top", "bottom", "front", "back"].map(
          (file) => `/assets/skybox/space4/${file}.png`
        )}
      />
      <ambientLight intensity={0.27} />
      <pointLight position={[0, 0, 0]} decay={0.2} intensity={Math.PI} />
      <Suspense fallback={null}>
        {planetData.map(({ id, type }) => (
          <PlanetComponent key={id} id={id} type={type} />
        ))}
      </Suspense>
      <CameraController />
    </Canvas>
  );
}
