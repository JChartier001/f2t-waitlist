import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  waitlist: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    zipCode: v.optional(v.string()),
    userType: v.optional(v.union(v.literal("vendor"), v.literal("consumer"))),
    createdAt: v.number(),
  }),
  farmerApplications: defineTable({
    farmName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.string(),
    zipCode: v.string(),
    whatSells: v.string(),
    description: v.string(),
    howSells: v.string(),
    deliveryPickupOptions: v.string(),
    websiteOrSocial: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
export default schema;
export type Schema = typeof schema;
