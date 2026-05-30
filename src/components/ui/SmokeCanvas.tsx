"use client";

import { useEffect, useRef } from "react";

const GRAIN_INTERVAL = 80;
const GRAIN_TILE = 256;
const SMOKE_SPEED = 2;
const SMOKE_DENSITY = 3;
const SMOKE_CONTRAST = 10;

const VS = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FS = `
  precision highp float;
  uniform vec2 u_res;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_density;
  uniform float u_contrast;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  float snoise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x+p.y)*K1);
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)), 0.0);
    vec3 n = h*h*h*h*vec3(dot(a,hash2(i)),dot(b,hash2(i+o)),dot(c,hash2(i+1.0)));
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    uv.y = 1.0 - uv.y;
    float t = u_time * u_speed * 0.00012;
    float scale = 1.8 + u_density * 0.28;
    vec2 p = uv * scale;
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + t * 0.8),
      fbm(p + vec2(5.2, 1.3) + t * 0.6)
    );
    vec2 r = vec2(
      fbm(p + 4.0*q + vec2(1.7, 9.2) + t * 1.1),
      fbm(p + 4.0*q + vec2(8.3, 2.8) + t * 0.9)
    );
    float f = fbm(p + 4.0*r + t * 0.5);
    float contrast = 0.8 + u_contrast * 0.15;
    f = pow(clamp(f * 0.5 + 0.5, 0.0, 1.0), contrast);
    vec3 dark = vec3(0.03, 0.03, 0.032);
    vec3 light = vec3(0.15, 0.16, 0.17);
    vec3 col = mix(dark, light, f * f);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function SmokeCanvas() {
  const webglRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = webglRef.current;
    const grainCV = grainRef.current;
    if (!cv || !grainCV) return;

    const gl = (cv.getContext("webgl") || cv.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    function compileShader(g: WebGLRenderingContext, type: number, src: string) {
      const s = g.createShader(type)!;
      g.shaderSource(s, src);
      g.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uSpeed = gl.getUniformLocation(prog, "u_speed");
    const uDensity = gl.getUniformLocation(prog, "u_density");
    const uContrast = gl.getUniformLocation(prog, "u_contrast");

    let W = 0, H = 0;
    function resize() {
      if (!cv || !grainCV || !gl) return;
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      grainCV.width = grainCV.offsetWidth;
      grainCV.height = grainCV.offsetHeight;
      gl.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    const gCtx = grainCV.getContext("2d");
    if (!gCtx) return;
    const gtile = document.createElement("canvas");
    gtile.width = GRAIN_TILE;
    gtile.height = GRAIN_TILE;
    const gtCtx = gtile.getContext("2d")!;
    let grainLast = 0;

    function drawGrain(ts: number) {
      if (ts - grainLast < GRAIN_INTERVAL) return;
      if (!gCtx || !grainCV) return;
      const img = gtCtx.createImageData(GRAIN_TILE, GRAIN_TILE);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v; d[i+1] = v; d[i+2] = v; d[i+3] = 255;
      }
      gtCtx.putImageData(img, 0, 0);
      const pat = gCtx.createPattern(gtile, "repeat");
      if (pat) {
        gCtx.clearRect(0, 0, grainCV.width, grainCV.height);
        gCtx.fillStyle = pat;
        gCtx.fillRect(0, 0, grainCV.width, grainCV.height);
      }
      grainLast = ts;
    }

    let animId: number;
    function loop(ts: number) {
      if (!gl) return;
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, ts);
      gl.uniform1f(uSpeed, SMOKE_SPEED);
      gl.uniform1f(uDensity, SMOKE_DENSITY);
      gl.uniform1f(uContrast, SMOKE_CONTRAST);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      drawGrain(ts);
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", zIndex: 0 }}>
      <canvas
        ref={webglRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <canvas
        ref={grainRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "screen", opacity: 0.05 }}
      />
    </div>
  );
}
