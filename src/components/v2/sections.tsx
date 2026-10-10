"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";
import { useV2 } from "./context";
import { EMAIL, NAV, WHATSAPP } from "./chrome";
import { SETS, ctaColumns } from "./media";
import { DUR, EASE, EASE_IN, EASE_IO, Magnetic, MaskText, Reveal, Roll, Rule } from "./primitives";
import { useIsMobile, useSectionProgress } from "./useMedia";

/* ───────────────────── Encabezado de sección ───────────────────── */

function SecHead({ n, title, right }: { n: string; title: string; right: string }) {
  return (
    <div className="sh">
      <Rule />
      <span className="mono">
        <span className="dot" />
        {n}
      </span>
      <MaskText className="sh-t" text={title} />
      <span className="mono r">{right}</span>
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
  const o = useTransform(p, range, [0.13, 1]);
  return (
    <motion.span className={serif ? "sf" : undefined} style={{ opacity: o }}>
      {children}{" "}
    </motion.span>
  );
}

function Pill({ src, p, range }: { src: string; p: MotionValue<number>; range: [number, number] }) {
  const w = useTransform(p, range, ["0em", "1.9em"]);
  const o = useTransform(p, range, [0, 1]);
  return (
    <motion.span className="mf-pill" style={{ width: w, opacity: o }}>
      <AnimatePresence initial={false}>
        <motion.span
          key={src}
          style={{ backgroundImage: `url(${src})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
    </motion.span>
  );
}

export function Manifesto() {
  const { settings } = useV2();
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref, ["start start", "end end"]);
  const pills = SETS[settings.set].pills;
  const progO = useTransform(p, [0.9, 1], [1, 0]);

  const tokens = MANIFESTO_TOKENS;
  const N = tokens.length;
  const start = 0.04;
  const span = 0.8;

  return (
    <section ref={ref} className="mf" id="estudio" data-label="(01) Estudio">
      <div className="mf-st">
        <div className="mf-grid">
          <div className="mf-side">
            <span className="mono">
              <span className="dot" />
              (01) Estudio
            </span>
            <span className="mono mu">Sobre nosotros</span>
          </div>
          <p className="mf-t">
            {tokens.map((tok, i) => {
              const a = start + (i / N) * span;
              const r: [number, number] = [a, a + span / N + 0.04];
              const m = tok.t.match(/^\[(\d)\]$/);
              if (m) return <Pill key={i} src={pills[Number(m[1])]} p={p} range={r} />;
              return (
                <Word key={i} p={p} range={r} serif={tok.serif}>
                  {tok.t}
                </Word>
              );
            })}
          </p>
        </div>
        <motion.span className="mf-prog" style={{ scaleX: p, opacity: progO }} />
      </div>
    </section>
  );
}

const FACTS = [
  ["Criterio", "Cada decisión visual responde a un objetivo de negocio."],
  ["Sistema", "Automatizamos lo repetitivo para que tu equipo se enfoque en crecer."],
  ["Un solo equipo", "Marca, operación y web bajo el mismo criterio."],
  ["Escala", "Tu sistema crece con tu negocio: más procesos, más equipo, más canales, sin volver a empezar."],
];

export function Facts() {
  return (
    <section className="facts">
      {FACTS.map(([t, d], i) => (
        <div key={t} className="fact">
          {/* La línea se dibuja primero; el contenido la sigue (follow-through). */}
          <Rule delay={i * 0.08} />
          <Reveal className="fact-in" delay={0.15 + i * 0.08} y={18}>
            <span className="fact-n sf">{String(i + 1).padStart(2, "0")}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

/* ───────────────────────── Servicios ───────────────────────── */

const SERVICES = [
  {
    title: "Identidad",
    impact: "Posicionamiento premium",
    tags: ["Estrategia", "Logo", "Sistema visual", "Voz"],
    body: (
      <>
        Construimos el <b>alma visual</b> de tu marca. Diseñamos <b>identidades sólidas</b> para que
        tu negocio se perciba con la <b>autoridad</b> que merece.
      </>
    ),
    contact: "Identidad & Autoridad",
  },
  {
    title: "Sistemas",
    impact: "Rentabilidad y escala",
    tags: ["Procesos", "CRM", "Tableros", "Integraciones"],
    body: (
      <>
        Automatizamos <b>tareas repetitivas</b> para <b>liberar equipo</b>, acelerar operaciones y
        permitir que tu negocio <b>escale sin caos</b>.
      </>
    ),
    contact: "Sistemas & Automatización",
  },
  {
    title: "Web",
    impact: "Conversión de ventas",
    tags: ["Sitio", "Panel admin", "Catálogo", "Analítica"],
    body: (
      <>
        Construimos <b>software soberano</b> <b>hecho a medida</b> para transformar el interés de tus
        usuarios en <b>facturación real</b>.
      </>
    ),
    contact: "Web de Alta Conversión",
  },
];

/*
 * Reveal de imagen: el marco se abre como una cortina desde abajo (clip-path)
 * mientras la foto adentro se des-zoomea (1.22 → 1). Dos capas con curvas
 * distintas — la cortina "en pantalla", la foto desacelerando — para que no
 * se lea como un solo movimiento plano. Una vez por elemento.
 * Lo dispara la tarjeta (REVEAL_ON) y baja a los hijos por variants: un
 * elemento con clip-path inset(100%) tiene área visible cero y el
 * IntersectionObserver nunca lo da por visto.
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
const numUp = {
  variants: {
    hidden: { y: "100%" },
    shown: { y: "0%", transition: { duration: DUR.slow, ease: EASE, delay: 0.45 } },
  },
};

function ServiceCard({
  s,
  i,
  img,
  p,
}: {
  s: (typeof SERVICES)[number];
  i: number;
  img: string;
  p: MotionValue<number>;
}) {
  const { openContact } = useV2();
  const ix = useTransform(p, [0, 1], ["-7%", "7%"]);
  return (
    <motion.article className="sv-card" data-cur="Servicio" {...REVEAL_ON}>
      <motion.div className="sv-img" {...curtain}>
        <motion.div className="sv-img-z" {...dezoom}>
          <AnimatePresence initial={false}>
            <motion.span
              key={img}
              className="sv-img-in"
              style={{ backgroundImage: `url(${img})`, x: ix }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </motion.div>
        <span className="mk sv-num">
          <motion.span {...numUp}>
            {String(i + 1).padStart(2, "0")}
          </motion.span>
        </span>
      </motion.div>
      <div className="sv-body">
        <div className="sv-top">
          <span className="mono">Disciplina {String(i + 1).padStart(2, "0")}</span>
          <span className="mono">Impacto: {s.impact}</span>
        </div>
        <h3 className="sv-t">{s.title}</h3>
        <p className="sv-d">{s.body}</p>
        <div className="sv-tags">
          {s.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <button
          className="btn o sv-cta"
          onClick={() => {
            track(ANALYTICS_EVENTS.serviceExpand, { service: s.title });
            openContact(s.contact);
          }}
        >
          <Roll>Consultar</Roll> →
        </button>
      </div>
    </motion.article>
  );
}

export function Services() {
  const { settings } = useV2();
  const mobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const p = useSectionProgress(ref, ["start start", "end end"]);
  const x = useTransform(p, [0.03, 0.97], [0, -dist]);
  const [idx, setIdx] = useState(0);

  useLayoutEffect(() => {
    const t = trackRef.current;
    // En mobile el track es vertical: no hay recorrido horizontal que medir (y el
    // resize que dispara la barra del navegador al scrollear no debe re-renderizar).
    if (!t || mobile) return;
    const measure = () => setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
  }, [mobile]);

  const idxRef = useRef(0);
  useEffect(
    () =>
      p.on("change", (v) => {
        const next = Math.min(2, Math.max(0, Math.floor(((v - 0.12) / 0.86) * 3 + 0.2)));
        if (next !== idxRef.current) {
          idxRef.current = next;
          setIdx(next);
        }
      }),
    [p],
  );

  const imgs = SETS[settings.set].services;

  return (
    <section
      ref={ref}
      className="sv"
      id="servicios"
      data-label="(02) Servicios"
      style={mobile ? undefined : { height: `calc(100svh + ${dist}px)` }}
    >
      <div className="sv-st">
        <motion.div ref={trackRef} className="sv-track" style={mobile ? undefined : { x }}>
          <div className="sv-intro">
            <span className="mono">
              <span className="dot" />
              (02) Servicios
            </span>
            <MaskText className="sv-h" text={"Tres disciplinas,\n*un solo criterio.*"} />
            <p>
              Marca, operación y web diseñadas juntas. Cada pieza empuja a la otra: la identidad
              posiciona, el sistema sostiene y la web convierte.
            </p>
            <span className="mono mu hide-m">Seguí scrolleando →</span>
          </div>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} img={imgs[i]} p={p} />
          ))}
        </motion.div>
        <div className="sv-foot hide-m">
          <span className="mono">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={idx}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: "inline-block" }}
              >
                {String(idx + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>{" "}
            / 03 — {SERVICES[idx].title}
          </span>
          <span className="sv-bar">
            <motion.span style={{ scaleX: p }} />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Proyectos ───────────────────────── */

// Los proyectos con `archived` quedan guardados pero no se muestran.
const PROJECTS = [
  {
    name: "Fila0",
    href: "https://fila0.app",
    domain: "fila0.app",
    img: "/v2/img/fila0.webp",
    full: { src: "/v2/img/fila0-full.webp", ar: 1200 / 3000 },
    lead: "Fila en la barra → pedido desde el celular.",
    rest: "Producto propio para boliches, bares y eventos: el cliente escanea un QR, pide y paga; la barra solo prepara.",
    disc: "Producto · Pedidos sin fila",
  },
  {
    name: "inmobi.app",
    href: "https://pb-inmobiliaria-contratos.vercel.app/",
    domain: "pb-inmobiliaria-contratos.vercel.app",
    img: "/v2/img/inmobi.webp",
    full: { src: "/v2/img/inmobi-full.webp", ar: 1200 / 2842 },
    lead: "WhatsApp y planillas → un solo panel.",
    rest: "Reclamos, prestadores, pagos e impuestos de cada propiedad, con todo el equipo viendo lo mismo.",
    disc: "Sistema de gestión",
  },
  {
    name: "Kira",
    href: "https://www.kira-jewels.com",
    domain: "kira-jewels.com",
    img: "/v2/img/kira.webp",
    full: { src: "/v2/img/kira-full.webp", ar: 1200 / 3000 },
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

/*
 * Captura de página completa que, al pasar el mouse por la tarjeta, se
 * desplaza hasta el final: el caso se recorre como un sitio real. El
 * recorrido (alto de la imagen − alto visible) se mide con ResizeObserver y
 * se pasa por --travel; el movimiento lo hace CSS (transición interrumpible:
 * si el mouse sale a mitad, vuelve desde donde está).
 */
function ScrollShot({ src, ar }: { src: string; ar: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const long = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const w = wrap.current;
    const l = long.current;
    if (!w || !l) return;
    const set = () => {
      const travel = Math.max(0, l.offsetHeight - w.clientHeight);
      w.style.setProperty("--travel", `${travel}px`);
      // Más recorrido, más tiempo: ~1.6s cada 1000px, entre 2.5s y 6s.
      w.style.setProperty("--scroll-d", `${Math.min(6, Math.max(2.5, travel / 620)).toFixed(2)}s`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(w);
    ro.observe(l);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={wrap} className="pj-scroll">
      <div ref={long} className="pj-long" style={{ backgroundImage: `url(${src})`, aspectRatio: String(ar) }} />
    </div>
  );
}

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
          <div className="pj-top">
            <span className="mono">({String(i + 1).padStart(2, "0")})</span>
            <span className="mono">{pj.disc}</span>
          </div>
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
            {"full" in pj && pj.full ? (
              <ScrollShot src={pj.full.src} ar={pj.full.ar} />
            ) : (
              <div className="pj-img" style={{ backgroundImage: `url(${pj.img})` }} />
            )}
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
          <div className="pj-top">
            <span className="mono">({String(i + 1).padStart(2, "0")})</span>
            <span className="mono">Próximamente</span>
          </div>
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
    <section className="pj" id="proyectos" data-label="(03) Proyectos">
      <SecHead
        n="(03) Proyectos"
        title="Casos *seleccionados.*"
        right={`(${String(VISIBLE.length).padStart(2, "0")}) proyectos en producción`}
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

const PROCESS = [
  {
    title: "Auditoría & Validación",
    body: (
      <>
        Analizamos tu modelo actual para detectar <b>fugas de eficiencia</b>. Validamos que la
        solución digital ataque el <b>problema real</b>.
      </>
    ),
  },
  {
    title: "Lógica de Identidad",
    body: (
      <>
        Definimos el <b>núcleo visual</b> y la estructura de tu marca: una estética de{" "}
        <b>autoridad</b> y la <b>lógica de negocio</b> base del desarrollo.
      </>
    ),
  },
  {
    title: "Ingeniería Adaptativa",
    body: (
      <>
        Construimos tu <b>motor operativo</b> con el stack óptimo. Desarrollo de{" "}
        <b>alto rendimiento</b> enfocado en escalabilidad.
      </>
    ),
  },
  {
    title: "Autonomía de Escala",
    body: (
      <>
        Despliegue y transferencia de mando: un <b>activo digital soberano</b> que opera y crece{" "}
        <b>sin fricciones técnicas</b>.
      </>
    ),
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
      <span className="mono">Fase {String(i + 1).padStart(2, "0")}</span>
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
    <section className="pr" id="proceso" data-label="(04) Proceso">
      <SecHead n="(04) Proceso" title="Cuatro fases, *un método.*" right="6–10 semanas" />
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
                  {String(active + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </span>
            <small>/04</small>
          </div>
          <p className="pr-side-d">
            Un proceso corto y ordenado: primero entendemos el negocio, después diseñamos y
            construimos, y al final te entregamos el control.
          </p>
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

/* ───────────────────────── Marquee ───────────────────────── */

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function VelocityRow({ children, base }: { children: React.ReactNode; base: number }) {
  const bx = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(vel, [-3000, 3000], [7, -7], { clamp: true });
  const x = useTransform(bx, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);
  const reduce = useReducedMotion();
  useAnimationFrame((_, d) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let m = dir.current * base * (d / 1000);
    m += dir.current * m * f;
    bx.set(bx.get() + m);
  });
  return (
    <div className="mq-row">
      <motion.div className="mq-tr" style={{ x, skewX: skew }}>
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  const { settings } = useV2();
  const s = SETS[settings.set];
  const words = ["Identidad", "Sistemas", "Automatización", "Web de alta conversión", "Autoridad"];
  const imgs = [...s.pills, ...s.services];
  return (
    <section className="mq" aria-hidden="true">
      <VelocityRow base={-3}>
        <span className="mq-set">
          {words.map((w, i) => (
            <span key={w} className="mq-it">
              <span className={i % 2 ? "sf" : undefined}>{w}</span>
              <span className="mq-img" style={{ backgroundImage: `url(${imgs[i % imgs.length]})` }} />
            </span>
          ))}
        </span>
      </VelocityRow>
      <VelocityRow base={2}>
        <span className="mq-set mq-small">
          {["Identidad", "Operaciones", "Pymes", "Córdoba, AR", "LATAM", "Est. 2026"].map((w, i) => (
            <span key={w} className="mq-it">
              <span className="mono">({String(i + 1).padStart(2, "0")})</span>
              <span>{w}</span>
            </span>
          ))}
        </span>
      </VelocityRow>
    </section>
  );
}

/* ───────────────────────── CTA ───────────────────────── */

const COL_RANGES: [string, string][] = [
  ["6%", "-30%"],
  ["-24%", "8%"],
  ["2%", "-38%"],
  ["-18%", "12%"],
];

function CtaCol({ imgs, p, range }: { imgs: string[]; p: MotionValue<number>; range: [string, string] }) {
  const y = useTransform(p, [0, 1], range);
  return (
    <motion.div className="cta-col" style={{ y }}>
      {imgs.map((src, i) => (
        <span className="cta-cell" key={i}>
          <AnimatePresence initial={false}>
            <motion.span
              key={src}
              className="cta-img"
              style={{ backgroundImage: `url(${src})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </span>
      ))}
    </motion.div>
  );
}

export function Cta() {
  const { settings, openContact } = useV2();
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref, ["start end", "end start"]);
  const cols = ctaColumns(settings.set);
  return (
    <section ref={ref} className="cta" id="contacto" data-label="(05) Contacto">
      <div className="cta-cols" aria-hidden="true">
        {cols.map((c, i) => (
          <CtaCol key={i} imgs={c} p={p} range={COL_RANGES[i]} />
        ))}
      </div>
      <div className="cta-veil" />
      <div className="cta-in">
        <div className="cta-top">
          <span className="mono">
            <span className="dot" />
            (05) Contacto
          </span>
          <span className="mono">Respuesta en el día</span>
        </div>
        <MaskText as="h2" className="cta-t" text={"¿Listo para\n*construir?*"} stagger={0.08} />
        <div className="cta-bot">
          <p>
            Contanos cómo trabaja tu pyme hoy. En 30 minutos te decimos <b>qué ordenar primero</b>.
          </p>
          <div className="cta-btns">
            <a className="btn o" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
              <Roll>WhatsApp</Roll>
            </a>
            <Magnetic strength={0.4}>
              <button className="cta-round" data-cur="Hablemos" onClick={() => openContact()}>
                <span>Hablemos</span>
                <span className="cta-round-ar">→</span>
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
    <footer ref={ref} className="ft">
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
        <span className="mono">{copied ? "(Copiado)" : "(Copiar)"}</span>
      </button>
      <div className="ft-cols">
        <div>
          <span className="mono">Estudio</span>
          <span>Shift Studio®</span>
          <span className="mu">Sistemas de negocio para pymes</span>
        </div>
        <div>
          <span className="mono">Navegación</span>
          {NAV.map(([id, name]) => (
            <a key={id} href={`#${id}`}>
              <Roll>{name}</Roll>
            </a>
          ))}
        </div>
        <div>
          <span className="mono">Contacto</span>
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
          <span className="mono">Base</span>
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
      <div className="ft-fb mono">
        <span>© 2026 Shift Studio</span>
        <span className="hide-m">(CBA.26)</span>
        <a href="#top">Volver arriba ↑</a>
      </div>
    </footer>
  );
}
