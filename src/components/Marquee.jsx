import { useLayoutEffect, useRef } from "react";
import { Asterisk } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/scroll";

const ITEMS = [
  "Web Experiences",
  "Brand Identity",
  "Motion Design",
  "Creative Direction",
  "WebGL & 3D",
  "Interaction Design",
];

function RowContent() {
  return ITEMS.map((item, i) => (
    <span key={i} className="flex items-center">
      <span
        className={`mx-[0.4em] whitespace-nowrap font-display font-semibold uppercase leading-none ${
          i % 2 === 1 ? "text-stroke-bone" : ""
        }`}
      >
        {item}
      </span>
      <Asterisk
        className="mx-[0.4em] h-[0.4em] w-[0.4em] shrink-0 text-accent"
        strokeWidth={2.5}
      />
    </span>
  ));
}

/**
 * Infinite marquee that reacts to scroll velocity — it speeds up and
 * skews while you scroll, then relaxes back (an Awwwards staple).
 */
export default function Marquee() {
  const rootRef = useRef(null);
  const wrapRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const root = rootRef.current;
    const wrap = wrapRef.current;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".marquee-row", root);
      const tweens = rows.map((row, i) =>
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 26, ease: "none", repeat: -1 }
        )
      );

      let ts = 1;
      let skew = 0;
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          ts = gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 320);
          skew = gsap.utils.clamp(-14, 14, v / -320);
        },
      });

      const skewTo = gsap.quickTo(wrap, "skewX", {
        duration: 0.4,
        ease: "power2.out",
      });

      const tick = () => {
        ts += (1 - ts) * 0.05;
        skew += (0 - skew) * 0.06;
        tweens.forEach((t) => t.timeScale(ts));
        skewTo(skew);
      };
      gsap.ticker.add(tick);

      /* context cleanup runs on ctx.revert() */
      return () => gsap.ticker.remove(tick);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-hidden
      className="relative overflow-hidden border-y border-bone/10 py-8 md:py-12"
    >
      <div
        ref={wrapRef}
        className="flex flex-col gap-[1.6vw] text-[7.5vw] leading-none md:text-[4.6vw] will-change-transform"
      >
        <div className="marquee-row flex w-max items-center">
          <RowContent />
          <RowContent />
        </div>
        <div className="marquee-row flex w-max items-center">
          <RowContent />
          <RowContent />
        </div>
      </div>
    </section>
  );
}
