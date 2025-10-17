import type { MetaFunction } from "@remix-run/node";
import CanvasMain from "~/components/CanvasMain";
import MenuControl from "~/components/controls/menu.control";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MenuControl />
      <CanvasMain />
    </div>
  );
}
