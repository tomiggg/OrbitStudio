"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton } from "@/components/admin/ui/AdminPrimitives";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <AdminButton variant="ghost" onClick={handleLogout} disabled={loading}>
      Cerrar sesión
    </AdminButton>
  );
}
