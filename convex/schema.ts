import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  waitlist: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    zipCode: v.optional(v.string()),
    userType: v.optional(v.union(v.literal("vendor"), v.literal("consumer"))),
    createdAt: v.number(),
    /** Set when we send the "please specify vendor/consumer" follow-up email. Prevents duplicate sends. */
    userTypeFollowUpSentAt: v.optional(v.number()),
    /** Set when we send the "please share your location" follow-up email. Prevents duplicate sends. */
    locationFollowUpSentAt: v.optional(v.number()),
  }),
  farmerApplications: defineTable({
    farmName: v.optional(v.string()),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    whatSells: v.optional(v.string()),
    description: v.optional(v.string()),
    howSells: v.optional(v.string()),
    deliveryPickupOptions: v.optional(v.string()),
    websiteOrSocial: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
export default schema;
export type Schema = typeof schema;
