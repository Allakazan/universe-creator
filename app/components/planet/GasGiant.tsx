import Prando from "prando";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { PlanetBase } from "./PlanetBase";

import fragment from "~/shaders/planetGas.frag";
import { PlanetAtom, planetAtom } from "../atoms/planet.atom";
import { IUniform } from "three";
import { PlanetGeneralProps } from "~/interfaces/planet.interface";
import { hsvToRgb } from "~/helpers/color.helpers";

export function GasGiant({ id }: PlanetGeneralProps) {
  const planets = useAtomValue(planetAtom);
  const [planet, setPlanet] = useState<PlanetAtom | null>(null);

  const uniforms = useMemo<{ [key: string]: IUniform<any> }>(() => {
    const data = planets.find((planet) => planet.id === id);

    if (!data) return {};

    setPlanet(data);
    const rng = new Prando(data.seed);

    const uni = {
      color1: { value: hsvToRgb(rng.next(0, 1), rng.next(0.1, 0.2), rng.next(0.3, 0.7)) },
      color2: { value: hsvToRgb(rng.next(0, 1), rng.next(0.1, 0.2), rng.next(0.3, 0.7)) },
      turbulanceStrength: { value: rng.next(0.4, 0.6) },
      turbulanceWindForce: { value: rng.next(0.01, 0.02) },
      stretch: { value: rng.nextInt(0, 4) },
      noiseParams: {
        value: {
          alg: rng.nextInt(0, 2),
          method: rng.nextInt(0, 2), //2
          octaves: rng.nextInt(4, 8),
          amplitude: rng.next(2, 8),
          frequency: rng.next(1, 6),
          persistence: rng.next(0.4, 0.7),
          lacunarity: rng.next(2, 2.5),
        },
      },
      turbulanceParams: {
        value: {
          alg: rng.nextInt(0, 2),
          method: 0, //0
          octaves: rng.nextInt(2, 6),
          amplitude: rng.next(3, 4),
          frequency: rng.next(1, 3),
          persistence: rng.next(0.3, 0.9),
          lacunarity: rng.next(2, 3),
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
