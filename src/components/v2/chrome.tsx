"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";
import { useV2 } from "./context";
import { HERO_MODES, IMAGE_SETS } from "./media";
import { EASE, Roll } from "./primitives";

export const EMAIL = "shiftstudio.work@gmail.com";
export const WHATSAPP = "5493512261334";

export const NAV = [
  ["estudio", "Estudio"],
  ["servicios", "Servicios"],
  ["proyectos", "Proyectos"],
  ["proceso", "Proceso"],
] as const;

/* ───────────────────────── Loader ───────────────────────── */

const SEEN_KEY = "ss_v2_seen";

export function Loader() {
  const { setReady } = useV2();
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let skip = matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      skip = skip || sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    if (skip) {
      const id = requestAnimationFrame(() => {
        setShow(false);
        setReady(true);
      });
      return () => cancelAnimationFrame(id);
    }
    const ctl = animate(0, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        setReady(true);
        setShow(false);
      },
    });
    return () => ctl.stop();
  }, [setReady]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="ld"
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: "-100%", borderBottomLeftRadius: "40% 12vh", borderBottomRightRadius: "40% 12vh" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="ld-top">
            <span className="mono">(Shift Studio®)</span>
            <span className="mono hide-m">Identidad + Sistemas</span>
            <span className="mono hide-m">Córdoba, AR — 31°S 64°O</span>
            <span className="mono">Est. 2026</span>
          </div>
          <div className="ld-bar">
            <motion.span style={{ scaleX: n / 100 }} />
          </div>
          <div className="ld-bot">
            <span className="ld-wm">
              {"shift studio".split("").map((ch, i) => (
                <span className="mk" key={i}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.035 }}
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                </span>
              ))}
              <sup>®</sup>
            </span>
            <span className="ld-n">
              {String(n).padStart(3, "0")}
              <small>%</small>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Header ───────────────────────── */

export function Header({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  const { openContact, ready } = useV2();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [now, setNow] = useState("(00) Inicio");
  const [clock, setClock] = useState("--:--");

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400 && !menuOpen);
    setSolid(v > 60);
  });

  useEffect(() => {
    const secs = [...document.querySelectorAll<HTMLElement>("[data-label]")];
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) setNow((e.target as HTMLElement).dataset.label || "");
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
      transition={{ duration: 0.7, ease: EASE }}
    >
      <a className="wm" href="#top" data-cur="Inicio">
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
          <a key={id} href={`#${id}`}>
            <Roll>{name}</Roll>
          </a>
        ))}
      </nav>
      <div className="hd-r">
        <span className="mono hide-m">CBA {clock}</span>
        <button className="pill hide-m" data-cur="Escribinos" onClick={() => openContact()}>
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
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div>
            {NAV.map(([id, name], i) => (
              <div className="mnav-rw" key={id}>
                <span className="mk">
                  <motion.a
                    href={`#${id}`}
                    onClick={onClose}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                  >
                    {name}
                  </motion.a>
                </span>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
          <div className="mnav-ft">
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Cursor ───────────────────────── */

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.35 });
  const [label, setLabel] = useState<string | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("v2-cur");
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setOn(true);
      const t = (e.target as HTMLElement).closest?.<HTMLElement>("[data-cur]");
      setLabel(t ? t.dataset.cur || "" : null);
    };
    const leave = () => setOn(false);
    addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("v2-cur");
      removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      className={`cur${label !== null ? " big" : ""}${on ? " on" : ""}`}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <span>{label}</span>
    </motion.div>
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
      transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="stg-card"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="md"
            role="dialog"
            aria-modal="true"
            aria-label="Contacto"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="md-tp">
              <h3>
                Contanos
                <br />
                <span className="sf">tu proyecto.</span>
              </h3>
              <button className="mono" onClick={onClose}>
                (Cerrar)
              </button>
            </div>
            {sent ? (
              <div className="md-ok">
                <b>Recibido.</b>
                <span className="mono">Te respondemos en el día</span>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
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
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
