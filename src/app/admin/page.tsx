import type { Metadata } from "next";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export const metadata: Metadata = { title: "Panel — Shift Studio" };

export default function AdminDashboardPage() {
  return (
    <RequireAuth>
      <AdminShell>
        <ProjectsTable />
      </AdminShell>
    </RequireAuth>
  );
}
