"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";
import { ContactModal, Cursor, Header, Loader, MobileMenu, SettingsPanel } from "./chrome";
import { V2Provider, useV2 } from "./context";
import { Hero } from "./Hero";
import { Cta, Facts, Footer, Manifesto, Marquee, Process, Projects, Services } from "./sections";
import "lenis/dist/lenis.css";
import "./v2.css";

// Versión V2 del home (rama dev2). Misma base estética que la versión C
// (grises oscuros, Geist + mono, filas editoriales) llevada a una página
// con scroll narrativo: hero con ventana que se expande, manifiesto que se
// ilumina, servicios en scroll horizontal, proyectos apilados, proceso con
// línea de progreso y CTA con columnas en parallax.

// Sin versionCHref (producción) no se muestran el panel de ajustes ni el link a la versión C.
type Props = { fontClassName?: string; versionCHref?: string };

export function V2(props: Props) {
  const [contact, setContact] = useState<{ open: boolean; preset: string | null }>({
    open: false,
    preset: null,
  });
  const openContact = useCallback((service?: string) => {
    setContact({ open: true, preset: service ?? null });
    track(ANALYTICS_EVENTS.contactOpen, { source: service ? "services" : "v2", service });
  }, []);
  const closeContact = useCallback(() => setContact((c) => ({ ...c, open: false })), []);

  return (
    <MotionConfig reducedMotion="user">
      <V2Provider openContact={openContact}>
        <Shell {...props} contact={contact} closeContact={closeContact} />
      </V2Provider>
    </MotionConfig>
  );
}

function Shell({
  fontClassName,
  versionCHref,
  contact,
  closeContact,
}: Props & {
  contact: { open: boolean; preset: string | null };
  closeContact: () => void;
}) {
  const { settings, setLenis, lenis } = useV2();
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Smooth scroll + anclas internas.
  // Lenis solo en desktop con mouse/trackpad. En touch no suaviza nada (syncTouch
  // está apagado) pero igual registra touchstart/touchmove/touchend NO pasivos en
  // window: eso obliga al navegador a esperar al hilo principal en cada touchmove
  // y rompe el scroll nativo con inercia (los flicks cortos). En touch, scroll nativo.
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const l = reduce || touch ? null : new Lenis({ lerp: 0.085, autoRaf: true });
    setLenis(l);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      if (l) l.scrollTo(id === "top" ? 0 : el, { duration: 1.6 });
      else el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      l?.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  // Bloqueo de scroll con menú/modal abiertos (Lenis en desktop, overflow en touch).
  useEffect(() => {
    const lock = contact.open || menuOpen;
    if (lenis) {
      if (lock) lenis.stop();
      else lenis.start();
      return;
    }
    const h = document.documentElement;
    h.style.overflow = lock ? "hidden" : "";
    return () => {
      h.style.overflow = "";
    };
  }, [lenis, contact.open, menuOpen]);

  // Fondo del documento (evita blanco en overscroll) y textura de grano.
  useEffect(() => {
    const h = document.documentElement;
    const prev = h.style.background;
    h.style.background = "#0E0E0D";
    const c = document.createElement("canvas");
    c.width = c.height = 200;
    const x = c.getContext("2d");
    if (x && rootRef.current) {
      const d = x.createImageData(200, 200);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = 255;
      }
      x.putImageData(d, 0, 0);
      rootRef.current.style.setProperty("--grimg", `url(${c.toDataURL()})`);
    }
    return () => {
      h.style.background = prev;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`v2 ${fontClassName ?? ""}${settings.accent ? "" : " noacc"}${settings.grain ? "" : " nogr"}`}
    >
      <Loader />
      <Header menuOpen={menuOpen} onMenu={() => setMenuOpen((o) => !o)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="v2-main">
        <Hero />
        <Manifesto />
        <Facts />
        <Services />
        <Projects />
        <Process />
        <Marquee />
        <Cta />
      </div>
      <Footer versionCHref={versionCHref} />
      {versionCHref && <SettingsPanel versionCHref={versionCHref} />}
      <ContactModal open={contact.open} preset={contact.preset} onClose={closeContact} />
      <Cursor />
    </div>
  );
}
