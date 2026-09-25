import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const lenis = prefersReducedMotion
  ? null
  : new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Smoothly scroll to a target selector, element or pixel offset. */
export function scrollTo(target) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}
