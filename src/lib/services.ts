// src/lib/services.ts

export type Service = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  model: string;
  emoji?: string;
  image?: string; // ruta en /public, ej: "/services/identidad.png"
};

export const SERVICES: Service[] = [
  {
    id: "identidad",
    number: "01",
    category: "OPERATIONS",
    title: "Identidad & Autoridad",
    description: "Construimos el alma visual de tu marca. Diseñamos identidades sólidas para que tu negocio se perciba con la autoridad que merece.",
    highlights: ["alma visual", "identidades sólidas", "autoridad"],
    model: "IMPACTO: POSICIONAMIENTO PREMIUM",
    emoji: "🎯",
    image: "/services/identidad.png",
  },
  {
    id: "sistemas",
    number: "02",
    category: "AUTOMATION",
    title: "Sistemas & Automatización",
    description: "Automatizamos tareas repetitivas para liberar equipo, acelerar operaciones y permitir que tu negocio escale sin caos.",
    highlights: ["tareas repetitivas", "liberar equipo", "escale sin caos"],
    model: "IMPACTO: RENTABILIDAD Y ESCALA",
    emoji: "⚡",
    image: "/services/sistemas.png",
  },
  {
    id: "web-conversion",
    number: "03",
    category: "PLATFORMS",
    title: "Web de Alta Conversión",
    description: "Construimos software soberano hecho a medida para transformar el interés de tus usuarios en facturación real.",
    highlights: ["software soberano", "hecho a medida", "facturación real"],
    model: "IMPACTO: CONVERSIÓN DE VENTAS",
    emoji: "🚀",
    image: "/services/web.png",
  },
];