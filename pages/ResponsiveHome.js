import { useEffect, useState } from "react";
import Desktop from "./Desktop";
import Mobile from "./Mobile";

export default function ResponsiveHome() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop ? <Desktop /> : <Mobile />;
}
