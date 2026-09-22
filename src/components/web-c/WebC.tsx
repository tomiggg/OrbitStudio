"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";
import "./web-c.css";

// Versión "C" del home (rama dev). Portado de "Shift Web C.html": la
// estructura y las clases son las del prototipo; las animaciones
// (preloader, cursor, parallax, reveal, preview) se manejan de forma
// imperativa en un único efecto, igual que el script original.

const SHOW_PROJECTS = false;
const EMAIL = "shiftstudio.work@gmail.com";
const WHATSAPP = "5493512261334";

const SERVICES = [
  {
    n: "01",
    title: "Identidad",
    tags: ["Estrategia", "Logo", "Sistema visual", "Voz"],
    impact: "Impacto: posicionamiento premium",
    body: (
      <>
        Construimos el <b>alma visual</b> de tu marca. Diseñamos <b>identidades sólidas</b> para que
        tu negocio se perciba con la <b>autoridad</b> que merece.
      </>
    ),
    contact: "Identidad & Autoridad",
    pv: { src: "/web-c/foto-hero.jpg", pos: "30% 25%", size: "260%" },
  },
  {
    n: "02",
    title: "Sistemas",
    tags: ["Procesos", "CRM", "Tableros", "Integraciones"],
    impact: "Impacto: rentabilidad y escala",
    body: (
      <>
        Automatizamos <b>tareas repetitivas</b> para <b>liberar equipo</b>, acelerar operaciones y
        permitir que tu negocio <b>escale sin caos</b>.
      </>
    ),
    contact: "Sistemas & Automatización",
    pv: { src: "/web-c/foto-hero.jpg", pos: "78% 55%", size: "260%" },
  },
  {
    n: "03",
    title: "Web",
    tags: ["Sitio", "Panel admin", "Catálogo", "Analítica"],
    impact: "Impacto: conversión de ventas",
    body: (
      <>
        Construimos <b>software soberano</b> <b>hecho a medida</b> para transformar el interés de tus
        usuarios en <b>facturación real</b>.
      </>
    ),
    contact: "Web de Alta Conversión",
    pv: { src: "/projects/pb.png", pos: "center top", size: "cover" },
  },
];

const PROJECTS = [
  {
    name: "PB Inmobiliaria",
    href: "https://www.pbinmobiliaria.com.ar/",
    img: "/projects/pb.png",
    lead: "Web + panel de propiedades.",
    rest: " Catálogo que el equipo actualiza solo.",
    disc: "Sitio web + admin",
  },
  {
    name: "Tu UTN",
    href: "https://tu-utn.vercel.app/",
    img: "/projects/tuutn.png",
    lead: "Caos de datos → control total.",
    rest: " Un sistema académico hecho simple.",
    disc: "Optimización de procesos",
  },
  {
    name: "Kira",
    href: "https://www.kira-jewels.com",
    img: "",
    lead: "Instagram → tienda propia.",
    rest: " Catálogo con pedido por WhatsApp.",
    disc: "Sitio web + catálogo",
  },
];

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

const CHIPS = [
  "Identidad & Autoridad",
  "Sistemas & Automatización",
  "Web de Alta Conversión",
  "No sé todavía",
];

const SECTIONS = (
  [
    ["estudio", "Estudio"],
    ["servicios", "Servicios"],
    ["proyectos", "Proyectos"],
    ["proceso", "Proceso"],
    ["contacto", "Contacto"],
  ] as const
).filter(([id]) => SHOW_PROJECTS || id !== "proyectos");

const NUM = Object.fromEntries(
  SECTIONS.map(([id, name], i) => {
    const n = "(" + String(i + 1).padStart(2, "0") + ")";
    return [id, { n, label: `${n} ${name}`, alt: i % 2 === 1 }];
  }),
) as Record<string, { n: string; label: string; alt: boolean }>;

const TICKER = (
  <>
    <span className="f">Identidad</span>
    <span className="a">(01)</span>
    <span>Sistemas</span>
    <span className="a">(02)</span>
    <span className="f">Automatización</span>
    <span className="a">(03)</span>
    <span>Web de alta conversión</span>
    <span className="a">(04)</span>
    <span className="f">Autoridad</span>
    <span className="a">(05)</span>
  </>
);

export function WebC({ fontClassName }: { fontClassName?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSvc, setActiveSvc] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

  function openContact(service?: string) {
    setSent(false);
    setChips(service ? [service] : []);
    setMenuOpen(false);
    setModalOpen(true);
    track(ANALYTICS_EVENTS.contactOpen, { source: service ? "services" : "web_c", service });
  }

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
    track(ANALYTICS_EVENTS.contactSubmit, { source: "web_c", service: chips.join(", ") });
    setSent(true);
  }

  function copyEmail() {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Fondo del documento acorde al tema (evita el blanco en overscroll).
  useEffect(() => {
    const h = document.documentElement;
    const prev = { bg: h.style.background, sb: h.style.scrollBehavior };
    h.style.background = light ? "#E9E7E2" : "#0F0F0E";
    h.style.scrollBehavior = "smooth";
    return () => {
      h.style.background = prev.bg;
      h.style.scrollBehavior = prev.sb;
    };
  }, [light]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const root = rootRef.current!;
    const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;
    const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...root.querySelectorAll<T>(s)];
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement | Window | Document,
      ev: K | string,
      fn: (e: never) => void,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(ev, fn as EventListener, opts);
      cleanups.push(() => el.removeEventListener(ev, fn as EventListener, opts));
    };
    const timers: number[] = [];

    const hero = $("#hero");
    const heroIn = () => hero.classList.add("in");

    // Grain
    const c = document.createElement("canvas");
    c.width = c.height = 220;
    const x = c.getContext("2d");
    if (x) {
      const d = x.createImageData(220, 220);
      const a = d.data;
      for (let i = 0; i < a.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        a[i] = a[i + 1] = a[i + 2] = v;
        a[i + 3] = 255;
      }
      x.putImageData(d, 0, 0);
      root.style.setProperty("--grimg", "url(" + c.toDataURL() + ")");
    }

    // Preloader
    const pre = $("#pre");
    let raf = 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pre.style.display = "none";
      heroIn();
    } else {
      const D = 1500;
      const t0 = performance.now();
      let done = false;
      const bg = pre.querySelector<HTMLElement>(".bgc")!;
      const pct = $("#pct");
      const fin = () => {
        if (done) return;
        done = true;
        cancelAnimationFrame(raf);
        pct.innerHTML = "100<small>%</small>";
        pre.classList.add("s2", "s3");
        bg.style.transition = "opacity .01s .3s";
        bg.style.opacity = "0";
        timers.push(window.setTimeout(heroIn, 950));
        timers.push(
          window.setTimeout(() => {
            pre.style.transition = "opacity .5s";
            pre.style.opacity = "0";
          }, 1150),
        );
        timers.push(window.setTimeout(() => (pre.style.display = "none"), 1700));
      };
      requestAnimationFrame(() => pre.classList.add("s1"));
      timers.push(window.setTimeout(() => pre.classList.add("s2"), 380));
      const st = (n: number) => {
        const p = Math.min(1, (n - t0) / D);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        pct.innerHTML = String(Math.round(e * 100)).padStart(3, "0") + "<small>%</small>";
        if (p < 1) raf = requestAnimationFrame(st);
        else timers.push(window.setTimeout(fin, 160));
      };
      raf = requestAnimationFrame(st);
      on(pre, "click", fin);
    }

    // Scroll: parallax, progreso, sección actual, header compacto, CTA mobile
    const hph = $("#hero .ph");
    const prog = $("#prog");
    const nowl = $("#nowl");
    const hd = $("#hd");
    const mcta = $("#mcta");
    const ctc = $("#contacto");
    const secEls = SECTIONS.map(([id]) => $("#" + id));
    let sTick = false;
    let lastNow = "";
    let lastHp = -1;
    const onScroll = () => {
      sTick = false;
      const y = scrollY;
      const ih = innerHeight;
      const max = document.documentElement.scrollHeight - ih || 1;
      let cur = "";
      for (const s of secEls) {
        if (s.getBoundingClientRect().top < ih * 0.4) cur = s.dataset.n || cur;
      }
      const ct = ctc.getBoundingClientRect().top;
      if (y < ih) {
        const hp = Math.round(y * 0.22);
        if (hp !== lastHp) {
          hph.style.translate = "0 " + hp + "px";
          lastHp = hp;
        }
      }
      prog.style.transform = "scaleX(" + y / max + ")";
      if (cur && cur !== lastNow) {
        nowl.textContent = cur;
        lastNow = cur;
      }
      hd.classList.toggle("sc", y > ih * 0.6);
      mcta.classList.toggle("on", y > ih * 0.8 && ct > ih * 0.9);
    };
    on(window, "scroll", () => {
      if (!sTick) {
        sTick = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
    onScroll();

    // Cursor custom
    const cu = $("#cur");
    const cl = cu.querySelector("span")!;
    let mx = -100, my = -100, cx = -100, cy = -100, cRun = false;
    const mv = () => {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      if (Math.abs(mx - cx) < 0.1 && Math.abs(my - cy) < 0.1) {
        cx = mx;
        cy = my;
        cRun = false;
      }
      cu.style.translate = cx + "px " + cy + "px";
      if (cRun) requestAnimationFrame(mv);
    };
    on(window, "mousemove", (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!cu.classList.contains("on")) cu.classList.add("on");
      if (!cRun) {
        cRun = true;
        requestAnimationFrame(mv);
      }
    }, { passive: true });
    on(document, "mouseleave", () => cu.classList.remove("on"));
    $$("[data-cur]").forEach((el) => {
      on(el, "mouseenter", () => {
        cl.textContent = el.dataset.cur || "";
        cu.classList.add("big");
      });
      on(el, "mouseleave", () => cu.classList.remove("big"));
    });

    // Botones magnéticos
    $$(".mag").forEach((b) => {
      b.style.transition = "background .2s,color .2s,transform .4s cubic-bezier(.22,1,.36,1)";
      on(b, "mousemove", (e: MouseEvent) => {
        const r = b.getBoundingClientRect();
        b.style.transform =
          "translate(" +
          (e.clientX - r.left - r.width / 2) * 0.25 +
          "px," +
          (e.clientY - r.top - r.height / 2) * 0.35 +
          "px)";
      });
      on(b, "mouseleave", () => {
        b.style.transform = "";
      });
    });

    // Reveal
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    $$(".rv").forEach((el) => io.observe(el));

    // Reloj Córdoba
    const clk = () => {
      const t = new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Cordoba",
      });
      $$(".clk").forEach((el) => (el.textContent = t));
    };
    clk();
    const clkI = window.setInterval(clk, 30000);

    // Preview flotante
    const pv = $("#pv");
    $$("[data-pv]").forEach((el) => {
      on(el, "mouseenter", () => {
        const src = el.dataset.pv;
        pv.style.backgroundImage = src
          ? `url("${src}")`
          : "repeating-linear-gradient(135deg,var(--cd) 0 12px,var(--bg) 12px 24px)";
        pv.style.backgroundSize = el.dataset.size || "cover";
        pv.style.backgroundPosition = el.dataset.pos || "center top";
        pv.classList.add("on");
      });
      on(el, "mouseleave", () => pv.classList.remove("on"));
      on(el, "mousemove", (e: MouseEvent) => {
        pv.style.translate = e.clientX + 120 + "px " + e.clientY + "px";
      }, { passive: true });
    });

    return () => {
      cleanups.forEach((f) => f());
      timers.forEach((t) => clearTimeout(t));
      clearInterval(clkI);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const secClass = (id: string) => "s" + (NUM[id]?.alt ? " alt" : "");

  return (
    <div ref={rootRef} className={`wc curon${light ? " l" : ""} ${fontClassName ?? ""}`}>
      <header className={`g4 px`} id="hd">
        <a className="wm" href="#top">
          shift studio®
        </a>
        <span className="c2">
          <span className="tag0">
            Branding + operaciones
            <br />
            para pymes
          </span>
          <span className="now mono">
            <span className="dot" />
            <i id="nowl">{NUM.estudio.label}</i>
          </span>
        </span>
        <nav>
          {SECTIONS.filter(([id]) => id !== "contacto").map(([id, name]) => (
            <a key={id} href={`#${id}`}>
              {name}
            </a>
          ))}
        </nav>
        <div className="r hact">
          <button
            className="thm"
            aria-label="Cambiar tema"
            data-cur="Tema"
            onClick={() => setLight((l) => !l)}
          >
            <span className="k" />
          </button>
          <button className="mbtn" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? "Cerrar" : "Menú"}
          </button>
          <button className="hc" data-cur="Contacto" onClick={() => openContact()}>
            <span>Contacto</span>
            <span className="ar">↗</span>
          </button>
        </div>
        <span className="prog" id="prog" />
      </header>

      <div className={`mnav${menuOpen ? " open" : ""}`}>
        <div>
          {SECTIONS.filter(([id]) => id !== "contacto").map(([id, name], i) => (
            <div className="rw" key={id}>
              <span>
                <a href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {name}
                </a>
              </span>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
        <div className="ft">
          <button className="btn" onClick={() => openContact()}>
            Agendar diagnóstico →
          </button>
          <div className="mono">
            <span>{EMAIL}</span>
            <span>CBA, AR</span>
          </div>
        </div>
      </div>
      <button className="mcta" id="mcta" onClick={() => openContact()}>
        <span>Agendar diagnóstico</span>
        <span className="ar">→</span>
      </button>

      <div id="top">
        <section className="hero" id="hero">
          <div className="ph img" />
          <div className="veil" />
          <div className="rows">
            <div className="rw">
              <span className="big line">
                <span>
                  shift studio<sup>®</sup>
                </span>
              </span>
              <span className="big line">
                <span>branding</span>
              </span>
            </div>
            <div className="rw">
              <span className="big line">
                <span>operaciones</span>
              </span>
              <span className="big line">
                <span>sistemas</span>
              </span>
            </div>
            <div className="rw">
              <span className="big line">
                <span>(CBA.26)</span>
              </span>
              <span className="th img" />
              <span className="big line">
                <span>©2026</span>
              </span>
            </div>
          </div>
          <div className="bot g4">
            <p>
              Automatizamos <b>operaciones</b>, construimos <b>sistemas</b> y diseñamos la{" "}
              <b>identidad</b> que te posiciona con <b>autoridad</b>.
            </p>
            <span>
              <button className="btn mag" data-cur="Agendar" onClick={() => openContact()}>
                Agendar diagnóstico →
              </button>
            </span>
            <span className="mono">
              Córdoba, AR — <span className="clk">--:--</span>
            </span>
            <span className="mono">(Scroll ↓)</span>
          </div>
        </section>

        <section className={secClass("estudio")} id="estudio" data-n={NUM.estudio.label}>
          <div className="g4 sh rv">
            <span className="mono">{NUM.estudio.n}</span>
            <h2>Estudio</h2>
            <span className="mono">Branding + Operaciones</span>
          </div>
          <div className="g4 rv">
            <span className="mono">Sobre nosotros</span>
            <p className="lead">
              Somos un estudio de branding y operaciones para pymes. Diseñamos la identidad de tu
              marca y construimos los sistemas que la hacen funcionar.{" "}
              <em>Para que te veas como una empresa grande y operes como una.</em>
            </p>
          </div>
          <div className="g4 facts rv">
            {[
              ["Criterio", "Cada decisión visual responde a un objetivo de negocio."],
              ["Sistema", "Automatizamos lo repetitivo para que tu equipo se enfoque en crecer."],
              ["Un solo equipo", "Marca, operación y web bajo el mismo criterio."],
              ["Autonomía", "Te entregamos activos que tu equipo puede operar sin depender de nosotros."],
            ].map(([t, p], i) => (
              <div key={t}>
                <span className="mono">— {String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={secClass("servicios")} id="servicios" data-n={NUM.servicios.label}>
          <div className="g4 sh rv">
            <span className="mono">{NUM.servicios.n}</span>
            <h2>
              Servicios <em>— tres disciplinas</em>
            </h2>
            <span className="mono">Tocá para expandir</span>
          </div>
          <div className="svc rv">
            {SERVICES.map((s, i) => (
              <div
                key={s.n}
                className={`rw${activeSvc === i ? " on" : ""}`}
                data-cur="Abrir"
                data-pv={s.pv.src}
                data-pos={s.pv.pos}
                data-size={s.pv.size}
                onClick={() => {
                  const next = activeSvc === i ? null : i;
                  setActiveSvc(next);
                  if (next !== null) track(ANALYTICS_EVENTS.serviceExpand, { service: s.title });
                }}
              >
                <div className="l">
                  <span className="mono">{s.n}</span>
                  <span className="big">{s.title}</span>
                </div>
                <div className="tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="ex">
                  <div>
                    <div className="g4 exi">
                      <span className="mono">{s.impact}</span>
                      <p>{s.body}</p>
                      <div>
                        <button
                          className="btn o"
                          onClick={(e) => {
                            e.stopPropagation();
                            openContact(s.contact);
                          }}
                        >
                          Consultar →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {SHOW_PROJECTS && (
          <section className={secClass("proyectos")} id="proyectos" data-n={NUM.proyectos?.label}>
            <div className="g4 sh rv">
              <span className="mono">{NUM.proyectos?.n}</span>
              <h2>
                Proyectos <em>— seleccionados</em>
              </h2>
              <span className="mono">(03) casos</span>
            </div>
            <div className="pl rv">
              <div
                className="hd mono"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px minmax(0,1.6fr) minmax(0,1.3fr) minmax(0,1fr) 40px",
                  gap: 16,
                }}
              >
                <span>No.</span>
                <span>Cliente</span>
                <span>Desafío</span>
                <span>Disciplina</span>
                <span />
              </div>
              {PROJECTS.map((p, i) => (
                <a
                  key={p.name}
                  className="it"
                  href={p.href}
                  target="_blank"
                  rel="noopener"
                  data-cur="Ver"
                  data-pv={p.img}
                  onClick={() => track(ANALYTICS_EVENTS.projectLinkClick, { project: p.name })}
                >
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nm">{p.name}</span>
                  <span className="ds">
                    <b>{p.lead}</b>
                    {p.rest}
                  </span>
                  <span className="mono">{p.disc}</span>
                  <span className="ar">→</span>
                  {p.img && <span className="mth" style={{ backgroundImage: `url(${p.img})` }} />}
                </a>
              ))}
            </div>
            <a className="feat rv" href={PROJECTS[0].href} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PROJECTS[0].img} alt={PROJECTS[0].name} />
              <div className="cap">
                <span className="mono">(Destacado) {PROJECTS[0].name}</span>
                <span className="mono">Ver proyecto ↗</span>
              </div>
            </a>
          </section>
        )}

        <section className={secClass("proceso")} id="proceso" data-n={NUM.proceso.label}>
          <div className="g4 sh rv">
            <span className="mono">{NUM.proceso.n}</span>
            <h2>
              Proceso <em>— cuatro fases</em>
            </h2>
            <span className="mono">6–10 semanas</span>
          </div>
          <div className="pr rv">
            {PROCESS.map((p, i) => (
              <div className="it" key={p.title}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="tick" aria-hidden="true">
          <div className="tr">
            {TICKER}
            {TICKER}
          </div>
        </div>

        <section className="cta" id="contacto" data-n={NUM.contacto.label}>
          <div className="ph img" />
          <div className="veil" />
          <div className="top g4">
            <span className="mono">{NUM.contacto.n} Contacto</span>
            <span />
            <span />
            <span className="mono">
              <span className="dot" />
              Respuesta en el día
            </span>
          </div>
          <div className="rows">
            <div className="rw">
              <span className="big">¿Listo para</span>
              <span className="mono">Pymes · LATAM</span>
            </div>
            <div className="rw">
              <span className="big">construir?</span>
              <span className="mono">Córdoba, AR</span>
            </div>
          </div>
          <div className="bot g4">
            <p>
              Contanos cómo trabaja tu pyme hoy. En 30 minutos te decimos <b>qué ordenar primero</b>.
            </p>
            <div>
              <a
                className="btn o"
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <button className="btn mag" data-cur="Hablemos" onClick={() => openContact()}>
                Hablemos →
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <div className="mail">
          <button className={copied ? "ok" : ""} data-cur="Copiar" onClick={copyEmail}>
            {EMAIL}
          </button>
          <span className="mono">{copied ? "(Copiado)" : "(Copiar)"}</span>
        </div>
        <div className="g4 cols">
          <div>
            <span className="mono">Estudio</span>
            <span>Shift Studio®</span>
            <span style={{ color: "var(--mu)" }}>Branding + operaciones</span>
          </div>
          <div>
            <span className="mono">Navegación</span>
            {SECTIONS.filter(([id]) => id !== "contacto").map(([id, name]) => (
              <a key={id} href={`#${id}`}>
                {name}
              </a>
            ))}
          </div>
          <div>
            <span className="mono">Redes</span>
            <a href="#top">Instagram</a>
            <a href="#top">LinkedIn</a>
            <a href="#top">Behance</a>
          </div>
          <div>
            <span className="mono">Base</span>
            <span>Córdoba, Argentina</span>
            <span style={{ color: "var(--mu)" }}>
              Hora local <span className="clk">--:--</span>
            </span>
          </div>
        </div>
        <div className="fb mono">
          <span>© 2026 Shift Studio</span>
          <span>(CBA.26)</span>
          <a href="#top">Volver arriba ↑</a>
        </div>
      </footer>

      <div className="pv" id="pv" />
      <div className="cur" id="cur">
        <span />
      </div>

      <div className="pre" id="pre" aria-hidden="true">
        <div className="bgc" />
        <div className="cols">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="win">
          <div className="img" />
          <div className="vl" />
        </div>
        <div className="tp">
          <span className="mono">(Shift Studio®)</span>
          <span className="mono">Branding + Operaciones</span>
          <span className="mono">Córdoba, AR — 31°S 64°O</span>
          <span className="mono">Est. 2026</span>
        </div>
        <div className="bt">
          <b className="ln">
            <span>
              shift studio<sup>®</sup>
            </span>
          </b>
          <span className="ct ln">
            <span id="pct">
              000<small>%</small>
            </span>
          </span>
        </div>
        <span className="skip mono">(Tocá para saltar)</span>
      </div>

      <div
        className={`ov${modalOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
      >
        <div className={`md${sent ? " done" : ""}`}>
          <div className="tp">
            <h3>
              Contanos
              <br />
              <em>tu proyecto.</em>
            </h3>
            <button className="mono" onClick={() => setModalOpen(false)}>
              (Cerrar)
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <label>
              <span className="mono">Nombre</span>
              <input
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
            <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
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
            <button className="btn send" type="submit">
              Enviar consulta →
            </button>
          </form>
          <div className="ok">
            <b>Recibido.</b>
            <span className="mono">Te respondemos en el día</span>
          </div>
        </div>
      </div>
    </div>
  );
}
