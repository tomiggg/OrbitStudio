# PROGRESS — Panel Admin & Portal Cliente

## Objetivo del sistema
Panel admin para gestionar el estado de proyectos de clientes (Shift Studio),
con dos caras:
1. **Admin** (`/admin`): uso interno, gestión de proyectos.
2. **Portal cliente** (`/portal/[token]`): acceso vía link/QR, el cliente ve
   el estado de su proyecto, comenta y adjunta archivos.

Diseño "Urban Engineering Core": border-radius 0 en todo, Anton para
títulos, teal `#0ABAB5` sobre fondo `#072B2A`, monospace (JetBrains Mono)
para labels/metadatos/estados. Reutiliza las fuentes ya cargadas
globalmente (`--font-title`, `--font-body`) en `src/app/layout.tsx`.

## Sesión 2026-08-23 — Qué se hizo

### 1. Modelo de datos y store mock (anti-bloqueo: sin DB/auth real)
- `src/lib/admin/types.ts`: tipos `Project`, `ProjectComment`, `ProjectFile`,
  `ProjectStatus` (brief → diseño → desarrollo → revisión → entregado).
- `src/lib/admin/store.ts`: store en `localStorage` (key
  `shift-studio-admin-projects-v1`) con seed de 3 proyectos de ejemplo
  (PB Inmobiliaria, TU UTN, Kioscos del Sur — nombres ya usados en el
  portfolio existente). CRUD: `createProject`, `updateProjectStatus`,
  `updateProjectNotes`, `addComment`, `addFile`, `deleteProject`,
  `slugify`. Sincroniza entre pestañas del mismo navegador vía evento
  `storage`.
- `src/lib/admin/useProjects.ts`: hooks `useProjects`, `useProject(id)`,
  `useProjectByToken(token)` con `useSyncExternalStore` (reactivo, sin
  necesidad de refrescar).
- **Limitación conocida (mock):** todo vive en `localStorage` del
  navegador. No hay sincronización entre dispositivos ni backend real.
  El cliente y el admin solo ven los mismos datos si comparten navegador,
  o hay que migrar a una DB real (ver "Próximos pasos").

### 2. Panel Admin (`/admin`)
- `src/app/admin/layout.tsx`: shell dark con header (logo + nav).
- `src/app/admin/page.tsx`: dashboard con grid de proyectos (cards),
  búsqueda por cliente/proyecto, filtro por estado, formulario inline de
  "Nuevo proyecto" (genera token único para el link del cliente).
- `src/app/admin/proyectos/[id]/page.tsx`: detalle de proyecto —
  stepper de estado editable (click para cambiar), tarjeta de acceso del
  cliente (QR + link copiable), notas internas, hilo de comentarios
  (responde como "Shift Studio"), panel de archivos (subida + descarga),
  botón eliminar proyecto.

### 3. Portal Cliente (`/portal/[token]`)
- `src/app/portal/[token]/page.tsx`: vista pública sin nav de admin —
  logo, stepper de estado (solo lectura), hilo de comentarios (el cliente
  escribe con su propio nombre), panel de archivos (sube/descarga). Token
  inexistente → 404 real (`notFound()`).

### 4. Componentes compartidos
- `src/components/admin/ui/AdminPrimitives.tsx`: `AdminCard`, `AdminButton`,
  `AdminInput`, `AdminTextarea`, `AdminBadge`, `AdminLabel` — todos con
  `rounded-none`, monospace uppercase para labels, teal como único acento.
- `src/components/admin/StatusStepper.tsx`: stepper de 5 pasos, reutilizado
  en admin (editable) y portal (read-only, sin pasar `onChange`).
- `src/components/admin/CommentThread.tsx`: hilo de chat con burbujas
  alineadas según el rol del usuario actual (admin ↔ cliente).
- `src/components/admin/FileUploadPanel.tsx`: drag & drop + input file,
  guarda como `dataUrl` (base64) en el store — límite 5MB por archivo
  (razonable para demo en `localStorage`, que tiene tope ~5-10MB total).
- `src/components/admin/PortalLinkCard.tsx`: genera el link
  `/portal/[token]` + QR (`qrcode.react`, agregado como dependencia nueva)
  y botón de copiar al portapapeles.

### 5. Infraestructura
- `src/middleware.ts` y `src/proxy.ts`: se excluyeron `/admin` y `/portal`
  del matcher de `next-intl` (antes redirigían a `/es/admin` → 404, porque
  esas rutas viven fuera de `[locale]` a propósito — son herramientas
  internas/cliente sin necesidad de i18n).
- Nueva dependencia: `qrcode.react` (`package.json` / `package-lock.json`).

### Verificación hecha
- `npx tsc --noEmit`: sin errores.
- `npm run build`: compila y lintea OK (los warnings restantes son
  preexistentes, no tocan código nuevo).
- `npm run start` + smoke test con curl: `/admin` (200), `/portal/pb-inmobiliaria`
  (200), `/portal/token-inexistente` (404), home sigue redirigiendo a
  `/es` como antes (no se rompió el sitio de marketing).
- Capturas de pantalla con Playwright headless de `/admin`,
  `/admin/proyectos/proj-1` y `/portal/pb-inmobiliaria`: layout, stepper,
  QR, comentarios y panel de archivos se ven correctamente con la estética
  Urban Engineering Core.

## Próximos pasos (para la próxima sesión)

1. **Autenticación real del admin.** Hoy `/admin` es público (cualquiera
   con la URL entra). Agregar login simple (password compartida o
   NextAuth) antes de exponer esto en producción.
2. **Backend/DB real.** Migrar el store de `localStorage` a una API real
   (Postgres/Supabase/etc.) para que el portal del cliente funcione desde
   cualquier dispositivo y no dependa del navegador del admin. Es el mock
   más urgente a resolver.
3. **Notificaciones.** Cuando el cliente comenta o sube un archivo, el
   admin debería enterarse (email/WhatsApp) sin tener que entrar a
   revisar manualmente — y viceversa cuando el admin cambia el estado.
4. **Archivos grandes.** El `dataUrl` en `localStorage` no escala (límite
   ~5-10MB total del navegador). Con backend real, subir a S3/Supabase
   Storage y guardar solo la URL.
5. **Historial de cambios de estado.** Hoy el stepper solo guarda el
   estado actual; sería útil un timeline con fecha de cada cambio.
6. **Multi-admin.** Si Shift Studio suma gente, el campo `authorName`
   del admin está hardcodeado a "Shift Studio"; habría que soportar
   usuarios individuales.
7. **Página 404 propia para `/admin/proyectos/[id]`** con estilo del
   sistema (hoy usa el `not-found` genérico de Next).
8. Considerar mover `/admin` y `/portal` a un subdominio o detrás de un
   flag para no mezclar analytics/SEO con el sitio de marketing.
