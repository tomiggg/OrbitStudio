// src/lib/services.ts

export type Service = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  model: string;
};

export const SERVICES: Service[] = [
  {
    id: "identidad",
    number: "01",
    category: "OPERATIONS",
    title: "Identidad & Autoridad",
    description: "Construimos el alma visual de tu marca. Diseñamos identidades sólidas para que tu negocio se perciba con la autoridad que merece.",
    model: "IMPACTO: POSICIONAMIENTO PREMIUM",
  },
  {
    id: "sistemas",
    number: "02",
    category: "AUTOMATION",
    title: "Sistemas & Automatización",
    description: "Automatizamos tareas repetitivas para liberar equipo, acelerar operaciones y permitir que tu negocio escale sin caos.",
    model: "IMPACTO: RENTABILIDAD Y ESCALA",
  },
  {
    id: "web-conversion",
    number: "03",
    category: "PLATFORMS",
    title: "Web de Alta Conversión",
    description: "Construimos software soberano hecho a medida para transformar el interés de tus usuarios en facturación real.",
    model: "IMPACTO: CONVERSIÓN DE VENTAS",
  },
];