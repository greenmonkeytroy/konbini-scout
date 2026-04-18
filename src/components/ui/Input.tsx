import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border bg-white px-4 py-3 text-base text-nori",
          "placeholder:text-nori-light",
          "transition-all duration-200",
          "focus:outline-none focus:border-konbini-red focus:ring-[3px] focus:ring-konbini-red/[.15]",
          error
            ? "border-konbini-red"
            : "border-border-warm hover:border-nori-light",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
