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
      Thank you for joining the Farm2Table waitlist! We&apos;re building Tampa Bay&apos;s online farmers market, connecting you directly with local farms for fresh produce, meat, eggs, honey, and more. We&apos;re excited to have you as part of our community.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      We&apos;ll notify you as soon as we launch. You&apos;ll be among the first to shop local farms from your couch. In the meantime, if you have any questions, feel free to reply to this email.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Stay tuned for updates about Tampa Bay farmers, seasonal produce, and what&apos;s coming to your table.
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

// Farmer application confirmation email HTML
const getFarmerApplicationEmailHTML = (contactName: string, farmName: string) => {
  const firstName = contactName.split(" ")[0] || contactName;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background: linear-gradient(135deg, #F5E6D3 0%, #E8D5B7 50%, #FFB84D 100%); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 0; color: #cccccc; margin: 0;">
  <div style="margin: 0 auto; padding: 24px 32px 48px; background-color: #1a1a1a; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); max-width: 600px;">
    <div style="font-size: 48px; text-align: center; margin: 0 auto; padding-bottom: 20px;">🌾</div>
    
    <p style="font-size: 18px; line-height: 28px;">Hi ${firstName},</p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Thank you for applying to be a Founding Farmer with Farm2Table.  We received your application for <strong>${farmName}</strong> and we&apos;re excited to learn more.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      We&apos;re a small team and we&apos;re keeping our founding group to 10–15 farms so we can build real relationships. We&apos;ll review your application and reach out within the next few days to chat about your farm and how we can help you reach more customers in Tampa Bay.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      As a founding farm, you&apos;ll get our highest-tier plan free for your first 12 months and you&apos;ll help shape how we connect local food with local families. No upfront cost, you set your prices, and we already have neighbors on the waitlist.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Questions? Just reply to this email. We&apos;re here to help.
    </p>
    
    <p style="font-size: 16px; line-height: 26px; margin-top: 20px;">
      Fresh regards,<br />
      The Farm2Table Team
    </p>
    
    <hr style="border-color: #cccccc; margin: 20px 0;">
    
    <p style="color: #8c8c8c; font-size: 12px;">
      You received this email because you submitted a Founding Farmers application to Farm2Table. If you believe this is a mistake, feel free to ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
};

// Internal action to notify team of new founding farmer application
export const sendNewFarmerNotificationEmail = internalAction({
  args: {
    farmName: v.string(),
    contactName: v.string(),
  },
  handler: async (ctx, args) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 24px; color: #333; margin: 0;">
  <p style="font-size: 18px;">You've got a founding farmer! 🌾</p>
  <p style="font-size: 16px;"><strong>${args.farmName}</strong></p>
  <p style="font-size: 16px;">Contact: ${args.contactName}</p>
</body>
</html>
    `.trim();

    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: "customerservice@farm2table.app",
      subject: "You've got a founding farmer 🌾",
      html,
    });
  },
});

// Internal action to send farmer application confirmation email
export const sendFarmerApplicationEmail = internalAction({
  args: {
    contactName: v.string(),
    farmName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const html = getFarmerApplicationEmailHTML(
      args.contactName,
      args.farmName,
    );

    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: args.email,
      subject: "We received your Founding Farmers application 🌾",
      html,
    });
  },
});
