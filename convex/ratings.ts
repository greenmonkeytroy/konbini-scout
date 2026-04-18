import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const myRatings = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) return [];

    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return await Promise.all(
      ratings.map(async (r) => {
        const snack = await ctx.db.get(r.snackId);
        if (!snack) return null;
        const maker = await ctx.db.get(snack.makerId);
        const illustrationUrl = snack.illustrationStorageId
          ? await ctx.storage.getUrl(snack.illustrationStorageId)
          : null;
        return { ...r, snack: { ...snack, maker, illustrationUrl } };
      })
    ).then((rs) => rs.filter(Boolean));
  },
});

export const forSnack = query({
  args: { snackId: v.id("snacks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ratings")
      .withIndex("by_snack", (q) => q.eq("snackId", args.snackId))
      .collect();
  },
});

export const myRating = query({
  args: { clerkId: v.string(), snackId: v.id("snacks") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) return null;
    return await ctx.db
      .query("ratings")
      .withIndex("by_user_snack", (q) =>
        q.eq("userId", user._id).eq("snackId", args.snackId)
      )
      .unique();
  },
});

async function recalcSnackRating(ctx: any, snackId: any) {
  const ratings = await ctx.db
    .query("ratings")
    .withIndex("by_snack", (q: any) => q.eq("snackId", snackId))
    .collect();
  const total = ratings.length;
  const avg = total > 0 ? ratings.reduce((s: number, r: any) => s + r.score, 0) / total : 0;
  await ctx.db.patch(snackId, { averageRating: avg, totalRatings: total, updatedAt: Date.now() });
}

export const rate = mutation({
  args: {
    clerkId: v.string(),
    snackId: v.id("snacks"),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.score < 1 || args.score > 5) throw new Error("Score must be 1–5");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found — please sign in");

    const snack = await ctx.db.get(args.snackId);
    if (!snack) throw new Error("Snack not found");

    const now = Date.now();
    const existing = await ctx.db
      .query("ratings")
      .withIndex("by_user_snack", (q) =>
        q.eq("userId", user._id).eq("snackId", args.snackId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { score: args.score, updatedAt: now });
    } else {
      await ctx.db.insert("ratings", {
        userId: user._id,
        snackId: args.snackId,
        score: args.score,
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.patch(user._id, { totalRatings: user.totalRatings + 1 });
    }

    await recalcSnackRating(ctx, args.snackId);
  },
});
