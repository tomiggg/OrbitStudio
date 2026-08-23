import type { Metadata } from "next";
import { ProjectStatusView } from "@/components/portal/ProjectStatusView";

export const metadata: Metadata = { title: "Portal cliente — Shift Studio" };

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectStatusView id={id} />;
}
