import { v } from "convex/values";
import { mutation } from "./_generated/server";

/** Run once from Convex dashboard to grant admin role to a user by clerkId */
export const makeAdmin = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { role: "admin" });
    return `${user.name} is now admin`;
  },
});

/** No auth required — inserts admin user with a given clerkId */
export const bootstrapAdmin = mutation({
  args: { clerkId: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role: "admin" });
      return `${existing.name} upgraded to admin`;
    }
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      role: "admin",
      totalRatings: 0,
      createdAt: Date.now(),
    });
    return `${args.name} created as admin`;
  },
});
