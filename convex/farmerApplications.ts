import { v } from "convex/values";
import { mutation, action } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const submitFarmerApplication = mutation({
  args: {
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
  },
  handler: async (ctx, args): Promise<{ applicationId: string }> => {
    const existing = await ctx.db
      .query("farmerApplications")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("An application with this email has already been submitted");
    }

    const applicationId = await ctx.db.insert("farmerApplications", {
      farmName: args.farmName,
      contactName: args.contactName,
      email: args.email,
      phone: args.phone,
      zipCode: args.zipCode,
      whatSells: args.whatSells,
      description: args.description,
      howSells: args.howSells,
      deliveryPickupOptions: args.deliveryPickupOptions,
      websiteOrSocial: args.websiteOrSocial,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      createdAt: Date.now(),
    });

    return { applicationId };
  },
});

export const submitFarmerApplicationAction = action({
  args: {
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
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ applicationId: string; emailSent?: boolean }> => {
    const result = await ctx.runMutation(
      api.farmerApplications.submitFarmerApplication,
      {
        farmName: args.farmName,
        contactName: args.contactName,
        email: args.email,
        phone: args.phone,
        zipCode: args.zipCode,
        whatSells: args.whatSells,
        description: args.description,
        howSells: args.howSells,
        deliveryPickupOptions: args.deliveryPickupOptions,
        websiteOrSocial: args.websiteOrSocial,
        utmSource: args.utmSource,
        utmMedium: args.utmMedium,
        utmCampaign: args.utmCampaign,
      },
    );

    try {
      await Promise.all([
        ctx.runAction(internal.email.sendFarmerApplicationEmail, {
          contactName: args.contactName,
          farmName: args.farmName,
          email: args.email,
        }),
        ctx.runAction(internal.email.sendNewFarmerNotificationEmail, {
          farmName: args.farmName,
          contactName: args.contactName,
        }),
      ]);
      return { ...result, emailSent: true };
    } catch (error) {
      console.error("Failed to send farmer application email:", error);
      return { ...result, emailSent: false };
    }
  },
});
