import { type Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import SnackPageClient from "./SnackPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const snack = await client.query(api.snacks.bySlug, { slug });
    if (snack) {
      const description = snack.description?.slice(0, 160) ?? undefined;
      return {
        title: snack.name,
        description,
        openGraph: { title: snack.name, description },
      };
    }
  } catch {
    // fall through to default metadata
  }
  return {};
}

export default async function SnackPage({ params }: Props) {
  const { slug } = await params;
  return <SnackPageClient slug={slug} />;
}
