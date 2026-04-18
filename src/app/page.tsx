import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <PageContainer className="flex flex-col items-center justify-center text-center">
        <h1 className="mb-4 font-display text-4xl text-konbini-red sm:text-5xl">
          Konbini Scout
        </h1>
        <p className="mb-8 max-w-md text-lg text-nori-light">
          Scout the shelf. Find your five.
        </p>
        <div className="flex gap-4">
          <Link
            href="/browse/savoury"
            className="inline-flex items-center justify-center rounded-md bg-konbini-red px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-konbini-red-dark"
          >
            Browse Savoury
          </Link>
          <Link
            href="/browse/sweet"
            className="inline-flex items-center justify-center rounded-md border border-border-warm px-8 py-4 text-lg font-bold text-nori transition-colors hover:bg-shelf-wood"
          >
            Browse Sweet
          </Link>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
}
