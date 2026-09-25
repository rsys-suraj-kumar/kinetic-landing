import { useLayoutEffect } from "react";
import { gsap, SplitText } from "../lib/gsap";

/** Resolve after web fonts have loaded so SplitText measures lines correctly. */
function fontsReady(cb) {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready.then(() => cb());
  } else {
    cb();
  }
}

/**
 * Split an element into masked lines and reveal them from below
 * when it scrolls into view. (The classic Awwwards heading reveal.)
 */
export function useLineReveal(
  ref,
  {
    trigger,
    start = "top 85%",
    delay = 0,
    stagger = 0.09,
    duration = 1.1,
  } = {}
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx;
    let cancelled = false;
    fontsReady(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const split = new SplitText(el, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 115,
          duration,
          ease: "power4.out",
          stagger,
          delay,
          scrollTrigger: { trigger: trigger || el, start, once: true },
        });
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
}

/**
 * Fade-and-rise every element matching `selector` (default [data-fade])
 * inside the container when the container enters the viewport.
 */
export function useFadeUp(
  ref,
  {
    trigger,
    selector = "[data-fade]",
    y = 48,
    stagger = 0.09,
    delay = 0,
    start = "top 82%",
  } = {}
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = selector ? el.querySelectorAll(selector) : [el];
      if (!targets.length) return;
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        stagger,
        delay,
        scrollTrigger: { trigger: trigger || el, start, once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);
}

/**
 * Word-by-word opacity "fill" scrubbed to scroll position —
 * the manifesto effect seen across award-winning sites.
 */
export function useScrubWords(
  ref,
  { start = "top 78%", end = "bottom 42%" } = {}
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx;
    let cancelled = false;
    fontsReady(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const split = new SplitText(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.13 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
          }
        );
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
}
