import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { CaseLayout } from "@/components/home/projects/CaseLayout";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProjectCasePage({ params }: PageProps) {
  const { id } = await params;

  const project = PROJECTS.find((p) => p.id === id);

  // 404 real si no existe o no tiene case
  if (!project?.case) return notFound();

  const c = project.case;

  return (
    <CaseLayout
      eyebrow={`Caso real · ${c.client}`}
      title={project.title}
      heroTag={project.serviceTag}
      subtitle={project.description}
      externalUrl={c.externalUrl}
      blocks={[
        { label: "Contexto", content: <p>{c.context}</p> },
        { label: "Problema", content: <p>{c.problem}</p> },
        {
          label: "Enfoque",
          content: (
            <ul className="grid gap-2">
              {c.approach.map((x) => (
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
              {c.solution.map((x) => (
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
        items: c.results,
      }}
    />
  );
}