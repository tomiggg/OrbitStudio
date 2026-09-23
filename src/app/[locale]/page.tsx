import { V2 } from "@/components/v2/V2";
import { geist, instrumentSerif } from "@/fonts";

// Panel de ajustes y link a la versión C: solo en local y en previews de
// Vercel, nunca en producción.
const PREVIEW = process.env.VERCEL_ENV !== "production";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V2
      fontClassName={`${geist.variable} ${instrumentSerif.variable}`}
      versionCHref={PREVIEW ? `/${locale}/c` : undefined}
    />
  );
}
