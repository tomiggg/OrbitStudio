import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { jakarta } from "@/components/admin/fonts";

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--sky)]/15 bg-[var(--ink-2)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono uppercase tracking-widest text-[10px] text-[var(--sky)]">
      {children}
    </span>
  );
}

type ButtonVariant = "primary" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--sky)] text-[var(--ink)] hover:bg-white",
  ghost:
    "border border-[var(--sky)]/50 text-[var(--sky)] hover:bg-[var(--sky)]/10",
  danger:
    "border border-[#c2453a]/50 text-[#c2453a] hover:bg-[#c2453a]/10",
};

export function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`rounded-full font-mono uppercase tracking-widest text-[11px] px-5 py-2.5 transition disabled:opacity-40 disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[var(--sky)]/20 bg-[var(--ink)] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[var(--sky)] ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-[var(--sky)]/20 bg-[var(--ink)] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[var(--sky)] ${props.className ?? ""}`}
    />
  );
}

export function AdminBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[var(--sky)] px-2.5 py-1 font-mono uppercase tracking-widest text-[9px] text-[var(--sky)]">
      {children}
    </span>
  );
}

export function AdminSkeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />;
}

const AVATAR_PALETTE = [
  { bg: "var(--sky)", fg: "var(--ink)" },
  { bg: "var(--ink)", fg: "var(--sky)" },
];

// Circular initial avatar — eco directo de los íconos redondos con inicial
// que usa FeaturedProjects.tsx en el home (36px, 50% radius, Plus Jakarta
// Sans 800). Alterna paleta según el string para que proyectos distintos
// no se vean todos idénticos.
export function AdminAvatar({
  label,
  size = 36,
}: {
  label: string;
  size?: number;
}) {
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = (hash + label.charCodeAt(i)) % AVATAR_PALETTE.length;
  const { bg, fg } = AVATAR_PALETTE[hash];

  return (
    <span
      className={`${jakarta.className} inline-flex shrink-0 items-center justify-center rounded-full`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: bg,
        color: fg,
      }}
    >
      {initial}
    </span>
  );
}
