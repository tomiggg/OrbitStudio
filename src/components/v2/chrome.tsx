"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";
import { useV2 } from "./context";
import { HERO_MODES, IMAGE_SETS } from "./media";
import { DUR, EASE, EASE_IN, EASE_IO, Roll, stagger } from "./primitives";
import { useMedia } from "./useMedia";

export const EMAIL = "shiftstudio.work@gmail.com";
export const WHATSAPP = "5493512261334";

export const NAV = [
  ["estudio", "Estudio"],
  ["servicios", "Servicios"],
  ["proyectos", "Proyectos"],
  ["proceso", "Proceso"],
] as const;

/* ───────────────────────── Intro ───────────────────────── */

const SEEN_KEY = "ss_v2_seen";
const DISCIPLINES = ["Identidad", "Sistemas", "Web"];
const TICKS = [0.55, 1.0, 1.45]; // s: entrada de cada disciplina
const MIN_INTRO = 2.05; // s: tiempo mínimo en pantalla (el ticker completa su vuelta)
const MAX_WAIT = 3.2; // s: tope esperando a las fuentes
const OPEN_DELAY = 0.22; // s: las cortinas arrancan cuando el contenido ya está saliendo
const WORDMARK = "shift studio";

/*
 * Intro en tres actos (setup → acción → resolución):
 *   1. Setup: una línea se dibuja desde el centro y suben los rótulos.
 *   2. Acción: el wordmark sube desde su máscara y debajo pasan las tres
 *      disciplinas del estudio — contenido real en vez de un % de carga falso.
 *   3. Resolución: el contenido sale hacia arriba (ease-in, más corto que su
 *      entrada) y la pantalla se abre en dos cortinas desde la línea. El hero
 *      empieza a entrar con las cortinas a medio abrir, sin corte en negro.
 * Espera a las fuentes (con tope) para que el wordmark no cambie de tipografía
 * en medio de la animación. Una vez por sesión; con reduced-motion no se muestra.
 * Todo con transform/opacity: nada que repinte o recalcule layout por frame.
 */
export function Loader() {
  const { setReady } = useV2();
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const [disc, setDisc] = useState(-1);

  useEffect(() => {
    let skip = matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      skip = skip || sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (skip) {
      const id = requestAnimationFrame(() => {
        setPhase("done");
        setReady(true);
      });
      return () => cancelAnimationFrame(id);
    }
    const timers = TICKS.map((s, i) => setTimeout(() => setDisc(i), s * 1000));
    const t0 = performance.now();
    let alive = true;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, MAX_WAIT * 1000))]).then(() => {
      if (!alive) return;
      const wait = Math.max(0, MIN_INTRO * 1000 - (performance.now() - t0));
      timers.push(
        setTimeout(() => {
          // Se marca vista recién al salir: si se marcara al montar, el doble
          // montaje de StrictMode (dev) la saltearía siempre.
          try {
            sessionStorage.setItem(SEEN_KEY, "1");
          } catch {}
          setPhase("out");
        }, wait),
        setTimeout(() => setReady(true), wait + OPEN_DELAY * 1000),
      );
    });
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [setReady]);

  if (phase === "done") return null;
  const out = phase === "out";
  // Salidas: ease-in y ~70% de la duración de su entrada.
  const exitUp = { y: "-110%", transition: { duration: 0.45, ease: EASE_IN } };

  return (
    <div className="ld" aria-hidden="true">
      <motion.div
        className="ld-half t"
        animate={{ y: out ? "-100%" : "0%" }}
        transition={{ duration: 1.05, ease: EASE_IO, delay: OPEN_DELAY }}
      />
      <motion.div
        className="ld-half b"
        animate={{ y: out ? "100%" : "0%" }}
        transition={{ duration: 1.05, ease: EASE_IO, delay: OPEN_DELAY }}
        onAnimationComplete={() => out && setPhase("done")}
      />

      <motion.span
        className="ld-line"
        initial={{ scaleX: 0 }}
        animate={out ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
        transition={out ? { duration: 0.4, ease: EASE_IN } : { duration: DUR.slow, ease: EASE, delay: 0.05 }}
      />

      <div className="ld-top">
        {["(Shift Studio®)", "Sistemas de negocio", "Córdoba, AR — 31°S 64°O", "Est. 2026"].map((t, i) => (
          <span className={`mk${i === 1 || i === 2 ? " hide-m" : ""}`} key={t}>
            <motion.span
              className="mono"
              initial={{ y: "110%" }}
              animate={out ? exitUp : { y: "0%" }}
              transition={{ duration: DUR.base, ease: EASE, delay: 0.15 + i * 0.06 }}
            >
              {t}
            </motion.span>
          </span>
        ))}
      </div>

      <span className="ld-wm">
        {WORDMARK.split("").map((ch, i) => (
          <span className="mk" key={i}>
            <motion.span
              initial={{ y: "110%", rotate: 3 }}
              animate={
                out
                  ? { y: "-110%", transition: { duration: 0.45, ease: EASE_IN, delay: i * 0.012 } }
                  : { y: "0%", rotate: 0 }
              }
              transition={{ duration: DUR.slow, ease: EASE, delay: 0.3 + i * stagger(WORDMARK.length, 0.035) }}
            >
              {ch === " " ? "\u00a0" : ch}
            </motion.span>
          </span>
        ))}
        <motion.sup
          initial={{ opacity: 0, y: 8 }}
          animate={out ? { opacity: 0, transition: { duration: 0.2 } } : { opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.85 }}
        >
          ®
        </motion.sup>
      </span>

      <motion.div
        className="ld-sub"
        animate={out ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: out ? 0.3 : DUR.base, ease: out ? EASE_IN : EASE }}
      >
        <span className="ld-tk">
          <AnimatePresence mode="popLayout" initial={false}>
            {disc >= 0 && (
              <motion.span
                key={disc}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-110%", transition: { duration: 0.3, ease: EASE_IN } }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {DISCIPLINES[disc]}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="mono ld-n">
          {disc >= 0 ? String(disc + 1).padStart(2, "0") : "00"} / {String(DISCIPLINES.length).padStart(2, "0")}
        </span>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Header ───────────────────────── */

export function Header({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  const { openContact, ready } = useV2();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  // La primera entrada llega después del wordmark del hero (sigue a la intro).
  const [entered, setEntered] = useState(false);
  const flags = useRef({ hidden: false, solid: false });
  const [now, setNow] = useState("(00) Inicio");
  const [active, setActive] = useState("top");
  const [clock, setClock] = useState("--:--");

  // Se llama en cada frame de scroll: solo toca el estado de React al cambiar.
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    const h = v > prev && v > 400 && !menuOpen;
    const s = v > 60;
    if (h !== flags.current.hidden) {
      flags.current.hidden = h;
      setHidden(h);
    }
    if (s !== flags.current.solid) {
      flags.current.solid = s;
      setSolid(s);
    }
  });

  useEffect(() => {
    const secs = [...document.querySelectorAll<HTMLElement>("[data-label]")];
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          setNow(el.dataset.label || "");
          setActive(el.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secs.forEach((s) => io.observe(s));
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Argentina/Cordoba",
        }),
      );
    tick();
    const id = setInterval(tick, 30000);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
  }, []);

  return (
    <motion.header
      className={`hd${solid ? " solid" : ""}`}
      initial={{ y: "-100%" }}
      animate={{ y: ready && !hidden ? "0%" : "-100%" }}
      transition={
        hidden
          ? { duration: DUR.quick, ease: EASE_IN }
          : { duration: DUR.base, ease: EASE, delay: entered ? 0 : 0.75 }
      }
      onAnimationComplete={() => ready && !entered && setEntered(true)}
    >
      <a className="wm" href="#top">
        shift studio<sup>®</sup>
      </a>
      <span className="mono hd-now hide-m">
        <span className="dot" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={now}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {now}
          </motion.span>
        </AnimatePresence>
      </span>
      <nav className="hide-m">
        {NAV.map(([id, name]) => (
          <a key={id} href={`#${id}`} className={active === id ? "on" : undefined}>
            <Roll>{name}</Roll>
            {/* Indicador compartido: se desliza de un link al otro (layoutId). */}
            {active === id && (
              <motion.span className="hd-ind" layoutId="hd-ind" transition={{ duration: 0.5, ease: EASE }} />
            )}
          </a>
        ))}
      </nav>
      <div className="hd-r">
        <span className="mono hide-m">CBA {clock}</span>
        <button className="pill hide-m" onClick={() => openContact()}>
          <Roll>Contacto</Roll>
          <span className="pill-ar">↗</span>
        </button>
        <button className="mbtn show-m" aria-expanded={menuOpen} onClick={onMenu}>
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>
      <motion.span className="hd-prog" style={{ scaleX: scrollYProgress }} />
    </motion.header>
  );
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openContact } = useV2();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mnav"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.5, ease: EASE_IO } }}
          transition={{ duration: 0.7, ease: EASE_IO }}
        >
          <div>
            {NAV.map(([id, name], i) => (
              <div className="mnav-rw" key={id}>
                <span className="mk">
                  <motion.a
                    href={`#${id}`}
                    onClick={onClose}
                    initial={{ y: "110%", rotate: 3 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{ duration: DUR.slow, ease: EASE, delay: 0.25 + i * 0.06 }}
                  >
                    {name}
                  </motion.a>
                </span>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
          <motion.div
            className="mnav-ft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, ease: EASE, delay: 0.5 }}
          >
            <button
              className="btn"
              onClick={() => {
                onClose();
                openContact();
              }}
            >
              Agendar diagnóstico →
            </button>
            <div className="mono">
              <span>{EMAIL}</span>
              <span>CBA, AR</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Cursor ───────────────────────── */

// Solo en dispositivos con mouse/trackpad: en touch no se monta.
export function Cursor() {
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  return fine ? <CursorDot /> : null;
}

// Sin React en el camino caliente: la posición se escribe directo como
// transform en cada pointermove (el navegador ya los entrega uno por frame),
// sin spring ni lerp. El estado "grande" con etiqueta solo cambia al entrar o
// salir de un [data-cur], y se anima con scale en un nodo interno para que la
// transición no arrastre también la posición.
function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;
    const html = document.documentElement;
    html.classList.add("v2-cur");
    let target: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      el.classList.add("on");
      const t = (e.target as Element | null)?.closest?.<HTMLElement>("[data-cur]") ?? null;
      if (t !== target) {
        target = t;
        if (t) label.textContent = t.dataset.cur ?? "";
        el.classList.toggle("big", !!t);
      }
    };
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) el.classList.remove("on");
    };
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    return () => {
      html.classList.remove("v2-cur");
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <div ref={ref} className="cur" aria-hidden="true">
      <span className="cur-in">
        <span ref={labelRef} />
      </span>
    </div>
  );
}

/* ───────────────────────── Ajustes ───────────────────────── */

function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg">
      <span className="mono">{label}</span>
      <div className="seg-opts">
        {options.map((o) => (
          <button
            key={o.id}
            className={o.id === value ? "on" : ""}
            onClick={() => onChange(o.id)}
            aria-pressed={o.id === value}
          >
            {o.id === value && (
              <motion.span className="seg-bg" layoutId={`seg-${label}`} transition={{ duration: 0.4, ease: EASE }} />
            )}
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsPanel({ versionCHref }: { versionCHref: string }) {
  const { settings, update, ready } = useV2();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <motion.div
      ref={ref}
      className="stg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
      transition={{ duration: DUR.base, ease: EASE, delay: 1.1 }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="stg-card"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.22, ease: EASE_IN } }}
            transition={{ duration: DUR.quick, ease: EASE }}
          >
            <div className="stg-hd">
              <span>Ajustes de vista</span>
              <span className="mono">Solo preview</span>
            </div>
            <Seg
              label="Hero"
              value={settings.hero}
              options={HERO_MODES}
              onChange={(hero) => update({ hero })}
            />
            <Seg
              label="Imágenes"
              value={settings.set}
              options={IMAGE_SETS}
              onChange={(set) => update({ set })}
            />
            <Seg
              label="Acento"
              value={settings.accent ? "teal" : "neutro"}
              options={[
                { id: "teal", label: "Teal" },
                { id: "neutro", label: "Neutro" },
              ]}
              onChange={(v) => update({ accent: v === "teal" })}
            />
            <Seg
              label="Grano"
              value={settings.grain ? "on" : "off"}
              options={[
                { id: "on", label: "On" },
                { id: "off", label: "Off" },
              ]}
              onChange={(v) => update({ grain: v === "on" })}
            />
            <a className="stg-link" href={versionCHref}>
              <span>Ver versión C</span>
              <span>→</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <button className="stg-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="stg-ic" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mono">{open ? "Cerrar" : "Ajustes"}</span>
      </button>
    </motion.div>
  );
}

/* ───────────────────────── Contacto ───────────────────────── */

const CHIPS = ["Identidad & Autoridad", "Sistemas & Automatización", "Web de Alta Conversión", "No sé todavía"];

export function ContactModal({
  open,
  preset,
  onClose,
}: {
  open: boolean;
  preset: string | null;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSent(false);
    setChips(preset ? [preset] : []);
    const t = setTimeout(() => firstRef.current?.focus(), 400);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onKey);
    };
  }, [open, preset, onClose]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = [
      "Hola Shift Studio",
      "",
      `Nombre: ${form.name}`,
      `Contacto: ${form.contact}`,
      `Necesito: ${chips.join(", ") || "-"}`,
      "",
      form.message || "-",
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noreferrer");
    track(ANALYTICS_EVENTS.contactSubmit, { source: "v2", service: chips.join(", ") });
    setSent(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ov"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE_IN, delay: 0.05 } }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <motion.div
            className="md"
            role="dialog"
            aria-modal="true"
            aria-label="Contacto"
            initial={{ y: 28, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0, transition: { duration: 0.25, ease: EASE_IN } }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          >
            <motion.div
              className="md-tp"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: DUR.base, ease: EASE, delay: 0.15 }}
            >
              <h3>
                Contanos
                <br />
                <span className="sf">tu proyecto.</span>
              </h3>
              <button className="mono" onClick={onClose}>
                (Cerrar)
              </button>
            </motion.div>
            {sent ? (
              <motion.div
                className="md-ok"
                initial={{ y: 16, scale: 0.98, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <b>Recibido.</b>
                <span className="mono">Te respondemos en el día</span>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={onSubmit}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: DUR.base, ease: EASE, delay: 0.22 }}
              >
                <label>
                  <span className="mono">Nombre</span>
                  <input
                    ref={firstRef}
                    required
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
                <label>
                  <span className="mono">Email o WhatsApp</span>
                  <input
                    required
                    placeholder="hola@tuempresa.com"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                </label>
                <div className="md-chips">
                  <span className="mono">¿Qué necesitás?</span>
                  <div className="chips">
                    {CHIPS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className={chips.includes(c) ? "on" : ""}
                        onClick={() =>
                          setChips((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]))
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <label>
                  <span className="mono">Mensaje</span>
                  <textarea
                    rows={3}
                    placeholder="Contanos brevemente cómo trabajan hoy"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </label>
                <button className="btn md-send" type="submit">
                  Enviar por WhatsApp →
                </button>
              </motion.form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
