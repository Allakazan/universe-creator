import Prando from "prando";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { PlanetBase } from "./PlanetBase";
import { PlanetAtom, planetAtom } from "../atoms/planet.atom";
import { IUniform } from "three";
import { PlanetGeneralProps } from "~/interfaces/planet.interface";

import fragment from "~/shaders/planetTerrain.frag";
import { hsvToRgb } from "~/helpers/color.helpers";

export function Terrestrial({ id }: PlanetGeneralProps) {
  const planets = useAtomValue(planetAtom);
  const [planet, setPlanet] = useState<PlanetAtom | null>(null);
  const [size, setSize] = useState<number>(0);

  const uniforms = useMemo<{ [key: string]: IUniform<any> }>(() => {
    const data = planets.find((planet) => planet.id === id);

    if (!data) return {};

    setPlanet(data);
    const rng = new Prando(data.seed);

    const hue = rng.next(0, 1);
    const sat = rng.next(0.2, 0.4);
    const satOffset = rng.next(0.2, 0.25);

    const uni = {
      color1: { value: hsvToRgb(hue, sat, rng.next(0.65, 0.8)) },
      color2: { value: hsvToRgb(hue, sat + satOffset, rng.next(0.65, 0.8)) },
      color3: { value: hsvToRgb(hue, sat - satOffset, rng.next(0.65, 0.8)) },
      atmosphereColor: { value: hsvToRgb(hue, sat, rng.next(0.65, 0.8)) },
      stretch: { value: rng.nextInt(0, 1) },
      bumpStrength: { value: 1.3 },
      noiseTint: { value: rng.nextBoolean() },
      noiseParams: {
        value: {
          alg: 1, // Simplex Noise by default to get better normals
          method: rng.nextInt(0, 2),
          octaves: rng.nextInt(6, 8),
          amplitude: rng.next(3, 8),
          frequency: rng.next(2, 6),
          persistence: rng.next(0.6, 0.7),
          lacunarity: rng.next(2, 3.0),
        },
      },
      noiseParams2: {
        value: {
          alg: rng.nextInt(0, 2),
          method: rng.nextInt(0, 2),
          octaves: rng.nextInt(6, 8),
          amplitude: rng.next(2, 8),
          frequency: rng.next(6, 12),
          persistence: rng.next(0.5, 0.7),
          lacunarity: rng.next(2, 3.0),
        },
      },
    };

    setSize(rng.next(0.3, 0.64));

    return uni;
  }, [planets]);

  return (
    <>{planet && <PlanetBase {...planet} fragment={fragment} uniforms={uniforms} size={size} />}</>
  );
}
