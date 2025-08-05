import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";

export const addToWaitlist = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; waitlistId?: string; message?: string }> => {
    // Check if email already exists in waitlist
    const existing = await ctx.db
      .query("waitlist")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      return { success: false, message: "Email already exists in waitlist" };
    }

    // Add to waitlist
    const waitlistId = await ctx.db.insert("waitlist", {
      email: args.email,
      createdAt: Date.now(),
    });

    return { success: true, waitlistId };
  },
});

export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    const waitlistEntries = await ctx.db.query("waitlist").collect();
    return waitlistEntries.length;
  },
});

export const joinWaitlist = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; waitlistId?: string; message?: string; emailSent?: boolean }> => {
    // Add to waitlist
    const result: { success: boolean; waitlistId?: string; message?: string } = await ctx.runMutation(api.waitlist.addToWaitlist, {
      email: args.email,
    });

    if (!result.success) {
      return result;
    }

    // Send welcome email
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
  },
});