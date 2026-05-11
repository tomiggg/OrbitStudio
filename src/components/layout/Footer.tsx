"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0ABAB5" }}
    >
      {/* top fade - Conservado idéntico */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-14"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0))",
        }}
      />

      {/* noise - Conservado idéntico */}
      <div aria-hidden className="pointer-events-none absolute inset-0 footer-noise" />

      <Container>
        <div className="relative py-8 md:py-10">
          {/* MAIN */}
          <div className="grid gap-6 md:grid-cols-4 md:gap-10 md:items-start">
            {/* BRAND */}
            <div className="rounded-3xl bg-white/18 backdrop-blur-xl p-6 md:bg-transparent md:backdrop-blur-0 md:p-0">
              <Link href="/es" className="inline-flex items-center">
                <Image
                  src="/logo/orbit-logo-header.png"
                  alt="Shift Studio"
                  width={150}
                  height={36}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>

              <p className="mt-3 text-sm text-[#072b2a]/80">
                Soluciones digitales pensadas para negocios que quieren crecer.
              </p>

              <p className="mt-2 text-sm text-[#072b2a]/65">
                Transformamos negocios tradicionales en soluciones digitales competitivas.
              </p>
            </div>

            {/* LINKS WRAP */}
            <div className="grid gap-4 md:contents">
              {/* SECCIONES */}
              <div className="rounded-3xl bg-white/18 backdrop-blur-xl p-6 md:bg-transparent md:backdrop-blur-0 md:p-0">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#072b2a]/60">
                  Secciones
                </div>
                <ul className="space-y-2">
                  <li><a href="#services" className="footer-link">Servicios</a></li>
                  <li><a href="#portfolio" className="footer-link">Proyectos</a></li>
                  <li><a href="#process" className="footer-link">Proceso</a></li>
                  <li><a href="#contact" className="footer-link">Contacto</a></li>
                </ul>
              </div>

              {/* CONTACTO */}
              <div className="rounded-3xl bg-white/18 backdrop-blur-xl p-6 md:bg-transparent md:backdrop-blur-0 md:p-0">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#072b2a]/60">
                  Contacto
                </div>
                <ul className="space-y-2">
                  <li><a href="https://wa.me/5493512261334" target="_blank" rel="noreferrer" className="footer-link">WhatsApp</a></li>
                  <li><a href="https://www.linkedin.com/company/shift-studio-work" target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a></li>
                  <li><a href="mailto:shiftstudio.work@gmail.com" className="footer-link break-all">shiftstudio.work@gmail.com</a></li>
                  <li className="text-sm text-[#072b2a]/60">Córdoba, AR</li>
                </ul>
              </div>

              {/* LEGAL */}
              <div className="rounded-3xl bg-white/18 backdrop-blur-xl p-6 md:bg-transparent md:backdrop-blur-0 md:p-0">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#072b2a]/60">
                  Legal
                </div>
                <p className="text-sm text-[#072b2a]/75">© Shift Studio</p>
                <p className="mt-1 text-sm text-[#072b2a]/55">Todos los derechos reservados.</p>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR - Estética Unificada */}
          <div className="mt-10 border-t border-white/20 pt-6">
            <div className="flex flex-col items-center gap-4 text-center text-[11px] font-bold uppercase tracking-wide text-[#072b2a]/60 md:flex-row md:justify-between md:text-left">
              
              <span className="opacity-90">Hecho en Argentina <span className="mx-1 opacity-30">·</span> Enfoque en resultados</span>
              
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 items-center">
                <span>Sistemas de alto rendimiento</span>
                <span className="opacity-25">/</span>
                <span>Activos digitales</span>
                <span className="opacity-25">/</span>
                <span>Ingeniería de marca</span>
              </div>
              
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}