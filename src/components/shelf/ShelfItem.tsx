import Image from "next/image";
import Link from "next/link";
import { LuckyCatRating } from "@/components/rating/LuckyCatRating";

interface ShelfItemProps {
  snack: {
    _id: string;
    name: string;
    slug: string;
    averageRating: number;
    totalRatings: number;
    illustrationUrl?: string | null;
    photoUrl?: string | null;
    maker?: { name: string } | null;
  };
}

export function ShelfItem({ snack }: ShelfItemProps) {
  const imageUrl = snack.illustrationUrl ?? snack.photoUrl;

  return (
    <Link
      href={`/snack/${snack.slug}`}
      className="group flex w-36 shrink-0 snap-center flex-col items-center gap-2 sm:w-44"
    >
      {/* Snack image */}
      <div className="relative flex h-36 w-full items-end justify-center sm:h-44">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={snack.name}
            fill
            className="object-contain drop-shadow-md transition-transform duration-300 group-hover:-translate-y-2"
            sizes="(max-width: 640px) 144px, 176px"
          />
        ) : (
          <div className="flex h-32 w-24 items-center justify-center rounded-md bg-shelf-wood text-4xl transition-transform duration-300 group-hover:-translate-y-2">
            🍡
          </div>
        )}
      </div>

      {/* Info below shelf line */}
      <div className="w-full text-center">
        <p className="line-clamp-2 text-xs font-bold leading-tight text-nori group-hover:text-konbini-red sm:text-sm">
          {snack.name}
        </p>
        {snack.maker && (
          <p className="mt-0.5 text-xs text-nori-light">{snack.maker.name}</p>
        )}
        {snack.totalRatings > 0 && (
          <div className="mt-1 flex justify-center">
            <LuckyCatRating score={snack.averageRating} size={14} />
          </div>
        )}
      </div>
    </Link>
  );
}
