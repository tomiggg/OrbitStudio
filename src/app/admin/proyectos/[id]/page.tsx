import type { Metadata } from "next";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectDetailAdmin } from "@/components/admin/ProjectDetailAdmin";

export const metadata: Metadata = { title: "Proyecto — Panel Shift Studio" };

export default async function AdminProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RequireAuth>
      <AdminShell>
        <ProjectDetailAdmin id={id} />
      </AdminShell>
    </RequireAuth>
  );
}
