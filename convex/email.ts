import { Resend } from "@convex-dev/resend";
import { components, internal } from "./_generated/api";
import { internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Initialize Resend with the component - disable test mode for production
export const resend = new Resend(components.resend, {
  testMode: false,
});

// Domains that should never receive real emails (e2e tests, etc.)
const TEST_EMAIL_DOMAINS = ["example.com", "test.com"];

// Internal mutation to send email via Resend
export const sendEmail = internalMutation({
  args: {
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (ctx, args) => {
    const domain = args.to.split("@")[1]?.toLowerCase();
    if (domain && TEST_EMAIL_DOMAINS.includes(domain)) {
      console.log(`Skipping email to test address: ${args.to}`);
      return;
    }

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
      Thank you for joining the Farm2Table waitlist! We&apos;re building Tampa Bay&apos;s online farmers market, connecting you directly with local vendors for fresh produce, meat, eggs, honey, handmade goods, and more. We&apos;re excited to have you as part of our community.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      We&apos;ll notify you as soon as we launch. You&apos;ll be among the first to shop local from your couch. In the meantime, if you have any questions, feel free to reply to this email.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Stay tuned for updates about Tampa Bay vendors, seasonal produce, and what&apos;s coming to your table.
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

/** HTML template for the "please specify vendor/consumer + location" follow-up email. */
export function getUserTypeFollowUpEmailHTML(): string {
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

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">Hi there,</p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      You signed up for Farm2Table a while back, and I&apos;m so glad you did. We&apos;re getting closer to launch and I wanted to check in.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Farm2Table is an online farmers market connecting local vendors directly with people who want fresh, local food. No middlemen.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      I&apos;m building out our founding community right now and I&apos;d love to know a little more about you. Could you hit reply and let me know:
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      <strong>1.</strong> Are you a vendor or producer, or are you someone looking to buy local?<br />
      <strong>2.</strong> What city/area are you located in?
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      That&apos;s it. Two quick answers.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      If you&apos;re a local vendor or producer, I&apos;m actively looking for founding vendors to partner with as we launch. Founding vendors get early access, priority placement, and a direct line to me as we build this together. I&apos;d love to talk more if that sounds like a fit.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      And if you&apos;re here for the food, don&apos;t worry. I&apos;m working hard to bring the best local vendors to your area. Your answers help me know where to focus.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Thanks for being part of this from the beginning.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-top: 20px;">
      Jen<br />
      Founder, Farm2Table
    </p>

    <hr style="border-color: #cccccc; margin: 20px 0;">

    <p style="color: #8c8c8c; font-size: 12px;">
      You received this email because you signed up for the Farm2Table waitlist. If you believe this is a mistake, feel free to ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
}

/** HTML template for the location follow-up email. Different copy for vendors (with founding farmer pitch) vs consumers. */
export function getLocationFollowUpEmailHTML(
  userType: "vendor" | "consumer",
): string {
  const vendorBlock = `
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      I&apos;m actively looking for founding vendors to partner with as we launch. Founding vendors get early access, priority placement, and a direct line to me as we build this together. If that sounds like a fit, just reply and I&apos;d love to talk. Or you can apply at <a href="https://farm2table.app/founding-farmers?utm_source=location_followup_email&amp;utm_medium=email&amp;utm_campaign=vendor_location" style="color: #FFB84D;">farm2table.app/founding-farmers</a>.
    </p>
  `;

  const consumerBlock = `
    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      I&apos;m working hard to bring the best local vendors to your area. Your location helps me know where to focus first.
    </p>
  `;

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

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">Hi there,</p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      You signed up for Farm2Table and we&apos;re getting closer to launch. One quick question: what city or area are you located in? Just hit reply with your city or zip code.
    </p>

    ${userType === "vendor" ? vendorBlock : consumerBlock}

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Thanks for being part of this.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-top: 20px;">
      Jen<br />
      Founder, Farm2Table
    </p>

    <hr style="border-color: #cccccc; margin: 20px 0;">

    <p style="color: #8c8c8c; font-size: 12px;">
      You received this email because you signed up for the Farm2Table waitlist. If you believe this is a mistake, feel free to ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
}

/** Internal action to send the user-type follow-up email. Uses custom subject and HTML. */
export const sendUserTypeFollowUpEmail = internalAction({
  args: {
    email: v.string(),
    waitlistId: v.id("waitlist"),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: args.email,
      subject: args.subject,
      html: args.html,
    });
    await ctx.runMutation(internal.waitlist.markUserTypeFollowUpSent, {
      waitlistId: args.waitlistId,
    });
  },
});

/** Internal action to send the location follow-up email. Tailors copy for vendor vs consumer. */
export const sendLocationFollowUpEmail = internalAction({
  args: {
    email: v.string(),
    waitlistId: v.id("waitlist"),
    userType: v.union(v.literal("vendor"), v.literal("consumer")),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailSubject =
      args.subject ?? "Quick question from Farm2Table: where are you located?";
    const html = getLocationFollowUpEmailHTML(args.userType);

    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: args.email,
      subject: emailSubject,
      html,
    });
    await ctx.runMutation(internal.waitlist.markLocationFollowUpSent, {
      waitlistId: args.waitlistId,
    });
  },
});

// Farmer interest follow-up email HTML — sent when farmer submits the simple landing page form
const getFarmerInterestEmailHTML = (contactName: string) => {
  const firstName = escapeHtml(contactName.split(" ")[0] || contactName);

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
      Thanks for your interest in joining Farm2Table as a founding vendor. I&apos;m really excited to hear from you.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      We&apos;re keeping our founding group to just 10 to 15 vendors so we can build real relationships and make sure every vendor gets the attention they deserve. As a founding vendor, you&apos;d get:
    </p>

    <ul style="font-size: 16px; line-height: 26px; margin-bottom: 20px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Our highest-tier plan <strong>free for 12 months</strong></li>
      <li style="margin-bottom: 8px;">You set your own prices, no wholesalers, no middlemen</li>
      <li style="margin-bottom: 8px;">Access to our growing list of Tampa Bay families ready to buy</li>
      <li style="margin-bottom: 8px;">A direct line to me as we shape the platform together</li>
    </ul>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      <strong>Next step:</strong> Tell us a little more about your business so we can get you set up. It takes about 5 minutes:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://farm2table.app/founding-farmers/apply?utm_source=farmer_interest_email&amp;utm_medium=email&amp;utm_campaign=founding_farmer_followup" style="background-color: #FFB84D; color: #1a1a1a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Tell Us About Your Business</a>
    </div>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      Or just reply to this email and we can chat directly. I&apos;d love to hear your story.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-top: 20px;">
      Jen<br />
      Founder, Farm2Table
    </p>

    <hr style="border-color: #cccccc; margin: 20px 0;">

    <p style="color: #8c8c8c; font-size: 12px;">
      You received this email because you expressed interest in joining Farm2Table as a founding vendor. If you believe this is a mistake, feel free to ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
};

// Internal action to send farmer interest follow-up email
export const sendFarmerInterestEmail = internalAction({
  args: {
    contactName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const html = getFarmerInterestEmailHTML(args.contactName);

    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: args.email,
      subject: "Thanks for your interest, here's your next step 🌾",
      html,
    });
  },
});

// Internal action to notify team of new farmer interest
export const sendFarmerInterestNotificationEmail = internalAction({
  args: {
    contactName: v.string(),
    whatSells: v.string(),
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
  <p style="font-size: 18px;">New vendor interest! 🌱</p>
  <p style="font-size: 16px;"><strong>${escapeHtml(args.contactName)}</strong></p>
  <p style="font-size: 16px;">Sells: ${escapeHtml(args.whatSells)}</p>
</body>
</html>
    `.trim();

    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: "customerservice@farm2table.app",
      subject: "New vendor interest 🌱",
      html,
    });
  },
});

// Farmer application confirmation email HTML
const getFarmerApplicationEmailHTML = (contactName: string, farmName: string) => {
  const firstName = escapeHtml(contactName.split(" ")[0] || contactName);
  const safeFarmName = escapeHtml(farmName);

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
      Thank you for applying to be a Founding Vendor with Farm2Table. We received your application for <strong>${safeFarmName}</strong> and we&apos;re excited to learn more.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      We&apos;re a small team and we&apos;re keeping our founding group to 10 to 15 vendors so we can build real relationships. We&apos;ll review your application and reach out within the next few days to chat about your business and how we can help you reach more customers in Tampa Bay.
    </p>

    <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
      As a founding vendor, you&apos;ll get our highest-tier plan free for your first 12 months and you&apos;ll help shape how we connect local food with local families. No upfront cost, you set your prices, and we already have neighbors on the waitlist.
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
      You received this email because you submitted a Founding Vendors application to Farm2Table. If you believe this is a mistake, feel free to ignore this email.
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
  <p style="font-size: 18px;">You've got a founding vendor! 🌾</p>
  <p style="font-size: 16px;"><strong>${escapeHtml(args.farmName)}</strong></p>
  <p style="font-size: 16px;">Contact: ${escapeHtml(args.contactName)}</p>
</body>
</html>
    `.trim();

    await ctx.runMutation(internal.email.sendEmail, {
      from: "Farm2Table <customerservice@farm2table.app>",
      to: "customerservice@farm2table.app",
      subject: "You've got a founding vendor 🌾",
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
      subject: "We received your Founding Vendors application 🌾",
      html,
    });
  },
});
