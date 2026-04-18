import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface CategoryPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  /** Render as an anchor-like span (no button semantics) */
  asSpan?: boolean;
}

export function CategoryPill({
  active = false,
  asSpan = false,
  className,
  children,
  ...props
}: CategoryPillProps) {
  const styles = cn(
    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200",
    active
      ? "bg-konbini-red text-white"
      : "bg-shelf-wood text-nori hover:bg-border-warm",
    !asSpan && "cursor-pointer focus-visible:outline-2 focus-visible:outline-konbini-red",
    className
  );

  if (asSpan) {
    return (
      <span className={styles}>
        {children}
      </span>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
