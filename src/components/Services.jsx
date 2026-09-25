import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "../lib/gsap";
import { useLineReveal } from "../hooks/anim";

const SERVICES = [
  {
    title: "Creative Direction",
    desc: "Concepts, art direction and campaign thinking that give brands a spine.",
    seed: "svc-direction",
  },
  {
    title: "Web Design",
    desc: "Editorial layouts, obsessive typography and interfaces with intent.",
    seed: "svc-web",
  },
  {
    title: "Development & Motion",
    desc: "Buttery GSAP choreography, WebGL scenes and performance-obsessed builds.",
    seed: "svc-dev",
  },
  {
    title: "Brand Identity",
    desc: "Logos, systems and guidelines engineered to flex across every screen.",
    seed: "svc-brand",
  },
];

/**
 * Service rows with a floating image preview that trails the cursor
 * and swaps per row — a hallmark of award-winning agency sites.
 */
export default function Services() {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const previewImgRef = useRef(null);
  const titleRef = useRef(null);
  const [active, setActive] = useState(0);

  useLineReveal(titleRef);

  /* cursor-trailing preview */
  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    const img = previewImgRef.current;
    if (!list || !preview || !img) return;

    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.85 });
    const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e) => {
      const rect = list.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };
    const onEnter = () => {
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: "power3.out" });
    };

    list.addEventListener("mousemove", onMove);
    list.addEventListener("mouseenter", onMove);
    list.addEventListener("mouseleave", onLeave);
    return () => {
      list.removeEventListener("mousemove", onMove);
      list.removeEventListener("mouseenter", onMove);
      list.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* pulse the image whenever the hovered row changes */
  useEffect(() => {
    const img = previewImgRef.current;
    if (!img) return;
    gsap.fromTo(
      img,
      { scale: 1.25 },
      { scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [active]);

  /* row entrance */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-row", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative px-4 py-[16vh] md:px-8"
    >
      <div data-fade className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-fog">
          What we do — 03
        </span>
      </div>

      <h2
        ref={titleRef}
        className="mt-8 font-display text-[clamp(2.8rem,7.5vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.02em]"
      >
        Capabilities<span className="text-accent">®</span>
      </h2>

      <div ref={listRef} className="relative mt-16 border-t border-bone/10">
        {/* floating preview */}
        <div
          ref={previewRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[21rem] w-[16rem] overflow-hidden rounded-[4px] opacity-0 will-change-transform md:block"
        >
          <img
            ref={previewImgRef}
            src={`https://picsum.photos/seed/${SERVICES[0].seed}/480/620?grayscale`}
            alt=""
            className="h-full w-full object-cover contrast-[1.06]"
          />
        </div>

        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            data-cursor="hover"
            onMouseEnter={() => setActive(i)}
            className="service-row group relative flex items-center justify-between gap-6 border-b border-bone/10 py-8 will-change-transform md:py-12"
          >
            <div className="flex items-baseline gap-5 md:gap-8">
              <span className="font-body text-xs font-bold text-accent">
                0{i + 1}
              </span>
              <h3 className="font-display text-[clamp(1.5rem,3.6vw,3.4rem)] font-medium uppercase leading-none tracking-[-0.01em] transition-all duration-500 group-hover:translate-x-3 group-hover:text-accent">
                {s.title}
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <p className="hidden max-w-[15rem] text-sm leading-relaxed text-fog lg:block">
                {s.desc}
              </p>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/20 transition-colors duration-500 group-hover:border-accent group-hover:bg-accent">
                <ArrowUpRight className="h-4 w-4 text-bone transition-colors duration-500 group-hover:text-ink" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
