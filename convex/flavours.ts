import { v } from "convex/values";
import { query } from "./_generated/server";

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flavours")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("flavours").order("asc").collect();
  },
});

export const byCategory = query({
  args: {
    category: v.union(v.literal("savoury"), v.literal("sweet")),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("flavours").collect();
    return all.filter(
      (f) => f.category === args.category || f.category === "both"
    );
  },
});
