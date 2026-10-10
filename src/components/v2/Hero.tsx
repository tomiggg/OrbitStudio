"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import { useV2 } from "./context";
import { Module, Raw, type PieceId } from "./modules";
import { EASE, Magnetic } from "./primitives";
import { useIsMobile, useMedia, useSectionProgress } from "./useMedia";

/*
 * Hero — el momento firma del sitio: del caos al sistema.
 *
 * Arranca con el desorden real de una pyme (WhatsApps, planillas rotas,
 * post-its, facturas que vencen) desparramado por la pantalla. Al scrollear,
 * cada pieza viaja a su lugar en una grilla y cambia de cara: el artefacto
 * crudo se apaga y aparece su módulo limpio. Al final los ocho módulos quedan
 * dentro de un mismo marco — "una sola pieza" — y el titular cambia de
 * "funciona a pulmón" a "lo convertimos en un sistema".
 *
 * Es la única animación protagonista de la página; el resto acompaña.
 * Todo es transform/opacity atado al scroll (lo maneja la persona, se puede
 * frenar y volver). Con reduced-motion se muestra el estado final, sin pin.
 */

type Piece = {
  id: PieceId;
  /** Desplazamiento del caos respecto de su celda: [x vw, y vh, rotación°]. */
  d: [number, number, number];
  /** Igual, en mobile. null = la pieza no se muestra en mobile. */
  m: [number, number, number] | null;
};

// Grilla final: 4×2 en desktop, 3×2 en mobile (orden del DOM).
const PIECES: Piece[] = [
  { id: "pedidos", d: [-12, 34, -8], m: [47, -23, -8] },
  { id: "stock", d: [5.5, -14, 5], m: [-29, -19, 6] },
  { id: "tareas", d: [9, 32, 10], m: [-8, -3, 10] },
  { id: "facturas", d: [-25.5, 14, -4], m: null },
  { id: "catalogo", d: [-24, 16, 6], m: [25, -21, 7] },
  { id: "marca", d: [23.5, -34, -10], m: [31, -1, -9] },
  { id: "agenda", d: [-27, -20, 3], m: null },
  { id: "cobros", d: [-13.5, 20, 8], m: [-56, -3, 5] },
];

// En pantalla: suave en ambos extremos (sale despacio del caos y aterriza).
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function PieceView({
  piece,
  k,
  p,
  mobile,
  ready,
}: {
  piece: Piece;
  k: number;
  p: MotionValue<number>;
  mobile: boolean;
  ready: boolean;
}) {
  const off = (mobile ? piece.m : piece.d) ?? [0, 0, 0];
  // Cada pieza arranca un poco después que la anterior: el orden se va armando.
  const a = 0.06 + k * 0.03;
  const b = a + 0.4;
  const t = useTransform(p, [a, b], [0, 1], { ease: easeIO });
  const x = useTransform(t, (v) => `${(off[0] * (1 - v)).toFixed(3)}vw`);
  const y = useTransform(t, (v) => `${(off[1] * (1 - v)).toFixed(3)}vh`);
  const rotate = useTransform(t, (v) => off[2] * (1 - v));
  // Cambio de cara al aterrizar: el crudo se apaga un poco antes de que
  // aparezca el módulo, con escalas opuestas para que no se lea como un fundido plano.
  const rawO = useTransform(p, [b - 0.13, b - 0.04], [1, 0]);
  const rawS = useTransform(p, [b - 0.13, b - 0.04], [1, 0.9]);
  const modO = useTransform(p, [b - 0.09, b], [0, 1]);
  const modS = useTransform(p, [b - 0.09, b], [0.94, 1]);

  return (
    <motion.div
      className={`pc pc-${piece.id}${piece.m ? "" : " hide-m"}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.3 + k * 0.05 }}
    >
      <motion.div className="pc-in" style={{ x, y, rotate }}>
        <motion.div className="pc-raw" style={{ opacity: rawO, scale: rawS }}>
          <Raw id={piece.id} />
        </motion.div>
        <motion.div className="pc-mod" style={{ opacity: modO, scale: modS }}>
          <Module id={piece.id} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Line({
  children,
  scrollY,
  delay,
  ready,
}: {
  children: string;
  scrollY: MotionValue<string>;
  /** Con delay, la línea además entra desde su máscara cuando termina la intro. */
  delay?: number;
  ready: boolean;
}) {
  const inner = (
    <motion.span className="hl" style={{ y: scrollY }}>
      {children}
    </motion.span>
  );
  return (
    <span className="mk hl-mk">
      {delay === undefined ? (
        inner
      ) : (
        <motion.span
          className="hl"
          initial={{ y: "110%" }}
          animate={{ y: ready ? "0%" : "110%" }}
          transition={{ duration: 1, ease: EASE, delay }}
        >
          {inner}
        </motion.span>
      )}
    </span>
  );
}

export function Hero() {
  const { ready, openContact } = useV2();
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  // useMedia (y no useReducedMotion): en el server da false y se corrige al
  // hidratar, sin que el HTML del server y el primer render del cliente difieran.
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const live = useSectionProgress(ref, ["start start", "end end"]);
  const done = useMotionValue(1);
  const p = reduce ? done : live;

  const aY = useTransform(p, [0.36, 0.48], ["0%", "-112%"]);
  const bY = useTransform(p, [0.44, 0.58], ["112%", "0%"]);
  const subO = useTransform(p, [0.58, 0.7], [0, 1]);
  const subY = useTransform(p, [0.58, 0.72], [18, 0]);
  const sysO = useTransform(p, [0.6, 0.74], [0, 1]);
  const sysS = useTransform(p, [0.6, 0.76], [0.97, 1]);
  const cueO = useTransform(p, [0.64, 0.72], [1, 0]);
  const order = useTransform(p, [0.04, 0.7], [0, 1]);

  // Los botones solo reciben clics cuando ya se ven.
  const [live2, setLive2] = useState(false);
  const flag = useRef(false);
  useMotionValueEvent(p, "change", (v) => {
    const next = v > 0.6;
    if (next !== flag.current) {
      flag.current = next;
      setLive2(next);
    }
  });
  const ctaOn = reduce || live2;

  return (
    <section
      ref={ref}
      className={`hero${reduce ? " still" : ""}`}
      id="top"
      data-label="Inicio"
      data-theme="paper"
    >
      <div className="hero-st">
        <div className="hero-copy">
          <motion.p
            className="hero-kick"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            Estudio de sistemas para pymes, en Córdoba
          </motion.p>
          <h1 className="hero-h" aria-label="Tu negocio funciona a pulmón. Lo convertimos en un sistema.">
            <span className="hero-h-a" aria-hidden="true">
              <Line scrollY={aY} delay={0.2} ready={ready}>
                Tu negocio
              </Line>
              <Line scrollY={aY} delay={0.28} ready={ready}>
                funciona
              </Line>
              <Line scrollY={aY} delay={0.36} ready={ready}>
                a pulmón.
              </Line>
            </span>
            <span className="hero-h-b" aria-hidden="true">
              <Line scrollY={bY} ready={ready}>
                Lo convertimos
              </Line>
              <Line scrollY={bY} ready={ready}>
                en un sistema.
              </Line>
            </span>
          </h1>
          <motion.div
            className="hero-sub"
            style={{ opacity: subO, y: subY, pointerEvents: ctaOn ? "auto" : "none" }}
            aria-hidden={!ctaOn}
          >
            <p>
              Marca, operación y web diseñadas como una sola pieza, para negocios que crecieron más
              rápido que sus herramientas.
            </p>
            <div className="hero-ctas">
              <Magnetic>
                <button className="btn" data-cur="Agendar" onClick={() => openContact()} tabIndex={ctaOn ? 0 : -1}>
                  Agendar diagnóstico
                </button>
              </Magnetic>
              <a className="btn o" href="#proyectos" tabIndex={ctaOn ? 0 : -1}>
                Ver casos
              </a>
            </div>
          </motion.div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          <motion.div className="sys" style={{ opacity: sysO, scale: sysS }}>
            <span className="sys-bar">
              <i />
              <i />
              <i />
              <span>tu-negocio.app</span>
            </span>
          </motion.div>
          <div className="sys-grid">
            {PIECES.map((piece, k) => (
              <PieceView key={piece.id} piece={piece} k={k} p={p} mobile={mobile} ready={ready} />
            ))}
          </div>
        </div>

        {!reduce && (
          <motion.div
            className="hero-cue"
            style={{ opacity: cueO }}
            initial={{ y: 10 }}
            animate={{ y: ready ? 0 : 10 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
            aria-hidden="true"
          >
            <span>Scrolleá para ordenar</span>
            <span className="hero-cue-bar">
              <motion.i style={{ scaleX: order }} />
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
