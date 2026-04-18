import { ShelfSurface } from "./ShelfSurface";
import { ShelfItem } from "./ShelfItem";

interface ShelfSnack {
  _id: string;
  name: string;
  slug: string;
  averageRating: number;
  totalRatings: number;
  illustrationUrl?: string | null;
  photoUrl?: string | null;
  maker?: { name: string } | null;
}

interface ShelfDisplayProps {
  snacks: ShelfSnack[];
  emptyMessage?: string;
}

export function ShelfDisplay({ snacks, emptyMessage = "No snacks yet." }: ShelfDisplayProps) {
  if (snacks.length === 0) {
    return (
      <div className="rounded-lg border border-border-warm bg-shelf-wood px-6 py-12 text-center">
        <p className="text-nori-light">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ShelfSurface>
      {snacks.map((snack) => (
        <ShelfItem key={snack._id} snack={snack} />
      ))}
    </ShelfSurface>
  );
}
