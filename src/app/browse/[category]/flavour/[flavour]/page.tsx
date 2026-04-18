"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import { ShelfDisplay } from "@/components/shelf/ShelfDisplay";

export default function FlavourShelfPage() {
  const params = useParams();
  const category = (params.category as string) === "sweet" ? "sweet" : "savoury";
  const flavourSlug = params.flavour as string;

  const flavour = useQuery(api.flavours.bySlug, { slug: flavourSlug });
  const snacks = useQuery(api.snacks.byFlavour, { category, flavourSlug });

  const title = flavour
    ? `${flavour.iconEmoji ? flavour.iconEmoji + " " : ""}${flavour.name}`
    : flavourSlug;

  return (
    <>
      <Header />
      <PageContainer>
        {/* Back */}
        <Link
          href={`/browse/${category}`}
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-nori-light transition-colors hover:text-nori"
        >
          <ChevronLeft size={16} />
          {category === "savoury" ? "Savoury" : "Sweet"}
        </Link>

        <h1 className="mb-2 font-display text-3xl text-nori capitalize">{title}</h1>
        <p className="mb-10 text-nori-light capitalize">
          Top {category} snacks · {snacks?.length ?? "…"} on the shelf
        </p>

        {snacks === undefined ? (
          <div className="py-12 text-center text-nori-light">Loading shelf…</div>
        ) : (
          <ShelfDisplay
            snacks={snacks}
            emptyMessage={`No ${category} ${flavour?.name ?? ""} snacks yet.`}
          />
        )}
      </PageContainer>
      <Footer />
    </>
  );
}
