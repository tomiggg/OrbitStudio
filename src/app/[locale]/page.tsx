import { Geist } from "next/font/google";
import { WebC } from "@/components/web-c/WebC";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-geist",
});

export default function HomePage() {
  return <WebC fontClassName={geist.variable} />;
}
