import { Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from 'three';

import { cssToRgb, cssVar } from './css-color';

/*
 * The backdrop of the glass wordmark: the contact card's own background (surface plus two corner glows) with the hero
 * aurora running along its bottom edge. three.js transmission only refracts what is inside the WebGL scene, so the glass
 * needs this as a plane in the scene. The card's CSS glows fade out once it is drawn.
 *
 * The aurora colors, angles, periods and opacities MIRROR `.aurora-*` in globals.css (drawn flipped, at half strength,
 * masked like AuroraLayers in the old footer). The card colors MIRROR `--aurora-a` and `--aurora-b` in globals.css and
 * the gradients on the Contact card. Change them together.
 */
const CURTAIN_A = ['oklch(66% 0.2 255)', 'oklch(58% 0.24 275)', 'oklch(70% 0.19 295)'];
const CURTAIN_B = ['oklch(82% 0.12 220)', 'oklch(62% 0.23 268)', 'oklch(74% 0.17 285)'];
/** The card's two corner glows, with their alpha: light, then dark. */
const CARD_A = { light: ['oklch(55% 0.16 275)', 0.16], dark: ['oklch(48% 0.16 275)', 0.34] } as const;
const CARD_B = { light: ['oklch(60% 0.12 270)', 0.1], dark: ['oklch(45% 0.12 270)', 0.22] } as const;
const GLOWS = ['oklch(62% 0.21 262)', 'oklch(58% 0.23 280)', 'oklch(70% 0.17 295)', 'oklch(72% 0.13 230)'];
/** Layer opacities: glow, curtain A, curtain B. */
const OPACITY_LIGHT: [number, number, number] = [0.55, 0.55, 0.45];
const OPACITY_DARK: [number, number, number] = [0.7, 0.85, 0.7];
/** Half strength, like the footer aurora this was tuned on. */
const STRENGTH = 0.5;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec2 uSize;
uniform float uTime;
uniform vec3 uPaper;
uniform vec3 uA0, uA1, uA2;
uniform vec3 uB0, uB1, uB2;
uniform vec3 uG0, uG1, uG2, uG3;
uniform vec3 uOpacity;
uniform float uStrength;
uniform vec3 uCardA, uCardB;
uniform vec2 uCardAlpha;
uniform vec2 uBand; // x: band height in px (it sits at the bottom of the card), y: extra strength inside it
varying vec2 vUv;

vec4 curtain(float f, vec3 c0, vec3 c1, vec3 c2, vec3 a, vec4 s) {
  vec4 k0 = vec4(c0, a.x), k1 = vec4(c1, a.y), k2 = vec4(c2, a.z);
  if (f < s.x) return mix(vec4(c0, 0.0), k0, f / s.x);
  if (f < s.y) return mix(k0, k1, (f - s.x) / (s.y - s.x));
  if (f < s.z) return mix(k1, k2, (f - s.y) / (s.z - s.y));
  if (f < s.w) return mix(k2, vec4(c2, 0.0), (f - s.z) / (s.w - s.z));
  return vec4(c2, 0.0);
}

// Straight-alpha "over": top and under are (color, alpha).
vec4 over(vec4 top, vec4 under) {
  float a = top.a + under.a * (1.0 - top.a);
  vec3 c = (top.rgb * top.a + under.rgb * under.a * (1.0 - top.a)) / max(a, 1e-4);
  return vec4(c, a);
}

vec4 glow(vec2 p, vec2 center, vec2 radius, vec3 color, float alpha) {
  float d = length((p - center) / radius);
  return vec4(color, alpha * (1.0 - smoothstep(0.0, 0.72, d)));
}

vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }

void main() {
  // CSS pixel space in the aurora layer's own (pre-flip) coordinates. The layer is flipped, so uv.y = 0 (the bottom
  // of the card) is the layer's top: px.y = 0.
  vec2 px = vUv * uSize;
  float W = uSize.x, H = uSize.y;

  // Curtains: 170% wide layers translated by the CSS keyframes (24s and 18s, ease-in-out, alternate).
  float wide = 1.7 * W;
  float offA = -0.41 * wide * (0.5 - 0.5 * cos(3.14159 * uTime / 24.0));
  float offB = -0.41 * wide * (0.5 + 0.5 * cos(3.14159 * uTime / 18.0));
  vec2 dirA = vec2(sin(radians(100.0)), -cos(radians(100.0)));
  vec2 dirB = vec2(sin(radians(96.0)), -cos(radians(96.0)));
  float lenA = abs(wide * dirA.x) + abs(H * dirA.y);
  float lenB = abs(wide * dirB.x) + abs(H * dirB.y);
  float fA = fract(dot(px - vec2(offA, 0.0), dirA) / (0.30 * lenA));
  float fB = fract(dot(px - vec2(offB, 0.0), dirB) / (0.26 * lenB));
  vec4 a = curtain(fA, uA0, uA1, uA2, vec3(0.7, 1.0, 0.7), vec4(0.1, 0.233, 0.367, 0.567));
  vec4 b = curtain(fB, uB0, uB1, uB2, vec3(0.65, 0.95, 0.6), vec4(0.115, 0.25, 0.385, 0.577));

  // Glows: layer inset -12% -8%, breathing 12s alternate (translate -3%,2% to 4%,-3%, scale 1 to 1.1).
  float br = 0.5 - 0.5 * cos(3.14159 * uTime / 12.0);
  vec2 gSize = vec2(W * 1.16, H * 1.24);
  vec2 gOrigin = vec2(-0.08 * W, -0.12 * H) + gSize * mix(vec2(-0.03, 0.02), vec2(0.04, -0.03), br);
  vec2 gp = (px - gOrigin - gSize * 0.5) / mix(1.0, 1.1, br) + gSize * 0.5;
  vec4 g = vec4(0.0);
  g = over(glow(gp, gSize * vec2(0.78, 0.08), gSize * vec2(0.38, 0.55), uG0, 0.75), g);
  g = over(glow(gp, gSize * vec2(0.52, 0.24), gSize * vec2(0.34, 0.50), uG1, 0.50), g);
  g = over(glow(gp, gSize * vec2(0.92, 0.52), gSize * vec2(0.42, 0.60), uG2, 0.45), g);
  g = over(glow(gp, gSize * vec2(0.25, 0.18), gSize * vec2(0.30, 0.45), uG3, 0.35), g);

  vec4 aur = vec4(0.0);
  aur = over(vec4(g.rgb, g.a * uOpacity.x), aur);
  aur = over(vec4(a.rgb, a.a * uOpacity.y), aur);
  aur = over(vec4(b.rgb, b.a * uOpacity.z), aur);

  // Mask: ellipse 55% x 100% at 50% 0%, black to transparent at 75% (pre-flip space).
  float m = 1.0 - smoothstep(0.0, 0.75, length((px - vec2(0.5 * W, 0.0)) / vec2(0.55 * W, H)));

  // Behind the band only: more strength and a wider mask, so the glass has color to refract across the whole word.
  // The rest of the card keeps its soft top-right and bottom-left glows.
  float inBand = 1.0 - smoothstep(0.0, uBand.x, px.y);
  float bandMask = 1.0 - smoothstep(0.0, 1.35, length((px - vec2(0.5 * W, 0.0)) / vec2(0.55 * W, H)));
  m = mix(m, max(m, bandMask * 0.8), inBand);
  float boost = 1.0 + uBand.y * inBand;

  // The card background in CSS orientation (y down): surface, then radial-gradient(60% 80% at 85% 0) and
  // radial-gradient(50% 70% at 10% 110%), each fading out at 70% of its radius.
  vec2 cp = vec2(vUv.x * W, (1.0 - vUv.y) * H);
  float dA = length((cp - vec2(0.85 * W, 0.0)) / vec2(0.6 * W, 0.8 * H));
  float dB = length((cp - vec2(0.10 * W, 1.1 * H)) / vec2(0.5 * W, 0.7 * H));
  vec3 base = mix(uPaper, uCardA, uCardAlpha.x * clamp(1.0 - dA / 0.7, 0.0, 1.0));
  base = mix(base, uCardB, uCardAlpha.y * clamp(1.0 - dB / 0.7, 0.0, 1.0));

  vec3 color = mix(base, aur.rgb, clamp(aur.a * uStrength * boost * m, 0.0, 1.0));
  gl_FragColor = vec4(toLinear(color), 1.0);
  #include <colorspace_fragment>
}
`;

const rgb = (css: string) => new Vector3(...cssToRgb(css));

export function createAuroraBackdrop() {
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    toneMapped: false,
    depthWrite: false,
    uniforms: {
      uSize: { value: new Vector2(1, 1) },
      uTime: { value: 0 },
      uPaper: { value: new Vector3() },
      uA0: { value: new Vector3() },
      uA1: { value: new Vector3() },
      uA2: { value: new Vector3() },
      uB0: { value: new Vector3() },
      uB1: { value: new Vector3() },
      uB2: { value: new Vector3() },
      uG0: { value: new Vector3() },
      uG1: { value: new Vector3() },
      uG2: { value: new Vector3() },
      uG3: { value: new Vector3() },
      uOpacity: { value: new Vector3() },
      uStrength: { value: STRENGTH },
      uCardA: { value: new Vector3() },
      uCardB: { value: new Vector3() },
      uCardAlpha: { value: new Vector2() },
      uBand: { value: new Vector2(1, 0) },
    },
  });
  const geometry = new PlaneGeometry(1, 1);
  const mesh = new Mesh(geometry, material);

  mesh.renderOrder = -10;
  mesh.frustumCulled = false;

  const u = material.uniforms;

  return {
    mesh,
    /** Card size in CSS pixels. The plane itself is sized by the scene so its uv spans the canvas exactly. */
    setSize(width: number, height: number, bandTop: number) {
      u.uSize.value.set(width, height);
      u.uBand.value.set(Math.max(1, height - bandTop), 1.2);
    },
    setTheme(dark: boolean) {
      u.uPaper.value.copy(rgb(cssVar('--surface')));
      const cardA = dark ? CARD_A.dark : CARD_A.light;
      const cardB = dark ? CARD_B.dark : CARD_B.light;

      u.uCardA.value.copy(rgb(cardA[0]));
      u.uCardB.value.copy(rgb(cardB[0]));
      u.uCardAlpha.value.set(cardA[1], cardB[1]);
      u.uA0.value.copy(rgb(CURTAIN_A[0]));
      u.uA1.value.copy(rgb(CURTAIN_A[1]));
      u.uA2.value.copy(rgb(CURTAIN_A[2]));
      u.uB0.value.copy(rgb(CURTAIN_B[0]));
      u.uB1.value.copy(rgb(CURTAIN_B[1]));
      u.uB2.value.copy(rgb(CURTAIN_B[2]));
      GLOWS.forEach((css, index) => u[`uG${index}`].value.copy(rgb(css)));
      u.uOpacity.value.set(...(dark ? OPACITY_DARK : OPACITY_LIGHT));
    },
    update(time: number) {
      u.uTime.value = time;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
