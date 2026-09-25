# KINETIC® — Award-Style Animated Landing Page

An Awwwards-inspired landing page for a fictional creative studio, built with the
latest React + Tailwind stack and choreographed with GSAP.

## Stack

| Tool | Version | Role |
| --- | --- | --- |
| React | 19 | UI runtime |
| Vite | 8 | Dev server / bundler |
| Tailwind CSS | 4.3 (via `@tailwindcss/vite`) | Styling (CSS-first `@theme` config) |
| GSAP | 3.15 (ScrollTrigger + SplitText) | Scroll & intro choreography |
| Lenis | 1.3 | Buttery smooth scrolling |
| lucide-react | 1.48 | Icons |
| Fontshare | — | Clash Display + Satoshi typefaces |

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Award-winning techniques implemented

Researched from Awwwards / Webby winners (Lusion, Uncommon Studio, Apple,
Rive, Motto, C2MTL) and motion-design write-ups:

1. **Counting preloader** — 0→100 counter, masked wordmark reveal, then a
   5-column staggered curtain lift (`Preloader.jsx`).
2. **Smooth scrolling** — Lenis synced to GSAP's ticker + ScrollTrigger
   (`lib/scroll.js`).
3. **Custom cursor** — dot + lagging ring with `mix-blend-difference`, grows
   on interactive elements, morphs into an accent "View" pill over work cards
   (`CustomCursor.jsx`).
4. **Split-text reveals** — GSAP SplitText with line masks (`hooks/anim.js`).
5. **Velocity-reactive marquee** — infinite loop that speeds up and skews with
   scroll velocity, then relaxes (`Marquee.jsx`).
6. **Manifesto word-fill** — word-by-word opacity scrubbed to scroll position
   (`Manifesto.jsx` + `useScrubWords`).
7. **Pinned horizontal gallery** — Selected Work scrubs sideways with per-card
   image parallax and a progress bar; falls back to a stacked layout on mobile
   (`Work.jsx`).
8. **Floating image previews** — service rows with a cursor-trailing image that
   swaps per row (`Services.jsx`).
9. **Magnetic button** — gravitates toward the cursor, elastic snap-back
   (`CTA.jsx`).
10. **Count-up stats** — numbers scrub in on entry (`Stats.jsx`).
11. **Smart navbar** — blend-mode header with live clock, hides on scroll down,
    fullscreen clip-path menu (`Navbar.jsx`).
12. **Extras** — film-grain overlay, ambient orbs with mouse parallax, hide-on-
    scroll behaviors, `prefers-reduced-motion` guards for Lenis/preloader.

## Structure

```
src/
├─ App.jsx                 # composition + preloader/scroll-lock state
├─ index.css               # Tailwind v4 @theme tokens, utilities, Lenis CSS
├─ lib/
│  ├─ gsap.js              # plugin registration (ScrollTrigger, SplitText)
│  └─ scroll.js            # Lenis instance + scrollTo helper
├─ hooks/anim.js           # useLineReveal / useFadeUp / useScrubWords
└─ components/             # Preloader, CustomCursor, Navbar, Hero, Marquee,
                           # Manifesto, Work, Services, Stats, CTA, Footer, Grain
```

## Notes

- Images are seeded placeholders from `picsum.photos` (grayscale) — swap in
  real art direction easily via the `seed` fields in `Work/Services`.
- Animations pause automatically while the browser window is occluded
  (`requestAnimationFrame` throttling) and resume when visible.
