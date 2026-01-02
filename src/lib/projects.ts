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
    title: "Tu UTN (Gestion Estudiantil)",
    description:
      "La web oficial de UTN no muestra desbloqueos ni métricas. Creamos una app que previsualiza materias habilitadas y un dashboard para planificar la carrera.",
    href: "/proyectos/tu-utn",
    hrefLabel: "Ver caso",
    serviceTag: "Web App",
    featured: true,
    imageSrc: "/projects/tuutn.png",
    case: {
      client: "Estudiantes (UTN)",
      context:
        "Alumnos necesitan herramientas modernas para planificar su carrera; la web oficial no ofrece visualización de progreso, desbloqueos ni métricas.",
      problem:
        "No se puede previsualizar qué materias se habilitan según lo aprobado, ni tener un dashboard con datos clave (progreso, estimaciones, decisiones). Esto existe en privadas/exterior, pero no en la UTN.",
      approach: [
        "Modelar reglas de correlatividad y estados de materia",
        "Diseñar una UI que muestre desbloqueos de forma visual e inmediata",
        "Crear un dashboard con métricas útiles para decisiones de cursado",
      ],
      solution: [
        "Tabla/visor de materias con estados (Libre/Regular/Aprobada) y resaltado de habilitadas",
        "Cálculo dinámico de desbloqueos (qué podés cursar/rendir según tu avance)",
        "Dashboard con métricas: progreso, proyección/estimación y insights para planificación",
      ],
      results: [
        "Planificación más rápida (ver desbloqueos sin adivinar)",
        "Mejor toma de decisiones (métricas y visualización clara)",
        "Experiencia más “universidad moderna” sin depender del sistema oficial",
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