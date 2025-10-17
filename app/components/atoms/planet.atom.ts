import * as THREE from "three";
import { atom } from "jotai";
import { ulid } from "ulidx";
import { PlanetType } from "~/interfaces/planet.interface";

export type PlanetAtom = {
  id: string;
  type: PlanetType;
  seed: number;
  distance: number;
  angle: number;
  direction: number;
  inclination: number;
  ref?: THREE.Group;
};

export const selectedPlanetAtom = atom<(PlanetAtom & { mesh: THREE.Object3D }) | null>(null);

export const planetAtom = atom<PlanetAtom[]>([
  {
    id: ulid(),
    type: PlanetType.Star,
    seed: 3245,
    distance: 0,
    angle: 0.5,
    inclination: 0,
    direction: 1,
  },
  {
    id: ulid(),
    type: PlanetType.GasGiant,
    seed: 795,
    distance: 300,
    angle: 0.9,
    inclination: 0.1,
    direction: 1,
  },
  {
    id: ulid(),
    type: PlanetType.GasGiant,
    seed: 504,
    distance: 200,
    angle: 1.5,
    inclination: -0.05,
    direction: -1,
  },
  {
    id: ulid(),
    type: PlanetType.GasGiant,
    seed: 9070,
    distance: 400,
    angle: 3,
    inclination: 0,
    direction: -1,
  },
  {
    id: ulid(),
    type: PlanetType.Terrestrial,
    seed: 9070,
    distance: 100,
    angle: 1,
    inclination: 0,
    direction: -1,
  },
  /*{
    id: ulid(),
    type: PlanetType.Dwarf,
    seed: 1069.4182,
    distance: 3,
    angle: 2,
    direction: 1,
  },*/
]);
