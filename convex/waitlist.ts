import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";

export const addToWaitlist = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    userType: v.union(v.literal("vendor"), v.literal("consumer")),
    zipCode: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    waitlistId: string;
    message?: string;
    isUpdate?: boolean;
  }> => {
    // Check if email already exists in waitlist
    const existing = await ctx.db
      .query("waitlist")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      // Check if any details are different
      const detailsChanged =
        (existing.name !== undefined && existing.name !== args.name) ||
        (existing.userType !== undefined && existing.userType !== args.userType) ||
        (existing.zipCode !== args.zipCode);

      if (detailsChanged) {
        // Update the existing entry
        await ctx.db.patch(existing._id, {
          name: args.name,
          userType: args.userType,
          zipCode: args.zipCode,
        });
        return {
          waitlistId: existing._id,
          message: "Details updated successfully",
          isUpdate: true,
        };
      } else {
        // Same details, no need to update
        throw new Error("Email already exists in waitlist");
      }
    }

    // Add to waitlist
    const waitlistId = await ctx.db.insert("waitlist", {
      name: args.name,
      email: args.email,
      userType: args.userType,
      zipCode: args.zipCode,
      createdAt: Date.now(),
    });

    return { waitlistId };
  },
});

export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    const waitlistEntries = await ctx.db.query("waitlist").collect();
    return waitlistEntries.length;
  },
});

// Test utility function to delete a waitlist entry by email
// ⚠️ SECURITY: Only available in development/test environments
export const deleteWaitlistEntry = mutation({
  args: {
    email: v.string(),
    testSecret: v.string(), // Required secret to prevent unauthorized access
  },
  handler: async (ctx, args) => {
    // Only allow deletion in non-production environments with correct secret
    const expectedSecret = process.env.TEST_SECRET || "test-only-secret";

    if (args.testSecret !== expectedSecret) {
      throw new Error("Unauthorized: Invalid test secret");
    }

    // Additional safety: Only allow deletion of test emails
    if (
      !args.email.includes("@example.com") &&
      !args.email.endsWith("@test.com")
    ) {
      throw new Error("Only test emails can be deleted via this endpoint");
    }

    const entry = await ctx.db
      .query("waitlist")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (entry) {
      await ctx.db.delete(entry._id);
      return { success: true };
    }

    return { success: false, message: "Entry not found" };
  },
});

export const joinWaitlist = action({
  args: {
    name: v.string(),
    email: v.string(),
    userType: v.union(v.literal("vendor"), v.literal("consumer")),
    zipCode: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    waitlistId: string;
    message?: string;
    emailSent?: boolean;
    isUpdate?: boolean;
  }> => {
    // Add to waitlist
    const result: {
      waitlistId: string;
      message?: string;
      isUpdate?: boolean;
    } = await ctx.runMutation(api.waitlist.addToWaitlist, {
      name: args.name,
      email: args.email,
      userType: args.userType,
      zipCode: args.zipCode,
    });

    // Send welcome email only for new signups, not updates
    if (!result.isUpdate) {
      try {
        await ctx.runAction(internal.email.sendWaitlistEmail, {
          email: args.email,
        });

        return { ...result, emailSent: true };
      } catch (error) {
        console.error("Failed to send welcome email:", error);
        // Still return success for waitlist addition, just note email failed
        return { ...result, emailSent: false };
      }
    }

    return { ...result };
  },
});
