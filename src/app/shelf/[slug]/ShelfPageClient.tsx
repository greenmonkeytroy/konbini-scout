"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Share2, Eye, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import { ShelfDisplay } from "@/components/shelf/ShelfDisplay";

export default function ShelfPageClient({ slug }: { slug: string }) {
  const shelf = useQuery(api.shelves.bySlug, { slug });
  const incrementViews = useMutation(api.shelves.incrementViews);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shelf) {
      incrementViews({ id: shelf._id });
      trackEvent("shelf_viewed", { slug });
    }
  }, [shelf?._id]);

  async function handleShare() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      trackEvent("shelf_link_copied", { slug });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — try manually copying the URL.");
    }
  }

  if (shelf === undefined) {
    return (
      <>
        <Header />
        <PageContainer className="flex items-center justify-center">
          <p className="text-nori-light">Loading shelf…</p>
        </PageContainer>
        <Footer />
      </>
    );
  }

  if (shelf === null) {
    return (
      <>
        <Header />
        <PageContainer>
          <p className="mb-4 text-nori-light">That shelf doesn't exist. Maybe it was a limited edition?</p>
          <Link href="/browse/savoury" className="text-sm font-semibold text-konbini-red hover:underline">
            ← Browse snacks
          </Link>
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
          href="/browse/savoury"
          className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-nori-light transition-colors hover:text-nori"
        >
          <ChevronLeft size={16} />
          Browse
        </Link>

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl text-nori sm:text-4xl">{shelf.title}</h1>
            {shelf.creator && (
              <p className="mt-1 text-sm text-nori-light">by {shelf.creator.name}</p>
            )}
            {shelf.description && (
              <p className="mt-3 max-w-lg text-nori">{shelf.description}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {shelf.viewCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-nori-light">
                <Eye size={14} />
                {shelf.viewCount.toLocaleString()}
              </span>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-md border border-border-warm bg-white px-4 py-2 text-sm font-semibold text-nori transition-colors hover:border-konbini-red hover:text-konbini-red"
            >
              <Share2 size={15} />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        <div className="mb-12 mt-8">
          <ShelfDisplay snacks={shelf.snacks as any} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {shelf.snacks.map((snack, i) =>
            snack ? (
              <Link
                key={snack._id}
                href={`/snack/${snack.slug}`}
                className="group flex items-start gap-3 rounded-lg border border-border-warm bg-white p-4 transition-all hover:border-konbini-red hover:shadow-md lg:flex-col lg:items-center lg:text-center"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-konbini-red text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-nori group-hover:text-konbini-red">{snack.name}</p>
                  {snack.maker && (
                    <p className="text-xs text-nori-light">{snack.maker.name}</p>
                  )}
                </div>
              </Link>
            ) : null
          )}
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
