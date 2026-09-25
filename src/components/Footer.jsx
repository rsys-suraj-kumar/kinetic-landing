import { useLayoutEffect, useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { gsap } from "../lib/gsap";
import { scrollTo } from "../lib/scroll";

const SITEMAP = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = ["Instagram", "X / Twitter", "Dribbble", "LinkedIn"];

export default function Footer() {
  const rootRef = useRef(null);
  const markRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(markRef.current, {
        yPercent: 115,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 90%", once: true },
      });
      gsap.from(".foot-col", {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 90%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative border-t border-bone/10 px-4 pb-10 pt-16 md:px-8 md:pt-24"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        {/* new business */}
        <div className="foot-col md:col-span-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-fog">
            New business
          </p>
          <a
            href="mailto:hello@kinetic.studio"
            className="group relative mt-4 inline-block font-display text-[clamp(1.5rem,3.2vw,2.8rem)] font-semibold leading-tight"
          >
            hello@kinetic.studio
            <span className="absolute bottom-0 left-0 h-px w-full bg-bone/15">
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </span>
          </a>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-fog">
            Currently booking projects for Q4 2026. Tell us where you want to
            go — we'll choreograph the way there.
          </p>
        </div>

        {/* sitemap */}
        <div className="foot-col md:col-span-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-fog">
            Sitemap
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {SITEMAP.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(l.href);
                  }}
                  className="font-medium uppercase tracking-[0.12em] text-bone/80 transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* socials */}
        <div className="foot-col md:col-span-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-fog">
            Socials
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {SOCIALS.map((s) => (
              <li key={s}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="group flex items-center gap-1 font-medium uppercase tracking-[0.12em] text-bone/80 transition-colors hover:text-accent"
                >
                  {s}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* back to top */}
        <div className="foot-col flex flex-col items-start gap-6 md:col-span-3 md:items-end">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-fog">
            Global — Operating everywhere
          </p>
          <button
            onClick={() => scrollTo(0)}
            className="group flex h-14 w-14 items-center justify-center rounded-full border border-bone/20 transition-colors duration-500 hover:border-accent hover:bg-accent"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:text-ink" />
          </button>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="mt-20 overflow-hidden md:mt-28" aria-hidden>
        <h2
          ref={markRef}
          className="text-stroke-bone select-none text-center font-display text-[19.5vw] font-bold uppercase leading-[0.75] tracking-[-0.03em] transition-colors duration-700 hover:text-bone will-change-transform"
        >
          Kinetic®
        </h2>
      </div>

      {/* bottom bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 pt-6 text-[10px] font-medium uppercase tracking-[0.3em] text-fog">
        <span>© 2026 Kinetic Studio</span>
        <span className="hidden md:block">Designed & built with motion</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
