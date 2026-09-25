import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../lib/gsap";
import { useLineReveal, useFadeUp } from "../hooks/anim";

/** A button that gravitates toward the cursor and snaps back elastically. */
function MagneticButton({ children, href }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.4, ease: "power3.out" });
    const ixTo = gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3.out" });
    const iyTo = gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo(relX * 0.35);
      yTo(relY * 0.35);
      ixTo(relX * 0.18);
      iyTo(relY * 0.18);
    };
    const onLeave = () => {
      gsap.to(wrap, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <a
      ref={wrapRef}
      href={href}
      className="mt-14 inline-flex h-40 w-40 items-center justify-center rounded-full bg-accent text-ink will-change-transform md:h-44 md:w-44"
    >
      <span
        ref={innerRef}
        className="flex flex-col items-center gap-1 text-[12px] font-bold uppercase tracking-[0.2em] will-change-transform"
      >
        {children}
      </span>
    </a>
  );
}

/** Big closing statement with kinetic type + magnetic CTA. */
export default function CTA() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useLineReveal(titleRef);
  useFadeUp(rootRef, { selector: "[data-fade]" });

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative overflow-hidden px-4 py-[20vh] text-center md:py-[24vh]"
    >
      {/* ambient orb */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[130px]"
      />

      <p
        data-fade
        className="relative text-[11px] font-medium uppercase tracking-[0.35em] text-fog"
      >
        (04) — Got a project in mind?
      </p>

      <h2
        ref={titleRef}
        className="relative mt-8 font-display font-semibold uppercase leading-[0.85] tracking-[-0.02em]"
      >
        <span className="block text-[clamp(3.6rem,15vw,14rem)]">Let's</span>
        <span className="block text-[clamp(3.6rem,15vw,14rem)] text-accent">
          Move<span className="align-top text-[0.35em]">®</span>
        </span>
      </h2>

      <div data-fade className="relative flex justify-center">
        <MagneticButton href="mailto:hello@kinetic.studio">
          Start
          <br />
          a project
          <ArrowUpRight className="mt-1 h-4 w-4" />
        </MagneticButton>
      </div>
    </section>
  );
}
