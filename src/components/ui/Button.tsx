import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "no-underline hover:no-underline inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)]";

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--cta)] shadow-[0_8px_24px_rgba(0,89,84,0.14)] hover:bg-[color:var(--ctaHover)]",
  secondary:
    "border border-[color:var(--link)] bg-transparent text-[color:var(--link)] hover:bg-[color:rgba(93,193,185,0.10)]",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const style = variant === "primary" ? ({ color: "#fff" } as const) : undefined;

  return (
    <button type="button" className={cls} style={style} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: CommonProps & { href: string }) {
  const isExternal = /^https?:\/\//.test(href);
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const style = variant === "primary" ? ({ color: "#fff" } as const) : undefined;

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  );
}