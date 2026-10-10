"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";
import { useV2 } from "./context";
import { EMAIL, NAV, WHATSAPP } from "./chrome";
import { Module, type PieceId } from "./modules";
import { DUR, EASE, EASE_IN, EASE_IO, Magnetic, MaskText, Roll, Rule } from "./primitives";
import { useSectionProgress } from "./useMedia";

/*
 * Ritmo de la página: secciones que alternan papel (claro) y tinta (oscuro).
 * Cada sección declara su tema con data-theme; el header lo lee para invertirse.
 * Los títulos de sección entran desde su máscara (una sola entrada para toda
 * la página); el resto del contenido aparece sin animación propia.
 */

/* ───────────────────── Encabezado de sección ───────────────────── */

function SecHead({ title, aside }: { title: string; aside: string }) {
  return (
    <div className="sh">
      <Rule />
      <MaskText className="sh-t" text={title} />
      <p className="sh-a">{aside}</p>
    </div>
  );
}

/* ───────────────────────── Manifiesto ───────────────────────── */

const MANIFESTO =
  "Diseñamos sistemas de negocio: [0] identidad, operaciones y tecnología como una sola pieza. [1] *Para que te veas como una empresa grande [2] y operes como una.*";

const MANIFESTO_TOKENS = (() => {
  let serif = false;
  return MANIFESTO.split(" ").map((t) => {
    if (t.startsWith("*")) serif = true;
    const tok = { t: t.replace(/\*/g, ""), serif };
    if (t.endsWith("*")) serif = false;
    return tok;
  });
})();

function Word({
  children,
  p,
  range,
  serif,
}: {
  children: string;
  p: MotionValue<number>;
  range: [number, number];
  serif: boolean;
}) {
  const o = useTransform(p, range, [0.14, 1]);
  return (
    <motion.span className={serif ? "sf" : undefined} style={{ opacity: o }}>
      {children}{" "}
    </motion.span>
  );
}

/*
 * Glifos en línea con el texto (en vez de fotos): cada uno dibuja la idea de
 * su frase y se arma cuando la lectura llega hasta él.
 *   0 — marca: tres muestras de color
 *   1 — una sola pieza: cuatro bloques que encajan
 *   2 — escala: barras que crecen
 */
function Glyph({ kind, p, range }: { kind: number; p: MotionValue<number>; range: [number, number] }) {
  const t = useTransform(p, range, [0, 1]);
  const o = useTransform(t, [0, 0.4], [0, 1]);
  const s0 = useTransform(t, [0, 1], [0.4, 1]);
  const s1 = useTransform(t, [0.15, 1], [0.4, 1]);
  const s2 = useTransform(t, [0.3, 1], [0.4, 1]);
  const gap = useTransform(t, [0, 1], [6, 0]);
  const parts = [s0, s1, s2];
  return (
    <motion.span className={`mf-g mf-g${kind}`} style={{ opacity: o }} aria-hidden="true">
      {kind === 0 && parts.map((s, i) => <motion.i key={i} style={{ scale: s }} />)}
      {kind === 1 && [0, 1, 2, 3].map((i) => <motion.i key={i} style={{ x: i % 2 ? gap : 0, y: i > 1 ? gap : 0 }} />)}
      {kind === 2 && parts.map((s, i) => <motion.i key={i} style={{ scaleY: s }} />)}
    </motion.span>
  );
}

const PRINCIPLES = [
  ["Criterio", "Cada decisión visual responde a un objetivo de negocio."],
  ["Sistema", "Automatizamos lo repetitivo para que tu equipo se enfoque en crecer."],
  ["Un solo equipo", "Marca, operación y web bajo el mismo criterio, sin pasarse la pelota."],
  ["Escala", "Tu sistema crece con el negocio: más procesos, más equipo, más canales."],
];

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref, ["start start", "end end"]);
  const tokens = MANIFESTO_TOKENS;
  const N = tokens.length;
  const start = 0.04;
  const span = 0.78;

  return (
    <div className="mf-wrap" data-theme="ink">
      <section ref={ref} className="mf" id="estudio" data-label="Estudio">
        <div className="mf-st">
          <p className="mf-t">
            {tokens.map((tok, i) => {
              const a = start + (i / N) * span;
              const r: [number, number] = [a, a + span / N + 0.06];
              const m = tok.t.match(/^\[(\d)\]$/);
              if (m) return <Glyph key={i} kind={Number(m[1])} p={p} range={r} />;
              return (
                <Word key={i} p={p} range={r} serif={tok.serif}>
                  {tok.t}
                </Word>
              );
            })}
          </p>
        </div>
      </section>
      <div className="pp">
        {PRINCIPLES.map(([t, d]) => (
          <div key={t} className="pp-i">
            <Rule />
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Servicios ───────────────────────── */

/*
 * Índice de tres filas. Una abierta a la vez; al abrirse muestra qué incluye y
 * los módulos del hero que ese servicio produce — el mismo lenguaje visual
 * que el visitante ya vio ordenarse arriba.
 * La apertura es movimiento que responde a un clic: altura + opacidad,
 * rápido (0.45s) y sin rebote. La flecha gira desde su propio centro.
 */
const SERVICES: {
  title: string;
  what: string;
  body: string;
  includes: string[];
  pieces: PieceId[];
  contact: string;
}[] = [
  {
    title: "Marca",
    what: "Cómo te ven",
    body: "Logo, sistema visual y tono para que tu negocio se perciba del tamaño que querés tener — en la vidriera, en Instagram y en cada factura.",
    includes: ["Estrategia de marca", "Logo y sistema visual", "Tono y mensajes", "Piezas para redes"],
    pieces: ["marca", "catalogo"],
    contact: "Identidad & Autoridad",
  },
  {
    title: "Sistemas",
    what: "Cómo funciona",
    body: "Pedidos, stock, cobros y tareas en un solo lugar, con lo repetitivo automatizado. Tu equipo deja de perseguir planillas y chats.",
    includes: ["Mapa de procesos", "Panel de gestión", "Automatizaciones", "Integraciones con lo que ya usás"],
    pieces: ["stock", "tareas"],
    contact: "Sistemas & Automatización",
  },
  {
    title: "Web",
    what: "Cómo vendés",
    body: "Un sitio rápido, con catálogo y pedidos, que tu equipo actualiza sin depender de nadie. Pensado para convertir visitas en ventas.",
    includes: ["Sitio y catálogo", "Pedidos online", "Panel para editar", "Analítica"],
    pieces: ["pedidos", "cobros"],
    contact: "Web de Alta Conversión",
  },
];

function ServiceRow({
  s,
  open,
  onToggle,
}: {
  s: (typeof SERVICES)[number];
  open: boolean;
  onToggle: () => void;
}) {
  const { openContact } = useV2();
  const id = useId();
  return (
    <div className={`sv-row${open ? " on" : ""}`}>
      <button className="sv-head" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span className="sv-name">{s.title}</span>
        <span className="sv-what">{s.what}</span>
        <span className="sv-x" aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            className="sv-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.45, ease: EASE } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: EASE_IN } }}
          >
            <div className="sv-in">
              <div className="sv-copy">
                <p>{s.body}</p>
                <ul>
                  {s.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <button
                  className="btn"
                  onClick={() => {
                    track(ANALYTICS_EVENTS.serviceExpand, { service: s.title });
                    openContact(s.contact);
                  }}
                >
                  Consultar por {s.title.toLowerCase()}
                </button>
              </div>
              <div className="sv-mods" aria-hidden="true">
                {s.pieces.map((pc) => (
                  <Module key={pc} id={pc} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section className="sv" id="servicios" data-label="Servicios" data-theme="paper">
      <SecHead
        title="Tres disciplinas, un solo criterio."
        aside="Marca, operación y web diseñadas juntas: la identidad posiciona, el sistema sostiene y la web convierte."
      />
      <div className="sv-list">
        {SERVICES.map((s, i) => (
          <ServiceRow key={s.title} s={s} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Proyectos ───────────────────────── */

/*
 * Reveal de las capturas: el marco se abre como una cortina desde abajo
 * (clip-path) mientras la imagen adentro se des-zoomea (1.22 → 1). Lo dispara
 * la tarjeta (REVEAL_ON) y baja por variants: un elemento con clip-path
 * inset(100%) tiene área visible cero y el IntersectionObserver nunca lo ve.
 */
const REVEAL_ON = {
  initial: "hidden",
  whileInView: "shown",
  viewport: { once: true, amount: 0.25 },
} as const;
const curtain = {
  variants: {
    hidden: { clipPath: "inset(100% 0% 0% 0% round 14px)" },
    shown: { clipPath: "inset(0% 0% 0% 0% round 14px)", transition: { duration: DUR.reveal, ease: EASE_IO } },
  },
};
const dezoom = {
  variants: {
    hidden: { scale: 1.22 },
    shown: { scale: 1, transition: { duration: 1.6, ease: EASE } },
  },
};

// Los proyectos con `archived` quedan guardados pero no se muestran.
const PROJECTS = [
  {
    name: "Fila0",
    href: "https://fila0.app",
    domain: "fila0.app",
    img: "/v2/img/fila0.webp",
    lead: "Fila en la barra → pedido desde el celular.",
    rest: "Producto propio para boliches, bares y eventos: el cliente escanea un QR, pide y paga; la barra solo prepara.",
    disc: "Producto propio",
  },
  {
    name: "inmobi.app",
    href: "https://pb-inmobiliaria-contratos.vercel.app/",
    domain: "pb-inmobiliaria-contratos.vercel.app",
    img: "/v2/img/inmobi.webp",
    lead: "WhatsApp y planillas → un solo panel.",
    rest: "Reclamos, prestadores, pagos e impuestos de cada propiedad, con todo el equipo viendo lo mismo.",
    disc: "Sistema de gestión",
  },
  {
    name: "Kira",
    href: "https://www.kira-jewels.com",
    domain: "kira-jewels.com",
    img: "/v2/img/kira.webp",
    lead: "Instagram → tienda propia.",
    rest: "Catálogo online con pedido directo por WhatsApp.",
    disc: "Sitio web + catálogo",
  },
  {
    name: "PB Inmobiliaria",
    href: "https://www.pbinmobiliaria.com.ar/",
    domain: "pbinmobiliaria.com.ar",
    img: "/projects/pb.png",
    lead: "Web + panel de propiedades.",
    rest: "Catálogo que el equipo actualiza solo, sin depender de nadie.",
    disc: "Sitio web + admin",
    archived: true,
  },
  {
    name: "Tu UTN",
    href: "https://tu-utn.vercel.app/",
    domain: "tu-utn.vercel.app",
    img: "/projects/tuutn.png",
    lead: "Caos de datos → control total.",
    rest: "Un sistema académico hecho simple para el día a día.",
    disc: "Optimización de procesos",
    archived: true,
  },
];

const VISIBLE = PROJECTS.filter((pj) => !pj.archived);

function ProjectCard({
  pj,
  i,
  n,
  p,
}: {
  pj: (typeof PROJECTS)[number];
  i: number;
  n: number;
  p: MotionValue<number>;
}) {
  const scale = useTransform(p, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  const dim = useTransform(p, [i / n, 1], [0, (n - 1 - i) * 0.22]);
  return (
    <div className="pj-w" style={{ top: i * 28 }}>
      <motion.a
        className="pj-card"
        href={pj.href}
        target="_blank"
        rel="noopener"
        data-cur="Ver sitio"
        style={{ scale }}
        {...REVEAL_ON}
        onClick={() => track(ANALYTICS_EVENTS.projectLinkClick, { project: pj.name })}
      >
        <div className="pj-info">
          <span className="pj-disc">{pj.disc}</span>
          <div>
            <h3 className="pj-name">{pj.name}</h3>
            <p className="pj-d">
              <b>{pj.lead}</b> {pj.rest}
            </p>
          </div>
          <span className="pill pj-link">
            <Roll>Ver sitio</Roll>
            <span className="pill-ar">↗</span>
          </span>
        </div>
        <motion.div className="pj-shot" {...curtain}>
          <div className="pj-bar">
            <i />
            <i />
            <i />
            <span className="mono">{pj.domain}</span>
          </div>
          <motion.div className="pj-img-w" {...dezoom}>
            <div className="pj-img" style={{ backgroundImage: `url(${pj.img})` }} />
          </motion.div>
        </motion.div>
        <motion.span className="pj-dim" style={{ opacity: dim }} />
      </motion.a>
    </div>
  );
}

/*
 * "Tu proyecto": en vez de una captura vacía, un sitio que se diseña solo al
 * entrar en pantalla. Coreografía (una vez):
 *   0.00  grilla de columnas (ambiente)
 *   0.15  nav: logo, links, botón
 *   0.35  titular en dos líneas que se trazan; 0.6 bajada; 0.75 CTA
 *   0.55  panel con barras que crecen en ola
 *   1.00  tarjetas inferiores, escalonadas
 *   1.30  un cursor llega en arco al CTA y lo presiona → se pinta con el acento
 * Todo transform/opacity; con reduced-motion queda el estado final sin cursor.
 */
const BARS = [38, 54, 46, 70, 88, 62, 76];

function Blueprint() {
  const ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);
  const curRef = useRef<HTMLSpanElement>(null);
  const on = useInView(ref, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const root = ref.current;
    const cta = ctaRef.current;
    const cur = curRef.current;
    if (!on || reduce || !root || !cta || !cur) return;
    const r = root.getBoundingClientRect();
    const c = cta.getBoundingClientRect();
    const tx = c.left - r.left + c.width * 0.6;
    const ty = c.top - r.top + c.height * 0.55;
    // x e y con curvas distintas: el cursor sube primero y después se desliza,
    // así el recorrido es un arco y no una diagonal recta.
    const move = animate(
      cur,
      { x: [r.width * 0.86, tx], y: [r.height * 0.92, ty], opacity: [0, 1] },
      {
        duration: 1.15,
        delay: 1.3,
        x: { duration: 1.15, delay: 1.3, ease: [0.55, 0, 0.25, 1] },
        y: { duration: 1.15, delay: 1.3, ease: [0.15, 0.7, 0.3, 1] },
        opacity: { duration: 0.3, delay: 1.3 },
      },
    );
    let alive = true;
    move.then(() => {
      if (!alive) return;
      setClicked(true);
      animate(cur, { scale: [1, 0.82, 1] }, { duration: 0.32, ease: EASE });
      animate(cur, { opacity: 0 }, { duration: 0.5, delay: 1.4, ease: EASE_IN });
    });
    return () => {
      alive = false;
      move.stop();
    };
  }, [on, reduce]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: DUR.slow, ease: EASE, delay },
  });
  const line = (delay: number) => ({
    initial: { scaleX: 0 },
    animate: { scaleX: on ? 1 : 0 },
    transition: { duration: DUR.slow, ease: EASE, delay },
  });
  const grow = (delay: number) => ({
    initial: { scaleY: 0 },
    animate: { scaleY: on ? 1 : 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <div ref={ref} className={`bp${clicked ? " clicked" : ""}`} aria-hidden="true">
      <motion.div
        className="bp-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <i key={k} />
        ))}
      </motion.div>
      <div className="bp-nav">
        <motion.i className="bp-logo" {...rise(0.15)} />
        <span className="bp-links">
          {[0, 1, 2].map((k) => (
            <motion.i key={k} {...line(0.2 + k * 0.05)} />
          ))}
        </span>
        <motion.i className="bp-pill" {...rise(0.35)} />
      </div>
      <div className="bp-main">
        <div className="bp-copy">
          <motion.i className="bp-h" style={{ width: "88%" }} {...line(0.35)} />
          <motion.i className="bp-h" style={{ width: "62%" }} {...line(0.45)} />
          <motion.i className="bp-t" style={{ width: "76%" }} {...line(0.6)} />
          <motion.i className="bp-t" style={{ width: "52%" }} {...line(0.66)} />
          <motion.span ref={ctaRef} className="bp-cta" {...rise(0.75)}>
            Empezar
          </motion.span>
        </div>
        <motion.div className="bp-panel" {...rise(0.55)}>
          <span className="bp-panel-top">
            <i />
            <i />
          </span>
          <span className="bp-bars">
            {BARS.map((h, k) => (
              <motion.i key={k} style={{ height: `${h}%` }} {...grow(0.8 + k * 0.05)} />
            ))}
          </span>
        </motion.div>
      </div>
      <div className="bp-cards">
        {[0, 1, 2].map((k) => (
          <motion.i key={k} {...rise(1 + k * 0.08)} />
        ))}
      </div>
      <span ref={curRef} className="bp-cursor">
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M2 1.5 13.5 7.2 8.3 8.6 6 13.8Z" fill="currentColor" stroke="#0E0E0D" strokeWidth="1" />
        </svg>
      </span>
    </div>
  );
}

// Última placa del stack: lugar libre para el próximo cliente. Queda al
// fondo de la pila, así que no necesita escala ni oscurecido.
function SoonCard({ i }: { i: number }) {
  const { openContact } = useV2();
  return (
    <div className="pj-w" style={{ top: i * 28 }}>
      <button className="pj-card pj-soon" data-cur="Contanos" onClick={() => openContact()}>
        <div className="pj-info">
          <span className="pj-disc">Próximamente</span>
          <div>
            <h3 className="pj-name">El tuyo.</h3>
            <p className="pj-d">
              <b>Este lugar está libre.</b> Contanos cómo trabaja hoy tu negocio y lo diseñamos.
            </p>
          </div>
          <span className="pill pj-link">
            <Roll>Contanos tu proyecto</Roll>
            <span className="pill-ar">↗</span>
          </span>
        </div>
        <div className="pj-shot">
          <div className="pj-bar">
            <i />
            <i />
            <i />
            <span className="mono">tu-proyecto.com</span>
          </div>
          <Blueprint />
        </div>
      </button>
    </div>
  );
}

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, ["start start", "end end"]);
  return (
    <section className="pj" id="proyectos" data-label="Proyectos" data-theme="ink">
      <SecHead
        title="Casos reales."
        aside="Negocios que ya pasaron del caos al sistema. Todos en producción, con clientes usándolos hoy."
      />
      <div ref={ref} className="pj-stack">
        {VISIBLE.map((pj, i) => (
          <ProjectCard key={pj.name} pj={pj} i={i} n={VISIBLE.length + 1} p={p} />
        ))}
        <SoonCard i={VISIBLE.length} />
      </div>
    </section>
  );
}



/* ───────────────────────── Proceso ───────────────────────── */

// Acá la numeración sí es información: es una secuencia real de cuatro fases.
const PROCESS = [
  {
    title: "Diagnóstico",
    when: "Semana 1",
    body: "Entendemos cómo trabajás hoy: dónde se pierde tiempo, plata y pedidos. Salís con un mapa de qué ordenar primero.",
  },
  {
    title: "Diseño",
    when: "Semanas 2–3",
    body: "Definimos la marca y el sistema: cómo se ve tu negocio y cómo fluye cada pedido, cobro y tarea.",
  },
  {
    title: "Construcción",
    when: "Semanas 4–8",
    body: "Desarrollamos la web y las herramientas internas, conectadas entre sí. Te mostramos avances cada semana.",
  },
  {
    title: "Puesta en marcha",
    when: "Semanas 9–10",
    body: "Lo ponemos a andar con tu equipo y te quedás con el control. Seguimos cerca para que crezca.",
  },
];

function Step({
  s,
  i,
  active,
  onActive,
}: {
  s: (typeof PROCESS)[number];
  i: number;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);
  return (
    <div ref={ref} className={`pr-step${active ? " on" : ""}`}>
      <span className="pr-dot" />
      <span className="pr-when">{s.when}</span>
      <h3>{s.title}</h3>
      <p>{s.body}</p>
    </div>
  );
}

export function Process() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSectionProgress(listRef, ["start 55%", "end 55%"]);
  return (
    <section className="pr" id="proceso" data-label="Proceso" data-theme="paper">
      <SecHead
        title="Cuatro fases, un método."
        aside="De 6 a 10 semanas según el alcance. Siempre sabés en qué fase estamos y qué viene después."
      />
      <div className="pr-grid">
        <div className="pr-side">
          <div className="pr-big" aria-hidden="true">
            <span className="mk">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%", transition: { duration: 0.45, ease: EASE_IN } }}
                  transition={{ duration: DUR.slow, ease: EASE }}
                >
                  {active + 1}
                </motion.span>
              </AnimatePresence>
            </span>
            <small>de 4</small>
          </div>
        </div>
        <div ref={listRef} className="pr-list">
          <span className="pr-line">
            <motion.span style={{ scaleY: scrollYProgress }} />
          </span>
          {PROCESS.map((s, i) => (
            <Step key={s.title} s={s} i={i} active={active === i} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA ───────────────────────── */

/*
 * Cierre en tinta y sin imágenes: el titular grande es la pieza. El fondo es la
 * misma grilla de plano del hero, que se dibuja columna por columna al entrar
 * (una vez) — el sistema terminado, listo para el siguiente negocio.
 */
export function Cta() {
  const { openContact } = useV2();
  const ref = useRef<HTMLElement>(null);
  const on = useInView(ref, { once: true, amount: 0.3 });
  return (
    <section ref={ref} className="cta" id="contacto" data-label="Contacto" data-theme="ink">
      <div className="cta-grid" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <motion.i
            key={k}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: on ? 1 : 0 }}
            transition={{ duration: 1.2, ease: EASE_IO, delay: k * 0.06 }}
          />
        ))}
      </div>
      <div className="cta-in">
        <MaskText as="h2" className="cta-t" text={"Contanos cómo\ntrabajás hoy."} stagger={0.06} />
        <div className="cta-bot">
          <p>
            En una llamada de 30 minutos te decimos qué ordenar primero. Sin costo y sin compromiso.
            Respondemos en el día.
          </p>
          <div className="cta-btns">
            <a className="btn o" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
              <Roll>Escribir por WhatsApp</Roll>
            </a>
            <Magnetic strength={0.4}>
              <button className="cta-round" data-cur="Agendar" onClick={() => openContact()}>
                Agendar
                <br />
                diagnóstico
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

/*
 * Cierre: el wordmark gigante sube letra por letra en ola a medida que se
 * llega al final. Atado al scroll (lo maneja el usuario), con ease-out por
 * letra para que cada una "aterrice" en vez de frenar en seco.
 */
const WM = "shift\u00a0studio".split("");
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function WmLetter({ ch, k, p }: { ch: string; k: number; p: MotionValue<number> }) {
  const a = 0.2 + (k / WM.length) * 0.32;
  const y = useTransform(p, [a, a + 0.48], ["105%", "0%"], { ease: easeOut });
  return <motion.span style={{ y }}>{ch}</motion.span>;
}

export function Footer({ versionCHref }: { versionCHref?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const p = useSectionProgress(ref, ["start end", "end end"]);
  const supO = useTransform(p, [0.85, 1], [0, 1]);
  return (
    <footer ref={ref} className="ft" data-theme="ink">
      <button
        className={`ft-mail${copied ? " ok" : ""}`}
        data-cur={copied ? "Copiado" : "Copiar"}
        onClick={() => {
          navigator.clipboard?.writeText(EMAIL).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <span className="ft-mail-t">{EMAIL}</span>
        <span className="ft-copy">{copied ? "Copiado" : "Copiar"}</span>
      </button>
      <div className="ft-cols">
        <div>
          <span className="ft-l">Estudio</span>
          <span>Shift Studio®</span>
          <span className="mu">Sistemas de negocio para pymes</span>
        </div>
        <div>
          <span className="ft-l">Navegación</span>
          {NAV.map(([id, name]) => (
            <a key={id} href={`#${id}`}>
              <Roll>{name}</Roll>
            </a>
          ))}
        </div>
        <div>
          <span className="ft-l">Contacto</span>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
            <Roll>WhatsApp</Roll>
          </a>
          <a href={`mailto:${EMAIL}`}>
            <Roll>Email</Roll>
          </a>
          {versionCHref && (
            <a href={versionCHref}>
              <Roll>Versión C</Roll>
            </a>
          )}
        </div>
        <div>
          <span className="ft-l">Base</span>
          <span>Córdoba, Argentina</span>
          <span className="mu">31°S 64°O</span>
        </div>
      </div>
      <div className="ft-wm" aria-hidden="true">
        <span className="ft-wm-in">
          {WM.map((ch, k) => (
            <WmLetter key={k} ch={ch} k={k} p={p} />
          ))}
          <motion.sup style={{ opacity: supO }}>®</motion.sup>
        </span>
      </div>
      <div className="ft-fb">
        <span>© 2026 Shift Studio</span>
        <a href="#top">
          <Roll>Volver arriba</Roll>
        </a>
      </div>
    </footer>
  );
}
