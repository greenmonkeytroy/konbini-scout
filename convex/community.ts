import { v } from "convex/values";
import { query } from "./_generated/server";

const MIN_RATINGS = 3;

export const topByFlavour = query({
  args: {
    category: v.union(v.literal("savoury"), v.literal("sweet")),
    flavourSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const flavour = await ctx.db
      .query("flavours")
      .withIndex("by_slug", (q) => q.eq("slug", args.flavourSlug))
      .unique();
    if (!flavour) return [];

    const snacks = await ctx.db
      .query("snacks")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    const filtered = snacks
      .filter((s) => s.totalRatings >= MIN_RATINGS && s.flavourIds.includes(flavour._id))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    if (filtered.length === 0) return [];

    return await Promise.all(
      filtered.map(async (snack) => {
        const maker = await ctx.db.get(snack.makerId);
        const illustrationUrl = snack.illustrationStorageId
          ? await ctx.storage.getUrl(snack.illustrationStorageId)
          : null;
        const photoUrl = snack.photoStorageId
          ? await ctx.storage.getUrl(snack.photoStorageId)
          : null;
        return { ...snack, maker, illustrationUrl, photoUrl };
      })
    );
  },
});

export const topByMaker = query({
  args: {
    makerSlug: v.string(),
    category: v.optional(v.union(v.literal("savoury"), v.literal("sweet"))),
  },
  handler: async (ctx, args) => {
    const maker = await ctx.db
      .query("makers")
      .withIndex("by_slug", (q) => q.eq("slug", args.makerSlug))
      .unique();
    if (!maker) return [];

    const snacks = await ctx.db
      .query("snacks")
      .withIndex("by_maker", (q) => q.eq("makerId", maker._id))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    const filtered = snacks
      .filter((s) => s.totalRatings >= MIN_RATINGS && (!args.category || s.category === args.category))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    if (filtered.length === 0) return [];

    return await Promise.all(
      filtered.map(async (snack) => {
        const illustrationUrl = snack.illustrationStorageId
          ? await ctx.storage.getUrl(snack.illustrationStorageId)
          : null;
        const photoUrl = snack.photoStorageId
          ? await ctx.storage.getUrl(snack.photoStorageId)
          : null;
        return { ...snack, maker, illustrationUrl, photoUrl };
      })
    );
  },
});
