import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <PageContainer className="flex flex-col items-center justify-center text-center">
        <Image
          src="/konbini-logo.png"
          alt="Konbini Scout logo"
          width={360}
          height={360}
          className="mb-6"
          priority
        />
        <h1 className="mb-8 font-display text-konbini-red max-w-xs" style={{ fontSize: "1.725rem" }}>
          Scout the shelf. Find your five.
        </h1>
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
