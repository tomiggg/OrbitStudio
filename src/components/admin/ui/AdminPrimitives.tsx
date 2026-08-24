import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-[var(--sky)]/30 bg-[var(--ink-2)] ${className}`}
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
      className={`font-mono uppercase tracking-widest text-[11px] px-4 py-2.5 rounded-none transition disabled:opacity-40 disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
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
      className={`w-full rounded-none border border-[var(--sky)]/30 bg-[var(--ink)] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--sky)] ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-none border border-[var(--sky)]/30 bg-[var(--ink)] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--sky)] ${props.className ?? ""}`}
    />
  );
}

export function AdminBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-none border border-[var(--sky)] px-2 py-1 font-mono uppercase tracking-widest text-[9px] text-[var(--sky)]">
      {children}
    </span>
  );
}

export function AdminSkeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/10 ${className}`} />;
}
