"use client";

import { useEffect, useState } from "react";

// `toLocaleString`/`toLocaleDateString` dependen del motor ICU del entorno:
// el Node del servidor y el navegador del cliente pueden formatear la misma
// fecha con textos distintos (orden, ceros a la izquierda, am/pm). Como
// estas vistas ahora se renderizan server-side (ver repository.ts), eso
// dispara un hydration mismatch real que React "arregla" descartando y
// re-renderizando el subárbol — se ve como un flash en blanco.
// Por eso el primer render (server + primer paint del cliente) siempre
// muestra un formato fijo determinístico (no depende de locale/ICU), y
// recién después de montar se reemplaza por el formato lindo — ahí ya no
// hay nada que hidratar, es una actualización normal de estado.
function safeFallback(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export function ClientDate({
  iso,
  format,
  titleFormat,
  className,
}: {
  iso: string;
  format: (iso: string) => string;
  titleFormat?: (iso: string) => string;
  className?: string;
}) {
  const [state, setState] = useState<{ text: string; title?: string }>(() => ({
    text: safeFallback(iso),
  }));

  useEffect(() => {
    // Upgrade intencional post-mount (ver comentario de safeFallback arriba).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ text: format(iso), title: titleFormat?.(iso) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso]);

  return (
    <span className={className} title={state.title}>
      {state.text}
    </span>
  );
}
