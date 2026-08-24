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

Diseño "Urban Engineering Core": border-radius 0 en todo, Anton para
títulos, teal `#0ABAB5` sobre fondo `#072B2A`, monospace (JetBrains Mono)
para labels/metadatos/estados. Reutiliza las fuentes ya cargadas
globalmente (`--font-title`, `--font-body`) en `src/app/layout.tsx`.

## Estado actual (sesión 2026-08-24)

La versión anterior de este documento describía una implementación 100%
`localStorage` (sin backend, sin auth real). Esa versión fue reemplazada
por completo. Resumen de lo que cambió, fase por fase (ver el historial de
git para el detalle de cada commit):

### 1. Capa de datos server-side (ya no localStorage)

- `src/lib/admin/repository.ts`: interfaz `ProjectsRepository` — este es el
  **único punto de swap** para conectar un backend real (ver más abajo).
- `src/lib/admin/repository.fileStore.ts`: implementación actual. Persiste
  en `data/projects.json` + `data/uploads/<projectId>/<archivo>` (carpeta
  `data/` gitignorada). Cada operación relee el archivo del disco — no hay
  caché en memoria entre requests, a propósito: con Turbopack cada route
  handler puede terminar en una instancia de módulo distinta, y un caché
  in-process llevó a un bug real de inconsistencia entre `/admin` y
  `/portal` durante el desarrollo.
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

**Limitación conocida:** `data/` es un archivo/carpeta en el filesystem del
proceso Node. Funciona de verdad en dev y en cualquier hosting con
filesystem persistente (self-host, VPS, contenedor con volumen). **No
persiste en hosting serverless sin volumen** (ej. Vercel por defecto: cada
invocación puede correr en una instancia distinta con filesystem efímero).
Para producción real hace falta el swap descrito abajo.

#### Cómo swapear a una base de datos real

1. Crear `src/lib/admin/repository.<tuBackend>.ts` que implemente
   `ProjectsRepository` (mismo contrato que `repository.fileStore.ts` —
   usalo como referencia de qué tiene que hacer cada método).
2. En `src/lib/admin/repository.ts`, cambiar el `import` y el `return` de
   `getRepository()` para que apunte a la nueva implementación.
3. Nada más cambia — Route Handlers, hooks, componentes y páginas ya están
   escritos contra la interfaz, no contra `fileStore` directamente.

Para archivos adjuntos, lo mismo aplica: hoy `addFile`/`getFileBuffer`
escriben/leen del disco; una implementación real (S3, Supabase Storage)
implementaría esos métodos guardando el blob ahí y devolviendo/leyendo por
esa vía en vez de `node:fs`.

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

- Admin: `http://localhost:3000/admin` → pide login. Password por defecto
  (si no seteaste `ADMIN_PASSWORD`): `shiftstudio2026`. Nombre: cualquiera.
- Portal (3 proyectos semilla): `/portal/pb-inmobiliaria`,
  `/portal/tu-utn`, `/portal/kioscos-del-sur`.
- Los datos viven en `data/` (gitignorado) — borrar esa carpeta reinicia
  todo a la semilla original.

**Nota de `node_modules`:** este repo guarda las dependencias en
`node_modules.nosync/` con un symlink `node_modules → node_modules.nosync`
(para no sincronizarlas si la carpeta del proyecto está en iCloud/Dropbox).
Si corrés `npm install` a mano y VS Code/tu shell reemplaza el symlink por
una carpeta real, restaurá la convención:
```
rm -rf node_modules.nosync && mv node_modules node_modules.nosync && ln -sf node_modules.nosync node_modules
```

## Limitaciones conocidas / próximos pasos

1. **Backend real para producción.** Es el único punto verdaderamente
   pendiente para un deploy serverless — seguir la receta de swap de
   arriba. El resto (auth, historial, notificaciones in-app, UI) ya está
   resuelto sobre la interfaz correcta.
2. **Notificaciones externas** (email/WhatsApp). Hoy "actividad nueva" solo
   se ve si alguien entra al panel/portal — no hay push ni email cuando el
   cliente comenta o el admin cambia el estado.
3. **Multi-admin con permisos.** Cualquiera con la contraseña compartida
   entra como "admin" con nombre libre — no hay usuarios individuales con
   credenciales propias ni roles.
4. **Archivos grandes / storage real.** 20MB por archivo, servidos desde
   disco local — con el swap de backend, este es también el lugar para
   mover a S3/Supabase Storage.
5. Considerar mover `/admin` y `/portal` a un subdominio o detrás de un
   flag para no mezclar analytics/SEO con el sitio de marketing.
