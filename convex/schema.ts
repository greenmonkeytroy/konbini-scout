import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Snacks ───
  snacks: defineTable({
    name: v.string(),
    slug: v.string(),
    makerId: v.id("makers"),
    description: v.string(),
    flavourNotes: v.string(),
    category: v.union(v.literal("savoury"), v.literal("sweet")),
    flavourIds: v.array(v.id("flavours")),
    illustrationStorageId: v.optional(v.id("_storage")),
    photoStorageId: v.optional(v.id("_storage")),
    averageRating: v.number(),
    totalRatings: v.number(),
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_maker", ["makerId"])
    .index("by_category", ["category", "averageRating"])
    .index("by_slug", ["slug"])
    .index("by_published", ["isPublished"]),

  // ─── Makers ───
  makers: defineTable({
    name: v.string(),
    slug: v.string(),
    country: v.string(),
    description: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    snackCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"]),

  // ─── Flavours ───
  flavours: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.union(
      v.literal("savoury"),
      v.literal("sweet"),
      v.literal("both")
    ),
    description: v.optional(v.string()),
    iconEmoji: v.optional(v.string()),
    snackCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"]),

  // ─── Users ───
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    totalRatings: v.number(),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"]),

  // ─── Ratings ───
  ratings: defineTable({
    userId: v.id("users"),
    snackId: v.id("snacks"),
    score: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_snack", ["snackId"])
    .index("by_user_snack", ["userId", "snackId"]),

  // ─── Shared Shelves ───
  sharedShelves: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    snackIds: v.array(v.id("snacks")),
    slug: v.string(),
    viewCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"]),
});
