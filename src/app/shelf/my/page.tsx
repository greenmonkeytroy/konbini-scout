"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";

export default function MyShelves() {
  const { user, isLoaded } = useUser();
  const shelves = useQuery(
    api.shelves.myList,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );
  const remove = useMutation(api.shelves.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<"sharedShelves">, title: string) {
    if (!user || !confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await remove({ clerkId: user.id, id });
      toast.success("Shelf deleted.");
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  }

  if (!isLoaded) return null;

  if (!user) {
    return (
      <>
        <Header />
        <PageContainer className="flex flex-col items-center justify-center gap-4">
          <p className="text-nori">Sign in to see your shelves.</p>
        </PageContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-nori">My Shelves</h1>
            <p className="mt-1 text-sm text-nori-light">Your curated collections of 5</p>
          </div>
          <Link
            href="/shelf/create"
            className="inline-flex items-center gap-2 rounded-md bg-konbini-red px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark"
          >
            <Plus size={16} />
            New Shelf
          </Link>
        </div>

        {shelves === undefined ? (
          <p className="text-nori-light">Loading…</p>
        ) : shelves.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border-warm py-16 text-center">
            <p className="text-lg font-semibold text-nori">No shelves yet</p>
            <p className="text-sm text-nori-light">Create your first shelf of 5 snacks</p>
            <Link
              href="/shelf/create"
              className="inline-flex items-center gap-2 rounded-md bg-konbini-red px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark"
            >
              <Plus size={16} />
              Create a Shelf
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shelves.map((shelf) => (
              <div
                key={shelf._id}
                className="flex flex-col rounded-xl border border-border-warm bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Preview snack thumbnails */}
                <div className="flex h-24 items-center justify-center gap-2 rounded-t-xl bg-shelf-wood px-4">
                  {shelf.previewSnacks.map((snack, i) =>
                    snack ? (
                      <div key={i} className="relative h-16 w-14 shrink-0">
                        {snack.illustrationUrl ? (
                          <Image
                            src={snack.illustrationUrl}
                            alt={snack.name}
                            fill
                            className="object-contain drop-shadow-sm"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl">🍡</div>
                        )}
                      </div>
                    ) : null
                  )}
                  {shelf.snackIds.length > 3 && (
                    <span className="text-xs font-semibold text-nori-light">
                      +{shelf.snackIds.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h2 className="font-bold text-nori">{shelf.title}</h2>
                    {shelf.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-nori-light">{shelf.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-nori-light">
                    <Eye size={13} />
                    {shelf.viewCount.toLocaleString()} views
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <Link
                      href={`/shelf/${shelf.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border-warm px-3 py-2 text-xs font-semibold text-nori transition-colors hover:border-konbini-red hover:text-konbini-red"
                    >
                      <ExternalLink size={12} />
                      View Shelf
                    </Link>
                    <button
                      onClick={() => handleDelete(shelf._id, shelf.title)}
                      disabled={deleting === shelf._id}
                      className="rounded-md border border-border-warm p-2 text-nori-light transition-colors hover:border-red-300 hover:text-red-500 disabled:opacity-50"
                      aria-label="Delete shelf"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
      <Footer />
    </>
  );
}
