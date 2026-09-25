import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { lenis, scrollTo } from "../lib/scroll";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = ["Instagram", "X / Twitter", "Dribbble", "LinkedIn"];

export default function Navbar({ start }) {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const menuPanelRef = useRef(null);
  const menuLinksRef = useRef([]);
  const menuMetaRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  /* live clock */
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* entrance after preloader */
  useLayoutEffect(() => {
    if (!start) return;
    gsap.fromTo(
      navRef.current,
      { yPercent: -130 },
      { yPercent: 0, duration: 0.9, ease: "power3.out", delay: 0.35 }
    );
    return () => {
      gsap.killTweensOf(navRef.current);
    };
  }, [start]);

  /* hide on scroll down, show on scroll up */
  useLayoutEffect(() => {
    let lastY = 0;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const goingDown = y > lastY && y > 140;
        gsap.to(navRef.current, {
          yPercent: goingDown ? -130 : 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
        lastY = y;
      },
    });
    return () => st.kill();
  }, []);

  /* menu open/close timeline */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        menuPanelRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.inOut" }
      )
        .from(
          menuLinksRef.current.filter(Boolean),
          {
            yPercent: 130,
            duration: 0.8,
            stagger: 0.07,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .from(
          menuMetaRef.current,
          { autoAlpha: 0, y: 24, duration: 0.5, ease: "power3.out" },
          "-=0.45"
        );
      menuRef.current = tl;
    });
    return () => ctx.revert();
  }, []);

  /* react to open state */
  useEffect(() => {
    const tl = menuRef.current;
    if (!tl) return;
    if (open) {
      lenis?.stop();
      menuPanelRef.current.style.pointerEvents = "auto";
      tl.play();
    } else {
      lenis?.start();
      menuPanelRef.current.style.pointerEvents = "none";
      tl.reverse();
    }
  }, [open]);

  /* escape to close */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href) => {
    setOpen(false);
    lenis?.start();
    requestAnimationFrame(() => scrollTo(href));
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-[110] mix-blend-difference"
        style={{ transform: "translateY(-130%)" }}
      >
        <nav className="flex items-center justify-between px-4 py-5 md:px-8">
          <button
            onClick={() => scrollTo(0)}
            className="font-display text-lg font-semibold uppercase tracking-[-0.01em] text-bone"
            aria-label="Back to top"
          >
            Kinetic<span className="text-[0.6em] align-top">®</span>
          </button>

          <p className="hidden text-[11px] font-medium uppercase tracking-[0.3em] text-bone/60 tabular-nums md:block">
            Local — {time || "00:00:00"}
          </p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:hello@kinetic.studio"
              className="hidden text-[11px] font-medium uppercase tracking-[0.25em] text-bone/80 transition-colors hover:text-bone lg:block"
            >
              hello@kinetic.studio
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-bone/40 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-bone transition-colors duration-300 hover:bg-bone hover:text-black"
              aria-expanded={open}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      {/* fullscreen menu overlay */}
      <div
        ref={menuPanelRef}
        className="fixed inset-0 z-[100] bg-ink-soft"
        style={{
          clipPath: "inset(0% 0% 100% 0%)",
          pointerEvents: "none",
        }}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col justify-between px-4 pb-8 pt-28 md:px-8">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link, i) => (
              <div key={link.href} className="overflow-hidden">
                <button
                  ref={(el) => {
                    menuLinksRef.current[i] = el;
                  }}
                  onClick={() => go(link.href)}
                  className="group flex items-baseline gap-4 text-left font-display text-[13vw] font-semibold uppercase leading-[0.95] text-bone transition-colors duration-300 hover:text-accent md:text-[7.5vw]"
                >
                  <span className="font-body text-xs font-bold text-accent">
                    0{i + 1}
                  </span>
                  {link.label}
                </button>
              </div>
            ))}
          </nav>

          <div
            ref={menuMetaRef}
            className="flex flex-wrap items-end justify-between gap-8 border-t border-bone/10 pt-6"
          >
            <div className="flex gap-10">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] font-medium uppercase tracking-[0.25em] text-fog transition-colors hover:text-accent"
                >
                  {s}
                </a>
              ))}
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-fog">
              Esc to close — © 2026 Kinetic
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
