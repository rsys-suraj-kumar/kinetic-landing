import { useEffect, useState } from "react";
import { lenis } from "./lib/scroll";
import { ScrollTrigger } from "./lib/gsap";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Work from "./components/Work";
import Services from "./components/Services";
import Stats from "./components/Stats";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Grain from "./components/Grain";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  /* lock scroll while the preloader is up, release + recalc after */
  useEffect(() => {
    if (!loaded) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [loaded]);

  /* recalc triggers once all assets are in */
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <Preloader onReveal={() => setLoaded(true)} />
      <CustomCursor />
      <Navbar start={loaded} />

      <main>
        <Hero start={loaded} />
        <Marquee />
        <Manifesto />
        <Work />
        <Services />
        <Stats />
        <CTA />
      </main>

      <Footer />
      <Grain />
    </>
  );
}
