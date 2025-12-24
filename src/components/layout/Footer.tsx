import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="relative border-t border-[color:var(--borderSoft)] bg-[color:var(--bg)]">
      {/* glow sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-40 max-w-5xl
                   rounded-full bg-[color:var(--link)]/10 blur-3xl"
      />

      <Container>
        <div className="py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            {/* Brand */}
            <div className="max-w-md">
              <div className="text-sm font-semibold tracking-tight text-[color:var(--title)]">
                Orbit Digital
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[color:var(--text)]">
                Soluciones digitales pensadas para negocios que quieren crecer.
              </p>

              <p className="mt-4 text-xs leading-relaxed text-[color:var(--muted)]">
                Transformamos negocios tradicionales en soluciones digitales competitivas.
              </p>
            </div>

            {/* Columns */}
            <div className="grid w-full grid-cols-2 gap-8 text-sm md:w-auto md:grid-cols-3">
              {/* Links */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-[color:var(--title)]">
                  Secciones
                </div>

                <a href="#services" className="orbit-link block">
                  Servicios
                </a>
                <a href="#portfolio" className="orbit-link block">
                  Proyectos
                </a>
                <a href="#process" className="orbit-link block">
                  Proceso
                </a>
                <a href="#contact" className="orbit-link block">
                  Contacto
                </a>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-[color:var(--title)]">
                  Contacto
                </div>

                <a
                  href="https://wa.me/5493510000000?text=Hola%20Orbit%20Digital%2C%20quiero%20consultar%20por%20un%20proyecto."
                  target="_blank"
                  rel="noreferrer"
                  className="orbit-link block"
                >
                  WhatsApp
                </a>

                <a href="mailto:hola@orbitdigital.com" className="orbit-link block">
                  hola@orbitdigital.com
                </a>

                <span className="block text-sm text-[color:var(--muted)]">
                  Córdoba, AR
                </span>
              </div>

              {/* Legal */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-[color:var(--title)]">
                  Legal
                </div>

                <div className="text-sm text-[color:var(--text)]">
                  © {new Date().getFullYear()} Orbit Digital
                </div>

                <div className="text-sm text-[color:var(--muted)]">
                  Todos los derechos reservados.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-[color:var(--borderSoft)] pt-6">
            <div className="flex flex-col gap-2 text-xs text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
              <span>Hecho en Córdoba · Enfoque en resultados</span>
              <span className="text-[color:var(--muted)]">
                Diseño & desarrollo web · Landing pages · Web apps
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}