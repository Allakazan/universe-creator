import { PlanetType } from "~/components/planet/PlanetBase";

interface PlanetConstrains {}
interface PlanetSettings {
  constraints: PlanetConstrains;
}

export const PlanetData: { [key in PlanetType]?: PlanetSettings } = {};
