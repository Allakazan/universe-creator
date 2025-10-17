import React, { useMemo } from "react";
import { atom, useAtom } from "jotai";
import { Leva, LevaPanel, useControls, folder, button, buttonGroup, useCreateStore } from "leva";

import { planetAtom, selectedPlanetAtom } from "../atoms/planet.atom";

export default function MenuControl() {
  const [planetData, setPlanetData] = useAtom(planetAtom);
  const [_, setSelectedPlanet] = useAtom(selectedPlanetAtom);

  const store = useCreateStore();

  const schema = useMemo(() => {
    const s: Record<string, any> = {};

    planetData.forEach((planet, i) => {
      s[`🌍 ${planet.id} #${i + 1}`] = folder({
        [`id_${planet.id}`]: { label: "ID", value: planet.id, editable: false },
        [`seed_${planet.id}`]: { label: "Seed", value: planet.seed, editable: false },

        [`btn_${i + 1}`]: buttonGroup({
          "🎯 Focus Camera": () => {
            if (planet.ref) setSelectedPlanet({ ...planet, mesh: planet.ref });
          },
        }),
      });
    });

    s["Unfocus"] = button(() => setSelectedPlanet(null));

    s["Generate New Seed"] = button(() => {
      setPlanetData((planets) =>
        planets.map((planet) => ({ ...planet, seed: Number((Math.random() * 6000).toFixed(4)) }))
      );
    });

    return s;
  }, [planetData]);

  // Monta os controles; o segundo argumento (deps) força o Leva a “re-semear” valores quando o array muda,
  // mantendo o Jotai como fonte da verdade.
  useControls(schema, [planetData]);

  return (
    <>
      <LevaPanel store={store} titleBar={{ title: "Editor via Leva" }} />
      <Leva /> {/* opcional: esconde o painel global padrão */}
    </>
  );
}
