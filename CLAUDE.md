# SHIFT STUDIO — CLAUDE.md
## Contexto del proyecto
Agencia de software "Shift Studio". Migrando estética de "Orbit Digital" 
al design system de Shift Studio. NO modificar lógica, rutas, i18n, 
ni estructura de componentes. SOLO migrar estilos, copy y tokens.

## Stack
- Next.js 16 App Router
- Tailwind v4
- next-intl (es/en)
- Fuentes: reemplazar Inter/Archivo Black → Anton (títulos) + JetBrains Mono (labels técnicos)

## Reglas de diseño MANDATORIAS
- border-radius: 0 en TODOS los elementos sin excepción
- Sin gradientes de color
- Sin glassmorphism ni backdrop-blur
- El teal #0ABAB5 es el ÚNICO color de acento
- Títulos: Anton, uppercase, letter-spacing negativo
- Labels técnicos: monospace, uppercase, tracking-wide, 9-12px
- Separadores: 1px solid, nunca más gruesos
- Sin emojis en la UI

## Paleta de tokens
--teal: #0ABAB5
--dark: #072B2A
--black: #000000
--bg-light: #FAFCFC
--bg-teal: rgba(167,233,231,0.37)
--white: #FFFFFF
--mono-muted: rgba(7,43,42,0.5)

## Orden de migración
1. globals.css — tokens y fuentes
2. Header
3. Hero
4. The Gap (sección problema)
5. Services
6. FeaturedProjects
7. Process
8. FinalCta
9. Footer