import { useState, useEffect } from "react";

type WindowDimensions = {
  width: number;
  height: number;
};

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions | null>({
    width: typeof window !== "undefined" ? window.document.documentElement.clientWidth : 0,
    height: typeof window !== "undefined" ? window.document.documentElement.clientHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
