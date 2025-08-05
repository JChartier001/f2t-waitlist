import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  waitlist: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }),
});
export default schema;
export type Schema = typeof schema;
