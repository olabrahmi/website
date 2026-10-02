import {
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PointLight,
  Scene,
  ShapePath,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';

import { createAuroraBackdrop } from './aurora-backdrop';
import { cssToRgb, isDark, watchTheme } from './css-color';
import { clamp, damp, easeInOutCubic, easeOutBack, easeOutQuart, lerp, range } from './damp';
import { createEnvironment } from './environment';
import { createQualityWatch } from './quality-watch';
import { createLoop } from './render-loop';
import { isLowEnd } from './supports-webgl';
import glyphData from './wordmark-glyphs.json';

// Tune by eye.
// A narrow FOV from far away: the word tilts up to 0.28 rad, and a wide lens would blow up the near end.
/** `--accent` in :root (light mode). The wordmark uses it in both themes. */
const LIGHT_ACCENT = '#4125f9';

const FOV = 15;
const CAMERA_Z = 24;
const WORD_WIDTH = 0.84; // fraction of the visible width at z = 0
const MAX_WORD_PX = 1260; // the band is max-w-[1500px], and the word is 84% of it
const BLEED = 0.1; // fraction of the cap height cut off at the bottom edge
const DEPTH = 0.28; // x cap height
const BEVEL_THICKNESS = 0.04; // x cap height
const BEVEL_SIZE = 0.025; // x cap height
const BEVEL_SEGMENTS = 6;
const CURVE_SEGMENTS = 10;
const TRACKING = -0.045; // em, looser than the CSS -0.075em so the bevels do not touch
const DPR_CAP = 1.5;
const FRAME_CAP_MS = 16.6;
const BACKDROP_Z = -2;

// Entrance, in seconds.
const RISE_STAGGER = 0.065;
const RISE_DURATION = 1;
const SWEEP_START = 1.3;
const SWEEP_END = 2.4;
const ENTRANCE_VISIBLE = 0.35;

const TILT_X = 0.15;
const TILT_Y = 0.28;
const LIFT = 0.45; // x cap height, at the pointer
const LIFT_SIGMA = 0.9; // letter widths
const LIFT_RISE = 0.05; // upward travel per unit of lift, so the wave also bobs
const TURN = 0.1; // rad, each letter's turn toward the cursor
const LIGHT_BASE = 50;

interface GlyphCommand extends Array<string | number> {}

interface Letter {
  mesh: Mesh<ExtrudeGeometry, MeshPhysicalMaterial[]>;
  /** Horizontal center, in em, relative to the word's center. */
  x: number;
  width: number;
  lift: number;
  turn: number;
}

export interface GlassWordmarkOptions {
  /** Covers the whole card. */
  canvas: HTMLCanvasElement;
  /** In-flow element at the bottom of the card: where the word sits. */
  band: HTMLElement;
  /** WebGL context lost: the wrapper disposes the scene and falls back to the static wordmark. */
  onFail: () => void;
}

export interface GlassWordmark {
  /** Resolves once the first frame is drawn. */
  ready: Promise<void>;
  dispose: () => void;
}

function buildGlyph(commands: GlyphCommand[], scale: number) {
  const path = new ShapePath();

  for (const c of commands) {
    const n = c.slice(1).map((value) => (value as number) * scale);

    if (c[0] === 'M') path.moveTo(n[0], n[1]);
    else if (c[0] === 'L') path.lineTo(n[0], n[1]);
    else if (c[0] === 'Q') path.quadraticCurveTo(n[0], n[1], n[2], n[3]);
    else if (c[0] === 'C') path.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5]);
    else if (c[0] === 'Z') path.currentPath?.closePath();
  }

  // Holes are found from the contours themselves, whatever their winding.
  return path.toShapes();
}

export function createGlassWordmark({ canvas, band, onFail }: GlassWordmarkOptions): GlassWordmark {
  const host = canvas.parentElement!;
  const lowEnd = isLowEnd();
  const dprCap = lowEnd ? 1 : DPR_CAP;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'default' });

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
  // The transmission pass only feeds blurry glass, half resolution is plenty.
  renderer.transmissionResolutionScale = 0.5;

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  const environment = createEnvironment(renderer);
  const backdrop = createAuroraBackdrop();
  const watchQuality = createQualityWatch({ renderer, onResize: () => resize(), onGiveUp: onFail });

  camera.position.set(0, 0, CAMERA_Z);
  scene.add(backdrop.mesh);

  // ExtrudeGeometry groups: 0 is the flat front and back, 1 is the walls and bevels. Two materials, so the face and
  // the 3D edges read as different surfaces.
  const face = new MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    thickness: 0.6,
    ior: 1.45,
    roughness: 0.06,
    dispersion: 0.15, // small: strong dispersion adds rainbow fringes, and the palette has no pink
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    specularIntensity: 1,
    envMap: environment,
    envMapIntensity: 1,
    attenuationDistance: 1.6,
  });
  const edge = face.clone();

  const light = new PointLight(0xffffff, LIGHT_BASE, 0, 2);

  scene.add(light);

  // Glyphs, built once. 1 world unit = 1 em before the word group is scaled to fit.
  const em = 1 / glyphData.unitsPerEm;
  const cap = glyphData.capHeight * em;
  const wordGroup = new Group();
  const pivot = new Group();
  const letters: Letter[] = [];
  let cursor = 0;

  pivot.add(wordGroup);
  scene.add(pivot);

  for (const glyph of glyphData.letters) {
    // The space has no outline: no mesh, only its advance.
    if (glyph.commands.length === 0) {
      cursor += glyph.advance * em + glyph.kerning * em + TRACKING;
      continue;
    }

    const shapes = buildGlyph(glyph.commands as GlyphCommand[], em);
    const geometry = new ExtrudeGeometry(shapes, {
      depth: DEPTH * cap,
      bevelEnabled: true,
      bevelThickness: BEVEL_THICKNESS * cap,
      bevelSize: BEVEL_SIZE * cap,
      bevelOffset: 0,
      // Fewer segments on weak machines: the glyph geometry is the biggest one-off cost of this scene.
      bevelSegments: lowEnd ? 3 : BEVEL_SEGMENTS,
      curveSegments: lowEnd ? 6 : CURVE_SEGMENTS,
    });

    geometry.computeBoundingBox();

    const box = geometry.boundingBox!;
    const centerX = (box.min.x + box.max.x) / 2;

    // Origin at the middle of the letter, so it tilts and rises around its own center.
    geometry.translate(-centerX, -cap / 2, -(DEPTH * cap) / 2);

    const mesh = new Mesh(geometry, [face, edge]);

    wordGroup.add(mesh);
    letters.push({ mesh, x: cursor + centerX, width: box.max.x - box.min.x, lift: 0, turn: 0 });
    cursor += glyph.advance * em + glyph.kerning * em + TRACKING;
  }

  const first = letters[0];
  const last = letters[letters.length - 1];
  const left = first.x - first.width / 2;
  const right = last.x + last.width / 2;
  const wordCenter = (left + right) / 2;
  const wordWidth = right - left;

  for (const letter of letters) letter.mesh.position.x = letter.x - wordCenter;

  // Layout, in world units. Set by resize().
  let canvasWidth = 1;
  let canvasHeight = 1;
  let visibleHeight = 1;
  let visibleWidth = 1;
  let capWorld = 1;
  let baseY = 0;

  function applyColors() {
    const isDarkTheme = isDark();
    // The word is the light-mode accent in both themes (dark mode's own accent is a lighter tint, so not read from CSS).
    const [r, g, b] = cssToRgb(LIGHT_ACCENT);

    // The face is the accent color itself: glossy, barely see-through, so the backdrop cannot wash it out. In dark mode
    // the lit color falls short of the accent against the dark scene, so the face also glows in it.
    // Dark mode paints the face from emissive alone (diffuse near black, no see-through), so lights and the backdrop
    // cannot tint it: what shows is the accent plus the gloss.
    face.color.setRGB(r, g, b, SRGBColorSpace).multiplyScalar(isDarkTheme ? 0.05 : 1);
    face.transmission = isDarkTheme ? 0 : 0.1;
    face.attenuationDistance = Infinity;
    face.envMapIntensity = isDarkTheme ? 0.3 : 0.7;
    // Light mode lets a tenth of the pale backdrop through, and the Neutral tone mapper crushes the low channels of a
    // flat color. Dark mode has no pale backdrop, so its glow is lifted to render what light mode renders (sampled:
    // about rgb(60, 40, 232)), solved against the tone mapper and checked on screen.
    if (isDarkTheme) face.emissive.setRGB(80 / 255, 64 / 255, 246 / 255, SRGBColorSpace);
    else face.emissive.setRGB(r, g, b, SRGBColorSpace);
    face.emissiveIntensity = isDarkTheme ? 1 : 0;

    // The 3D edges (walls and bevels) are a deeper shade of the same accent, opaque and glossy, so the face stands out
    // against them in both themes.
    edge.color.setRGB(r, g, b, SRGBColorSpace).multiplyScalar(0.28);
    edge.transmission = 0;
    edge.envMapIntensity = 0.6;
    edge.clearcoat = 0.3;
    edge.roughness = 0.3;
    edge.emissive.setRGB(r, g, b, SRGBColorSpace);
    edge.emissiveIntensity = 0;
    backdrop.setTheme(isDarkTheme);
    renderer.setClearColor(0x000000, 0);
    loop.start();
  }

  function resize() {
    // The canvas is the section plus some room above it (so the word can rise past the section's top edge); the
    // backdrop only covers the section, the rest of the canvas is transparent.
    const rect = canvas.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    if (!width || !height) return;

    canvasWidth = width;
    canvasHeight = height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const tan = Math.tan(MathUtils.degToRad(FOV / 2));

    visibleHeight = 2 * tan * CAMERA_Z;
    visibleWidth = visibleHeight * camera.aspect;

    const pxToWorld = visibleHeight / height;

    // The backdrop plane covers exactly the section rectangle (its uv maps to it), at its own depth.
    const depthScale = (CAMERA_Z - BACKDROP_Z) / CAMERA_Z;
    const above = hostRect.top - rect.top;

    backdrop.mesh.position.set(0, (height / 2 - above - hostRect.height / 2) * pxToWorld * depthScale, BACKDROP_Z);
    backdrop.mesh.scale.set(hostRect.width * pxToWorld * depthScale, hostRect.height * pxToWorld * depthScale, 1);

    const bandRect = band.getBoundingClientRect();

    backdrop.setSize(hostRect.width, hostRect.height, bandRect.top - hostRect.top);

    // 84% of the width, but never wider than the band (MAX_WORD_PX): the section is full-bleed.
    const scale = Math.min(WORD_WIDTH * visibleWidth, MAX_WORD_PX * pxToWorld) / wordWidth;

    wordGroup.scale.setScalar(scale);
    capWorld = cap * scale;
    // three multiplies thickness by the mesh's world scale, so it is set in em: 0.2 x cap height in the end.
    face.thickness = edge.thickness = 0.2 * cap;

    // The band's bottom edge, then the bleed below it, in world units (y up, canvas center at 0).
    const bandBottomWorld = visibleHeight / 2 - (bandRect.bottom - rect.top) * pxToWorld;

    baseY = bandBottomWorld - BLEED * capWorld;
    pivot.position.set(0, baseY + capWorld / 2, 0);
    loop.start();
  }

  // Frame state.
  let entranceRequested = false;
  let entranceStart: number | null = null;
  let visible = false;
  let tiltX = 0;
  let tiltY = 0;
  let lightX = 0;
  let lightY = 0;
  let pointerClientX = 0;
  let pointerClientY = 0;
  let pointerSeen = false;
  let lastMove = -Infinity;

  const onPointerMove = (event: PointerEvent) => {
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    pointerSeen = true;
    lastMove = performance.now() / 1000;
    loop.start();
  };

  function update(dt: number, time: number) {
    if (entranceRequested && entranceStart === null) entranceStart = time;

    const since = entranceStart === null ? -1 : time - entranceStart;
    const rect = canvas.getBoundingClientRect();
    const bandRect = band.getBoundingClientRect();

    // Pointer, relative to the band: x across its width, y over one and a half band heights.
    const idle = !pointerSeen || time - lastMove > 3;
    const nx = pointerSeen
      ? clamp((pointerClientX - (bandRect.left + bandRect.width / 2)) / (bandRect.width / 2), -1, 1)
      : 0;
    const ny = pointerSeen
      ? clamp((pointerClientY - (bandRect.top + bandRect.height / 2)) / (bandRect.height * 1.5), -1, 1)
      : 0;

    const sway = idle ? Math.sin(time * 0.35) * 0.08 : 0;

    tiltX = damp(tiltX, -ny * TILT_X, 6, dt);
    tiltY = damp(tiltY, nx * TILT_Y + sway, 6, dt);
    pivot.rotation.x = tiltX;
    pivot.rotation.y = tiltY;

    // Pointer in world units (the canvas is the card).
    const pxToWorld = visibleHeight / canvasHeight;
    const pointerWorldX = pointerSeen ? (pointerClientX - rect.left - canvasWidth / 2) * pxToWorld : 0;
    const pointerWorldY = pointerSeen ? (canvasHeight / 2 - (pointerClientY - rect.top)) * pxToWorld : 0;

    // The sweep light crosses the word once, then hands over to the cursor.
    const sweep = range(since, SWEEP_START, SWEEP_END);
    const sweeping = sweep > 0 && sweep < 1;

    if (sweeping) {
      lightX = lerp(-0.6 * visibleWidth, 0.6 * visibleWidth, easeInOutCubic(sweep));
      lightY = baseY + capWorld * 0.7;
      light.intensity = LIGHT_BASE * (1 + 1.2 * Math.sin(Math.PI * sweep));
    } else {
      lightX = damp(lightX, pointerWorldX, 8, dt);
      lightY = damp(lightY, pointerSeen ? pointerWorldY : baseY + capWorld * 0.7, 8, dt);
      light.intensity = damp(light.intensity, LIGHT_BASE, 8, dt);
    }
    light.position.set(lightX, lightY + capWorld * 0.35, 4 * (capWorld / 3));

    // Letters.
    const pointerAbove = pointerSeen ? bandRect.top - pointerClientY : Infinity;
    // Full strength from the band up to 100px above it, fading out by 300px.
    const near = pointerSeen ? clamp(1 - (pointerAbove - 100) / 200) : 0;

    letters.forEach((letter, index) => {
      const t = clamp((since - index * RISE_STAGGER) / RISE_DURATION);
      const restY = 0;
      const world = letter.mesh.position.x * wordGroup.scale.x;
      const dx = pointerWorldX - (pivot.position.x + world);
      const sigma = LIFT_SIGMA * letter.width * wordGroup.scale.x;
      const target = near * LIFT * cap * Math.exp(-(dx * dx) / (2 * sigma * sigma));

      // Each letter also turns its face toward the cursor, more the farther the cursor is to its side.
      const turn = near * clamp(dx / (2.5 * sigma), -1, 1) * TURN;

      letter.lift = damp(letter.lift, target, 10, dt);
      letter.turn = damp(letter.turn, turn, 9, dt);
      letter.mesh.position.y =
        restY + lerp(-1.1 * cap - BLEED * cap, 0, easeOutBack(t, 1.15)) + letter.lift * LIFT_RISE;
      letter.mesh.rotation.x = lerp(0.5, 0, easeOutQuart(t)) - 0.1 * (letter.lift / (LIFT * cap));
      letter.mesh.rotation.y = letter.turn;
      letter.mesh.position.z = letter.lift;
    });

    backdrop.update(time);
  }

  const loop = createLoop({
    minFrameMs: FRAME_CAP_MS,
    frame: (dt, time) => {
      update(dt, time);
      renderer.render(scene, camera);
      // After the render: giving up disposes the whole scene, so nothing may touch the renderer after this call.
      watchQuality(dt);

      return !disposed && visible;
    },
  });

  const resizeObserver = new ResizeObserver(resize);

  resizeObserver.observe(host);

  // Run only while the card is on or near the screen. The pointer listener lives only while it runs.
  const visibility = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        loop.start();
      } else {
        window.removeEventListener('pointermove', onPointerMove);
        loop.stop();
      }
    },
    { rootMargin: '100px 0px' },
  );
  const entrance = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      entranceRequested = true;
      entrance.disconnect();
      loop.start();
    },
    { threshold: ENTRANCE_VISIBLE },
  );
  const onContextLost = (event: Event) => {
    event.preventDefault();
    onFail();
  };

  canvas.addEventListener('webglcontextlost', onContextLost);
  visibility.observe(host);
  entrance.observe(band);

  const stopThemeWatch = watchTheme(applyColors);

  // Build, compile the shaders off the main thread (KHR_parallel_shader_compile), then draw the first frame (letters
  // still below the edge) before reporting ready.
  let disposed = false;
  applyColors();
  resize();
  update(0, performance.now() / 1000);

  const ready = renderer.compileAsync(scene, camera).then(() => {
    if (!disposed) renderer.render(scene, camera);
  });

  return {
    ready,
    dispose() {
      disposed = true;
      loop.dispose();
      stopThemeWatch();
      visibility.disconnect();
      entrance.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);

      for (const letter of letters) letter.mesh.geometry.dispose();
      face.dispose();
      edge.dispose();
      backdrop.dispose();
      environment.dispose();
      // No forceContextLoss(): the same canvas is reused after a dispose (Strict Mode, media query changes), and it
      // would hand the next renderer a lost context.
      renderer.dispose();
    },
  };
}
