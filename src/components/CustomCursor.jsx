import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";

/**
 * Custom blend-mode cursor with a lagging ring.
 * - "hover"  → grows on interactive elements
 * - "view"   → morphs into an accent pill with a label (work cards)
 */
export default function CustomCursor() {
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches
  );
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -300, y: -300 });
    gsap.set(label, { opacity: 0, scale: 0.4 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const setMode = (mode) => {
      if (mode === "view") {
        ring.style.mixBlendMode = "normal";
        gsap.to(ring, {
          width: 92,
          height: 92,
          backgroundColor: "var(--color-accent)",
          borderColor: "transparent",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
        gsap.to(dot, { scale: 0, duration: 0.25, ease: "power3.out" });
      } else if (mode === "hover") {
        ring.style.mixBlendMode = "difference";
        gsap.to(ring, {
          width: 56,
          height: 56,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "var(--color-accent)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 0, scale: 0.4, duration: 0.2 });
        gsap.to(dot, { scale: 0.4, duration: 0.25, ease: "power3.out" });
      } else {
        ring.style.mixBlendMode = "difference";
        gsap.to(ring, {
          width: 44,
          height: 44,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(236,233,226,0.5)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { opacity: 0, scale: 0.4, duration: 0.2 });
        gsap.to(dot, { scale: 1, duration: 0.25, ease: "power3.out" });
      }
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-cursor="view"]')) setMode("view");
      else if (t.closest('a, button, [data-cursor="hover"]')) setMode("hover");
      else setMode("default");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[300] h-1.5 w-1.5 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[299] flex h-11 w-11 items-center justify-center rounded-full border border-bone/50 mix-blend-difference"
      >
        <span
          ref={labelRef}
          className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-ink"
        >
          View
        </span>
      </div>
    </>
  );
}
