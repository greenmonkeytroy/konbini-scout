import { type MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${appUrl}/`, priority: 1 },
    { url: `${appUrl}/browse/savoury`, priority: 0.8 },
    { url: `${appUrl}/browse/sweet`, priority: 0.8 },
  ];

  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const snacks = await client.query(api.snacks.list);
    const snackRoutes: MetadataRoute.Sitemap = snacks
      .filter((s) => s.isPublished)
      .map((s) => ({
        url: `${appUrl}/snack/${s.slug}`,
        priority: 0.6,
      }));
    return [...staticRoutes, ...snackRoutes];
  } catch {
    return staticRoutes;
  }
}
