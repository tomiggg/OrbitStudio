import { Geist, Instrument_Serif } from "next/font/google";
import { V2 } from "@/components/v2/V2";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-geist",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <V2 fontClassName={`${geist.variable} ${serif.variable}`} versionCHref={`/${locale}/c`} />;
}
