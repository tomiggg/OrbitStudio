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
      {/* top fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-14"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0))",
        }}
      />

      {/* noise */}
      <div aria-hidden className="pointer-events-none absolute inset-0 footer-noise" />

      <Container>
        <div className="relative py-8">
          {/* MAIN GRID */}
          <div className="grid gap-10 md:grid-cols-4 md:items-start">
            {/* BRAND */}
            <div className="max-w-sm">
              <Link href="/es" className="inline-flex items-center">
                <Image
                  src="/logo/orbit-logo-header.png"
                  alt="Orbit Digital"
                  width={150}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
              </Link>

              <p className="mt-3 text-sm text-[#072b2a]/80">
                Soluciones digitales pensadas para negocios que quieren crecer.
              </p>

              <p className="mt-2 text-sm text-[#072b2a]/65">
                Transformamos negocios tradicionales en soluciones digitales competitivas.
              </p>
            </div>

            {/* SECCIONES */}
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#072b2a]/60">
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
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#072b2a]/60">
                Contacto
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://wa.me/5493512261334"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:tomasggggggg@gmail.com"
                    className="footer-link break-all"
                  >
                    tomasggggggg@gmail.com
                  </a>
                </li>
                <li className="text-sm text-[#072b2a]/60">Córdoba, AR</li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#072b2a]/60">
                Legal
              </div>
              <p className="text-sm text-[#072b2a]/75">
                © {new Date().getFullYear()} Shift Digital
              </p>
              <p className="mt-1 text-sm text-[#072b2a]/55">
                Todos los derechos reservados.
              </p>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="mt-6 border-t border-white/20 pt-4">
            <div className="flex flex-col gap-2 text-xs text-[#072b2a]/60 md:flex-row md:justify-between">
              <span>Hecho en Córdoba · Enfoque en resultados</span>
              <span>Diseño & desarrollo web · Landing pages · Web apps</span>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .footer-noise {
          opacity: 0.04;
          mix-blend-mode: overlay;
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.08) 0px,
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.05) 0px,
              rgba(0, 0, 0, 0.05) 1px,
              transparent 1px,
              transparent 4px
            );
        }

        .footer-link {
          font-size: 14px;
          font-weight: 600;
          color: rgba(7, 43, 42, 0.75);
          transition: color 160ms ease, transform 160ms ease;
        }

        .footer-link:hover {
          color: rgba(7, 43, 42, 1);
          transform: translateY(-1px);
        }
      `}</style>
    </footer>
  );
}