# PROGRESS — Panel Admin & Portal Cliente

## Objetivo del sistema

Panel para que Shift Studio gestione el estado de proyectos de clientes,
con dos caras:

1. **Admin** (`/admin`, detrás de login): crear proyectos, cambiar estado,
   escribir notas internas, comentar con el cliente, subir/descargar
   archivos, generar el link/QR del portal.
2. **Portal cliente** (`/portal/[token]`, público vía link/QR): el cliente
   ve el estado y el historial de su proyecto, comenta y sube/descarga
   archivos. Nunca ve las notas internas del admin.

Diseño: Brand Kit v1 (el mismo del home) — ink/paper/cream, celeste
`--sky` como acento, Plus Jakarta Sans para titulares y cuerpo
(`src/components/admin/fonts.ts`), esquinas redondeadas, monospace
reservado para labels/tags chicos. Ver `CLAUDE.md` para el detalle
completo del sistema — no usa `--font-title`/`--font-body` del layout
raíz (esos son del sitio de marketing, un sistema tipográfico distinto).

## Estado actual (sesión 2026-08-24)

La versión anterior de este documento describía una implementación 100%
`localStorage` (sin backend, sin auth real). Esa versión fue reemplazada
por completo. Resumen de lo que cambió, fase por fase (ver el historial de
git para el detalle de cada commit):

### 1. Capa de datos server-side — ahora Supabase (Postgres + Storage)

- `src/lib/admin/repository.ts`: interfaz `ProjectsRepository` — este sigue
  siendo el **único punto de swap** para conectar un backend real.
- `src/lib/admin/repository.supabase.ts`: implementación actual, sobre el
  proyecto Supabase `tkbgblbxgoqawxtgsgrl`. Tablas `projects`,
  `status_history`, `project_comments`, `project_files` (RLS habilitada,
  **sin policies a propósito**: default-deny para `anon`/`authenticated`,
  porque la autorización real la hacen los route handlers de Next, no la
  base — ver comentario al inicio del archivo). Los archivos van al bucket
  privado `project-files` de Supabase Storage. Requiere `SUPABASE_URL` y
  `SUPABASE_SERVICE_ROLE_KEY` (o el `secret` key del nuevo sistema de API
  keys de Supabase, que es su reemplazo) en el entorno — ver
  `.env.example`. Sin esas variables, cualquier operación tira error al
  primer intento de tocar la base.
- `src/lib/admin/repository.fileStore.ts`: implementación anterior (mock en
  disco, `data/projects.json` + `data/uploads/**`). Se dejó en el repo como
  referencia de contrato (mismo patrón que documentaba este archivo antes
  del swap) pero **ya no está conectada** — `getRepository()` no la
  importa.
- Expuesto vía Route Handlers: `src/app/api/admin/**` (protegidos por
  sesión) y `src/app/api/portal/**` (públicos, gateados por el token del
  proyecto) + `src/app/api/files/[projectId]/[fileId]` para descargar.
- El cliente (`src/lib/admin/useProjects.ts` + `src/lib/admin/apiClient.ts`)
  consume esa API por `fetch`, ya no lee `localStorage`.
- `src/app/admin/page.tsx`, `src/app/admin/proyectos/[id]/page.tsx` y
  `src/app/portal/[token]/page.tsx` son ahora **Server Components** que
  resuelven `notFound()` en el servidor (404 real, no uno que aparece
  recién tras hidratar) y pasan los datos iniciales a un Client Component
  (`DashboardView`, `ProjectDetailView`, `PortalView`) para la parte
  interactiva — así no hay flash de "Cargando..." en la carga inicial.

Verificado end-to-end contra la base real (no solo build/lint): login,
crear proyecto, comentario de admin y de cliente (vía `/api/portal`),
cambio de estado con historial, subir archivo (Storage) y descargarlo
byte-a-byte, proyección pública del portal (sin `notes` ni `storedName`),
y `deleteProject` — confirmado que cascadea comentarios/archivos/historial
en Postgres y borra el objeto del bucket.

Si en algún momento hace falta swapear a otro backend, el patrón sigue
siendo el mismo:

1. Crear `src/lib/admin/repository.<tuBackend>.ts` que implemente
   `ProjectsRepository` (usar `repository.supabase.ts` o
   `repository.fileStore.ts` como referencia de qué tiene que hacer cada
   método).
2. En `src/lib/admin/repository.ts`, cambiar el `import` y el `return` de
   `getRepository()` para que apunte a la nueva implementación.
3. Nada más cambia — Route Handlers, hooks, componentes y páginas ya están
   escritos contra la interfaz, no contra una implementación concreta.

### 2. Autenticación real del admin

- `src/lib/admin/session.ts`: cookie httpOnly firmada con HMAC (Web Crypto,
  sin dependencias nuevas, funciona tanto en el runtime Edge del
  middleware como en el runtime Node de los route handlers).
- `src/middleware.ts`: gatea `/admin/**` y `/api/admin/**` (excepto
  `/api/admin/session`, necesaria para poder loguearse) — sin cookie
  válida, redirige a `/admin/login` (páginas) o devuelve 401 (API).
- Login real en `/admin/login`, logout real (borra la cookie). El nombre
  con el que se loguea cada persona queda como autor de sus comentarios
  (ya no hardcodeado a "Shift Studio").
- Contraseña: `process.env.ADMIN_PASSWORD` (ver `.env.example`; sin definir,
  usa un default de desarrollo — **cambiarlo antes de producción**).

### 3. Historial de estado + actividad nueva/leída

- `Project.statusHistory`: cada cambio de estado queda registrado con
  fecha — se ve como timeline (`StatusHistory.tsx`) en admin y portal.
- `Project.lastSeenByAdmin` / `lastSeenByClient` + `src/lib/admin/activity.ts`:
  derivan si hay actividad del otro lado sin leer todavía (comentario,
  archivo, o cambio de estado). Punto teal + contador en el dashboard
  admin; banner "hay novedades" en el portal (capturado una sola vez desde
  el snapshot inicial, para que no desaparezca solo al marcar como visto).
- 404 propias con la estética del sistema para `/admin/proyectos/[id]` y
  `/portal/[token]` (antes usaban el 404 genérico de Next).

### 4. Pulido visual (portal primero, luego parejo con admin)

- `StatusStepper`: línea de progreso animada entre pasos.
- `CommentThread`: entrada animada por mensaje, auto-scroll, timestamps
  relativos ("hace 2h").
- `FileUploadPanel`: sube por XHR con barra de progreso real, drag-activo
  animado, badge de tipo de archivo, tope subido a 20MB (antes 5MB).
- `Toaster.tsx`: toasts compartidos (éxito/error/info) para feedback de
  acciones — crear proyecto, guardar notas, cambiar estado, subir archivo.
- `ConfirmDialog.tsx`: reemplaza el `confirm()` nativo del navegador para
  borrar un proyecto.
- `AdminSkeleton`: loading skeletons en vez de "Cargando..." plano.
- `FadeIn.tsx` vs. `Reveal.tsx` (del sitio de marketing): **no son
  intercambiables**. `Reveal` anima al entrar en viewport
  (`whileInView`) — pensado para scroll storytelling largo. El
  admin/portal son pantallas cortas donde casi todo ya está en el
  viewport al cargar, y depender de que el `IntersectionObserver` dispare
  para contenido ya visible puede dejarlo en `opacity:0` indefinidamente
  en algunos entornos (se vio en desarrollo). `FadeIn` anima siempre al
  montar, sin esa dependencia.
- `ClientDate.tsx`: **importante, no lo quites de en medio de un
  `toLocaleString`.** El ICU de Node (server) y el de Chrome (cliente)
  pueden formatear la misma fecha con textos distintos (orden, ceros a la
  izquierda, am/pm) — como estas vistas ahora renderizan server-side, eso
  dispara un hydration mismatch real que React "resuelve" descartando y
  regenerando el subárbol entero (se vio como toda la mitad de la página
  en blanco por un instante). `ClientDate` muestra un formato fijo
  determinístico en el primer render (server + primer paint cliente) y
  recién post-mount lo reemplaza por el formato lindo.

### Verificación hecha

- `npx eslint .` y `npm run build` sin errores en cada fase (los warnings
  restantes son preexistentes del sitio de marketing, no tocan código
  nuevo).
- Smoke tests con `curl` cubriendo: login/logout, 401 sin sesión, crear/
  editar/borrar proyecto, comentarios de ambos roles, subida/descarga de
  archivo, cambio de estado con historial, 404 reales, y — el que motivó
  sacar el caché en memoria — 5 iteraciones seguidas de crear un proyecto
  y pedir su portal inmediatamente después, sin inconsistencias.
- Verificación visual en Chrome real (no solo curl/build): login,
  dashboard con skeletons/toasts, detalle con diálogo de confirmación de
  borrado, portal con stepper animado, historial, comentarios
  (animación + auto-scroll + timestamp relativo), subida de archivo con
  barra de progreso y toast de confirmación, banner de novedades.

## Cómo probarlo en dev

```
npm install   # si hace falta (ver nota de node_modules abajo)
npm run dev
```

- Necesita `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`
  (ver `.env.example`) — sin eso, cualquier request que toque proyectos
  tira error. Sacar la key del dashboard de Supabase del proyecto
  `tkbgblbxgoqawxtgsgrl` (Settings → API Keys → Secret keys).
- Admin: `http://localhost:3000/admin` → pide login. Password por defecto
  (si no seteaste `ADMIN_PASSWORD`): `shiftstudio2026`. Nombre: cualquiera.
- Portal: no hay proyectos semilla — la base arranca vacía, hay que crear
  un proyecto desde `/admin` para conseguir su token/link de portal.
- Los datos viven en Supabase (Postgres + Storage), no en el filesystem
  local — `data/` y su nota de gitignore quedaron obsoletas.

**Nota de `node_modules`:** este repo guarda las dependencias en
`node_modules.nosync/` con un symlink `node_modules → node_modules.nosync`
(para no sincronizarlas si la carpeta del proyecto está en iCloud/Dropbox).
Si corrés `npm install` a mano y VS Code/tu shell reemplaza el symlink por
una carpeta real, restaurá la convención:
```
rm -rf node_modules.nosync && mv node_modules node_modules.nosync && ln -sf node_modules.nosync node_modules
```

## Analítica propia del sitio de marketing (sesión 2026-08-24, cont.)

A pedido explícito: nada de Google Analytics ni terceros — analítica
100% propia, guardada en la misma Supabase, consultable desde
`/admin/metricas`.

- **Tabla:** `analytics_events` en Supabase (misma base que el panel).
  RLS habilitada sin policies — mismo modelo de confianza que el resto
  (ver `repository.supabase.ts`): la escritura/lectura pasa por
  `getSupabaseAdminClient()` (`src/lib/supabaseAdmin.ts`, factorizado y
  compartido con el repositorio del panel), nunca por una key expuesta al
  cliente.
- **Qué se guarda:** `session_id` (uuid anónimo en `localStorage`, sin
  cruce con nada — no es PII), tipo de evento, path, referrer, UTMs,
  país/ciudad (de headers `x-vercel-ip-country`/`x-vercel-ip-city` de
  Vercel — **no pega a ningún servicio externo de geo-IP ni guarda la
  IP**; en local/hosting no-Vercel esos campos quedan `null`),
  dispositivo/navegador/SO (parseados del User-Agent con un parser propio
  chico, sin dependencia nueva), y `metadata` jsonb por evento. Respeta
  `navigator.doNotTrack`. Filtra bots por User-Agent antes de insertar.
- **Eventos instrumentados** (sin tocar la lógica de los componentes,
  solo se agregó una llamada a `track()` en cada punto de interacción ya
  existente): `pageview` (por cambio de ruta, `PageViewTracker` montado en
  `src/app/[locale]/layout.tsx`), `contact_open` (con `source`: `header`,
  `services` o `final_cta`), `contact_submit` (método elegido, servicio,
  timeline, presupuesto — centralizado en `ContactContent.handleSend`,
  el único punto de envío real que comparten los dos flujos de contacto
  del sitio), `service_expand`, `project_expand`, `project_link_click`.
- **Endpoint:** `POST /api/track` (`runtime = "nodejs"`, corre fuera del
  gate de `/admin` y del middleware de i18n — ver `src/middleware.ts`).
  Nunca tira error visible al visitante: cualquier fallo devuelve 204
  igual. Trunca/valida cada campo, allowlist de `event_type` en código
  (no constraint de DB, para poder sumar eventos nuevos sin migración).
- **Dashboard:** `/admin/metricas` (Server Component, mismo gate de
  sesión que el resto de `/admin`). Agrega en JS sobre las filas del
  rango elegido (7/30/90 días, límite de 20k filas) — no hay vistas ni
  funciones SQL, no hace falta con el volumen de tráfico esperado. KPIs
  (visitantes únicos, vistas, contactos iniciados/enviados, conversión),
  un gráfico de tendencia de dos series (vistas + visitantes, un solo eje,
  con crosshair y tooltip) y listas de barras (páginas, referrers, UTM
  source, país, dispositivo, navegador, servicios/proyectos más
  explorados) — construido siguiendo la skill de dataviz del repo:
  un solo hue de acento (`--sky`) para magnitud, gris de-emphasis para la
  serie secundaria, nada de paleta categórica porque ninguna vista la
  necesita.
- Verificado end-to-end: eventos reales generados desde Chrome llegan a
  Supabase con los campos correctos (UTM, device/browser/OS, metadata) y
  el dashboard los agrega bien: KPIs, gráfico con hover, y los 8 paneles
  de barras. Datos de prueba borrados de la tabla antes de terminar.

## Limitaciones conocidas / próximos pasos

1. ~~Backend real para producción.~~ Resuelto: `repository.supabase.ts`
   sobre Postgres + Storage, ver arriba.
2. **Notificaciones externas** (email/WhatsApp). Hoy "actividad nueva" solo
   se ve si alguien entra al panel/portal — no hay push ni email cuando el
   cliente comenta o el admin cambia el estado.
3. **Multi-admin con permisos.** Cualquiera con la contraseña compartida
   entra como "admin" con nombre libre — no hay usuarios individuales con
   credenciales propias ni roles.
4. **Deploy:** falta configurar `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
   (y `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`) como env vars en el hosting
   real (ej. Vercel) — hoy solo existen en `.env.local`, que no se
   commitea.
5. Considerar mover `/admin` y `/portal` a un subdominio o detrás de un
   flag para no mezclar analytics/SEO con el sitio de marketing.
6. **País/ciudad del visitante** en `analytics_events` solo se completa en
   Vercel (lee sus headers `x-vercel-ip-*`). En otro hosting quedaría
   siempre `null` — para eso habría que sumar geo-IP local (ej.
   `geoip-lite`) en `src/app/api/track/route.ts`.
