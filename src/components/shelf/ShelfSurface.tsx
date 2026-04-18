import { cn } from "@/lib/utils";

interface ShelfSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

export function ShelfSurface({ children, className }: ShelfSurfaceProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Items container */}
      <div
        className={cn(
          "relative z-10 flex gap-4 px-6 pt-4 pb-2",
          /* Mobile: horizontal scroll with snap */
          "overflow-x-auto snap-x snap-mandatory scroll-smooth",
          /* Desktop: evenly spaced row */
          "sm:justify-center sm:overflow-visible",
          /* Hide scrollbar visually but keep functional */
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}
      >
        {children}
      </div>

      {/* Shelf plank */}
      <div
        className="relative h-5 w-full rounded-md"
        style={{
          background:
            "linear-gradient(180deg, #C9B99A 0%, #B8A882 30%, #A89570 60%, #C9B99A 100%)",
          boxShadow: "0 4px 12px rgba(45, 42, 38, 0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
        aria-hidden="true"
      >
        {/* Wood grain overlay */}
        <div
          className="absolute inset-0 rounded-md opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(45,42,38,0.08) 40px, rgba(45,42,38,0.08) 41px)",
          }}
        />
      </div>

      {/* Shelf shadow below plank */}
      <div
        className="h-2 w-full rounded-b-sm opacity-30"
        style={{
          background: "linear-gradient(180deg, rgba(45,42,38,0.25) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
