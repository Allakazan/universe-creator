import Prando from "prando";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { PlanetBase } from "./PlanetBase";
import { PlanetAtom, planetAtom } from "../atoms/planet.atom";
import { IUniform } from "three";
import { PlanetGeneralProps } from "~/interfaces/planet.interface";

import fragment from "~/shaders/star.frag";
import { hsvToRgb } from "~/helpers/color.helpers";

export function Star({ id }: PlanetGeneralProps) {
  const planets = useAtomValue(planetAtom);
  const [planet, setPlanet] = useState<PlanetAtom | null>(null);
  const [size, setSize] = useState<number>(0);

  const uniforms = useMemo<{ [key: string]: IUniform<any> }>(() => {
    const data = planets.find((planet) => planet.id === id);

    if (!data) return {};

    setPlanet(data);
    const rng = new Prando(data.seed);

    const hue1 = rng.next(0.4, 1);
    const hue2 = hue1 > 0.5 ? hue1 - 0.15 : hue1 + 0.15;

    const uni = {
      color1: { value: hsvToRgb(hue1, rng.next(0.6, 1), rng.next(0.7, 1)) },
      color2: { value: hsvToRgb(hue2, rng.next(0.6, 1), rng.next(0.7, 1)) },
      noiseParams: {
        value: {
          alg: 1,
          method: rng.nextInt(1, 2),
          octaves: 8,
          amplitude: rng.next(2, 4),
          frequency: rng.next(0.2, 0.4),
          persistence: rng.next(0.5, 0.7),
          lacunarity: 2,
        },
      },
    };

    setSize(rng.next(10, 30));

    //console.log(data.seed, uni);

    return uni;
  }, [planets]);

  return (
    <>{planet && <PlanetBase {...planet} fragment={fragment} uniforms={uniforms} size={size} />}</>
  );
}
