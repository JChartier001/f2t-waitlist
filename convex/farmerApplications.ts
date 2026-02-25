import { v } from "convex/values";
import { mutation, action } from "./_generated/server";
import { api, internal } from "./_generated/api";

const TEST_EMAIL_DOMAINS = ["example.com", "test.com"];
function isTestEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && TEST_EMAIL_DOMAINS.includes(domain);
}

/** Landing page interest form — creates a partial record with just name, email, whatSells. */
export const submitFarmerInterest = mutation({
  args: {
    contactName: v.string(),
    email: v.string(),
    whatSells: v.string(),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ applicationId: string }> => {
    const existing = await ctx.db
      .query("farmerApplications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update with latest info
      await ctx.db.patch(existing._id, {
        contactName: args.contactName,
        whatSells: args.whatSells,
      });
      return { applicationId: existing._id };
    }

    const applicationId = await ctx.db.insert("farmerApplications", {
      contactName: args.contactName,
      email: args.email,
      whatSells: args.whatSells,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      createdAt: Date.now(),
    });

    return { applicationId };
  },
});

/** Landing page interest form action — saves record and sends interest email. */
export const submitFarmerInterestAction = action({
  args: {
    contactName: v.string(),
    email: v.string(),
    whatSells: v.string(),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ applicationId: string; emailSent?: boolean }> => {
    const result = await ctx.runMutation(
      api.farmerApplications.submitFarmerInterest,
      {
        contactName: args.contactName,
        email: args.email,
        whatSells: args.whatSells,
        utmSource: args.utmSource,
        utmMedium: args.utmMedium,
        utmCampaign: args.utmCampaign,
      },
    );

    if (isTestEmail(args.email)) {
      return { ...result, emailSent: false };
    }

    try {
      await Promise.all([
        ctx.runAction(internal.email.sendFarmerInterestEmail, {
          contactName: args.contactName,
          email: args.email,
        }),
        ctx.runAction(internal.email.sendFarmerInterestNotificationEmail, {
          contactName: args.contactName,
          whatSells: args.whatSells,
        }),
      ]);
      return { ...result, emailSent: true };
    } catch (error) {
      console.error("Failed to send farmer interest email:", error);
      return { ...result, emailSent: false };
    }
  },
});

/** Full application form — creates or updates an existing interest record with all fields. */
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
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Check if they already completed the full application
      if (existing.phone && existing.description) {
        throw new Error(
          "An application with this email has already been submitted",
        );
      }

      // Update the interest record with full application data
      await ctx.db.patch(existing._id, {
        farmName: args.farmName,
        contactName: args.contactName,
        phone: args.phone,
        zipCode: args.zipCode,
        whatSells: args.whatSells,
        description: args.description,
        howSells: args.howSells,
        deliveryPickupOptions: args.deliveryPickupOptions,
        websiteOrSocial: args.websiteOrSocial,
        // Preserve original UTM if they came from the interest form first
        ...(existing.utmSource
          ? {}
          : {
              utmSource: args.utmSource,
              utmMedium: args.utmMedium,
              utmCampaign: args.utmCampaign,
            }),
      });

      return { applicationId: existing._id };
    }

    // No prior interest — create a full record
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

/** Full application form action — saves record and sends application confirmation emails. */
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

    if (isTestEmail(args.email)) {
      return { ...result, emailSent: false };
    }

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
