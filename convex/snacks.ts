import { v } from "convex/values";
import { query } from "./_generated/server";

export const byId = query({
  args: { id: v.id("snacks") },
  handler: async (ctx, args) => {
    const snack = await ctx.db.get(args.id);
    if (!snack) return null;
    const maker = await ctx.db.get(snack.makerId);
    const flavours = await Promise.all(snack.flavourIds.map((id) => ctx.db.get(id)));
    const illustrationUrl = snack.illustrationStorageId
      ? await ctx.storage.getUrl(snack.illustrationStorageId)
      : null;
    const photoUrl = snack.photoStorageId
      ? await ctx.storage.getUrl(snack.photoStorageId)
      : null;
    return { ...snack, maker, flavours, illustrationUrl, photoUrl };
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const snack = await ctx.db
      .query("snacks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!snack) return null;
    const maker = await ctx.db.get(snack.makerId);
    const flavours = await Promise.all(snack.flavourIds.map((id) => ctx.db.get(id)));
    const illustrationUrl = snack.illustrationStorageId
      ? await ctx.storage.getUrl(snack.illustrationStorageId)
      : null;
    const photoUrl = snack.photoStorageId
      ? await ctx.storage.getUrl(snack.photoStorageId)
      : null;
    return { ...snack, maker, flavours, illustrationUrl, photoUrl };
  },
});

export const byFlavour = query({
  args: {
    category: v.union(v.literal("savoury"), v.literal("sweet")),
    flavourSlug: v.string(),
    limit: v.optional(v.number()),
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
      .filter((s) => s.flavourIds.includes(flavour._id))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, args.limit ?? 5);

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

export const byMaker = query({
  args: {
    makerSlug: v.string(),
    category: v.optional(v.union(v.literal("savoury"), v.literal("sweet"))),
    limit: v.optional(v.number()),
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
      .filter((s) => !args.category || s.category === args.category)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, args.limit ?? 5);

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

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("snacks").order("desc").collect();
  },
});
