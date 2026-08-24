import { AdminCard, AdminLabel } from "@/components/admin/ui/AdminPrimitives";
import { jakarta } from "@/components/admin/fonts";

export function StatTile({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <AdminCard className="flex flex-col gap-2 p-4">
      <AdminLabel>{label}</AdminLabel>
      <p
        className={`${jakarta.className} text-4xl tracking-[-0.02em] text-white`}
        style={{ textTransform: "none" }}
      >
        {value}
      </p>
      {sublabel && <p className="text-xs text-white/50">{sublabel}</p>}
    </AdminCard>
  );
}
