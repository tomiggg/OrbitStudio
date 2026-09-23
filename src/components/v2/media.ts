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

type SetImages = {
  /** Identidad, Sistemas, Web */
  services: [string, string, string];
  /** Píldoras dentro del manifiesto */
  pills: [string, string, string];
  /** Slideshow del hero */
  slides: string[];
};

export const SETS: Record<ImageSet, SetImages> = {
  estudio: {
    services: [p(26), p(60), p(180)],
    pills: [p(668), p(119), p(366)],
    slides: [p(0), p(445), p(20), p(36)],
  },
  arquitectura: {
    services: [p(953), p(1048), p(1031)],
    pills: [p(939), p(1081), p(616)],
    slides: [p(1076), p(546), p(737), p(299)],
  },
  materia: {
    services: [p(912), p(634), p(974)],
    pills: [p(766), p(1041), p(984)],
    slides: [p(685), p(900), p(693), p(474)],
  },
};

/** Imágenes para las columnas en parallax del CTA (mezcla del set activo). */
export function ctaColumns(set: ImageSet): string[][] {
  const s = SETS[set];
  const all = [...s.slides, ...s.services, ...s.pills];
  return [
    [all[0], all[4], all[8], all[1]],
    [all[5], all[9], all[2], all[6]],
    [all[3], all[7], all[8], all[0]],
    [all[6], all[1], all[9], all[4]],
  ];
}
