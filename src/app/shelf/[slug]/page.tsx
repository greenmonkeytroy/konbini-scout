import { type Metadata } from "next";
import ShelfPageClient from "./ShelfPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const ogUrl = `${appUrl}/api/og?shelf=${slug}`;

  return {
    openGraph: {
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl],
    },
  };
}

export default async function ShelfPage({ params }: Props) {
  const { slug } = await params;
  return <ShelfPageClient slug={slug} />;
}
