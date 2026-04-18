import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { slugify } from "./utils";

async function requireAdmin(ctx: any, clerkId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", clerkId))
    .unique();
  if (user?.role !== "admin") throw new Error("Not authorized");
  return user;
}

export const createSnack = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    makerId: v.id("makers"),
    description: v.string(),
    flavourNotes: v.string(),
    category: v.union(v.literal("savoury"), v.literal("sweet")),
    flavourIds: v.array(v.id("flavours")),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.clerkId);
    const { clerkId, ...rest } = args;
    const now = Date.now();
    const baseSlug = slugify(rest.name);

    let slug = baseSlug;
    let attempt = 0;
    while (await ctx.db.query("snacks").withIndex("by_slug", (q: any) => q.eq("slug", slug)).unique()) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    return await ctx.db.insert("snacks", {
      ...rest,
      slug,
      averageRating: 0,
      totalRatings: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateSnack = mutation({
  args: {
    clerkId: v.string(),
    id: v.id("snacks"),
    name: v.optional(v.string()),
    makerId: v.optional(v.id("makers")),
    description: v.optional(v.string()),
    flavourNotes: v.optional(v.string()),
    category: v.optional(v.union(v.literal("savoury"), v.literal("sweet"))),
    flavourIds: v.optional(v.array(v.id("flavours"))),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.clerkId);
    const { clerkId, id, ...fields } = args;
    const updates: any = { ...fields, updatedAt: Date.now() };
    if (fields.name) updates.slug = slugify(fields.name);
    await ctx.db.patch(id, updates);
  },
});

export const generateUploadUrl = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.clerkId);
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachImage = mutation({
  args: {
    clerkId: v.string(),
    snackId: v.id("snacks"),
    storageId: v.id("_storage"),
    imageType: v.union(v.literal("illustration"), v.literal("photo")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.clerkId);
    const field =
      args.imageType === "illustration"
        ? "illustrationStorageId"
        : "photoStorageId";
    await ctx.db.patch(args.snackId, {
      [field]: args.storageId,
      updatedAt: Date.now(),
    });
  },
});

export const createMaker = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    country: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.clerkId);
    return await ctx.db.insert("makers", {
      name: args.name,
      slug: slugify(args.name),
      country: args.country,
      description: args.description,
      snackCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const createFlavour = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    category: v.union(
      v.literal("savoury"),
      v.literal("sweet"),
      v.literal("both")
    ),
    description: v.optional(v.string()),
    iconEmoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.clerkId);
    return await ctx.db.insert("flavours", {
      name: args.name,
      slug: slugify(args.name),
      category: args.category,
      description: args.description,
      iconEmoji: args.iconEmoji,
      snackCount: 0,
      createdAt: Date.now(),
    });
  },
});
