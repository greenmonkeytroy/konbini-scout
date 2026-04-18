import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-shelf-wood p-6 shadow-card",
        interactive && "cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-elevated",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
