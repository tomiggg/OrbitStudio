import { getRepository } from "@/lib/admin/repository";
import { DashboardView } from "./DashboardView";

export default async function AdminDashboardPage() {
  const projects = await getRepository().list();
  return <DashboardView initialProjects={projects} />;
}
