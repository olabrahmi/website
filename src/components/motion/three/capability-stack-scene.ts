import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  OrthographicCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

import { cssToRgb, cssVar, cssVarRgb, isDark, watchTheme } from './css-color';
import { clamp, damp, easeInOutCubic, easeOutQuart, lerp, range } from './damp';
import { createEnvironment } from './environment';
import { createQualityWatch } from './quality-watch';
import { createLoop } from './render-loop';
import { isLowEnd, yieldToMain } from './supports-webgl';

// Tune by eye. World units: a slab footprint is 3.2 x 3.2.
const SLAB_W = 3.2;
const SLAB_D = 3.2;
const SLAB_H = 0.32;
const SLAB_RADIUS = 0.06;
const GAP_EXPLODED = 0.95;
const FAN_DEG = 6;
const ACTIVE_LIFT = 0.22;
const HOVER_LIFT = 0.18;
const BOB = 0.035;
const VIEW_SIZE = 7.4;
const CAMERA_ELEVATION_DEG = 30;
const CAMERA_RADIUS = 14;
const LOOK_AT_Y = -0.1; // aims a touch low so the stack sits a little high; the lifted top slab must still fit
const AZIMUTH_FROM = 38;
const AZIMUTH_TO = 52;
const MERGE_ZOOM = 1.12;
const DPR_CAP = 1.5; // 1 on low-end machines (see isLowEnd)

// Scroll story, as fractions of the pinned scroll distance.
const WALK_START = 0.08;
const WALK_END = 0.68;
const MERGE_END = 0.88;

const ENTRANCE_STAGGER = 0.09;
const ENTRANCE_DURATION = 0.7;
const ENTRANCE_DROP = 2.5;
const LOCK_DURATION = 0.52;

const TEXTURE_SIZE = 1024;
const TEXTURE_PADDING = 72;

export interface CapabilityStackOptions {
  canvas: HTMLCanvasElement;
  /** Pinned section: scroll progress, pointer parallax and the `data-locked` flag live here. */
  section: HTMLElement;
  /** The list items, top slab first. The scene writes data-active, data-dim and data-lit on them. */
  items: HTMLElement[];
  data: { title: string; proof: string[] }[];
  /** WebGL context lost: the wrapper disposes the scene and falls back to the grid. */
  onFail: () => void;
}

export interface CapabilityStack {
  ready: Promise<void>;
  setHover: (_index: number | null) => void;
  dispose: () => void;
}

interface Slab {
  group: Group;
  body: Mesh<RoundedBoxGeometry, MeshPhysicalMaterial>;
  edges: LineSegments<EdgesGeometry, LineBasicMaterial>;
  label: Mesh<PlaneGeometry, MeshBasicMaterial>;
  glow: Mesh<PlaneGeometry, MeshBasicMaterial>;
  texture: CanvasTexture;
  context: CanvasRenderingContext2D;
  lit: boolean;
  entrance: number;
  active: number;
  dim: number;
  hoverLift: number;
}

function radialTexture() {
  const canvas = document.createElement('canvas');

  canvas.width = canvas.height = 256;

  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.35)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;

  return texture;
}

function toColor(token: string, target = new Color()) {
  const [r, g, b] = cssToRgb(cssVar(token));

  return target.setRGB(r, g, b, SRGBColorSpace);
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  context.beginPath();
  context.roundRect(x, y, w, h, r);
}

export function createCapabilityStack({
  canvas,
  section,
  items,
  data,
  onFail,
}: CapabilityStackOptions): CapabilityStack {
  const count = data.length;
  const parent = canvas.parentElement!;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'default' });

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd() ? 1 : DPR_CAP));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 60);
  const environment = createEnvironment(renderer);
  const radial = radialTexture();
  const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const hemisphere = new HemisphereLight(0xffffff, 0xffffff, 0.6);
  const sun = new DirectionalLight(0xffffff, 1.2);

  sun.position.set(-3, 8, 4);
  scene.add(hemisphere, sun);

  // Shared geometry. Edges use a plain box: a rounded one gives hundreds of short segments.
  const bodyGeometry = new RoundedBoxGeometry(SLAB_W, SLAB_H, SLAB_D, 3, SLAB_RADIUS);
  const edgeGeometry = new EdgesGeometry(new BoxGeometry(SLAB_W, SLAB_H, SLAB_D));
  const labelGeometry = new PlaneGeometry(SLAB_W * 0.92, SLAB_D * 0.92);
  const glowGeometry = new PlaneGeometry(SLAB_W * 1.6, SLAB_D * 1.6);
  const outlineGeometry = new EdgesGeometry(new BoxGeometry(SLAB_W, count * SLAB_H, SLAB_D));
  const shadowGeometry = new PlaneGeometry(SLAB_W * 1.3, SLAB_D * 1.3);

  const stack = new Group();

  scene.add(stack);

  const outline = new LineSegments(outlineGeometry, new LineBasicMaterial({ transparent: true, depthWrite: false }));

  outline.renderOrder = 100;
  stack.add(outline);

  const shadow = new Mesh(
    shadowGeometry,
    new MeshBasicMaterial({ map: radial, color: 0x000000, transparent: true, depthWrite: false, toneMapped: false }),
  );

  shadow.rotation.x = -Math.PI / 2;
  shadow.renderOrder = -1;
  scene.add(shadow);

  const slabs: Slab[] = data.map((_, index) => {
    const group = new Group();

    // Painter's order: no one writes depth, so the bottom slab is drawn first and upper glass blends over it.
    const base = (count - 1 - index) * 10;

    const body = new Mesh(
      bodyGeometry,
      new MeshPhysicalMaterial({
        transparent: true,
        depthWrite: false,
        roughness: 0.25,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMap: environment,
        envMapIntensity: 0.6,
      }),
    );
    const edges = new LineSegments(edgeGeometry, new LineBasicMaterial({ transparent: true, depthWrite: false }));

    const canvas2d = document.createElement('canvas');

    canvas2d.width = canvas2d.height = TEXTURE_SIZE;

    const texture = new CanvasTexture(canvas2d);

    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;

    const label = new Mesh(
      labelGeometry,
      new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }),
    );
    const glow = new Mesh(
      glowGeometry,
      new MeshBasicMaterial({
        map: radial,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
    );

    label.rotation.x = -Math.PI / 2;
    label.position.y = SLAB_H / 2 + 0.002;
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -SLAB_H / 2 - 0.01;

    glow.renderOrder = base;
    body.renderOrder = base + 1;
    label.renderOrder = base + 2;
    edges.renderOrder = base + 3;

    group.add(glow, body, label, edges);
    stack.add(group);

    return {
      group,
      body,
      edges,
      label,
      glow,
      texture,
      context: canvas2d.getContext('2d')!,
      lit: false,
      entrance: 0,
      active: 0,
      dim: 0,
      hoverLift: 0,
    };
  });

  // Colors, read from the CSS tokens so both themes follow the site.
  const accent = new Color();
  const surface = new Color();
  const tint = new Color();
  const baseOpacity = { value: 0.78 };
  let shadowOpacity = 0.14;
  let fonts = { display: '', body: '' };

  function drawLabel(index: number) {
    const slab = slabs[index];
    const { context } = slab;
    const { title, proof } = data[index];
    const size = TEXTURE_SIZE;
    const dark = isDark();
    const ink = cssVarRgb('--ink');
    const chipFill = cssVarRgb('--surface-2', 0.85);
    const chipInk = cssVarRgb('--ink-muted');
    const litFill = cssVarRgb('--accent');
    const litInk = dark ? cssVarRgb('--accent-ink') : '#fff';

    context.clearRect(0, 0, size, size);
    context.textBaseline = 'alphabetic';

    // The slab above hides the back of this one, so everything sits along the front edge: chips last, title above.
    const maxWidth = size - TEXTURE_PADDING * 2;
    const chipHeight = 76;
    const gap = 14;
    const padX = 30;

    context.letterSpacing = '-1px';
    context.font = `500 40px ${fonts.body}`;

    const rows: { name: string; width: number }[][] = [[]];
    let rowWidth = 0;

    for (const name of proof) {
      const width = context.measureText(name).width + padX * 2;

      if (rowWidth && rowWidth + gap + width > maxWidth) {
        rows.push([]);
        rowWidth = 0;
      }
      rows[rows.length - 1].push({ name, width });
      rowWidth += (rowWidth ? gap : 0) + width;
    }

    const chipsTop = size - TEXTURE_PADDING - rows.length * chipHeight - (rows.length - 1) * gap;

    rows.forEach((row, rowIndex) => {
      const y = chipsTop + rowIndex * (chipHeight + gap);
      let x = TEXTURE_PADDING;

      for (const chip of row) {
        roundRect(context, x, y, chip.width, chipHeight, chipHeight / 2);
        context.fillStyle = slab.lit ? litFill : chipFill;
        context.fill();
        context.fillStyle = slab.lit ? litInk : chipInk;
        context.fillText(chip.name, x + padX, y + chipHeight / 2 + 13);
        x += chip.width + gap;
      }
    });

    context.letterSpacing = '-4px';
    context.fillStyle = ink;
    context.font = `600 92px ${fonts.display}`;

    const lines: string[] = [];
    let line = '';

    for (const word of title.split(' ')) {
      const next = line ? `${line} ${word}` : word;

      if (line && context.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    lines.push(line);
    lines.forEach((text, row) =>
      context.fillText(text, TEXTURE_PADDING, chipsTop - 44 - (lines.length - 1 - row) * 100),
    );

    slab.texture.needsUpdate = true;
  }

  function applyColors() {
    if (!fonts.display) return; // the first call comes from `ready`, once the fonts are loaded

    const dark = isDark();

    toColor('--accent', accent);
    toColor(dark ? '--surface-2' : '--surface', surface);
    baseOpacity.value = dark ? 0.7 : 0.78;
    shadowOpacity = dark ? 0.35 : 0.14;
    hemisphere.groundColor.copy(toColor('--surface-2', tint));

    for (const slab of slabs) {
      slab.body.material.envMapIntensity = dark ? 0.5 : 0.6;
      slab.edges.material.color.copy(accent);
      slab.glow.material.color.copy(accent);
    }
    outline.material.color.copy(accent);

    slabs.forEach((_, index) => drawLabel(index));
    loop.start();
  }

  // State the frame function keeps.
  let targetProgress = 0;
  let progress = 0;
  let parallaxX = 0;
  let parallaxY = 0;
  let parallaxTargetX = 0;
  let parallaxTargetY = 0;
  let listHover: number | null = null;
  let canvasHover: number | null = null;
  let rayDirty = false;
  let visible = false;
  let entranceRequested = false;
  let entranceStart: number | null = null;
  let lockStart: number | null = null;
  let lockArmed = true;
  let lastCurrent: number | null = null;
  let lastDimOn = false;
  let lastHover: number | null = null;
  let mergeT = 0;

  const pointer = new Vector2();
  const raycaster = new Raycaster();

  const restingY = (index: number, gap: number) => {
    const total = count * SLAB_H + (count - 1) * gap;

    return total / 2 - SLAB_H / 2 - index * (SLAB_H + gap);
  };

  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const distance = rect.height - window.innerHeight;

    targetProgress = distance > 0 ? clamp(-rect.top / distance) : 0;
  }

  function setLit(index: number, lit: boolean) {
    const slab = slabs[index];

    if (slab.lit === lit) return;
    slab.lit = lit;
    drawLabel(index);
  }

  function syncDom(current: number | null, dimOn: boolean, hovered: number | null) {
    if (current === lastCurrent && dimOn === lastDimOn && hovered === lastHover) return;
    lastCurrent = current;
    lastDimOn = dimOn;
    lastHover = hovered;

    items.forEach((item, index) => {
      item.toggleAttribute('data-active', current === index);
      item.toggleAttribute('data-dim', dimOn && current !== index);
      item.toggleAttribute('data-lit', hovered === index);
    });
    slabs.forEach((_, index) => setLit(index, current === index));
  }

  /** Returns true while something is still moving. */
  function update(dt: number, time: number) {
    let moving = false;
    const follow = (current: number, target: number, lambda: number) => {
      const next = damp(current, target, lambda, dt);

      if (Math.abs(next - target) > 0.001) moving = true;

      return next;
    };

    if (entranceRequested && entranceStart === null) entranceStart = time;

    progress = follow(progress, targetProgress, 10);
    parallaxX = follow(parallaxX, parallaxTargetX, 4);
    parallaxY = follow(parallaxY, parallaxTargetY, 4);

    const step = range(progress, WALK_START, WALK_END);
    const walking = progress >= WALK_START && progress < WALK_END;
    const scrollActive = walking ? Math.min(count - 1, Math.floor(step * count)) : null;

    mergeT = easeInOutCubic(range(progress, WALK_END, MERGE_END));
    if (mergeT < 0.999) moving = true;

    if (rayDirty) {
      rayDirty = false;
      raycaster.setFromCamera(pointer, camera);
      scene.updateMatrixWorld();

      const hit = raycaster.intersectObjects(
        slabs.map((slab) => slab.body),
        false,
      )[0];

      canvasHover = hit ? slabs.findIndex((slab) => slab.body === hit.object) : null;
    }

    const hovered = canvasHover ?? listHover;
    const current = hovered ?? scrollActive;
    const dimOn = current !== null && mergeT < 0.5;

    syncDom(current, dimOn, hovered);

    // Lock: a one-shot click when the block closes, re-armed when it opens again.
    if (mergeT > 0.98 && lockArmed) {
      lockArmed = false;
      lockStart = time;
      section.setAttribute('data-locked', '');
    } else if (mergeT < 0.6 && !lockArmed) {
      lockArmed = true;
      lockStart = null;
      section.removeAttribute('data-locked');
    }

    const lockT = lockStart === null ? 1 : clamp((time - lockStart) / LOCK_DURATION);
    const lockPulse = Math.sin(Math.PI * easeOutQuart(lockT));

    if (lockT < 1) moving = true;

    const gap = lerp(GAP_EXPLODED, 0, mergeT);
    const azimuth = lerp(AZIMUTH_FROM, AZIMUTH_TO, progress) + parallaxX * 3;
    const elevation = CAMERA_ELEVATION_DEG + parallaxY * -2;
    const azimuthRad = MathUtils.degToRad(azimuth);
    const elevationRad = MathUtils.degToRad(elevation);

    camera.position.set(
      CAMERA_RADIUS * Math.cos(elevationRad) * Math.sin(azimuthRad),
      CAMERA_RADIUS * Math.sin(elevationRad),
      CAMERA_RADIUS * Math.cos(elevationRad) * Math.cos(azimuthRad),
    );
    camera.lookAt(0, LOOK_AT_Y, 0);
    camera.zoom = lerp(1, MERGE_ZOOM, mergeT);
    camera.updateProjectionMatrix();

    slabs.forEach((slab, index) => {
      const isCurrent = current === index;

      if (entranceStart !== null) {
        const t = clamp((time - entranceStart - (count - 1 - index) * ENTRANCE_STAGGER) / ENTRANCE_DURATION);

        slab.entrance = t;
        if (t < 1) moving = true;
      }

      slab.active = follow(slab.active, isCurrent ? 1 : 0, 12);
      slab.dim = follow(slab.dim, dimOn && !isCurrent ? 1 : 0, 10);
      slab.hoverLift = follow(slab.hoverLift, hovered === index ? HOVER_LIFT : 0, 14);

      const e = easeOutQuart(slab.entrance);
      const bob = Math.sin(time * 0.8 + index * 0.9) * BOB * (1 - mergeT);

      slab.group.position.y =
        restingY(index, gap) +
        slab.active * ACTIVE_LIFT * (1 - mergeT) +
        slab.hoverLift * (1 - 0.7 * mergeT) +
        bob +
        (1 - e) * ENTRANCE_DROP;
      slab.group.rotation.y =
        MathUtils.degToRad(lerp(-FAN_DEG, FAN_DEG, index / Math.max(1, count - 1))) * (1 - mergeT);

      const material = slab.body.material;

      material.opacity = baseOpacity.value * e * lerp(1, 0.55, slab.dim);
      material.color.copy(surface).lerp(accent, 0.12 * slab.active);

      const edgeBase = lerp(lerp(0.35, 0.15, slab.dim), 1, slab.active);

      slab.edges.material.opacity = edgeBase * (1 - mergeT) * e;
      // Once the block is one piece, only the top slab keeps its label.
      slab.label.material.opacity = e * (index === 0 ? 1 : 1 - mergeT);
      slab.label.material.color.setScalar(lerp(1, 0.85, slab.dim));
      slab.glow.material.opacity = slab.active * 0.5 * e;
    });

    outline.material.opacity = mergeT * (0.8 + 0.2 * lockPulse);

    stack.scale.setScalar(1 + 0.02 * lockPulse);
    stack.position.y = Math.sin(time * 0.8) * 0.02 * mergeT;

    const bottom = restingY(count - 1, gap) - SLAB_H / 2;

    shadow.position.y = bottom - 0.5;
    shadow.scale.setScalar(lerp(1.35, 1.05, mergeT) - 0.03 * lockPulse);
    shadow.material.opacity = lerp(shadowOpacity, shadowOpacity * 1.4, mergeT) * slabs[count - 1].entrance;

    return moving;
  }

  function render() {
    renderer.render(scene, camera);
  }

  const watchQuality = createQualityWatch({ renderer, onResize: () => resize(), onGiveUp: onFail });

  const loop = createLoop({
    frame: (dt, time) => {
      const moving = update(dt, time);

      render();
      // After the render: giving up disposes the whole scene, so nothing may touch the renderer after this call.
      watchQuality(dt);

      return !disposed && visible && moving;
    },
  });

  function resize() {
    const width = parent.clientWidth;
    const height = canvas.clientHeight || width;

    if (!width || !height) return;

    renderer.setSize(width, height, false);

    const aspect = width / height;
    const view = VIEW_SIZE / Math.min(1, aspect);

    camera.left = (-view * aspect) / 2;
    camera.right = (view * aspect) / 2;
    camera.top = view / 2;
    camera.bottom = -view / 2;
    camera.updateProjectionMatrix();
    updateScroll();
    loop.start();
  }

  const onScroll = () => {
    if (!visible) return;
    updateScroll();
    loop.start();
  };
  const onSectionPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;

    const rect = section.getBoundingClientRect();

    parallaxTargetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    parallaxTargetY = clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1);
    loop.start();
  };
  const onSectionLeave = () => {
    parallaxTargetX = parallaxTargetY = 0;
    loop.start();
  };
  const onCanvasPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;

    const rect = canvas.getBoundingClientRect();

    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    rayDirty = true;
    loop.start();
  };
  const onCanvasLeave = () => {
    canvasHover = null;
    rayDirty = false;
    loop.start();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    onFail();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  section.addEventListener('pointermove', onSectionPointer, { passive: true });
  section.addEventListener('pointerleave', onSectionLeave);
  canvas.addEventListener('pointermove', onCanvasPointer, { passive: true });
  canvas.addEventListener('pointerleave', onCanvasLeave);
  canvas.addEventListener('webglcontextlost', onContextLost);

  const resizeObserver = new ResizeObserver(resize);

  resizeObserver.observe(parent);

  const visibility = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.3) entranceRequested = true;
        if (visible) {
          updateScroll();
          loop.start();
        }
      }
    },
    { threshold: [0, 0.3] },
  );

  visibility.observe(canvas);

  const stopThemeWatch = watchTheme(applyColors);
  let disposed = false;

  const ready = (async () => {
    const body = getComputedStyle(document.body);

    fonts = {
      display: body.getPropertyValue('--font-geist').trim() || 'sans-serif',
      body: body.getPropertyValue('--font-dm-sans').trim() || 'sans-serif',
    };
    await Promise.all([
      document.fonts.load(`600 92px ${fonts.display}`),
      document.fonts.load(`500 40px ${fonts.body}`),
    ]);

    applyColors();
    await yieldToMain(); // keep each task short: label textures above, first layout and compile below
    resize();
    updateScroll();
    progress = targetProgress;
    update(0, performance.now() / 1000);
    // Shaders compile in parallel off the main thread (KHR_parallel_shader_compile) instead of hitching the first frame.
    await renderer.compileAsync(scene, camera);
    if (!disposed) render();
  })();

  return {
    ready,
    setHover(index) {
      listHover = index;
      loop.start();
    },
    dispose() {
      disposed = true;
      loop.dispose();
      stopThemeWatch();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      section.removeEventListener('pointermove', onSectionPointer);
      section.removeEventListener('pointerleave', onSectionLeave);
      canvas.removeEventListener('pointermove', onCanvasPointer);
      canvas.removeEventListener('pointerleave', onCanvasLeave);
      canvas.removeEventListener('webglcontextlost', onContextLost);

      section.removeAttribute('data-locked');
      for (const item of items) {
        item.removeAttribute('data-active');
        item.removeAttribute('data-dim');
        item.removeAttribute('data-lit');
      }

      for (const slab of slabs) {
        slab.body.material.dispose();
        slab.edges.material.dispose();
        slab.label.material.dispose();
        slab.glow.material.dispose();
        slab.texture.dispose();
      }
      outline.material.dispose();
      shadow.material.dispose();
      bodyGeometry.dispose();
      edgeGeometry.dispose();
      labelGeometry.dispose();
      glowGeometry.dispose();
      outlineGeometry.dispose();
      shadowGeometry.dispose();
      radial.dispose();
      environment.dispose();
      // No forceContextLoss(): the same canvas is reused after a dispose (Strict Mode, media query changes), and it
      // would hand the next renderer a lost context.
      renderer.dispose();
    },
  };
}
