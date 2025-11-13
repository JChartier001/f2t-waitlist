import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  waitlist: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    userType: v.optional(v.union(v.literal("vendor"), v.literal("consumer"))),
    createdAt: v.number(),
  }),
});
export default schema;
export type Schema = typeof schema;
