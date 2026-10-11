"use client";

import { useEffect, useRef } from "react";
import type { LiveMode } from "./media";

/*
 * Fondos generativos del hero: un único quad WebGL con cuatro fragment shaders.
 * Todos hablan el mismo idioma que el resto de la página: tinta y hueso, el
 * teal solo como punto de atención cerca del cursor, y el grano lo pone la
 * capa global de la página (acá no se duplica).
 *
 *   fluido — humo por domain warping; el cursor lo empuja.
 *   topo   — curvas de nivel de un relieve que respira; el cursor levanta una loma.
 *   puntos — trama de medio tono de ese mismo humo, en retícula; el cursor la abre.
 *   lineas — líneas de flujo que nunca se cruzan; la que pasa por el cursor se marca.
 *
 * u_tone sigue al data-tone de la raíz: cuando la página hace "shift" a hueso,
 * el fondo se invierte con ella (tinta sobre papel) en vez de cortar en seco.
 * Se pausa fuera de pantalla y con la pestaña oculta; con reduced-motion
 * dibuja un solo cuadro (y redibuja si cambia el tono o el tamaño).
 */

const HEAD = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_tone;
uniform float u_acc;
uniform float u_px;
const vec3 INK = vec3(0.039, 0.039, 0.035);
const vec3 BONE = vec3(0.925, 0.918, 0.898);
const vec3 TEAL = vec3(0.039, 0.729, 0.71);
vec3 paint(float v, float a) {
  vec3 bg = mix(INK, BONE, u_tone);
  vec3 fg = mix(BONE, INK, u_tone);
  vec3 c = mix(bg, fg, clamp(v, 0.0, 1.0));
  return mix(c, TEAL, clamp(a, 0.0, 1.0) * u_acc);
}
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float snoise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}
const mat2 ROT = mat2(0.8776, 0.4794, -0.4794, 0.8776);
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p = ROT * p * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}
`;

const FRAG: Record<LiveMode, string> = {
  fluido: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.y;
  vec2 m = u_mouse * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.07;
  vec2 d = uv - m;
  float fall = exp(-dot(d, d) * 7.0);
  vec2 p = uv * 1.15 - d * fall * 0.7;
  vec2 q = vec2(fbm(p + t * 0.8), fbm(p + vec2(5.2, 1.3) + t * 0.6));
  vec2 r = vec2(fbm(p + 1.7 * q + vec2(1.7, 9.2) + t * 1.1), fbm(p + 1.7 * q + vec2(8.3, 2.8) + t * 0.9));
  float f = clamp(fbm(p + 1.9 * r + t * 0.5) * 0.7 + 0.5, 0.0, 1.0);
  float wisp = smoothstep(0.38, 0.98, f);
  float v = wisp * wisp * 0.72 + length(q) * 0.05;
  float a = smoothstep(0.7, 1.0, f) * fall * 0.35;
  gl_FragColor = vec4(paint(v, a), 1.0);
}`,
  topo: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.y;
  vec2 m = u_mouse * vec2(u_res.x / u_res.y, 1.0);
  vec2 d = uv - m;
  float near = exp(-dot(d, d) * 20.0);
  float h = fbm(uv * 1.3 + vec2(0.0, u_time * 0.02)) + 0.5 * near;
  float lv = h * 13.0;
  float w = fwidth(lv);
  float dist = abs(fract(lv + 0.5) - 0.5);
  float thin = 1.0 - smoothstep(w * 0.35 * u_px, w * (0.35 * u_px + 1.0), dist);
  float thick = 1.0 - smoothstep(w * 0.9 * u_px, w * (0.9 * u_px + 1.0), dist);
  float idx = 1.0 - step(0.5, mod(floor(lv + 0.5), 5.0));
  float line = mix(thin, thick, idx);
  float v = line * mix(0.26, 0.5, idx);
  gl_FragColor = vec4(paint(v, line * near * 0.9), 1.0);
}`,
  puntos: `
void main() {
  vec2 fc = gl_FragCoord.xy;
  float s = 15.0 * u_px;
  vec2 cell = floor(fc / s);
  vec2 c = (cell + 0.5) * s;
  vec2 cuv = c / u_res.y;
  vec2 m = u_mouse * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.06;
  vec2 q = vec2(fbm(cuv * 1.6 + t), fbm(cuv * 1.6 + vec2(5.2, 1.3) - t * 0.7));
  float n = clamp(fbm(cuv * 1.6 + 2.5 * q) * 0.8 + 0.5, 0.0, 1.0);
  vec2 dm = cuv - m;
  float infl = exp(-dot(dm, dm) * 60.0);
  vec2 off = normalize(dm + 1e-5) * infl * s * 0.14;
  float r = s * mix(0.03, 0.3, n * n);
  r = mix(r, s * 0.3, infl * 0.7);
  float dd = length(fc - (c + off));
  float dotv = 1.0 - smoothstep(r - 0.75 * u_px, r + 0.75 * u_px, dd);
  gl_FragColor = vec4(paint(dotv * mix(0.3, 0.75, n), dotv * infl * 0.8), 1.0);
}`,
  lineas: `
float field(vec2 uv, vec2 m) {
  vec2 d = uv - m;
  float bump = exp(-dot(d, d) * 10.0);
  return uv.y * 30.0 + fbm(uv * vec2(0.7, 1.1) + vec2(u_time * 0.035, u_time * 0.012)) * 5.0 + bump * 2.2;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.y;
  vec2 m = u_mouse * vec2(u_res.x / u_res.y, 1.0);
  float g = field(uv, m);
  float w = fwidth(g);
  float dist = abs(fract(g + 0.5) - 0.5);
  float line = 1.0 - smoothstep(w * 0.4 * u_px, w * (0.4 * u_px + 1.0), dist);
  float mine = 1.0 - step(0.5, abs(floor(g + 0.5) - floor(field(m, m) + 0.5)));
  vec2 d = uv - m;
  float fade = mix(0.35, 1.0, exp(-dot(d, d) * 1.5));
  gl_FragColor = vec4(paint(line * 0.34 * fade + line * mine * 0.3, line * mine), 1.0);
}`,
};

const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";

/** Escala de render: el fluido es suave y aguanta media resolución. */
const RES: Record<LiveMode, number> = { fluido: 0.5, topo: 1, puntos: 1, lineas: 1 };

export function HeroCanvas({ mode, accent }: { mode: LiveMode; accent: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const accRef = useRef(accent);
  useEffect(() => {
    accRef.current = accent;
  }, [accent]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    gl.getExtension("OES_standard_derivatives");

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, HEAD + FRAG[mode]));
    gl.bindAttribLocation(prog, 0, "a");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("u_res");
    const uTime = U("u_time");
    const uMouse = U("u_mouse");
    const uTone = U("u_tone");
    const uAcc = U("u_acc");
    const uPx = U("u_px");

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const root = cv.closest<HTMLElement>(".v2");
    const toneTarget = () => (root?.dataset.tone === "light" ? 1 : 0);

    let px = 1;
    const resize = () => {
      px = Math.min(devicePixelRatio || 1, 1.5) * RES[mode];
      cv.width = Math.max(1, Math.round(cv.clientWidth * px));
      cv.height = Math.max(1, Math.round(cv.clientHeight * px));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();

    // Cursor en coordenadas del canvas ya transformado (la ventana del hero escala).
    const target = { x: 0.62, y: 0.42 };
    const mouse = { ...target };
    let hasPointer = false;
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      if (!r.width) return;
      hasPointer = true;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
    };
    if (fine && !reduce) addEventListener("pointermove", move, { passive: true });

    let tone = toneTarget();
    let time = 7;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const draw = () => {
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTone, tone);
      gl.uniform1f(uAcc, accRef.current ? 1 : 0);
      gl.uniform1f(uPx, px);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      if (!hasPointer) {
        // Sin mouse (touch): el punto de atención deriva solo, lento.
        target.x = 0.5 + Math.sin(time * 0.21) * 0.24;
        target.y = 0.45 + Math.cos(time * 0.17) * 0.18;
      }
      const k = 1 - Math.exp(-dt * 4);
      mouse.x += (target.x - mouse.x) * k;
      mouse.y += (target.y - mouse.y) * k;
      // Mismo tiempo que la transición de color de la página (~0.7s).
      tone += (toneTarget() - tone) * (1 - Math.exp(-dt * 6));
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) {
        tone = toneTarget();
        draw();
        return;
      }
      if (!visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) tone = toneTarget();
      start();
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(cv);
    const mo = new MutationObserver(() => {
      if (reduce || !visible) {
        tone = toneTarget();
        draw();
      }
    });
    if (root) mo.observe(root, { attributes: true, attributeFilter: ["data-tone"] });
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", start);
      // Libera el contexto: cambiar de fondo varias veces no acumula contextos WebGL.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [mode]);

  return <canvas ref={ref} className="hm-cv" aria-hidden="true" />;
}
