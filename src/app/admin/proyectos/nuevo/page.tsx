import type { Metadata } from "next";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { NewProjectForm } from "@/components/admin/NewProjectForm";

export const metadata: Metadata = { title: "Nuevo proyecto — Panel Shift Studio" };

export default function NewProjectPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <NewProjectForm />
      </AdminShell>
    </RequireAuth>
  );
}
