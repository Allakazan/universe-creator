import { Vector3 } from "@react-three/fiber";
import { atom } from "jotai";
import { ulid } from "ulidx";
import { PlanetType } from "~/interfaces/planet.interface";

export type PlanetAtom = {
  id: string;
  type: PlanetType;
  seed: number;
  position: Vector3;
};

export const planetAtom = atom<PlanetAtom[]>([
  /*{
    id: ulid(),
    type: PlanetType.GasGiant,
    seed: 795,
    position: [-3, 0, -5],
  },
  {
    id: ulid(),
    type: PlanetType.GasGiant,
    seed: 504,
    position: [3, 0, -5],
  },
  {
    id: ulid(),
    type: PlanetType.GasGiant,
    seed: 9070,
    position: [-9, 0, -5],
  },*/
  {
    id: ulid(),
    type: PlanetType.Dwarf,
    seed: 2069.4182,
    position: [0, 0, 0],
  },
]);
