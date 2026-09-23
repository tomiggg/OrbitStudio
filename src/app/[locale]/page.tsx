import { V2 } from "@/components/v2/V2";
import { geist, instrumentSerif } from "@/fonts";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V2 fontClassName={`${geist.variable} ${instrumentSerif.variable}`} versionCHref={`/${locale}/c`} />
  );
}
