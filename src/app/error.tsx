"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <PageContainer className="flex flex-col items-center justify-center gap-6 text-center">
        <p className="font-display text-5xl text-konbini-red">Oops.</p>
        <p className="max-w-sm text-lg text-nori">Something went sideways. Give it another try?</p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-konbini-red px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-border-warm px-6 py-2.5 text-sm font-bold text-nori transition-colors hover:bg-shelf-wood"
          >
            Home
          </Link>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
