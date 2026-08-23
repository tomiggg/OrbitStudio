# PROGRESS — Panel Admin & Portal Cliente

Registro de avance del sistema de gestión de proyectos de Shift Studio.
Formato: sesión más reciente arriba.

---

## Sesión 1 — 2026-08-23

### Objetivo de la sesión
Construir desde cero el panel admin + portal cliente completo (MVP funcional
con datos mockeados), siguiendo el "Urban Engineering Core" design system
(border-radius 0, Anton + JetBrains Mono, acento teal sobre fondo oscuro).

### ✅ Completado

**1. Capa de datos (mock, sin backend todavía)**
- `src/lib/admin/types.ts` — modelo de datos: `ClientProject`, `CommentEntry`,
  `AttachmentMeta`, `StageEvent`, etc.
- `src/lib/admin/stages.ts` — 5 etapas del proyecto (Briefing → Diseño →
  Desarrollo → Revisión → Entregado) con progreso asociado.
- `src/lib/admin/mock-data.ts` — 3 proyectos semilla (PB Inmobiliaria, Tu UTN,
  Grupo Astral) con historial de etapas y comentarios de ejemplo.
- `src/lib/admin/store.ts` — "backend" mock persistido en `localStorage`,
  con pub/sub (`useSyncExternalStore`) para reactividad y sincronización
  entre pestañas del mismo navegador vía el evento nativo `storage`.
  CRUD completo: crear/editar proyecto, cambiar etapa, cambiar estado,
  agregar comentarios, agregar adjuntos, eliminar proyecto.
- `src/lib/admin/auth.ts` — mock auth por contraseña fija en cliente
  (`sessionStorage`). **No es seguro, es solo gate de UI** (ver pendientes).
- `src/lib/admin/files.ts` — conversión de `File` a adjunto mockeado
  (dataURL inline si pesa <1.5MB, si no solo se guarda metadata).
- `src/lib/admin/portal-session.ts` — desbloqueo del portal por proyecto
  persistido en `sessionStorage`.
- `src/hooks/useAdminStore.ts` — hooks `useProjects()` / `useProject(id)`
  reactivos sobre el store.
- `src/hooks/useMounted.ts` — hook genérico (`useSyncExternalStore`) para
  leer estado del browser (window/sessionStorage) sin mismatch de hidratación
  y sin el anti-patrón de `setState` dentro de un `useEffect`.

**2. Panel Admin** (`/admin`, rutas fuera de `[locale]`, sin i18n)
- `/admin/login` — login mock.
- `/admin` — dashboard: grid de proyectos, filtro por estado
  (activo/pausado/completado), barra de progreso por etapa.
- `/admin/proyectos/nuevo` — alta de proyecto (cliente, título, resumen,
  fecha de entrega, presupuesto). Genera código de acceso automáticamente.
- `/admin/proyectos/[id]` — detalle: stepper de etapas interactivo (click
  para avanzar/retroceder etapa), selector de estado, ficha del cliente,
  panel de QR + link + código de acceso para compartir con el cliente,
  archivos del proyecto (subida + listado), hilo de comentarios con el
  cliente (con adjuntos), eliminar proyecto.

**3. Portal Cliente** (`/portal/[id]`, público vía link/QR, sin i18n)
- Gate de acceso por código (el mismo que ve el admin en el panel).
- Vista de estado: título, resumen, badge de estado, etapa actual,
  fecha de entrega, barra de progreso, stepper de etapas (solo lectura),
  archivos compartidos, hilo de comentarios (el cliente puede escribir y
  adjuntar archivos — quedan visibles para el admin en la misma sesión de
  `localStorage` del navegador).

**4. Componentes compartidos** (`src/components/admin/*`, reusados en portal)
- `StatusBadge`, `StageStepper` (interactivo/solo-lectura), `CommentThread`
  (chat con adjuntos, alineación por autor), `AttachmentList`, `QRPanel`
  (usa el paquete `qrcode`, agregado como dependencia nueva).

**5. Infra**
- `src/middleware.ts` — excluidas `/admin` y `/portal` del matcher de
  next-intl (no llevan prefijo de locale, son herramientas internas/portal).
- Dependencias nuevas: `qrcode`, `@types/qrcode`.

### 🔍 Verificado
- `npx tsc --noEmit` sin errores.
- `npx eslint` sin errores ni warnings en el código nuevo.
- `npm run build` compila y genera todas las rutas correctamente.
- Flujo E2E probado con Playwright headless contra `next start`:
  login admin → dashboard → detalle de proyecto → cambio de etapa →
  comentario admin → portal cliente → código incorrecto rechazado →
  código correcto → comentario cliente visible → persiste tras reload.

### ⚠️ Reglas Anti-Bloqueo aplicadas (mockeado, documentado)
- **Auth**: contraseña fija en cliente (`shiftstudio2026`, ver
  `src/lib/admin/auth.ts`). Sin esto no hay forma de "loguearse" sin backend.
  **Antes de producción: reemplazar por auth real** (NextAuth, o Supabase
  Auth, con sesión server-side).
- **DB**: no hay base de datos. Todo vive en `localStorage` del navegador
  (`src/lib/admin/store.ts`). Esto significa:
  - Los datos NO se comparten entre dispositivos (admin en su compu y
    cliente en su celular NO ven el mismo estado — cada uno tiene su propio
    `localStorage`).
  - "Tiempo real" hoy solo funciona entre pestañas del mismo navegador
    (evento `storage`), no es real-time real entre dispositivos.
  - Si el cliente borra datos del navegador, pierde el desbloqueo del
    portal (pero no el proyecto, que vive en el localStorage del admin).
- **Storage de archivos**: no hay backend de archivos. Los adjuntos <1.5MB
  se guardan como dataURL en localStorage (funciona pero no escala);
  los más grandes solo guardan metadata (nombre/tamaño), sin preview real.

### 📌 Próxima sesión — hacer EXACTAMENTE esto
1. **Backend real (prioridad más alta)**: reemplazar `src/lib/admin/store.ts`
   por llamadas a una API real. Sugerencia rápida sin infra propia: Supabase
   (Postgres + Auth + Storage) — resolvería DB, auth y archivos en un solo
   paso. Mantener la misma interfaz pública del store (mismas funciones
   exportadas: `getProject`, `createProject`, `setProjectStage`,
   `addComment`, `addAttachment`, etc.) para no tener que tocar los
   componentes de UI, solo la implementación interna.
2. **Real-time real**: con Supabase, usar `supabase.channel(...)` /
   Realtime Postgres Changes para que un comentario del cliente aparezca
   en el panel admin sin recargar (y viceversa), incluso en dispositivos
   distintos.
3. **Notificaciones**: avisar por WhatsApp/email cuando el cliente comenta
   o cuando el admin cambia de etapa (reusar `src/lib/whatsapp.ts` ya
   existente en el proyecto para el link de WhatsApp).
4. **Edición de proyecto existente**: hoy se puede crear y ver, pero no
   editar título/resumen/cliente/presupuesto de un proyecto ya creado
   (solo etapa/estado/comentarios/adjuntos). Agregar un modo "editar" en
   `/admin/proyectos/[id]`.
5. Pulir: reemplazar `<img>` por `next/image` donde tenga sentido (el QR
   ya quedó con `<img>` + eslint-disable porque es una dataURL generada en
   cliente, no vale la pena `next/image` ahí — pero si se listan attachments
   tipo imagen con preview, sí conviene).

### 💡 Autosugerencias para sesiones futuras
- Vista de "actividad reciente" en el dashboard admin (últimos comentarios
  de todos los proyectos, ordenados por fecha).
- Exportar el detalle de un proyecto a PDF para mandarlo por mail.
- Modo oscuro/claro ya está resuelto (todo el panel es oscuro por diseño),
  pero si se pide una versión "print-friendly" del portal cliente, considerar
  una hoja de estilos alternativa.
- Límite de tamaño de archivo configurable + aviso visual claro cuando un
  archivo queda "sin preview" por ser mayor a 1.5MB (hoy queda implícito).
