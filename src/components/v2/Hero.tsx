"use client";

import { AnimatePresence, motion, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { useV2 } from "./context";
import { HERO_PHOTO, HERO_VIDEOS, SETS, type HeroMode } from "./media";
import { EASE, Magnetic, MaskText } from "./primitives";
import { useIsMobile, useSectionProgress } from "./useMedia";

function Video({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [src]);
  return (
    <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="auto" />
  );
}

function Slides({ slides }: { slides: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, [slides.length]);
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[i % slides.length]}
          className="hm-img kb"
          style={{ backgroundImage: `url(${slides[i % slides.length]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <span className="hm-count mono">
        ({String((i % slides.length) + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")})
      </span>
    </>
  );
}

export function HeroMedia({ mode, slides }: { mode: HeroMode; slides: string[] }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={mode + (mode === "slides" ? slides[0] : "")}
        className="hm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        {mode === "foto" ? (
          <div className="hm-img kb" style={{ backgroundImage: `url(${HERO_PHOTO})` }} />
        ) : mode === "slides" ? (
          <Slides slides={slides} />
        ) : (
          <Video {...HERO_VIDEOS[mode]} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/*
 * Animación de scroll del hero.
 *
 * La "ventana" que se abre a pantalla completa se hace SOLO con transform:
 * el marco (.hero-frame, un poco más grande que el viewport para que sus
 * esquinas redondeadas queden afuera al final) arranca escalado a (sx, sy) y
 * el media adentro lleva la contra-escala (zoom / escala del marco), así el
 * video no se deforma. Nada de clip-path, que en Chrome repinta el layer del
 * video en cada frame.
 *
 * Donde el navegador soporta scroll-driven animations (Chrome 115+, Safari 26+)
 * todo corre como animación CSS atada a un view-timeline: la ejecuta el
 * compositor, sincronizada con el scroll real aunque el hilo principal esté
 * ocupado (Lenis en desktop, inercia del touch en mobile). En el resto
 * (Firefox) se usa el mismo modelo calculado con framer-motion.
 */

const EXPAND = 0.55; // fracción del recorrido del hero en la que la ventana llega a pantalla completa
const M0 = 1.3; // zoom inicial del media (parallax)
const STOPS = 8;

function buildHeroCss() {
  const pct = (t: number) => `${+(t * 100).toFixed(2)}%`;
  const frame: string[] = [];
  const media: string[] = [];
  for (let k = 0; k <= STOPS; k++) {
    const t = k / STOPS;
    const fx = `(var(--sx) + (1 - var(--sx)) * ${t})`;
    const fy = `(var(--sy) + (1 - var(--sy)) * ${t})`;
    const m = +(M0 - (M0 - 1) * t).toFixed(4);
    frame.push(`${pct(t)}{transform:scale(calc${fx},calc${fy})}`);
    media.push(`${pct(t)}{transform:scale(calc(${m} / ${fx}),calc(${m} / ${fy}))}`);
  }
  const r = (a: number, b: number) => `contain ${pct(a)} contain ${pct(b)}`;
  const fade = r(0.2 * EXPAND, 0.75 * EXPAND);
  return `
@keyframes v2-frame{${frame.join("")}}
@keyframes v2-media{${media.join("")}}
@keyframes v2-w1{to{transform:translateX(-38vw)}}
@keyframes v2-w2{to{transform:translateX(38vw)}}
@keyframes v2-out{from{opacity:1}to{opacity:0}}
@keyframes v2-veil{from{opacity:.1}to{opacity:.62}}
@keyframes v2-in{from{opacity:0}to{opacity:1}}
@keyframes v2-up{from{transform:translateY(50px)}to{transform:none}}
@supports (animation-timeline: view()){
.v2 .hero.sda{view-timeline:--hero block}
.v2 .hero.sda .hero-frame{animation:v2-frame linear both;animation-timeline:--hero;animation-range:${r(0, EXPAND)}}
.v2 .hero.sda .hero-media{animation:v2-media linear both;animation-timeline:--hero;animation-range:${r(0, EXPAND)}}
.v2 .hero.sda .hero-veil{animation:v2-veil linear both;animation-timeline:--hero;animation-range:${r(0, EXPAND)}}
.v2 .hero.sda .w1{animation:v2-w1 linear both,v2-out linear both;animation-timeline:--hero,--hero;animation-range:${r(0, EXPAND)},${fade}}
.v2 .hero.sda .w2{animation:v2-w2 linear both,v2-out linear both;animation-timeline:--hero,--hero;animation-range:${r(0, EXPAND)},${fade}}
.v2 .hero.sda .hero-meta{animation:v2-out linear both;animation-timeline:--hero;animation-range:${r(0, 0.12)}}
.v2 .hero.sda .hero-stmt{animation:v2-in linear both,v2-up linear both;animation-timeline:--hero,--hero;animation-range:${r(0.5, 0.66)},${r(0.5, 0.8)}}
}`;
}
const HERO_CSS = buildHeroCss();

const noopSubscribe = () => () => {};
function useScrollDrivenSupport() {
  return useSyncExternalStore(
    noopSubscribe,
    () => typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"),
    () => false,
  );
}

const W1 = "shift";
const W2 = "studio";

export function Hero() {
  const { settings, ready, openContact } = useV2();
  const ref = useRef<HTMLElement>(null);
  const stRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const sda = useScrollDrivenSupport();
  const p = useSectionProgress(ref, ["start start", "end end"]);

  // Geometría de la ventana inicial → --sx/--sy/--hr (sin estado de React).
  const geo = useRef({ sx: 0.34, sy: 0.44 });
  useLayoutEffect(() => {
    const hero = ref.current;
    const st = stRef.current;
    if (!hero || !st) return;
    const apply = () => {
      const W = st.clientWidth;
      const H = st.clientHeight;
      const R = mobile ? 28 : 40;
      const [ww, wh] = mobile ? [0.86 * W, 0.38 * H] : [0.36 * W, 0.46 * H];
      const sx = ww / (W + 2 * R);
      const sy = wh / (H + 2 * R);
      geo.current = { sx, sy };
      hero.style.setProperty("--hr", `${R}px`);
      hero.style.setProperty("--sx", sx.toFixed(5));
      hero.style.setProperty("--sy", sy.toFixed(5));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(st);
    return () => ro.disconnect();
  }, [mobile]);

  // Fallback JS (sin scroll-driven animations): mismo modelo, calculado por frame.
  const e = useTransform(p, (v) => Math.min(1, Math.max(0, v / EXPAND)));
  const frameAt = (s: number, t: number) => s + (1 - s) * t;
  const fX = useTransform(e, (t) => frameAt(geo.current.sx, t));
  const fY = useTransform(e, (t) => frameAt(geo.current.sy, t));
  const mX = useTransform(e, (t) => (M0 - (M0 - 1) * t) / frameAt(geo.current.sx, t));
  const mY = useTransform(e, (t) => (M0 - (M0 - 1) * t) / frameAt(geo.current.sy, t));
  const leftX = useTransform(e, [0, 1], ["0vw", "-38vw"]);
  const rightX = useTransform(e, [0, 1], ["0vw", "38vw"]);
  const wordsO = useTransform(e, [0.2, 0.75], [1, 0]);
  const veilO = useTransform(e, [0, 1], [0.1, 0.62]);
  const metaO = useTransform(p, [0, 0.12], [1, 0]);
  const stmtO = useTransform(p, [0.5, 0.66], [0, 1]);
  const stmtY = useTransform(p, [0.5, 0.8], [50, 0]);

  // El reveal del statement es un disparo único: solo cambia estado al cruzar el umbral.
  const [stmtIn, setStmtIn] = useState(false);
  const stmtRef = useRef(false);
  useMotionValueEvent(p, "change", (v) => {
    const next = v > 0.52;
    if (next !== stmtRef.current) {
      stmtRef.current = next;
      setStmtIn(next);
    }
  });

  const js = !sda;

  const chars = (w: string, base: number) =>
    w.split("").map((ch, i) => (
      <span className="mk" key={i}>
        <motion.span
          initial={{ y: "105%" }}
          animate={{ y: ready ? "0%" : "105%" }}
          transition={{ duration: 1.2, ease: EASE, delay: base + i * 0.05 }}
        >
          {ch}
        </motion.span>
      </span>
    ));

  return (
    <section ref={ref} className={`hero${sda ? " sda" : ""}`} id="top" data-label="(00) Inicio">
      <style>{HERO_CSS}</style>
      <div ref={stRef} className="hero-st">
        <motion.div
          className="hero-frame-in"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
        >
          <motion.div className="hero-frame" style={js ? { scaleX: fX, scaleY: fY } : undefined}>
            <motion.div className="hero-media" style={js ? { scaleX: mX, scaleY: mY } : undefined}>
              <HeroMedia mode={settings.hero} slides={SETS[settings.set].slides} />
            </motion.div>
            <motion.div className="hero-veil" style={js ? { opacity: veilO } : undefined} />
          </motion.div>
        </motion.div>

        <motion.div className="hero-meta" style={js ? { opacity: metaO } : undefined}>
          <motion.span
            className="mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Identidad + sistemas
            <br />
            para pymes
          </motion.span>
          <motion.span
            className="mono hide-m"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Identidad
            <br />
            Sistemas · Web
          </motion.span>
          <motion.span
            className="mono hide-m"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            Córdoba, AR
            <br />
            31°S 64°O
          </motion.span>
          <motion.span
            className="mono r"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            ©2026
            <br />
            (Scroll ↓)
          </motion.span>
        </motion.div>

        <motion.h1
          className="hero-w w1"
          style={js ? { x: leftX, opacity: wordsO } : undefined}
          aria-label="shift studio"
        >
          <span aria-hidden="true">{chars(W1, 0.1)}</span>
        </motion.h1>
        <motion.div
          className="hero-w w2"
          style={js ? { x: rightX, opacity: wordsO } : undefined}
          aria-hidden="true"
        >
          {chars(W2, 0.3)}
          <sup>®</sup>
        </motion.div>

        <motion.div
          className={`hero-stmt${stmtIn ? " on" : ""}`}
          style={js ? { opacity: stmtO, y: stmtY } : undefined}
        >
          <span className="mono">(Shift Studio®) — Identidad + Sistemas</span>
          <MaskText
            as="p"
            className="hero-stmt-t"
            text={"Tu negocio es un sistema.\n*Nosotros lo diseñamos.*"}
            animate={stmtIn}
            stagger={0.06}
          />
          <p className="hero-stmt-d">
            <b>Identidad</b>, <b>operaciones</b> y <b>tecnología</b>, pensadas como{" "}
            <b>una sola pieza</b> — no como servicios sueltos.
          </p>
          <Magnetic>
            <button className="btn" data-cur="Agendar" onClick={() => openContact()}>
              Agendar diagnóstico →
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
