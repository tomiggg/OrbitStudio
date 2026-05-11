export type Project = {
  id: string;

  // Card (home)
  title: string;
  description: string; // 1–2 líneas (problema + enfoque)
  href: string; // ahora: link interno al caso (/proyectos/slug)
  hrefLabel?: string;
  serviceTag?: string;
  featured?: boolean;

  // Preview
  imageSrc?: string;

  // ✅ Case study (para páginas intermedias)
  case?: {
    client: string;
    context: string; // contexto / situación
    problem: string; // problema real
    approach: string[]; // enfoque (bullets)
    solution: string[]; // solución (bullets)
    results: string[]; // resultado (bullets)
    stack?: string[]; // opcional
    externalUrl?: string; // link real al proyecto
  };
};

export const PROJECTS: Project[] = [
  {
    id: "pb-inmobiliaria",
    title: "PB Inmobiliaria",
    description:
      "No había presencia formal ni forma rápida de actualizar propiedades. Creamos web + panel para publicar/editarlas y captar consultas directo.",
    href: "/proyectos/pb-inmobiliaria",
    hrefLabel: "Ver caso",
    serviceTag: "Sitio Web + Admin",
    featured: true,
    imageSrc: "/projects/pb.png",
    case: {
      client: "PB Inmobiliaria",
      context:
        "Inmobiliaria que necesitaba verse profesional online y mantener el catálogo siempre actualizado sin depender de terceros.",
      problem:
        "Falta de presencia digital formal y un dolor operativo: no podían listar/editar propiedades fácil desde su propio equipo (admin/secretaría).",
      approach: [
        "Definir una identidad y estructura de sitio que transmita confianza",
        "Resolver el back-office: alta/edición de propiedades con un flujo simple",
        "Optimizar el camino a contacto (WhatsApp / consultas) desde cada propiedad",
      ],
      solution: [
        "Sitio web profesional con secciones claras y narrativa de marca",
        "Panel/flujo de administración para publicar, editar y mantener propiedades al día",
        "Páginas de propiedades con información completa + CTA directo a contacto",
      ],
      results: [
        "Presencia más formal y confiable (mejor primera impresión)",
        "Catálogo siempre actualizado por el equipo interno (sin fricción)",
        "Contacto más directo desde propiedades (menos pasos para consultar)",
      ],
      stack: ["Next.js", "Tailwind CSS", "TypeScript"  ],
      externalUrl: "https://www.pbinmobiliaria.com.ar/",
    },
  },

  {
    id: "tu-utn",
    title: "Tu UTN",
    description:
      "Convertimos el caos de datos en control total. Rediseñamos un sistema complejo y antiguo para transformarlo en una herramienta simple que hoy ayuda a muchos de usuarios a tomar mejores decisiones.",
    href: "/proyectos/tu-utn",
    hrefLabel: "Ver caso de estudio",
    serviceTag: "Optimización de Procesos",
    featured: true,
    imageSrc: "/projects/tuutn.png",
    case: {
      client: "Comunidad Académica",
      context:
        "Los sistemas antiguos suelen ser difíciles de usar y no muestran la información que realmente importa para el día a día del usuario.",
      problem:
        "Información desordenada y falta de claridad. El usuario perdía tiempo intentando entender su situación actual y no podía planificar sus próximos pasos con seguridad.",
      approach: [
        "Analizar las reglas del sistema para simplificarlas al máximo.",
        "Diseñar una interfaz moderna donde lo importante resalte a primera vista.",
        "Crear un panel de control automático que elimine las dudas del usuario."
      ],
      solution: [
        "Panel de Control Inteligente: Un tablero que muestra el estado real y los logros alcanzados de forma visual.",
        "Mapa de Ruta Automático: El sistema calcula solo qué caminos están habilitados, eliminando el error humano.",
        "Acceso Rápido a Datos Críticos: Todo lo que el usuario necesita en un solo lugar, optimizado para celulares y computadoras."
      ],
      results: [
        "Ahorro de tiempo real: Planificación de meses reducida a segundos.",
        "Validación Masiva: Probado y aprobado por una comunidad activa que impulsó el crecimiento del proyecto.",
        "Impacto Visual: Transformamos una experiencia frustrante en una herramienta que da gusto usar."
      ],
      stack: ["React", "Node.js", "PostgreSQL"],
      externalUrl: "https://tu-utn.vercel.app/",
    },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured).slice(0, 2);

// helper opcional para páginas de caso
export function getProjectById(id: string) {
  return PROJECTS.find((p) => p.id === id);
}