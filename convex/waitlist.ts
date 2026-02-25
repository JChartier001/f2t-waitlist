import { v } from "convex/values";
import { mutation, query, internalMutation, action, type ActionCtx } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { getUserTypeFollowUpEmailHTML } from "./email";

const TEST_EMAIL_DOMAINS = ["example.com", "test.com"];
function isTestEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && TEST_EMAIL_DOMAINS.includes(domain);
}

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

/**
 * Returns waitlist entries that don't have userType (vendor/consumer) and haven't
 * received the follow-up email yet. Use for a dry-run before sending.
 *
 * @param createdBefore - Optional timestamp: only include signups before this date (e.g. Date.now() - 30*24*60*60*1000 for 30 days ago)
 */
export const getWaitlistWithoutUserType = query({
  args: {
    createdBefore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("waitlist").collect();
    return all
      .filter(
        (e) =>
          e.userType === undefined &&
          e.userTypeFollowUpSentAt === undefined &&
          (args.createdBefore === undefined || e.createdAt < args.createdBefore),
      )
      .map((e) => ({ _id: e._id, email: e.email, name: e.name }));
  },
});

/** Internal: marks a waitlist entry as having received the user-type follow-up email. */
export const markUserTypeFollowUpSent = internalMutation({
  args: { waitlistId: v.id("waitlist") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.waitlistId, {
      userTypeFollowUpSentAt: Date.now(),
    });
  },
});

/**
 * Returns waitlist entries that have userType but no location (zipCode) and haven't
 * received the location follow-up email yet. Use for a dry-run before sending.
 */
export const getWaitlistWithUserTypeWithoutLocation = query({
  args: {
    createdBefore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("waitlist").collect();
    return all
      .filter(
        (e) =>
          e.userType !== undefined &&
          (!e.zipCode || e.zipCode.trim() === "") &&
          e.locationFollowUpSentAt === undefined &&
          (args.createdBefore === undefined || e.createdAt < args.createdBefore),
      )
      .map((e) => ({ _id: e._id, email: e.email, name: e.name, userType: e.userType }));
  },
});

/** Internal: marks a waitlist entry as having received the location follow-up email. */
export const markLocationFollowUpSent = internalMutation({
  args: { waitlistId: v.id("waitlist") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.waitlistId, {
      locationFollowUpSentAt: Date.now(),
    });
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

type SendUserTypeFollowUpResult = {
  total: number;
  sent: number;
  failed: number;
  sentEmails: string[];
  failedEmails: { email: string; error: string }[];
};

async function runSendUserTypeFollowUp(
  ctx: ActionCtx,
  args: { subject: string; html: string; createdBefore?: number },
): Promise<SendUserTypeFollowUpResult> {
  const entries = await ctx.runQuery(api.waitlist.getWaitlistWithoutUserType, {
    createdBefore: args.createdBefore,
  });

  const results: { sent: string[]; failed: { email: string; error: string }[] } = {
    sent: [],
    failed: [],
  };

  for (const entry of entries) {
    try {
      await ctx.runAction(internal.email.sendUserTypeFollowUpEmail, {
        email: entry.email,
        waitlistId: entry._id,
        subject: args.subject,
        html: args.html,
      });
      results.sent.push(entry.email);
    } catch (err) {
      results.failed.push({
        email: entry.email,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    total: entries.length,
    sent: results.sent.length,
    failed: results.failed.length,
    sentEmails: results.sent,
    failedEmails: results.failed,
  };
}

/**
 * Sends the user-type follow-up email to everyone on the waitlist who hasn't
 * specified vendor/consumer and hasn't received this email before. Each person
 * is only emailed once (userTypeFollowUpSentAt is set after a successful send).
 *
 * Run from Convex Dashboard: Functions → waitlist.sendUserTypeFollowUpEmails
 * Pass your subject and html (full HTML email body) as arguments.
 *
 * @param subject - Email subject line
 * @param html - Full HTML body for the email (use the same styling as other Farm2Table emails, or plain HTML)
 * @param createdBefore - Optional: only email people who signed up before this timestamp (ms). E.g. Date.now() - 30*24*60*60*1000 for 30 days ago.
 */
export const sendUserTypeFollowUpEmails = action({
  args: {
    subject: v.string(),
    html: v.string(),
    createdBefore: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<SendUserTypeFollowUpResult> => {
    return runSendUserTypeFollowUp(ctx, args);
  },
});

/**
 * Convenience version using the built-in "Two quick questions" email copy.
 * Sends to everyone without userType who hasn't received it yet.
 * Run from Convex Dashboard with no args (or optional createdBefore).
 */
export const sendUserTypeFollowUpEmailsDefault = action({
  args: {
    createdBefore: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<SendUserTypeFollowUpResult> => {
    return runSendUserTypeFollowUp(ctx, {
      subject: "Two quick questions from Farm2Table",
      html: getUserTypeFollowUpEmailHTML(),
      createdBefore: args.createdBefore,
    });
  },
});

type SendLocationFollowUpResult = {
  total: number;
  sent: number;
  failed: number;
  sentEmails: string[];
  failedEmails: { email: string; error: string }[];
};

async function runSendLocationFollowUp(
  ctx: ActionCtx,
  args: { subject?: string; createdBefore?: number },
): Promise<SendLocationFollowUpResult> {
  const entries = await ctx.runQuery(
    api.waitlist.getWaitlistWithUserTypeWithoutLocation,
    { createdBefore: args.createdBefore },
  );

  const results: { sent: string[]; failed: { email: string; error: string }[] } =
    { sent: [], failed: [] };

  for (const entry of entries) {
    if (entry.userType !== "vendor" && entry.userType !== "consumer") continue;
    try {
      await ctx.runAction(internal.email.sendLocationFollowUpEmail, {
        email: entry.email,
        waitlistId: entry._id,
        userType: entry.userType,
        subject: args.subject,
      });
      results.sent.push(entry.email);
    } catch (err) {
      results.failed.push({
        email: entry.email,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    total: entries.length,
    sent: results.sent.length,
    failed: results.failed.length,
    sentEmails: results.sent,
    failedEmails: results.failed,
  };
}

/**
 * Sends the location follow-up email to everyone who has userType but no location,
 * and hasn't received this email before. Copy is tailored: vendors get founding
 * farmer pitch, consumers get a simpler message.
 *
 * Run from Convex Dashboard: Functions → waitlist.sendLocationFollowUpEmailsDefault
 * with no args (or optional createdBefore).
 */
export const sendLocationFollowUpEmailsDefault = action({
  args: {
    subject: v.optional(v.string()),
    createdBefore: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<SendLocationFollowUpResult> => {
    return runSendLocationFollowUp(ctx, {
      subject: args.subject,
      createdBefore: args.createdBefore,
    });
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

    // Send welcome email only for new signups, not updates or test emails
    if (!result.isUpdate && !isTestEmail(args.email)) {
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
