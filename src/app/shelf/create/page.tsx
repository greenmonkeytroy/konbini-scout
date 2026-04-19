"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const MAX = 5;

export default function CreateShelfPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const myRatings = useQuery(
    api.ratings.myRatings,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );
  const allSnacks = useQuery(api.snacks.list);
  const createShelf = useMutation(api.shelves.create);

  const [selected, setSelected] = useState<Id<"snacks">[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  function toggle(id: Id<"snacks">) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < MAX ? [...prev, id] : prev
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title.trim() || selected.length !== MAX) return;
    setSaving(true);
    try {
      const { slug } = await createShelf({
        clerkId: user.id,
        title: title.trim(),
        description: description.trim() || undefined,
        snackIds: selected,
      });
      toast.success("Shelf created!");
      trackEvent("shelf_created");
      router.push(`/shelf/${slug}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to create shelf.");
    } finally {
      setSaving(false);
    }
  }

  // Build a deduplicated snack list — rated snacks first
  const ratedSnackIds = new Set(myRatings?.map((r) => r!.snack._id) ?? []);
  const ratedSnacks = myRatings?.map((r) => r!.snack) ?? [];
  const unratedSnacks = (allSnacks ?? [])
    .filter((s) => s.isPublished && !ratedSnackIds.has(s._id))
    .map((s) => ({ ...s, maker: null, illustrationUrl: null }));

  const snackList = [...ratedSnacks, ...unratedSnacks];

  if (!isLoaded) return null;

  if (!user) {
    return (
      <>
        <Header />
        <PageContainer className="flex flex-col items-center justify-center gap-4">
          <p className="text-nori">Sign in to create a shelf.</p>
          <Link href="/" className="text-sm font-semibold text-konbini-red hover:underline">← Home</Link>
        </PageContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <Link
          href="/shelf/my"
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-nori-light transition-colors hover:text-nori"
        >
          <ChevronLeft size={16} />
          My Shelves
        </Link>

        <h1 className="mb-2 font-display text-3xl text-nori">Create a Shelf</h1>
        <p className="mb-8 text-nori-light">Pick exactly 5 snacks, give it a name, share the link.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Shelf details */}
          <div className="space-y-4 rounded-xl border border-border-warm bg-white p-6">
            <div>
              <label className="mb-1 block text-sm font-semibold text-nori">Shelf Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Troy's Spicy Picks"
                required
                maxLength={60}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-nori">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what this shelf is about… (optional)"
                maxLength={140}
              />
            </div>
          </div>

          {/* Snack picker */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-nori">Pick Your 5</h2>
              <span className={cn(
                "text-sm font-bold tabular-nums",
                selected.length === MAX ? "text-matcha" : "text-nori-light"
              )}>
                {selected.length} / {MAX}
              </span>
            </div>

            {snackList.length === 0 ? (
              <p className="text-nori-light">Loading snacks…</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {snackList.map((snack) => {
                  const isSelected = selected.includes(snack._id as Id<"snacks">);
                  const isDisabled = !isSelected && selected.length >= MAX;
                  return (
                    <button
                      key={snack._id}
                      type="button"
                      onClick={() => toggle(snack._id as Id<"snacks">)}
                      disabled={isDisabled}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
                        isSelected
                          ? "border-konbini-red bg-konbini-red/5 shadow-sm"
                          : isDisabled
                          ? "cursor-not-allowed border-border-warm opacity-40"
                          : "border-border-warm bg-white hover:border-konbini-red hover:shadow-sm"
                      )}
                    >
                      {isSelected && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-konbini-red text-white">
                          <Check size={12} />
                        </span>
                      )}
                      <div className="relative h-16 w-full">
                        {snack.illustrationUrl ? (
                          <Image
                            src={snack.illustrationUrl}
                            alt={snack.name}
                            fill
                            className="object-contain"
                            sizes="120px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-3xl">🍡</div>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs font-bold text-nori">{snack.name}</p>
                      {"maker" in snack && snack.maker && (
                        <p className="text-xs text-nori-light">{snack.maker.name}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving || selected.length !== MAX || !title.trim()}>
              {saving ? "Creating…" : "Create Shelf"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </PageContainer>
      <Footer />
    </>
  );
}
