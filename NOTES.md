# Portfolio Notes

Reference for Hassan Ahmed's personal portfolio. This file is meant to make future work on this repo fast — architecture, why things are the way they are, and the gotchas that already cost time once.

## What this is

A single-page application deployed at <https://hassanahmedshm.github.io/>. The landing page (`/`) is a cinematic portfolio with Hero / About / Manifesto / Projects / Contact sections. Four subpages (`/ag`, `/lifetrack`, `/astrov`, `/optiscan`) host self-contained case studies.

GitHub Pages SPA routing is handled via a tiny sessionStorage redirect shim in `index.html`.

## Tech stack

- **Vite 6** + **React 19** + **TypeScript 5** (strict)
- **Tailwind** (utility classes mostly used in Navbar)
- **react-router-dom v7** with `HashRouter` (required for GH Pages)
- **GSAP 3** + **ScrollTrigger** + **ScrollToPlugin** for animations
- **Lenis 1** for smooth-scroll
- **Three.js** + **@react-three/fiber** + **@react-three/drei** for the Projects three.js scene (WORK letters)
- **Recharts**, **Leaflet** (only used by AstroV / AG / LifeTrack / Optiscan — none used on landing)
- `gh-pages` for deploy
- `vitest` + Testing Library (tests exist for `useDeviceCapabilities` and `textureLoader`)

## Project layout

```
src/
  App.tsx                          Router shell + Landing page composition
  main.tsx                         ReactDOM.createRoot(<App/>)
  pages/
    AG.tsx                         Subpage — Autonomous Agent case study
    LifeTrack.tsx                  Subpage — LifeTrack case study
    AstroV.tsx                     Subpage — asteroid tracker case study
    Optiscan.tsx                   Subpage — ocular CV case study
    NotFound.tsx                   404
  components/
    Hero/                          Landing — name + animated letters
    About/                         Landing — bio + photo + animated line, held stage
    Manifesto/                     Landing — scroll-pinned word reveal
    Projects/                      Landing — horizontal scrolling cards + WORK letters
    Contact/                       Landing — footer w/ email + socials
    Navbar/                        Fixed nav, command-center overlay, TOC menu
    Transitions/    CombIntro.tsx              Loading intro overlay — the mark draws itself
    CombIntro.css             Styles for the intro overlay
    LoadingSpinner/                Spinner used in route Suspense fallbacks
    ErrorBoundary.tsx              Top-level error boundary (used per-section in App)
    SectionError/                  Error fallback UI
    SectionSkeleton/               Skeleton placeholder for Suspense
    StarField/                     Twinkling canvas background
    Logo/StylizedH.tsx             The hand-drawn H mark used in nav/contact
    SidebarGame/                   Flappy/Snake/Reaction games in command-center menu
    Scene/Scene.tsx                Three.js particle field (UNUSED on landing — kept around)
  hooks/
    useScrollProgress.ts           Reads window.scrollY → 0..1 (consumed by Navbar progress bar)
    useScrollDirection.ts          'up' | 'down' for nav hide-on-scroll
    useScrollTriggerCleanup.ts     Per-component ScrollTrigger lifecycle (register + kill on unmount)
    useLenis.ts                    Standalone Lenis init (DO NOT call — App owns the singleton)
    useLetterExplosion.ts          Hero name "explode" animation
    useLetterExplosion helper for Hero
    useWordReveal.ts               Manifesto scroll-pinned word sequence
    useDeviceCapabilities.ts       WebGL/CPU/mobile detection — used to gate heavy animations
    useButtonMicroInteraction.ts   Tiny press/hover scale handler used on contact buttons
    useLenis.ts                    Standalone Lenis init (unused after the dual-lenis fix)
  styles/
    index.css                      Global tokens, content-area gate, scrollbar, etc.
    reset.css                      Minimal CSS reset
  utils/
    animation.ts                   requestIdleCallback helper used by StarField
    math.ts                        seededRandomRange + lerp (used by Hero + Projects)
    impactCalculator.ts            Used by AstroV only
    textureLoader.ts               Used by three.js scene; has unit tests
  services/
    nasaApi.ts                     Used by AstroV only
public/
  images/, textures/               Static assets referenced by sections / subpages
  404.html                         Fallback for GH Pages SPA redirects
  favicon.ico                      1×1 transparent PNG (stops the 404)
```

## Routing

`HashRouter` (`src/App.tsx`). Five routes:

| Path | Element | Loading |
|---|---|---|
| `/` | `Portfolio` (full landing page) | n/a — eager |
| `/astrov` | `<AstroV/>` (lazy) | `<LoadingSpinner/>` |
| `/optiscan` | `<Optiscan/>` (lazy) | `<LoadingSpinner/>` |
| `/ag` | `<AG/>` (lazy) | `<LoadingSpinner/>` |
| `/lifetrack` | `<LifeTrack/>` (lazy) | `<LoadingSpinner/>` |
| anything else | `<NotFound/>` | n/a |

The four subpages are `React.lazy()`-loaded for code-splitting. The landing page sections (`Hero`, `Manifesto`, `About`, `Projects`) are also `React.lazy()` inside `Portfolio` (see "The lazy-load race" gotcha below).

## Landing page composition

`Portfolio` renders:

```
<CombIntro onComplete={handleLoadingComplete} />   // mounted only when !introSeen & !reducedMotion
<div className="content-area" data-loading={...}>
  <Navbar contentRef={contentRef} />             // fixed top
  <div className="global-scroll-progress" .../>   // progress bar driven by useScrollProgress
  <main ref={contentRef}>
    <Suspense fallback={<SectionSkeleton type="hero" />}>
      <ErrorBoundary fallback={<SectionError section="hero" />}>
        <Hero reducedMotion={reducedMotion} />
      </ErrorBoundary>
    </Suspense>
    ... (same wrapper for About, Manifesto, Projects)
    <Contact />                                   // NOT lazy, NOT wrapped — Contact is the footer
  </main>
</div>
```

`Contact` is intentionally eager because it's the closing section and lazy-wrapping it isn't worth the complexity.

## The intro overlay

`src/components/Transitions/CombIntro.tsx` + `.css` (the CSS file only exists since the intro was rebuilt — it used to have **no styles at all**, just a faded `<h1>`).

The beat sheet, ~2.6s total, driven by one GSAP timeline:

| time | beat |
|---|---|
| 0.15s | the isometric H draws itself (`strokeDashoffset` → 0, path length ~1327px) with a blue drop-shadow glow, dead centre of the screen |
| 1.75s | the site behind starts fading up (`onReveal`), the mark flies past the camera (scale 5.5 + blur 26px + hot glow) |
| 1.8s | the overlay's background fades to transparent over the revealed site |
| ~2.6s | `onComplete` → the overlay unmounts |

Nothing else on screen — the mark is the whole piece, so it sits alone at the centre of the frame.

**The handoff is the whole trick.** `App.tsx` keeps two separate flags: `isLoading` (the overlay is up) and `contentReady` (the site is revealed). `onReveal` flips `contentReady` *before* the overlay dissolves, so the site fades up **behind** the mark instead of popping in after a black frame. `.content-area` therefore needs its `transition: opacity` — without it the reveal is a hard cut.

Skippable: any key or click jumps the timeline to `progress(1)`, which still fires `onReveal` then `onComplete` in order.

Shown on first visit only (`intro-seen` in localStorage) and never under reduced motion.

**Replaying it:** `http://localhost:5173/?intro=1` forces the intro to play even for returning visitors (`App.tsx` checks the query param before reading localStorage). Without it you have to clear the flag:
```js
localStorage.removeItem('intro-seen')
```

## The intro overlay + loading gate

`CombIntro` ends by calling `handleLoadingComplete` which:
1. `setIsLoading(false)` (React state in `Portfolio` — unmounts the overlay)
2. `localStorage.setItem('intro-seen', 'true')`
3. `setTimeout(ScrollTrigger.refresh, 120)` (recompute trigger positions now that content is visible)

It also calls `onReveal` earlier in the timeline, which flips `contentReady` and fades the site up behind the still-visible overlay.

The content-area is hidden by default in `index.css`:

```css
.content-area {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.55s var(--ease-out-expo);
}
.content-area[data-loading="false"] { opacity: 1; visibility: visible; }
```

`data-loading` is now just `!contentReady`. `contentReady` starts as `introSeen` (a returning visitor never sees the overlay) and is forced to `true` by the reduced-motion effect.

## Animation stack

- **GSAP ticker** drives ScrollTrigger.
- **Lenis** is created exactly once, in `App.tsx`'s `Portfolio`. It's wired into ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` and into the GSAP ticker via a `tickerCallback(time) => lenis.raf(time * 1000)`. Lag smoothing is disabled for frame-accurate scroll.
- **Reduced motion** is detected from `prefers-reduced-motion` AND a user toggle in `localStorage` under `motion-enabled`. Components receive `reducedMotion` as a prop and skip GSAP work (or set final state immediately) when true.

## Sections — what each does

- **Hero** — `useLetterExplosion` scatters the letters as you scroll past. Stars come from `StarField` (canvas twinkle).
- **About** — Bio column on the left, school photo on the right, and the animated vertical gradient line between them. The reveal has two beats, in this order: **(1)** the stripe grows out of the dead center of the screen, expanding up *and* down (`scaleY` 0 → 1, `transform-origin: center center`) until it is complete; **(2)** only then do the text and photo slide out from behind it — text off to the left, photo off to the right. Desktop holds the section as a stage (`.about-grid` is `position: sticky; top: 0`, the section is `200svh`) so the whole reveal is watched happen on screen with the content framed and still, and the single scrubbed trigger runs `top top` → `bottom bottom`. Both columns are **clipped at the stripe** (`overflow: hidden` on `.about-content` / `.about-image-column`, no column gap) so a column can only ever slide *out* from behind the divider — it can never cross onto the other side. Mobile has no visible line, so it becomes a single one-shot timeline (photo rises, then text).
- **Manifesto** — **Pinned** by ScrollTrigger. As you scroll through ~2000px of pinned scroll, five words fade in/out one at a time: "AI should empower not replace." (set in `Manifesto.tsx`). The pin is `+=2000`, which means the document grows by 2000px when manifesto is mounted. The CSS already had `.manifesto.pin-spacer` rules ready for this — only the `pin: true` flag was missing.
- **Projects** — Horizontal-scrolling showcase of four project cards (AstroV / AG / Optiscan / LifeTrack). A three.js scene draws the letters W, O, R, K floating on a perspective curve above a dot grid (the "WORK" letters). The cards-container slides left as you scroll vertically through the section. Hovering a card swaps the native cursor for a floating info panel (`CustomCursor.tsx`) that trails the pointer with a lag and is clamped to the viewport; the panel is decorative (aria-hidden), the card itself stays the accessible control. The pointer position is kept in a ref, not state, so mouse movement never re-renders the pinned section.
- **Contact** — Footer with the stylized H, email, GitHub + LinkedIn icons, copyright.

## Subpages

Treat these as **read-only black boxes** unless you're specifically asked to touch them. Each is a self-contained app with its own state, layout, and assets. They were working before the landing-page fixes and should stay that way.

If you need to change shared behavior (e.g. global scroll, intro overlay), test that it doesn't break the subpages — they each render bare, without the Portfolio wrapper.

## Gotchas that already cost time

These are bugs we hit and fixed. Don't accidentally re-introduce them.

### 1. CombIntro timeline restart race

If `handleLoadingComplete` isn't stable across renders, the `CombIntro` GSAP timeline is killed and restarted on every `App` re-render — and `App` re-renders constantly (every scroll tick fires `setProgress` in `useScrollProgress`). The intro never completes, `data-loading` stays `"true"`, and the user sees a black page forever.

**Fix:**
- `handleLoadingComplete` is wrapped in `useCallback(..., [])`.
- `CombIntro` stores `onComplete` in a ref, the GSAP effect is mount-only (`[]`), and the timeline reads `onCompleteRef.current?.()` inside its `onComplete`. No dependency on the callback identity.

### 2. Dual Lenis

`App.tsx` creates a Lenis and wires it to `gsap.ticker`. `useScrollProgress` used to also call `useLenis()`, which created a second Lenis and registered a second `gsap.ticker` callback. Two competing smooth-scroll loops fighting each other.

**Fix:** `useScrollProgress` no longer imports or calls `useLenis`. The single Lenis in `App.tsx` is enough — `window` scroll events still fire normally for `useScrollProgress`.

### 3. Lazy-load race in the Navbar

`Hero`, `About`, `Manifesto`, `Projects` are `React.lazy()`-loaded. The `Navbar` is rendered before the `<main>`, so on its first commit only `#contact` exists in the DOM. The old effect ran once with `[contentRef]` deps and skipped the missing sections — meaning **only `contact`'s ScrollTrigger ever got created**, so `activeSection` was permanently locked to `"contact"`.

**Fix:** The effect now retries via `requestAnimationFrame` until every section is in the DOM, then creates all triggers.

### 4. Nav triggers for pinned sections

When `pin: true` is used on a section (Manifesto), GSAP wraps it in a `.pin-spacer`. Using the section itself as the nav trigger is wrong — its viewport top is fixed at 0 during the pin, so `start: "top center"` is never reached.

**Fix:** If the section's parent is a `.pin-spacer`, use the pin-spacer as the trigger instead. The pin-spacer still scrolls naturally.

### 5. Projects scroll distance too long

The original `ScrollTrigger` on Projects was `end: "+=400%"` with `moveDistance = window.innerWidth * 2`, on a document that's only ~4500px tall. ScrollTrigger could only run to ~25% progress, and the cards-container had `padding-left: 100vw` so the first card was off-screen at the right edge. Result: empty Projects section.

**Fix:** `end: "+=100%"`, `moveDistance = window.innerWidth`, `padding-left: 5vw`. All four cards now reachable in a normal page scroll.

### 6. `overflow-x: hidden` on `body` silently kills `position: sticky`

`body { overflow-x: hidden }` turns the body into a scroll container that never scrolls. Any `position: sticky` descendant then sticks to *that* container instead of the viewport, so it simply scrolls away with the page — with no error and no warning. The About section's held stage silently did nothing because of this.

**Fix:** `body { overflow-x: clip }`. `clip` hides the overflow without creating a scroll container, so sticky keeps working. Never use `overflow-x: hidden` on `body`/`html` in this project.

### 7. A CSS `transform` beats the inline transform on the custom cursor

`CustomCursor` writes its follow position to `style.transform` every frame. A stylesheet rule on the same element wins over the inline value — including with `!important` — so the panel sat parked at the top-left corner of the viewport while the native cursor was hidden.

**Fix:** Never set `transform` in CSS for `.custom-cursor`; the JS owns it. If you need to restyle the panel, use other properties.

### 8. Never insert DOM nodes into React-managed elements

React's reconciler only knows about the children it rendered. Inserting a node into a React-managed element at runtime makes the DOM diverge from React's view of it, and the next re-render throws `NotFoundError: Failed to execute 'removeChild' on 'Node'` and the section falls over to the error boundary.

**Fix:** If you need extra DOM, render it from JSX. If you genuinely need to touch the DOM by hand, do it in an element React treats as a leaf, and clean it up in the effect's teardown.

## Build & deploy

```bash
npm run dev       # vite dev server (http://localhost:5173, falls back to 5174 etc.)
npm run build     # vite build → dist/
npm run preview   # serve dist/
npm run deploy    # predeploy (npm run build) then gh-pages -d dist -t --nojekyll -v .gitignore
npm test          # vitest --run (only two tests, useDeviceCapabilities and textureLoader)
```

The build outputs `dist/` with hashed asset names. The `index.html` script has the GH Pages SPA redirect shim that turns `?/path` into `/path` on load.

## Adding a new landing-page section

1. Create `src/components/<Name>/<Name>.tsx` and `<Name>.css`.
2. Add to `App.tsx` in the same `lazy(...)` pattern as the other sections, and insert the `<Suspense>+<ErrorBoundary>` wrapper in the right vertical order.
3. Add the section ID to the `sections` array in `Navbar.tsx` (it'll appear as a TOC link automatically).
4. If the section needs pinning, use `pin: true` in its ScrollTrigger and remember to update the Navbar's nav-trigger setup if you need its TOC link to highlight while pinned (the existing pin-spacer-aware code already handles this — just use the section ID).
5. Make sure the section has `id="<name>"` and matches the kebab-case convention used elsewhere.

## Adding a new subpage

1. Create `src/pages/<Name>.tsx` as a default export.
2. Add a `lazy(() => import('./pages/<Name>'))` line in `App.tsx` and a `<Route path="/<name>" element={...}/>`.
3. Link from the Projects section (`src/components/Projects/Projects.tsx` — `projects` array near top of file). Add an image to `public/images/`.

## Style conventions

- Tailwind classes are used sparingly — mostly in the Navbar (sticky, translate-y, etc.).
- Per-component CSS files for everything else, imported by the component file.
- CSS variables for colors and spacing live in `:root` and `[data-theme="light"]` in `src/styles/index.css`. Theme toggle is in the Navbar.
- Comments are sparse but present at decision points. Don't add noise.

## Tips for future work

- **Test in a real browser, not just the build.** Most of the bugs we hit were runtime-only — visible only after GSAP and ScrollTrigger had a chance to actually run.
- **Drive Chrome via puppeteer for visual debugging.** Pattern:
  ```js
  import puppeteer from 'puppeteer-core';
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu'],
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
  });
  ```
  Pre-set `localStorage.setItem('intro-seen', 'true')` and reload to skip the intro overlay for screenshot tests.
- **When you add a ScrollTrigger to a pinned element**, always check that other triggers referencing that element use the pin-spacer instead.
- **When you add a callback prop to a child component**, think about whether the parent's identity is stable across renders. If it isn't, store the callback in a ref inside the child.
- **When you suspect a re-render race**, add `console.log` to the relevant `setX` calls and to the effect, then watch the browser console while interacting.