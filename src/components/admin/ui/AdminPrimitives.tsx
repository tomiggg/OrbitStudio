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
      className={`border border-[var(--teal)]/30 bg-[#0a3634] ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono uppercase tracking-widest text-[10px] text-[var(--teal)]">
      {children}
    </span>
  );
}

type ButtonVariant = "primary" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--teal)] text-[var(--dark)] hover:bg-white",
  ghost:
    "border border-[var(--teal)]/50 text-[var(--teal)] hover:bg-[var(--teal)]/10",
  danger:
    "border border-red-500/50 text-red-400 hover:bg-red-500/10",
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
      className={`w-full rounded-none border border-[var(--teal)]/30 bg-[#052221] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--teal)] ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-none border border-[var(--teal)]/30 bg-[#052221] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--teal)] ${props.className ?? ""}`}
    />
  );
}

export function AdminBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-none border border-[var(--teal)] px-2 py-1 font-mono uppercase tracking-widest text-[9px] text-[var(--teal)]">
      {children}
    </span>
  );
}
