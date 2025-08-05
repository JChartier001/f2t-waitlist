import { Resend } from "@convex-dev/resend";
import { components, internal } from "./_generated/api";
import { internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";

// Initialize Resend with the component - disable test mode for production
export const resend = new Resend(components.resend, {
  testMode: false,
});

// Internal mutation to send email via Resend
export const sendEmail = internalMutation({
  args: {
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (ctx, args) => {
    await resend.sendEmail(ctx, {
      from: args.from,
      to: args.to,
      subject: args.subject,
      html: args.html,
    });
  },
});

// Simple HTML email template
const getWaitlistEmailHTML = (email: string) => {
  const username = email.split("@")[0];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background: linear-gradient(135deg, #F5E6D3 0%, #E8D5B7 50%, #FFB84D 100%); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 0; color: #cccccc; margin: 0;">
  <div style="margin: 0 auto; padding: 24px 32px 48px; background-color: #1a1a1a; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); max-width: 600px;">
    <div style="font-size: 48px; text-align: center; margin: 0 auto; padding-bottom: 20px;">🥕</div>
    
    <p style="font-size: 18px; line-height: 28px;">Hi ${username},</p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Thank you for joining the Farm2Table waitlist! We're building a platform that connects you directly with local farmers to access fresh, locally-sourced produce. We're excited to have you as part of our growing community.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      We'll notify you as soon as Farm2Table launches in your area. You'll be among the first to enjoy farm-fresh produce delivered from local growers to your table. In the meantime, if you have any questions, feel free to reply to this email.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Stay tuned for updates about local farmers, seasonal produce, and sustainable farming practices in your community.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-top: 20px;">
      Fresh regards,<br />
      The Farm2Table Team
    </p>
    
    <hr style="border-color: #cccccc; margin: 20px 0;">
    
    <p style="color: #8c8c8c; font-size: 12px;">
      You received this email because you signed up for the Farm2Table waitlist. If you believe this is a mistake, feel free to ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
};

// Internal action to send waitlist email
export const sendWaitlistEmail = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const html = getWaitlistEmailHTML(args.email);

    // Send the email
    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: args.email,
      subject: "Welcome to Farm2Table! 🥕",
      html,
    });
  },
});
