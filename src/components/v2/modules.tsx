/*
 * Piezas del "caos → sistema".
 *
 * Cada pieza tiene dos caras:
 *   - Raw: el artefacto real con el que trabaja una pyme hoy (un WhatsApp, una
 *     planilla con errores, un post-it, una factura que vence…). Colores y
 *     formas propios de cada uno: a propósito no combinan entre sí.
 *   - Module: lo mismo convertido en una parte del sistema, con un solo
 *     lenguaje visual (tarjeta blanca, tipografía y acento de la marca).
 * El hero las anima de una cara a la otra; Servicios reutiliza los módulos.
 * Son ilustraciones: sin logos ni marcas de terceros.
 */

export type PieceId =
  | "pedidos"
  | "stock"
  | "tareas"
  | "facturas"
  | "catalogo"
  | "marca"
  | "agenda"
  | "cobros";

/* ───────────────────────── Raw ───────────────────────── */

export function Raw({ id }: { id: PieceId }) {
  switch (id) {
    case "pedidos":
      return (
        <div className="raw raw-wa">
          <span className="raw-wa-b">¿Te quedó el talle M en negro?</span>
          <span className="raw-wa-b">te pago por transferencia</span>
          <span className="raw-wa-t">22:47</span>
        </div>
      );
    case "stock":
      return (
        <div className="raw raw-xls">
          <span className="raw-xls-h">stock_FINAL_v3 (2).xlsx</span>
          <span className="raw-xls-g">
            {["Remera", "12", "#¡REF!", "Buzo", "??", "4", "Jean", "0", "=B3*", "Gorra", "7", ""].map((c, i) => (
              <i key={i} className={c.startsWith("#") || c === "??" ? "err" : undefined}>
                {c}
              </i>
            ))}
          </span>
        </div>
      );
    case "tareas":
      return (
        <div className="raw raw-post">
          <span>Llamar al contador!!</span>
          <span>y pasarle los tickets</span>
        </div>
      );
    case "facturas":
      return (
        <div className="raw raw-inv">
          <span className="raw-inv-h">Factura C</span>
          <span className="raw-inv-n">0004-00001289</span>
          <span className="raw-inv-l" />
          <span className="raw-inv-l s" />
          <span className="raw-inv-tot">$ 84.700</span>
          <span className="raw-inv-st">Vence hoy</span>
        </div>
      );
    case "catalogo":
      return (
        <div className="raw raw-dm">
          <span className="raw-dm-h">
            <i />
            usuario_2381
          </span>
          <span className="raw-dm-b">precio?</span>
          <span className="raw-dm-b">precio??</span>
          <span className="raw-dm-b">hay envíos?</span>
        </div>
      );
    case "marca":
      return (
        <div className="raw raw-logo">
          <span className="raw-logo-f">logo_final2.jpg</span>
          <span className="raw-logo-w">TU MARCA</span>
        </div>
      );
    case "agenda":
      return (
        <div className="raw raw-cal">
          <span className="raw-cal-h">Martes</span>
          <span>turno 15 hs ??</span>
          <span className="x">Martín</span>
          <span>¿o era Martina?</span>
        </div>
      );
    case "cobros":
      return (
        <div className="raw raw-pay">
          <span className="raw-pay-h">Transferencia recibida</span>
          <span className="raw-pay-v">$ 35.000</span>
          <span className="raw-pay-q">¿De quién es?</span>
        </div>
      );
  }
}

/* ───────────────────────── Module ───────────────────────── */

const MODULES: Record<PieceId, { label: string; value: string }> = {
  pedidos: { label: "Pedidos", value: "12 nuevos" },
  stock: { label: "Stock", value: "Al día" },
  tareas: { label: "Tareas", value: "3 para hoy" },
  facturas: { label: "Facturación", value: "Automática" },
  catalogo: { label: "Catálogo", value: "48 productos" },
  marca: { label: "Marca", value: "Un sistema" },
  agenda: { label: "Agenda", value: "8 turnos" },
  cobros: { label: "Cobros", value: "Conciliados" },
};

function Viz({ id }: { id: PieceId }) {
  switch (id) {
    case "pedidos":
      return (
        <span className="mv-rows">
          {["Talle M negro", "Buzo gris", "Jean 42"].map((t, i) => (
            <span key={t}>
              <i>{t}</i>
              <b className={i === 0 ? "on" : undefined}>{i === 0 ? "Listo" : "En curso"}</b>
            </span>
          ))}
        </span>
      );
    case "stock":
      return (
        <span className="mv-bars">
          {[46, 70, 38, 86, 58].map((h, i) => (
            <i key={i} className={i === 3 ? "on" : undefined} style={{ height: `${h}%` }} />
          ))}
        </span>
      );
    case "tareas":
      return (
        <span className="mv-checks">
          {["Enviar tickets al contador", "Revisar pedidos", "Subir fotos nuevas"].map((t, i) => (
            <span key={t} className={i === 0 ? "on" : undefined}>
              <i />
              {t}
            </span>
          ))}
        </span>
      );
    case "facturas":
      return (
        <span className="mv-inv">
          <span>
            <i>0004-00001289</i>
            <b>$ 84.700</b>
          </span>
          <em>Emitida y enviada</em>
        </span>
      );
    case "catalogo":
      return (
        <span className="mv-grid">
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <i key={k} className={k === 1 ? "on" : undefined} />
          ))}
        </span>
      );
    case "marca":
      return (
        <span className="mv-brand">
          <b>Tu marca</b>
          <span>
            <i />
            <i />
            <i />
          </span>
        </span>
      );
    case "agenda":
      return (
        <span className="mv-time">
          {[
            [0, 30],
            [36, 22],
            [64, 28],
          ].map(([l, w], i) => (
            <i key={i} className={i === 1 ? "on" : undefined} style={{ left: `${l}%`, width: `${w}%` }} />
          ))}
        </span>
      );
    case "cobros":
      return (
        <span className="mv-pay">
          <span>
            <i>Martina G.</i>
            <b>$ 35.000</b>
          </span>
          <em>Pedido #1043</em>
        </span>
      );
  }
}

export function Module({ id }: { id: PieceId }) {
  const m = MODULES[id];
  return (
    <div className="mod">
      <span className="mod-l">{m.label}</span>
      <span className="mod-v">{m.value}</span>
      <span className="mod-viz">
        <Viz id={id} />
      </span>
    </div>
  );
}
