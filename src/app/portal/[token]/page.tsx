import { notFound } from "next/navigation";
import { getRepository, toPublicProject } from "@/lib/admin/repository";
import { PortalView } from "./PortalView";

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const project = await getRepository().getByToken(token);
  if (!project) {
    notFound();
  }
  return <PortalView token={token} initialProject={toPublicProject(project)} />;
}
