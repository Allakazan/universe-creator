import type { MetaFunction } from "@remix-run/node";
import CanvasMain from "~/components/CanvasMain";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CanvasMain />
    </div>
  );
}
