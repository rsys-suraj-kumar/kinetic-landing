import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap } from "../lib/gsap";

const MARK = "KINETIC".split("");

/**
 * Hero: masked headline reveal, inline image pill, giant parallax wordmark
 * and a mouse-following ambient orb. Intro timeline plays once the
 * preloader curtain starts lifting (`start` prop).
 */
export default function Hero({ start }) {
  const rootRef = useRef(null);
  const orbRef = useRef(null);
  const headRef = useRef(null);
  const markWrapRef = useRef(null);
  const headLinesRef = useRef([]);
  const pillRef = useRef(null);
  const markCharsRef = useRef([]);
  const topElsRef = useRef([]);
  const introTl = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      const topEls = topElsRef.current.filter(Boolean);
      const headLines = headLinesRef.current.filter(Boolean);
      const markChars = markCharsRef.current.filter(Boolean);

      /* initial hidden states */
      gsap.set(topEls, { y: 24, autoAlpha: 0 });
      gsap.set(headLines, { yPercent: 115 });
      gsap.set(markChars, { yPercent: 120 });
      gsap.set(pillRef.current, { scale: 1.6 });

      /* intro timeline (paused until preloader reveals) */
      introTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power4.out" } })
        .to(topEls, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0)
        .to(headLines, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.1)
        .to(
          pillRef.current,
          { scale: 1.05, duration: 1.3, ease: "power3.out" },
          0.45
        )
        .to(markChars, { yPercent: 0, duration: 1, stagger: 0.035 }, 0.5);

      /* scroll parallax — applied to WRAPPERS so it never fights the
         intro reveal on the inner spans (that caused the text to
         snap back to its hidden state on first scroll) */
      gsap.to(headRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(markWrapRef.current, {
        yPercent: 26,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(orbRef.current, {
        yPercent: 140,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    /* mouse parallax on the orb */
    const orbX = gsap.quickTo(orbRef.current, "x", {
      duration: 1.2,
      ease: "power3.out",
    });
    const orbY = gsap.quickTo(orbRef.current, "y", {
      duration: 1.2,
      ease: "power3.out",
    });
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      orbX(nx * 90);
      orbY(ny * 90);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (start) introTl.current?.play();
  }, [start]);

  return (
    <section
      ref={rootRef}
      className="relative flex h-[100svh] flex-col justify-between overflow-hidden px-4 pb-5 pt-20 md:px-8 md:pt-24"
    >
      {/* faint vertical hairlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mx-4 grid grid-cols-2 md:mx-8 md:grid-cols-4"
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`${i > 0 ? "border-l" : ""} border-bone/[0.05]`}
          />
        ))}
      </div>

      {/* ambient orb */}
      <div
        ref={orbRef}
        aria-hidden
        className="absolute -right-[6vw] top-[18vh] h-[34vw] w-[34vw] rounded-full bg-accent/15 blur-[110px] will-change-transform"
      />

      {/* top meta row */}
      <div className="relative flex items-start justify-between text-[10px] font-medium uppercase tracking-[0.3em] text-fog md:text-[11px]">
        <p
          ref={(el) => {
            topElsRef.current[0] = el;
          }}
        >
          Independent
          <br />
          Creative Studio
        </p>
        <p
          ref={(el) => {
            topElsRef.current[1] = el;
          }}
          className="hidden text-center md:block"
        >
          Est. 2019
          <br />
          Operating worldwide
        </p>
        <p
          ref={(el) => {
            topElsRef.current[2] = el;
          }}
          className="flex items-center gap-2 text-right"
        >
          Scroll to explore
          <ArrowDown className="h-3.5 w-3.5 animate-bounce text-accent" />
        </p>
      </div>

      {/* headline */}
      <h1
        ref={headRef}
        className="relative font-display text-[clamp(3.4rem,11.5vw,11.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.02em] will-change-transform"
      >
        <span className="block overflow-hidden">
          <span
            ref={(el) => {
              headLinesRef.current[0] = el;
            }}
            className="block will-change-transform"
          >
            We craft
          </span>
        </span>
        <span className="block overflow-hidden">
          <span
            ref={(el) => {
              headLinesRef.current[1] = el;
            }}
            className="block will-change-transform"
          >
            <span className="mx-[0.06em] inline-block h-[0.72em] w-[1.9em] overflow-hidden rounded-full align-[-0.08em]">
              <img
                ref={pillRef}
                src="https://picsum.photos/seed/kinetic-hero/480/280?grayscale"
                alt=""
                className="h-full w-full origin-center object-cover will-change-transform"
              />
            </span>
            Digital
          </span>
        </span>
        <span className="block overflow-hidden">
          <span
            ref={(el) => {
              headLinesRef.current[2] = el;
            }}
            className="block will-change-transform"
          >
            Motion<span className="text-accent">®</span>
          </span>
        </span>
      </h1>

      {/* giant wordmark */}
      <div
        ref={markWrapRef}
        aria-hidden
        className="relative select-none text-center font-display text-[19.5vw] font-bold uppercase leading-[0.78] tracking-[-0.03em] text-bone will-change-transform"
      >
        {MARK.map((c, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span
              ref={(el) => {
                markCharsRef.current[i] = el;
              }}
              className="inline-block will-change-transform"
            >
              {c}
            </span>
          </span>
        ))}
        <span className="inline-block overflow-hidden">
          <span
            ref={(el) => {
              markCharsRef.current[MARK.length] = el;
            }}
            className="mt-[0.12em] inline-block align-top text-[0.28em] text-accent will-change-transform"
          >
            ®
          </span>
        </span>
      </div>
    </section>
  );
}
