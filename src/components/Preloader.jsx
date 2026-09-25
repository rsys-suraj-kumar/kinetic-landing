import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/scroll";

const WORD = "KINETIC®".split("");
const COLS = 5;

/**
 * Award-style intro: a counting preloader that lifts away in
 * staggered vertical curtain columns, revealing the hero beneath.
 */
export default function Preloader({ onReveal }) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const charsRef = useRef([]);
  const colsRef = useRef([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const chars = charsRef.current.filter(Boolean);
        const cols = colsRef.current.filter(Boolean);
        const counterEl = counterRef.current;

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          onComplete: () => {
            root.style.display = "none";
          },
        });

        if (prefersReducedMotion) {
          tl.add(() => onReveal?.()).to(root, { autoAlpha: 0, duration: 0.4 });
          return;
        }

        const counter = { v: 0 };

        tl.from(chars, {
          yPercent: 120,
          duration: 0.9,
          stagger: 0.045,
        }, 0.05)
          .from(counterEl, { yPercent: 120, autoAlpha: 0, duration: 0.6 }, 0.2)
          .to(
            counter,
            {
              v: 100,
              duration: 1.7,
              ease: "power2.inOut",
              onUpdate: () => {
                counterEl.textContent = String(
                  Math.round(counter.v)
                ).padStart(3, "0");
              },
            },
            0.35
          )
          .fromTo(
            barRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.7, ease: "power2.inOut" },
            0.35
          )
          .to(
            chars,
            { yPercent: -130, duration: 0.7, stagger: 0.03, ease: "power3.in" },
            "+=0.15"
          )
          .to(contentRef.current, { autoAlpha: 0, duration: 0.3 }, "<0.35")
          .add(() => onReveal?.())
          .to(cols, {
            yPercent: -101,
            duration: 0.9,
            stagger: 0.06,
            ease: "expo.inOut",
          });
      }, root);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[120]" aria-hidden>
      {/* curtain columns */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              colsRef.current[i] = el;
            }}
            className="h-full flex-1 bg-ink-soft will-change-transform"
          />
        ))}
      </div>

      {/* progress hairline */}
      <div className="absolute left-0 top-0 z-10 h-px w-full bg-bone/10">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* wordmark */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="flex overflow-hidden font-display text-[14vw] font-semibold uppercase leading-none tracking-[-0.02em] md:text-[9vw]">
          {WORD.map((c, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span
                ref={(el) => {
                  charsRef.current[i] = el;
                }}
                className={`inline-block will-change-transform ${
                  c === "®"
                    ? "mt-[0.16em] align-top text-[0.35em] text-accent"
                    : ""
                }`}
              >
                {c}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* counter */}
      <div className="absolute bottom-6 right-6 z-10 text-right md:bottom-10 md:right-10">
        <div className="overflow-hidden">
          <span
            ref={counterRef}
            className="block font-display text-[16vw] font-semibold leading-none text-bone/90 tabular-nums md:text-[9vw]"
          >
            000
          </span>
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-fog">
          Loading the experience
        </p>
      </div>

      {/* bottom-left tag */}
      <p className="absolute bottom-6 left-6 z-10 text-[10px] uppercase tracking-[0.35em] text-fog md:bottom-10 md:left-10">
        Kinetic Studio — Est. 2019
      </p>
    </div>
  );
}
