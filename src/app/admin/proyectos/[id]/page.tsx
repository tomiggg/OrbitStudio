import { notFound } from "next/navigation";
import { getRepository } from "@/lib/admin/repository";
import { ProjectDetailView } from "./ProjectDetailView";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getRepository().getById(id);
  if (!project) {
    notFound();
  }
  return <ProjectDetailView id={id} initialProject={project} />;
}
