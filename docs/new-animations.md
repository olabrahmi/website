   must not load until you scroll toward "What I do". It should load as one shared chunk used by both scenes. Check
   that the home page's first-load JS in the build output did not grow by more than a few KB compared with `main`
   (only the two small client wrappers).
2. **Traces:** DevTools Performance, CPU no throttling, "Screenshots" on, record:
   - Baseline: same page with both effects disabled (temporarily force the media queries to fail, for example by
     setting the QUERY to `(min-width: 99999px)`, then restore).
   - Stack: 6 seconds scrolling slowly through the pinned section and hovering slabs.
   - Footer: 6 seconds moving the cursor over the footer after the entrance.
3. Read GPU, raster and main-thread time per frame from the trace, not FPS. Targets on an Apple Silicon laptop at the
   default caps:
   - Stack: main thread under 2ms per frame of script, GPU under 3ms per frame.
   - Footer: main thread under 2ms per frame, GPU under 6ms per frame. If GPU is higher, in order: set
     `transmissionResolutionScale` to 0.5 (if not done), lower `DPR_CAP` to 1.25, lower `BEVEL_SEGMENTS` to 4 and
     `CURVE_SEGMENTS` to 8, lower `antialias` to false at DPR above 1.
   - When neither section is on screen, both scenes must cost zero (no rAF callbacks in the trace).
4. Repeat one footer trace in Safari (Develop > Show Web Inspector > Timelines) because Safari's WebGL is the slowest.
5. Check memory: navigate home to a case study and back three times; in the Memory panel the WebGL contexts must not
   pile up (the stack scene is disposed each time, the footer one stays single).

---

## Phase 5. Docs and cleanup

1. `AGENTS.md`, section "Motion": add two short bullets in the existing voice:
   - Capability stack: where it lives, the gating query, that it never switches layout while the section is in view,
     that the list order matches the slab order (screen on top, pager at the bottom).
   - Footer wordmark: transmission only refracts the WebGL scene, so the footer aurora is duplicated in
     `aurora-backdrop.ts` and the colors must change together with `.aurora-*`; caps (DPR 1.5, 60fps, render only while
     visible); glyphs come from `wordmark-glyphs.json`, generated once from Geist Bold with opentype.js.
   - Mention that `three` is only ever loaded with `import()`.
2. Fix the existing `AGENTS.md` line "Header and footer keep their own `view-transition-name`": only the header has one
   (`site-header.tsx`). Ask the owner whether to add one to the footer instead of guessing; leave it if unsure.
3. `pnpm lint`, `pnpm typecheck`, `pnpm build` all clean. Delete `plans/` only if the owner asks.

---

## Acceptance checklist

- [ ] Desktop 1440x900, light and dark: the stack arrives, walks through four steps in sync with the list, compresses,
      locks, and reverses when scrolling back up. No jank, no layout jump.
- [ ] Hovering a slab lights its list item and chips; hovering a list item lifts its slab; Tab through the proof links
      does the same.
- [ ] Footer: letters rise in order, the light sweeps once, the word tilts and waves with the cursor, the aurora bends
      through the glass, the CSS aurora is gone underneath with no visible seam or color jump.
- [ ] Theme toggle while either effect is visible: colors switch in one frame.
- [ ] Phone width, `prefers-reduced-motion: reduce`, and WebGL disabled (`chrome://flags` or `--disable-webgl`):
      today's grid and the static wordmark, no `three` request in Network.
- [ ] Deep link to `/#capabilities` and `/#contact`: no layout jump.
- [ ] No `three` in first-load JS; zero rAF work when both sections are off screen.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm build` clean. Nothing committed.

---

## Recording notes for the video (for the owner)

- `pnpm build && pnpm start`, Chrome, window 1440x900 or 1600x1000, dark mode (the aurora is richer), 60fps capture.
- Stack: start with the section just below the fold, scroll with a trackpad at an even speed through the four steps,
  pause one beat on the lock, then hover two slabs.
- Footer: reload the page with the footer just out of view, scroll down so the entrance plays on camera, then move the
  cursor slowly left to right across the word, then in a small circle.
- Two clips of 6 to 8 seconds each cut together work better than one long take.

