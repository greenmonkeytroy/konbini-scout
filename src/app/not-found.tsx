import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <>
      <Header />
      <PageContainer className="flex flex-col items-center justify-center gap-6 text-center">
        <p className="font-display text-7xl text-konbini-red">404</p>
        <p className="max-w-sm text-lg text-nori">
          That page got eaten. Let&apos;s find you some snacks.
        </p>
        <Link
          href="/"
          className="rounded-md bg-konbini-red px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark"
        >
          Back to the shelf
        </Link>
      </PageContainer>
      <Footer />
    </>
  );
}
