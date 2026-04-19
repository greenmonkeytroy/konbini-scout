import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-border-warm bg-shelf-wood py-4",
        className
      )}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <p className="text-center text-sm text-nori-light">
          <span className="font-display text-base text-nori">Konbini Scout</span>
          <span className="mx-3 opacity-40">·</span>
          Scout the shelf. Find your five.
        </p>
      </div>
    </footer>
  );
}
