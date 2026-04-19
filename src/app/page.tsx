"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import { ShelfDisplay } from "@/components/shelf/ShelfDisplay";

const HOW_IT_WORKS = [
  {
    step: "1",
    emoji: "🏪",
    title: "Browse the shelf",
    body: "Pick Savoury or Sweet, then explore by flavour or maker. Each shelf shows the top 5.",
  },
  {
    step: "2",
    emoji: "🐱",
    title: "Rate with lucky cats",
    body: "Tried one? Rate it 1–5 lucky cats. Your ratings build your personal Top 5 shelf.",
  },
  {
    step: "3",
    emoji: "📤",
    title: "Share your picks",
    body: "Curate any 5 snacks into a shelf and send the link to friends. No account needed to view.",
  },
];

export default function Home() {
  const savourySnacks = useQuery(api.snacks.topByCategory, { category: "savoury" });
  const sweetSnacks = useQuery(api.snacks.topByCategory, { category: "sweet" });

  const hasSavoury = savourySnacks && savourySnacks.length > 0;
  const hasSweet = sweetSnacks && sweetSnacks.length > 0;

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="border-b border-border-warm bg-rice-paper">
        <PageContainer className="py-8 text-center">
          <Image
            src="/konbini-logo.png"
            alt="Konbini Scout"
            width={440}
            height={440}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="mb-4 font-display text-2xl text-nori sm:text-3xl">
            Scout the shelf.<br />Find your five.
          </h1>
          <p className="mx-auto mb-5 max-w-md text-base text-nori-light">
            Your guide to the best Asian snacks you haven&apos;t tried yet. Browse by flavour, rate what you love, and share your top 5 with anyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/browse/savoury"
              className="inline-flex items-center gap-2 rounded-md bg-konbini-red px-8 py-4 text-base font-bold text-white transition-colors hover:bg-konbini-red-dark"
            >
              🧂 Browse Savoury
            </Link>
            <Link
              href="/browse/sweet"
              className="inline-flex items-center gap-2 rounded-md border border-border-warm bg-white px-8 py-4 text-base font-bold text-nori transition-colors hover:bg-shelf-wood"
            >
              🍬 Browse Sweet
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* ── Featured Shelves ── */}
      {(hasSavoury || hasSweet) && (
        <section className="border-b border-border-warm bg-rice-paper">
          <PageContainer className="py-8">
            <h2 className="mb-2 font-display text-2xl text-nori sm:text-3xl">
              What&apos;s on the shelf
            </h2>
            <p className="mb-6 text-nori-light">
              Top-rated picks from the Konbini Scout catalogue.
            </p>

            {hasSavoury && (
              <div className="mb-7">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-xl text-nori">🧂 Top Savoury</h3>
                  <Link
                    href="/browse/savoury"
                    className="text-sm font-semibold text-konbini-red hover:underline"
                  >
                    See all →
                  </Link>
                </div>
                <ShelfDisplay snacks={savourySnacks} />
              </div>
            )}

            {hasSweet && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-xl text-nori">🍬 Top Sweet</h3>
                  <Link
                    href="/browse/sweet"
                    className="text-sm font-semibold text-konbini-red hover:underline"
                  >
                    See all →
                  </Link>
                </div>
                <ShelfDisplay snacks={sweetSnacks} />
              </div>
            )}
          </PageContainer>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="bg-rice-paper">
        <PageContainer className="py-8">
          <h2 className="mb-2 font-display text-2xl text-nori sm:text-3xl">How it works</h2>
          <p className="mb-6 text-nori-light">Three steps from curious to obsessed.</p>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, emoji, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-konbini-red text-sm font-bold text-white">
                    {step}
                  </span>
                  <span className="text-2xl">{emoji}</span>
                </div>
                <h3 className="font-display text-lg text-nori">{title}</h3>
                <p className="text-sm leading-relaxed text-nori-light">{body}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <Footer />
    </>
  );
}
