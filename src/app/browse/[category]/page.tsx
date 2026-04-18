"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils";

type Category = "savoury" | "sweet";

export default function BrowsePage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string) === "sweet" ? "sweet" : "savoury";

  const flavours = useQuery(api.flavours.byCategory, { category });
  const makers = useQuery(api.makers.list);

  function switchCategory(cat: Category) {
    router.push(`/browse/${cat}`);
  }

  return (
    <>
      <Header />
      <PageContainer>
        {/* Category toggle */}
        <div className="mb-10 flex justify-center">
          <div className="flex rounded-full border border-border-warm bg-shelf-wood p-1">
            {(["savoury", "sweet"] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => switchCategory(cat)}
                className={cn(
                  "rounded-full px-8 py-2.5 text-sm font-bold capitalize transition-colors",
                  category === cat
                    ? "bg-konbini-red text-white shadow-sm"
                    : "text-nori-light hover:text-nori"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Browse by Flavour */}
        <section className="mb-12">
          <h2 className="mb-5 font-display text-2xl text-nori">Browse by Flavour</h2>
          {flavours === undefined ? (
            <p className="text-nori-light">Loading…</p>
          ) : flavours.length === 0 ? (
            <p className="text-nori-light">No flavours yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {flavours.map((f) => (
                <Link
                  key={f._id}
                  href={`/browse/${category}/flavour/${f.slug}`}
                  className="flex items-center gap-2 rounded-full border border-border-warm bg-white px-5 py-2.5 text-sm font-semibold text-nori transition-colors hover:border-konbini-red hover:bg-konbini-red hover:text-white"
                >
                  {f.iconEmoji && <span>{f.iconEmoji}</span>}
                  {f.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Browse by Maker */}
        <section>
          <h2 className="mb-5 font-display text-2xl text-nori">Browse by Maker</h2>
          {makers === undefined ? (
            <p className="text-nori-light">Loading…</p>
          ) : makers.length === 0 ? (
            <p className="text-nori-light">No makers yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {makers.map((m) => (
                <Link
                  key={m._id}
                  href={`/browse/${category}/maker/${m.slug}`}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border-warm bg-white p-4 text-center transition-all hover:border-konbini-red hover:shadow-md"
                >
                  <div className="text-2xl">🏭</div>
                  <p className="text-sm font-bold text-nori">{m.name}</p>
                  <p className="text-xs text-nori-light">{m.country}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </PageContainer>
      <Footer />
    </>
  );
}
