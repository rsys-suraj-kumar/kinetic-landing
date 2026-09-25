import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

const STATS = [
  { value: 120, suffix: "+", pad: 3, label: "Projects shipped" },
  { value: 34, suffix: "", pad: 2, label: "Intl. design awards" },
  { value: 9, suffix: "", pad: 2, label: "Years running" },
  { value: 98, suffix: "%", pad: 2, label: "Client retention" },
];

/** Stats strip with scroll-triggered count-up numbers. */
export default function Stats() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stat-num", rootRef.current).forEach((el) => {
        const target = Number(el.dataset.value);
        const pad = Number(el.dataset.pad) || 0;
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent =
              String(Math.round(obj.v)).padStart(pad, "0") + suffix;
          },
        });
      });

      gsap.from(".stat-cell", {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 82%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const cellCls = (i) =>
    [
      "stat-cell relative px-6 py-14 md:px-10 md:py-20 border-bone/10",
      i % 2 === 0 ? "border-r" : "",
      i < 2 ? "border-b lg:border-b-0" : "",
      i < 3 ? "lg:border-r" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <section
      ref={rootRef}
      className="border-y border-bone/10"
      aria-label="Studio stats"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className={cellCls(i)}>
            <span
              className="stat-num block font-display text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-none tracking-[-0.02em]"
              data-value={s.value}
              data-pad={s.pad}
              data-suffix={s.suffix}
            >
              {String(0).padStart(s.pad, "0")}
              {s.suffix}
            </span>
            <span className="mt-4 block text-[11px] font-medium uppercase tracking-[0.3em] text-fog">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
