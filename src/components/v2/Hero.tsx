"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

const W1 = "shift";
const W2 = "studio";

export function Hero() {
  const { settings, ready, openContact } = useV2();
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  const p = useSectionProgress(ref, ["start start", "end end"]);

  // 0 → 0.55: la ventana se abre a pantalla completa y las palabras se separan.
  const e = useTransform(p, [0, 0.55], [0, 1], { clamp: true });
  const iy = mobile ? 31 : 27;
  const ix = mobile ? 7 : 32;
  const clip = useTransform(e, (v) => {
    const k = 1 - v;
    return `inset(${iy * k}% ${ix * k}% ${iy * k}% ${ix * k}% round ${18 * k}px)`;
  });
  const mediaScale = useTransform(e, [0, 1], [1.3, 1]);
  const leftX = useTransform(e, [0, 1], ["0vw", "-38vw"]);
  const rightX = useTransform(e, [0, 1], ["0vw", "38vw"]);
  const wordsO = useTransform(e, [0.2, 0.75], [1, 0]);
  const veilO = useTransform(e, [0, 1], [0.1, 0.62]);
  const metaO = useTransform(p, [0, 0.12], [1, 0]);
  const stmtO = useTransform(p, [0.5, 0.66], [0, 1]);
  const stmtY = useTransform(p, [0.5, 0.8], [50, 0]);
  const [stmtIn, setStmtIn] = useState(false);
  useMotionValueEvent(p, "change", (v) => setStmtIn(v > 0.52));

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
    <section ref={ref} className="hero" id="top" data-label="(00) Inicio">
      <div className="hero-st">
        <motion.div
          className="hero-frame"
          style={{ clipPath: clip }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
        >
          <motion.div className="hero-media" style={{ scale: mediaScale }}>
            <HeroMedia mode={settings.hero} slides={SETS[settings.set].slides} />
          </motion.div>
          <motion.div className="hero-veil" style={{ opacity: veilO }} />
        </motion.div>

        <motion.div className="hero-meta" style={{ opacity: metaO }}>
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

        <motion.h1 className="hero-w w1" style={{ x: leftX, opacity: wordsO }} aria-label="shift studio">
          <span aria-hidden="true">{chars(W1, 0.1)}</span>
        </motion.h1>
        <motion.div className="hero-w w2" style={{ x: rightX, opacity: wordsO }} aria-hidden="true">
          {chars(W2, 0.3)}
          <sup>®</sup>
        </motion.div>

        <motion.div className={`hero-stmt${stmtIn ? " on" : ""}`} style={{ opacity: stmtO, y: stmtY }}>
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
