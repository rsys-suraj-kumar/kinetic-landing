import { useRef } from "react";
import { useScrubWords, useFadeUp } from "../hooks/anim";

const VALUES = [
  {
    title: "Design-led",
    body: "Every project starts with the eye — editorial layouts, obsessive typography and grids that breathe.",
  },
  {
    title: "Motion-first",
    body: "Animation is not decoration, it's language. Interfaces should speak with weight, ease and intent.",
  },
  {
    title: "Built to last",
    body: "Performance budgets, accessibility and clean engineering — beauty that doesn't collapse under load.",
  },
];

export default function Manifesto() {
  const rootRef = useRef(null);
  const textRef = useRef(null);

  useScrubWords(textRef);
  useFadeUp(rootRef);

  return (
    <section
      id="studio"
      ref={rootRef}
      className="relative px-4 py-[16vh] md:px-8 md:py-[20vh]"
    >
      <div data-fade className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-fog">
          The Studio — 01
        </span>
      </div>

      <p
        ref={textRef}
        className="mt-12 max-w-6xl font-display text-[clamp(1.9rem,4.6vw,4.4rem)] font-medium leading-[1.12] tracking-[-0.01em]"
      >
        Kinetic is an independent studio sculpting websites that{" "}
        <em className="not-italic text-accent">perform</em> — where every
        pixel earns its place, every scroll tells a story, and movement is
        meaning.
      </p>

      <div className="mt-24 grid gap-12 md:grid-cols-3 md:gap-8">
        {VALUES.map((v) => (
          <div
            key={v.title}
            data-fade
            className="border-t border-bone/10 pt-6"
          >
            <h3 className="font-display text-xl font-semibold uppercase md:text-2xl">
              {v.title}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-fog">
              {v.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
