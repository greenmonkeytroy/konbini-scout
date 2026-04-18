import { LuckyCat } from "./LuckyCat";

interface LuckyCatRatingProps {
  score: number;
  total?: number;
  size?: number;
  showCount?: boolean;
}

function catState(score: number): "happy" | "neutral" | "grumpy" {
  if (score >= 4) return "happy";
  if (score >= 3) return "neutral";
  return "grumpy";
}

export function LuckyCatRating({ score, total, size = 28, showCount = false }: LuckyCatRatingProps) {
  const filled = Math.round(score);
  const state = catState(score);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <LuckyCat key={i} state={state} active={i < filled} size={size} />
      ))}
      {showCount && total !== undefined && total > 0 && (
        <span className="ml-1.5 text-xs text-nori-light">({total})</span>
      )}
    </div>
  );
}
