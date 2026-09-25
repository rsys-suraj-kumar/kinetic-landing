import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../lib/gsap";
import { useFadeUp } from "../hooks/anim";

const PROJECTS = [
  { title: "Lumen Finance", tag: "Digital Product", year: "2026", seed: "kinetic-lumen" },
  { title: "Orbit Atlas", tag: "WebGL Experience", year: "2025", seed: "kinetic-orbit" },
  { title: "Nova Athletics", tag: "E-Commerce", year: "2025", seed: "kinetic-nova" },
  { title: "Studio Mono", tag: "Brand & Web", year: "2024", seed: "kinetic-mono" },
  { title: "Pulse Festival", tag: "Campaign Site", year: "2024", seed: "kinetic-pulse" },
];

/**
 * Selected work: a pinned section that scrubs horizontally on desktop
 * (with per-card image parallax + progress bar) and stacks on mobile.
 */
export default function Work() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const introRef = useRef(null);

  useFadeUp(introRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;

    const mm = gsap.matchMedia();

    /* ---- desktop: pinned horizontal scroll ---- */
    mm.add("(min-width: 768px)", () => {
      const getAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + (getAmount() + 80),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            gsap.set(barRef.current, { scaleX: self.progress }),
        },
      });

      gsap.utils.toArray(".work-par", track).forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => "+=" + (getAmount() + 80),
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      return () => gsap.set(track, { clearProps: "x" });
    });

    /* ---- mobile: stacked cards reveal ---- */
    mm.add("(max-width: 767px)", () => {
      const cards = gsap.utils.toArray(".work-card", root);
      cards.forEach((card) => {
        gsap.from(card, {
          y: 64,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={rootRef} className="relative md:h-screen">
      <div className="flex h-full items-center overflow-hidden py-24 md:py-0">
        <div
          ref={trackRef}
          className="flex flex-col gap-16 px-4 will-change-transform md:flex-row md:items-center md:gap-[5vw] md:px-8"
        >
          {/* intro panel */}
          <div ref={introRef} className="shrink-0 md:w-[28vw]">
            <div data-fade className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-fog">
                Selected Work — 02
              </span>
            </div>
            <h2
              data-fade
              className="mt-8 font-display text-[clamp(2.8rem,6vw,6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.02em]"
            >
              Recent
              <br />
              launches<span className="text-accent">®</span>
            </h2>
            <p data-fade className="mt-8 max-w-sm text-sm leading-relaxed text-fog">
              A slice of what we've shipped lately — fintech tools, WebGL
              worlds and storefronts that outperform their benchmarks.
            </p>
            <p
              data-fade
              className="mt-10 text-[11px] font-medium uppercase tracking-[0.35em] text-fog"
            >
              (05) Projects — Drag the scroll
            </p>
          </div>

          {/* project cards */}
          {PROJECTS.map((p) => (
            <article
              key={p.seed}
              data-cursor="view"
              className="work-card group w-full shrink-0 md:w-[36vw]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-ink-soft">
                <div className="work-par absolute inset-y-0 -left-[6%] w-[112%] will-change-transform">
                  <img
                    src={`https://picsum.photos/seed/${p.seed}/1000/1250?grayscale`}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover contrast-[1.06] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                  />
                </div>
                <span className="absolute right-4 top-4 rounded-full border border-bone/20 bg-ink/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-bone/90 backdrop-blur-sm">
                  {p.year}
                </span>
                <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5 text-ink" />
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold md:text-3xl">
                  {p.title}
                </h3>
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-fog">
                  {p.tag}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* progress bar (pinned with section) */}
      <div
        aria-hidden
        className="absolute bottom-8 left-4 right-4 hidden h-px bg-bone/10 md:block"
      >
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
