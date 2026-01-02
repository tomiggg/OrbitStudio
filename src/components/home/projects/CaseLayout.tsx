"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useContact } from "@/components/contact/ContactProvider";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroTag?: string;
  externalUrl?: string;

  blocks: {
    label: string;
    content: React.ReactNode;
  }[];

  highlights?: {
    title: string;
    items: string[];
  };
};

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 10, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function CaseLayout({
  eyebrow = "Caso real",
  title,
  subtitle,
  heroTag,
  externalUrl,
  blocks,
  highlights,
}: Props) {
  const { openContact } = useContact();

  const scrollToDetail = () => {
    const el = document.getElementById("detalle");
    if (!el) return;

    // offset por header fixed
    const headerOffset = window.innerWidth >= 768 ? 80 : 64;
    const y =
      el.getBoundingClientRect().top + window.scrollY - headerOffset - 14;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[color:var(--bg)] py-16 md:py-20">
      {/* top band (más sutil, más “Orbit”) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,43,42,0.08), rgba(7,43,42,0))",
        }}
      />

      {/* glow blobs (menos verde “duro”, más tiffany premium) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-[-160px] h-[420px] w-[420px] rounded-full blur-[90px]"
        style={{ background: "rgba(51,139,133,0.14)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-200px] right-[-180px] h-[520px] w-[520px] rounded-full blur-[100px]"
        style={{ background: "rgba(7,43,42,0.08)" }}
      />

      <Container>
        {/* Back link */}
        <div className="mb-10">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--title)]/60 transition hover:text-[color:var(--title)]"
          >
            <span aria-hidden className="text-base">
              ←
            </span>
            Volver a proyectos
          </Link>
        </div>

        {/* Hero */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.55, ease }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Eyebrow pill (más alineada a tu estética) */}
          <div
            className={[
              "inline-flex items-center gap-2 rounded-full",
              "border border-[color:var(--borderSoft)]",
              "bg-white/22 backdrop-blur-2xl",
              "px-4 py-2 text-xs font-semibold tracking-wide",
              "text-[color:var(--title)]/65",
              "shadow-[0_10px_30px_rgba(0,0,0,0.05)]",
            ].join(" ")}
          >
            <span>{eyebrow}</span>
            {heroTag ? (
              <>
                <span className="opacity-30">•</span>
                <span className="text-[color:var(--link)]">{heroTag}</span>
              </>
            ) : null}
          </div>

          {/* Título (más “Archivo”: tracking, tamaño, line-height) */}
          <h1
            className="
              mt-5
              font-extrabold
              tracking-[-0.07em]
              text-[color:var(--title)]
            "
            style={{
              fontSize: "clamp(44px, 4.6vw, 76px)",
              lineHeight: "0.92",
            }}
          >
            {title}
          </h1>

          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--text)]/75 md:text-base">
              {subtitle}
            </p>
          ) : null}

          {/* CTAs */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex items-center justify-center
                  rounded-full bg-[color:var(--cta)]
                  px-6 py-3 text-sm font-semibold text-white
                  shadow-[0_14px_40px_rgba(0,0,0,0.16)]
                  transition hover:bg-[color:var(--ctaHover)]
                  active:scale-[0.99]
                "
              >
                Ver proyecto live
              </a>
            ) : null}

            <button
              type="button"
              onClick={scrollToDetail}
              className="
                inline-flex items-center justify-center
                rounded-full
                border border-[color:var(--borderSoft)]
                bg-white/20 backdrop-blur-2xl
                px-6 py-3 text-sm font-semibold
                text-[color:var(--title)]/75
                shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                transition hover:bg-white/28
                active:scale-[0.99]
              "
            >
              Ver detalle
            </button>
          </div>
        </motion.div>

        {/* Content grid */}
        <div
          id="detalle"
          className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-[1fr_360px] md:gap-8"
        >
          {/* Main */}
          <div className="grid gap-6">
            {blocks.map((b, i) => (
              <motion.article
                key={b.label}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.55, delay: i * 0.04, ease }}
                className="
                  rounded-3xl
                  border border-[color:var(--borderSoft)]
                  bg-white/18
                  backdrop-blur-2xl
                  shadow-[0_18px_55px_rgba(0,0,0,0.05)]
                  px-6 py-6
                "
              >
                <div className="text-[11px] font-semibold tracking-wide text-[color:var(--title)]/55">
                  {b.label}
                </div>

                <div className="mt-3 text-sm leading-relaxed text-[color:var(--text)]/85">
                  {b.content}
                </div>
              </motion.article>
            ))}
          </div>

          {/* Sidebar */}
          <div className="grid gap-6">
            {highlights ? (
              <motion.aside
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.55, ease }}
                className="
                  rounded-3xl
                  border border-[color:var(--borderSoft)]
                  bg-[color:var(--card)]
                  shadow-[0_18px_55px_rgba(0,0,0,0.05)]
                  px-6 py-6
                "
              >
                <div className="text-sm font-extrabold tracking-[-0.03em] text-[color:var(--title)]">
                  {highlights.title}
                </div>

                <ul className="mt-4 grid gap-3">
                  {highlights.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-3 text-sm text-[color:var(--text)]/85"
                    >
                      <span
                        className="
                          mt-[2px]
                          inline-flex h-5 w-5 items-center justify-center
                          rounded-full
                          bg-[color:var(--link)]/12
                          text-[color:var(--link)]
                          text-[12px]
                        "
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span className="leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.aside>
            ) : null}

            {/* CTA box */}
            <div className="rounded-3xl border border-[color:var(--borderSoft)] bg-white/18 backdrop-blur-2xl px-6 py-6 shadow-[0_18px_55px_rgba(0,0,0,0.05)]">
  <div className="text-[11px] font-semibold tracking-wide text-[color:var(--title)]/55">
    ¿Tu negocio tiene un problema parecido?
  </div>

  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
    Podemos analizar tu caso, decirte el primer paso y darte un rango estimado,
    sin compromiso.
  </p>

  <button
    type="button"
    onClick={openContact}
    className="
      mt-5 inline-flex w-full items-center justify-center
      rounded-full bg-[color:var(--cta)]
      px-6 py-3 text-sm font-semibold text-white
      shadow-[0_14px_40px_rgba(0,0,0,0.16)]
      transition hover:bg-[color:var(--ctaHover)]
      active:scale-[0.99]
    "
  >
    Hablemos
  </button>

  <div className="mt-3 text-center text-[11px] text-[color:var(--muted)]">
    Respuesta en el día · Presupuesto claro · Sin compromiso
  </div>
</div>
          </div>
        </div>
      </Container>
    </section>
  );
}