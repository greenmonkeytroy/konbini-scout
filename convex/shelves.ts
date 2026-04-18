import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { slugify } from "./utils";

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const shelf = await ctx.db
      .query("sharedShelves")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!shelf) return null;

    const creator = await ctx.db.get(shelf.userId);
    const snacks = await Promise.all(
      shelf.snackIds.map(async (id) => {
        const snack = await ctx.db.get(id);
        if (!snack) return null;
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

    return { ...shelf, creator, snacks: snacks.filter(Boolean) };
  },
});

export const myList = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) return [];

    const shelves = await ctx.db
      .query("sharedShelves")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return await Promise.all(
      shelves.map(async (shelf) => {
        const previewSnacks = await Promise.all(
          shelf.snackIds.slice(0, 3).map(async (id) => {
            const snack = await ctx.db.get(id);
            if (!snack) return null;
            const illustrationUrl = snack.illustrationStorageId
              ? await ctx.storage.getUrl(snack.illustrationStorageId)
              : null;
            return { name: snack.name, illustrationUrl };
          })
        );
        return { ...shelf, previewSnacks: previewSnacks.filter(Boolean) };
      })
    );
  },
});

export const create = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    snackIds: v.array(v.id("snacks")),
  },
  handler: async (ctx, args) => {
    if (args.snackIds.length !== 5) throw new Error("A shelf must have exactly 5 snacks");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const baseSlug = slugify(args.title);
    let slug = baseSlug;
    let attempt = 0;
    while (
      await ctx.db
        .query("sharedShelves")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    await ctx.db.insert("sharedShelves", {
      userId: user._id,
      title: args.title,
      description: args.description,
      snackIds: args.snackIds,
      slug,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { slug };
  },
});

export const remove = mutation({
  args: { clerkId: v.string(), id: v.id("sharedShelves") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found");

    const shelf = await ctx.db.get(args.id);
    if (!shelf) throw new Error("Shelf not found");
    if (shelf.userId !== user._id) throw new Error("Not your shelf");

    await ctx.db.delete(args.id);
  },
});

export const incrementViews = mutation({
  args: { id: v.id("sharedShelves") },
  handler: async (ctx, args) => {
    const shelf = await ctx.db.get(args.id);
    if (!shelf) return;
    await ctx.db.patch(args.id, { viewCount: shelf.viewCount + 1 });
  },
});
