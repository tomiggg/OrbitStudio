export type Project = {
  id: string;
  title: string;
  description: string; // problema + solución 1–2 líneas
  href: string; // link al proyecto (externo)
  hrefLabel?: string; // "Ver proyecto" | "Ver caso"
  serviceTag?: string; // ej: "Sitio Web Profesional"
  featured?: boolean; // destacados para Home

  // ✅ opcional: preview visual
  imageSrc?: string; // /projects/pb.png
};

export const PROJECTS: Project[] = [
  {
    id: "pbinmobiliaria",
    title: "PB Inmobiliaria",
    description:
      "Sitio web profesional para captar consultas y transmitir confianza con navegación clara y CTA directo.",
    href: "https://www.pbinmobiliaria.com.ar/",
    hrefLabel: "Ver proyecto",
    serviceTag: "Sitio Web Profesional",
    featured: true,
    imageSrc: "/projects/pb.png",
  },
  {
    id: "tu-utn",
    title: "Tu UTN (Gestión de Materias)",
    description:
      "Web app para organizar materias y correlatividades: estados, progreso y visualización dinámica para decisiones rápidas.",
    href: "https://tu-utn.vercel.app/",
    hrefLabel: "Ver web app",
    serviceTag: "Web Apps / Sistemas",
    featured: true,
    imageSrc: "/projects/tuutn.png",
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured).slice(0, 2);