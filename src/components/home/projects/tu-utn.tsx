"use client";

import { CaseLayout } from "@/components/home/projects/CaseLayout";
import { getProjectById } from "@/lib/projects";

export default function TuUtnCase() {
  const p = getProjectById("tu-utn");
  if (!p?.case) return null;

  return (
    <CaseLayout
      title={p.title}
      heroTag={p.serviceTag}
      subtitle="De una web oficial sin métricas ni desbloqueos a una app que te muestra progreso, correlativas y decisiones en segundos."
      externalUrl={p.case.externalUrl}
      blocks={[
        { label: "Contexto", content: <p>{p.case.context}</p> },
        { label: "Problema", content: <p>{p.case.problem}</p> },
        {
          label: "Enfoque",
          content: (
            <ul className="grid gap-2">
              {p.case.approach.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-[6px] h-[5px] w-[5px] rounded-full bg-[color:var(--link)]" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          ),
        },
        {
          label: "Solución",
          content: (
            <ul className="grid gap-2">
              {p.case.solution.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-[6px] h-[5px] w-[5px] rounded-full bg-[color:var(--link)]" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          ),
        },
      ]}
      highlights={{
        title: "Resultados",
        items: p.case.results,
      }}
    />
  );
}