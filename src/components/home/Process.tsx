import { Container } from "@/components/ui/Container";

const STEPS = [
  {
    title: "Diagnóstico",
    desc: "Entendemos tu negocio, tu público y el objetivo real del sitio.",
  },
  {
    title: "Estrategia",
    desc: "Definimos estructura, mensajes y CTA para convertir con claridad.",
  },
  {
    title: "Construcción",
    desc: "Diseño + desarrollo por iteraciones cortas, con feedback y orden.",
  },
  {
    title: "Entrega & escalado",
    desc: "Publicación + base lista para crecer: mejoras, automatizaciones y nuevas secciones.",
  },
];

export function Process() {
  return (
    <section id="process" className="bg-[color:var(--section)] py-16 md:py-20">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--title)] md:text-3xl">
            Cómo trabajamos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Un proceso simple, predecible y enfocado en resultados.
          </p>
        </div>

        {/* Roadmap */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* Línea central */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[3px] bg-[color:var(--link)]/60"
          />

          <ul className="relative z-10 flex flex-col gap-12">
            {STEPS.map((s) => (
              <li key={s.title} className="flex justify-center">
                <div className="w-full max-w-3xl rounded-2xl border border-[color:var(--borderSoft)] bg-[color:var(--card)] px-6 py-5 text-center">
                  <h3 className="text-lg font-semibold text-[color:var(--title)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}