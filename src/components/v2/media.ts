// Media de la versión V2. Las fotos son de Unsplash (vía Picsum, licencia
// libre) pasadas a escala de grises; los videos son los clips de tinta/humo
// que ya estaban en /public, recortados y re-encodeados en /public/v2/video.

export type HeroMode = "tinta" | "humo" | "bloom" | "foto" | "slides";
export type ImageSet = "estudio" | "arquitectura" | "materia";

export const HERO_MODES: { id: HeroMode; label: string }[] = [
  { id: "tinta", label: "Tinta" },
  { id: "humo", label: "Humo" },
  { id: "bloom", label: "Bloom" },
  { id: "foto", label: "Foto" },
  { id: "slides", label: "Slides" },
];

export const HERO_VIDEOS: Record<"tinta" | "humo" | "bloom", { src: string; poster: string }> = {
  tinta: { src: "/v2/video/tinta.mp4", poster: "/v2/video/tinta.jpg" },
  humo: { src: "/v2/video/humo.mp4", poster: "/v2/video/humo.jpg" },
  bloom: { src: "/v2/video/bloom.mp4", poster: "/v2/video/bloom.jpg" },
};

export const HERO_PHOTO = "/web-c/foto-hero.jpg";

export const IMAGE_SETS: { id: ImageSet; label: string }[] = [
  { id: "estudio", label: "Estudio" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "materia", label: "Materia" },
];

const p = (id: number) => `/v2/img/p${id}.webp`;
const u = (name: string) => `/v2/img/s-${name}.webp`;

/*
 * Cada lugar de la página tiene un concepto fijo, y cada set lo resuelve con
 * una sola dirección de arte:
 *   - Estudio: estudio de software (wireframes, anotaciones en iPad, código,
 *     dashboards, equipo). Mac presente pero no dominante.
 *   - Arquitectura: solo arquitectura moderna.
 *   - Materia: solo texturas y patrones abstractos.
 */
type SetImages = {
  /** Tarjetas de servicios: Identidad (carácter/marca), Sistemas (estructura/orden), Web (lo digital). */
  services: [identidad: string, sistemas: string, web: string];
  /** Píldoras del manifiesto: "sistemas de negocio:" (partes organizadas),
   *  "una sola pieza." (el todo integrado), "empresa grande" (escala). */
  pills: [sistema: string, pieza: string, escala: string];
  /** Slideshow del hero: el estudio en contexto. */
  slides: string[];
};

export const SETS: Record<ImageSet, SetImages> = {
  estudio: {
    services: [u("identidad"), u("sistemas"), u("web")],
    pills: [u("dashboard"), u("equipo"), u("sala")],
    slides: [u("ipad"), u("wireframe"), u("pizarra"), u("producto")],
  },
  arquitectura: {
    services: [p(939), p(887), p(948)],
    pills: [p(1048), p(942), p(1076)],
    slides: [p(1031), p(953), p(949), p(618)],
  },
  materia: {
    services: [p(893), p(955), p(352)],
    pills: [p(960), p(1041), p(924)],
    slides: [p(912), p(1053), p(1058), p(940)],
  },
};

/**
 * Columnas en parallax del CTA: las 10 imágenes del set en una grilla 4×4.
 * El índice (k·3) mod 10 recorre las 10 antes de repetir, así ninguna se
 * repite dentro de una columna ni al lado de sí misma.
 */
export function ctaColumns(set: ImageSet): string[][] {
  const s = SETS[set];
  const all = [...s.slides, ...s.services, ...s.pills];
  return [0, 1, 2, 3].map((c) => [0, 1, 2, 3].map((r) => all[((r * 4 + c) * 3) % all.length]));
}
