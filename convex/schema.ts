import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pokemon: defineTable({
    dex_id: v.float64(),
    name: v.string(),
  }).index("by_dex_id", ["dex_id"]).index("by_name", ["name"]),
  types: defineTable({ name: v.string() }).index("by_name", ["name"]),
});