import Image from "next/image";
import { cn } from "@/lib/utils";

type LuckyCatState = "happy" | "neutral" | "grumpy";

interface LuckyCatProps {
  state: LuckyCatState;
  active?: boolean;
  size?: number;
  className?: string;
  /** Accessible label override */
  label?: string;
}

const stateConfig: Record<LuckyCatState, { src: string; label: string }> = {
  happy: { src: "/lucky-cats/happy.svg", label: "happy lucky cat" },
  neutral: { src: "/lucky-cats/neutral.svg", label: "neutral lucky cat" },
  grumpy: { src: "/lucky-cats/grumpy.svg", label: "grumpy lucky cat" },
};

export function LuckyCat({
  state,
  active = true,
  size = 32,
  className,
  label,
}: LuckyCatProps) {
  const config = stateConfig[state];

  return (
    <span
      className={cn(
        "inline-block transition-opacity duration-200",
        !active && "opacity-30 grayscale",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={config.src}
        alt={label ?? config.label}
        width={size}
        height={size}
        className="h-full w-full"
      />
    </span>
  );
}
