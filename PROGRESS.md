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

## Sesión 2026-08-23 (continuación) — Qué se hizo

Se tomaron 4 objetivos de "Próximos pasos" de la sesión anterior y se
completaron de punta a punta (mock donde hacía falta, sin backend real
todavía):

### 1. Auth mock para `/admin` (anti-bloqueo: sin backend/NextAuth aún)
- `src/lib/admin/auth.ts`: sesión en `localStorage`
  (`shift-studio-admin-session-v1`) con `loginAdmin(name, password)` /
  `logoutAdmin()` / hook `useAdminSession()`. Contraseña fija en el
  bundle del cliente (`shiftstudio2026`) — **no es seguridad real**, solo
  evita que `/admin` quede completamente abierto. Sigue pendiente auth
  real (ver "Próximos pasos" #1, ahora con más detalle).
- `src/components/admin/AdminAuthGate.tsx`: si no hay sesión, muestra
  formulario de login (nombre + contraseña); si hay sesión, muestra el
  contenido con un header de sesión + botón "Cerrar sesión".
- `src/app/admin/layout.tsx`: envuelve `{children}` con `AdminAuthGate`.
- El nombre ingresado en el login ahora se usa como `authorName` en los
  comentarios del admin (`src/app/admin/proyectos/[id]/page.tsx`), en vez
  del "Shift Studio" hardcodeado — primer paso hacia multi-admin (#6 de
  la lista anterior).

### 2. Historial de cambios de estado (timeline)
- `src/lib/admin/types.ts`: nuevo tipo `StatusChange` y campo
  `statusHistory: StatusChange[]` en `Project`.
- `src/lib/admin/store.ts`: `updateProjectStatus` ahora agrega una
  entrada al historial (solo si el estado cambia de verdad).
  `normalizeProject()` rellena `statusHistory`/`lastSeenBy*` en proyectos
  guardados por la sesión anterior (localStorage viejo sin estos
  campos), para no romper datos existentes del usuario.
- `src/components/admin/StatusHistory.tsx`: timeline vertical (línea +
  puntos) con estado y fecha/hora, más reciente primero. Se muestra en
  el detalle de admin y en el portal del cliente (solo lectura en ambos
  lados, es un registro).

### 3. Notificaciones in-app (mock — sin email/WhatsApp real, ver #3 de
   la lista anterior, que sigue pendiente para eso)
- Nuevos campos `lastSeenByAdmin` / `lastSeenByClient` (ISO) en
  `Project`, actualizados con `markSeenByAdmin` / `markSeenByClient`.
- `hasUnreadForAdmin(project)`: true si hay comentarios/archivos del
  cliente posteriores a `lastSeenByAdmin`.
- `hasUnreadForClient(project)`: true si hay comentarios/archivos del
  admin o cambios de estado posteriores a `lastSeenByClient`.
- Dashboard admin (`/admin`): punto teal junto al nombre del cliente en
  la card cuando hay actividad nueva, + contador "N con actividad nueva
  del cliente" en el header. Al entrar al detalle del proyecto se marca
  como visto (`markSeenByAdmin`).
- Portal cliente: al cargar, si había novedades del admin desde la
  última visita, se muestra un aviso ("Hay novedades desde tu última
  visita") *antes* de marcar como visto — se captura el estado con
  `useState(() => null)` + effect (mismo patrón que `PortalLinkCard`
  para evitar mismatch de hidratación), así el aviso no desaparece solo
  porque el propio efecto marcó visto.
- Seed data ajustada para que el mock sea demostrable: PB Inmobiliaria
  arranca con actividad no leída para el admin; TU UTN arranca con
  actividad no leída para el cliente.

### 4. Página 404 propia (estilo Urban Engineering Core)
- `src/app/admin/proyectos/[id]/not-found.tsx`: dentro del layout de
  admin (o sea, sigue detrás del login gate).
- `src/app/portal/[token]/not-found.tsx`: con header/logo igual al
  portal real, para que un link roto no caiga en la 404 genérica de
  Next.

### Verificación hecha
- `npm install` (no había `node_modules` en este contenedor).
- `npx tsc --noEmit`: sin errores.
- `npm run build`: compila y lintea OK (mismos warnings preexistentes de
  siempre, ninguno en código nuevo). Tuve que ajustar el hook del banner
  del portal dos veces por reglas estrictas de eslint-plugin-react-hooks
  (`set-state-in-effect`, `refs` — no se puede leer/escribir un ref
  durante el render ni hacer `setState` directo sin el patrón de
  `PortalLinkCard`).
- `npm run start` + curl: `/admin` (200, muestra el gate de login),
  `/admin/proyectos/proj-1` (200), `/portal/pb-inmobiliaria` (200, con
  "Historial de estado"), `/portal/tu-utn` (200), `/portal/no-existe`
  (**404** con la página nueva), home sigue redirigiendo a `/es`.
- **Limitación de esta verificación:** no había Playwright instalado en
  este contenedor (`Cannot find module 'playwright'`) y no se instaló
  para no depender de red — no se tomaron capturas de pantalla reales
  del login, el dashboard con el punto de actividad nueva, ni el banner
  "Hay novedades" del portal (ese banner en particular solo aparece
  después de hidratar en el cliente, así que tampoco es verificable con
  curl). El código se revisó a mano y compila/tipa bien, pero
  **falta una verificación visual real en navegador la próxima sesión**
  para estas 3 piezas puntuales.
- Nota aparte (no bloqueante): `/admin/proyectos/no-existe` devuelve
  HTTP 200 en vez de 404 (el `notFound()` corre dentro de un client
  component envuelto en `AdminAuthGate`, y Next no puede setear el status
  code en ese caso). El contenido visible es correcto (login gate, y una
  vez logueado, la página 404 nueva) — es solo el status code HTTP el
  que queda mal. Como `/admin` ya tiene `robots: noindex`, no es
  prioritario, pero quedó anotado.

## Próximos pasos (para la próxima sesión)

1. **Autenticación real del admin.** El login de hoy es un mock: nombre
   libre + una contraseña fija embebida en el JS del cliente (visible
   para cualquiera que abra devtools). Sirve para no dejar `/admin`
   totalmente abierto, pero **no es seguridad real**. Reemplazar por
   NextAuth o un endpoint de login server-side con cookie httpOnly antes
   de usar esto con proyectos/clientes reales.
2. **Backend/DB real.** Sigue siendo el mock más urgente: todo vive en
   `localStorage` del navegador, así que admin y cliente solo comparten
   datos si usan el mismo navegador. Migrar a Postgres/Supabase + API
   routes (o Server Actions) es el bloqueante real para poder usar esto
   con un cliente de verdad.
3. **Notificaciones fuera de la app (email/WhatsApp).** Ya existe el
   mock in-app (punto de actividad nueva en el dashboard, aviso de
   novedades en el portal) — falta la parte async: avisar aunque nadie
   tenga la pestaña abierta. Requiere backend real (#2) primero.
4. **Archivos grandes.** Sigue el límite de `localStorage` (~5-10MB
   total). Con backend real, subir a storage externo y guardar solo URL.
5. **Corregir el status code 404 real** en
   `/admin/proyectos/[id]` cuando el id no existe (hoy es 200 con
   contenido de 404) — probablemente moviendo la lógica de `notFound()`
   a un server component que envuelva la parte cliente, o resolviendo el
   proyecto en el servidor.
6. **Verificación visual en navegador** de lo hecho hoy (login,
   dashboard con actividad nueva, banner de novedades del portal) — no
   se pudo hacer en este contenedor por falta de Playwright instalado.
7. **Multi-admin completo.** Hoy cualquiera que sepa la contraseña puede
   loguearse con cualquier nombre (no hay lista de usuarios ni
   permisos); es más "firma tus comentarios" que autenticación
   multi-usuario real. Depende de #1/#2 para hacerse bien.
8. Considerar mover `/admin` y `/portal` a un subdominio o detrás de un
   flag para no mezclar analytics/SEO con el sitio de marketing.

## Autosugerencias para sesiones futuras (no pedidas explícitamente)

- **Export/backup del store mock**: botón en `/admin` para descargar todo
  el `localStorage` como JSON (y otro para importarlo) — mientras no haya
  backend real, es la única forma de no perder los proyectos si se limpia
  el navegador o se cambia de máquina.
- **Buscador global de comentarios/archivos** en el dashboard admin (hoy
  la búsqueda solo filtra por nombre de cliente/proyecto).
- **Estado "archivado"** además de los 5 pasos actuales, para proyectos
  entregados hace mucho y sacarlos de la vista principal sin borrarlos.
