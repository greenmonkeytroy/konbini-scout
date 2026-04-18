"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import { LuckyCatRating } from "@/components/rating/LuckyCatRating";
import { LuckyCatInput } from "@/components/rating/LuckyCatInput";

export default function SnackDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, isLoaded } = useUser();

  const snack = useQuery(api.snacks.bySlug, { slug });
  const myRating = useQuery(
    api.ratings.myRating,
    isLoaded && user && snack ? { clerkId: user.id, snackId: snack._id } : "skip"
  );
  const rate = useMutation(api.ratings.rate);

  const [pendingScore, setPendingScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const currentScore = pendingScore || myRating?.score || 0;

  async function handleRate(score: number) {
    if (!user) {
      toast.error("Sign in to rate snacks.");
      return;
    }
    if (!snack) return;
    setPendingScore(score);
    setSaving(true);
    try {
      await rate({ clerkId: user.id, snackId: snack._id, score });
      toast.success("Rating saved!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save rating.");
      setPendingScore(0);
    } finally {
      setSaving(false);
    }
  }

  if (snack === undefined) {
    return (
      <>
        <Header />
        <PageContainer className="flex items-center justify-center">
          <p className="text-nori-light">Loading…</p>
        </PageContainer>
        <Footer />
      </>
    );
  }

  if (snack === null) {
    return (
      <>
        <Header />
        <PageContainer>
          <p className="text-nori-light">Snack not found.</p>
          <Link href="/browse/savoury" className="mt-4 inline-block text-sm font-semibold text-konbini-red hover:underline">
            ← Browse snacks
          </Link>
        </PageContainer>
        <Footer />
      </>
    );
  }

  const imageUrl = snack.illustrationUrl ?? snack.photoUrl;
  const category = snack.category;

  return (
    <>
      <Header />
      <PageContainer>
        {/* Back */}
        <Link
          href={`/browse/${category}`}
          className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-nori-light transition-colors hover:text-nori"
        >
          <ChevronLeft size={16} />
          Browse {category}
        </Link>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Image */}
          <div className="flex items-center justify-center rounded-xl bg-shelf-wood p-8">
            {imageUrl ? (
              <div className="relative h-72 w-full">
                <Image
                  src={imageUrl}
                  alt={snack.name}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center text-8xl">🍡</div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Maker + category */}
            <div className="mb-2 flex items-center gap-2">
              {snack.maker && (
                <span className="text-sm font-semibold text-nori-light">{snack.maker.name}</span>
              )}
              <span className="rounded-full bg-shelf-wood px-2.5 py-0.5 text-xs font-semibold capitalize text-nori-light">
                {snack.category}
              </span>
            </div>

            <h1 className="mb-4 font-display text-3xl text-nori sm:text-4xl">{snack.name}</h1>

            {/* Community rating */}
            {snack.totalRatings > 0 && (
              <div className="mb-6">
                <LuckyCatRating
                  score={snack.averageRating}
                  total={snack.totalRatings}
                  size={32}
                  showCount
                />
              </div>
            )}

            {/* Flavour tags */}
            {snack.flavours && snack.flavours.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {snack.flavours.map((f) =>
                  f ? (
                    <span
                      key={f._id}
                      className="rounded-full border border-border-warm bg-white px-3 py-1 text-xs font-semibold text-nori"
                    >
                      {f.iconEmoji} {f.name}
                    </span>
                  ) : null
                )}
              </div>
            )}

            {/* Description */}
            {snack.description && (
              <p className="mb-4 leading-relaxed text-nori">{snack.description}</p>
            )}

            {/* Flavour notes */}
            {snack.flavourNotes && (
              <p className="mb-8 text-sm italic text-nori-light">{snack.flavourNotes}</p>
            )}

            {/* Rating input */}
            <div className="rounded-xl border border-border-warm bg-shelf-wood p-6">
              <p className="mb-4 font-display text-lg text-nori">
                {myRating ? "Your rating" : "Rate this snack"}
              </p>
              {isLoaded && !user ? (
                <p className="text-sm text-nori-light">Sign in to rate snacks.</p>
              ) : (
                <LuckyCatInput
                  value={currentScore}
                  onChange={handleRate}
                  disabled={saving}
                />
              )}
              {currentScore > 0 && (
                <p className="mt-3 text-xs text-nori-light">
                  You rated this {currentScore}/5 cats
                </p>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
