import localFont from "next/font/local";

// Fuentes de las versiones C y V2 servidas desde el repo / node_modules, sin
// pedirlas a Google Fonts en el build (en Vercel la respuesta de Google hizo
// fallar next/font: "Cannot read properties of null (reading '1')").

// Geist: paquete oficial `geist` (variable font, pesos 100–900) → --font-geist-sans
export { GeistSans as geist } from "geist/font/sans";

export const instrumentSerif = localFont({
  src: [
    { path: "./InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});
