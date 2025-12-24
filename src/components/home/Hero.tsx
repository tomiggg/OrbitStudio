import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const WHATSAPP_HREF =
  "https://wa.me/5493510000000?text=Hola%20Orbit%20Digital%2C%20quiero%20consultar%20por%20un%20proyecto.";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate overflow-hidden min-h-[70vh] md:min-h-[80vh]    py-14 md:py-24">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 bg-[color:var(--bg)]/60"
        aria-hidden="true"
      />

      <Container>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* LOGO */}
          <img
  src="/logo/orbit-logo.png"
  alt="Orbit Digital"
  className="mx-auto mb-6 block h-auto w-[clamp(200px,24vw,320px)] max-w-full"
/>

          {/* Título oculto (SEO + accesibilidad) */}
          <h1 className="sr-only">{t("title")}</h1>

          {/* SUBTÍTULO */}
          <p className="mx-auto mt-2 max-w-2xl text-pretty text-base leading-relaxed text-[color:var(--text)] md:text-lg">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={WHATSAPP_HREF} size="lg">
              Hablá con nosotros por WhatsApp
            </ButtonLink>

            <ButtonLink href="#process" variant="secondary" size="lg">
              Ver cómo trabajamos
            </ButtonLink>
          </div>

          {/* Separador invisible */}
          <div className="h-12 md:h-16" />

          {/* Micro trust abajo */}
          <p className="text-xs text-[color:var(--muted)]">
            Respuesta en el día · Sin compromiso
          </p>
        </div>
      </Container>
    </section>
  );
}