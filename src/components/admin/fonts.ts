import { Plus_Jakarta_Sans } from "next/font/google";

// Tipografía del admin/portal, alineada 1:1 con el home real (Hero.tsx,
// Services.tsx, etc.) — no con var(--font-title)/var(--font-body) del
// layout raíz, que siguen siendo Anton + JetBrains Mono para el sitio de
// marketing y no reflejan el sistema tipográfico que el home usa de
// verdad. jakarta = titulares (peso 800), jakartaBody = texto de cuerpo
// (peso 400). El mono queda reservado para labels/tags chicos en
// mayúscula, igual que en el home.
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
export const jakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "400" });
