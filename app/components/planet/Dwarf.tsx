import Prando from "prando";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { PlanetBase } from "./PlanetBase";
import { PlanetAtom, planetAtom } from "../atoms/planet.atom";
import { IUniform } from "three";
import { PlanetGeneralProps } from "~/interfaces/planet.interface";

import fragment from "~/shaders/planetTerrain.frag";
import { hsvToRgb } from "~/helpers/color.helpers";

export function Dwarf({ id }: PlanetGeneralProps) {
  const planets = useAtomValue(planetAtom);
  const [planet, setPlanet] = useState<PlanetAtom | null>(null);

  const uniforms = useMemo<{ [key: string]: IUniform<any> }>(() => {
    const data = planets.find((planet) => planet.id === id);

    if (!data) return {};

    setPlanet(data);
    const rng = new Prando(data.seed);

    const uni = {
      color1: { value: hsvToRgb(rng.next(0, 1), rng.next(0.1, 0.6), rng.next(0.2, 0.8)) },
      color2: { value: hsvToRgb(rng.next(0, 1), rng.next(0.1, 0.6), rng.next(0.2, 0.8)) },
      stretch: { value: rng.nextInt(0, 1) },
      noiseParams: {
        value: {
          alg: rng.nextInt(0, 2),
          method: rng.nextInt(0, 2),
          octaves: rng.nextInt(6, 8),
          amplitude: rng.next(3, 8),
          frequency: rng.next(1, 6),
          persistence: rng.next(0.3, 0.7),
          lacunarity: rng.next(2, 3.0),
        },
      },
    };

    console.log(data.seed, uni);

    return uni;
  }, [planets]);

  return (
    <>
      {planet && (
        <PlanetBase
          fragment={fragment}
          seed={planet.seed}
          uniforms={uniforms}
          position={planet.position}
        />
      )}
    </>
  );
}
