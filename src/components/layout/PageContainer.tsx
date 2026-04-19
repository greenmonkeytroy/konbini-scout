import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Remove default horizontal padding (e.g. for full-bleed sections) */
  noPadding?: boolean;
}

export default function PageContainer({
  children,
  className,
  noPadding = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1200px] flex-1",
        !noPadding && "px-4 py-4 sm:px-6 sm:py-6",
        className
      )}
    >
      {children}
    </main>
  );
}
