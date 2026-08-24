# SHIFT STUDIO — CLAUDE.md

## Contexto del proyecto

Agencia de software "Shift Studio". El sitio de marketing (home) y el
panel admin + portal cliente (`/admin`, `/portal/[token]`) viven en el
mismo repo y comparten el mismo sistema de diseño: **Brand Kit v1**.

No modificar lógica, rutas, i18n ni estructura de componentes sin que el
pedido lo requiera explícitamente — los cambios de diseño son de estilos,
copy y tokens.

## Stack

- Next.js 16 App Router
- Tailwind v4
- next-intl (es/en) en el sitio de marketing
- Fuentes: **Plus Jakarta Sans** (peso 800 para titulares, 400 para texto
  de cuerpo) es la tipografía real del Brand Kit v1 — es la que usa el
  home (`Hero.tsx`, `Services.tsx`, `FeaturedProjects.tsx`, `FinalCta.tsx`)
  y la que usa el panel admin/portal (`src/components/admin/fonts.ts`:
  `jakarta` / `jakartaBody`). JetBrains Mono queda reservado solo para
  labels/tags/eyebrows chicos en mayúscula (10-11px, tracking ancho) —
  nunca para titulares ni texto de cuerpo largo.
  - El layout raíz (`src/app/layout.tsx`) todavía inyecta Anton vía
    `--font-title` y JetBrains Mono vía `--font-body` (planes de una
    iteración anterior del brand). Esas variables ya no las usa el
    contenido visible del home ni del admin — quedan ahí por inercia, no
    las uses como referencia de qué tipografía va en pantalla.
  - `globals.css` tiene una regla global `h1,h2,h3,h4,h5,h6 { text-transform:
    uppercase }` heredada de esa misma iteración anterior. Al ser CSS sin
    `@layer`, en Tailwind v4 queda "sin capa" y le gana en cascada a
    cualquier utilidad de Tailwind (`normal-case` incluida) sin importar
    especificidad. Para un título que no debe ir en mayúscula, no alcanza
    con una clase de Tailwind — hay que pisarlo con `style={{
    textTransform: "none" }}` inline (así lo resuelve el propio home).

## Reglas de diseño — Brand Kit v1 (real, vigente)

- **Esquinas redondeadas**, no rectas: contenedores grandes tipo "hero"
  24-28px (`rounded-[24px]`/`rounded-[28px]`), cards de UI 16-20px
  (`rounded-2xl`), inputs/badges/botones/tags pequeños completamente
  redondeados (`rounded-full`) — igual que los CTAs pill y los avatares
  circulares con inicial del home (`FeaturedProjects.tsx`).
- **Sin gradientes de color** planos en fondos — el contraste se logra
  con bloques de color sólido (ink vs. paper/cream) y con la textura de
  grano/humo (`SmokeCanvas`, ver abajo), no con `linear-gradient`.
- Sin glassmorphism ni backdrop-blur.
- **Celeste `--sky` (`#9EC7D4`) es el acento**, no el teal `#0ABAB5` de la
  paleta vieja (ese token sigue en `globals.css` pero ya no es el acento
  activo del home ni del admin — no lo reintroduzcas en trabajo nuevo).
- Titulares: Plus Jakarta Sans 800, **minúscula/case natural** (no
  uppercase), `letter-spacing` negativo (`-0.02em` a `-0.04em`),
  `line-height` apretado (0.82-0.92 en los titulares grandes del home).
  Un acento en itálica + color sky sobre una palabra puntual es un
  recurso válido y usado (`Hero.tsx`: "studio.", `FinalCta.tsx`:
  "construir?", `LoginForm.tsx`: "sesión").
  Excepción: nombres de proyecto/cliente cargados por el usuario (texto
  de datos, no copy de marca) van tal cual los escribió, sin forzar
  ninguna transformación de case.
- Labels/tags/eyebrows chicos: monospace, uppercase, tracking ancho,
  9-12px — igual que antes, este patrón sigue vigente.
- Separadores: 1px solid (`--rule` en el home, `--sky)/10-20` en el
  admin) para listas/filas editoriales — no cajas con borde grueso
  alrededor de todo.
- Textura opcional para momentos "hero" (login, hero, CTA final): fondo
  ink + `SmokeCanvas` (`src/components/ui/SmokeCanvas.tsx`, WebGL
  smoke + film grain, reutilizable — no dupliques el shader inline).
  Reservalo para pantallas de bajo tráfico/una sola vez en pantalla, no
  para vistas densas de uso constante (dashboards, listados) por costo
  de rendering.
- Sin emojis en la UI.

## Paleta de tokens (`src/app/globals.css`)

Tokens vigentes (Brand Kit v1):
```
--ink: #0d0d0d        /* fondo oscuro, texto sobre paper */
--ink-2: #1a1a1a       /* fondo de cards sobre ink */
--paper: #FAFCFC
--cream: #f0f0ee       /* fondo de página del home */
--cream-2: #e6e6e1
--sky: #9EC7D4         /* acento único */
--sky-soft: #c7e0e6
--sky-deep: #5fa3b8    /* variante para texto destacado sobre paper */
--mute: #7a7a7a        /* texto secundario sobre paper/cream */
--mute-2: #a8a8a3
--rule: #dcdcd6         /* divisores 1px */
```
Tokens legacy (preexistentes en el archivo, **no** son el sistema activo
— no diseñar contra ellos): `--teal`, `--dark`, `--black`, `--bg-light`,
`--bg-teal`, `--white`, `--mono-muted`.

## Alcance

El home de marketing y el panel admin/portal comparten Brand Kit v1 pero
son superficies separadas — un cambio de estilos en una no debe tocar
lógica/rutas/i18n de la otra a menos que el pedido lo pida.
