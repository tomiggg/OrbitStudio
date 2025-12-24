import { Container } from "@/components/ui/Container";

type FinalCtaProps = {
  onOpenContact?: () => void;
};

export function FinalCta({ onOpenContact }: FinalCtaProps) {
  return (
    <section id="contact" className="relative overflow-hidden py-18 md:py-24">
      {/* Fondo suave (respeta tu design system) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color:var(--section)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full
                   bg-[color:var(--link)]/10 blur-3xl"
      />

      <Container>
        <div className="relative mx-auto max-w-3xl">
          <div
            className="rounded-3xl border border-[color:var(--borderSoft)] bg-[color:var(--card)]
                       px-6 py-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                       md:px-12 md:py-14"
          >
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-[color:var(--title)] md:text-3xl">
              ¿Hablamos de tu proyecto?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
              Te decimos qué conviene construir primero para vender, ordenar y
              escalar. Claro, rápido y sin compromiso.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => onOpenContact?.()}
                className="
                  inline-flex items-center justify-center
                  rounded-xl bg-[color:var(--cta)]
                  px-8 py-4 text-base font-semibold
                  text-white
                  shadow-[0_10px_30px_rgba(0,89,84,0.18)]
                  transition hover:bg-[color:var(--ctaHover)]
                  focus:outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]
                  focus:ring-offset-2 focus:ring-offset-[color:var(--card)]
                "
              >
                Contactar a Orbit Digital
              </button>
            </div>

            <p className="mt-5 text-xs text-[color:var(--muted)]">
              Respuesta en el día · Sin compromiso
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}