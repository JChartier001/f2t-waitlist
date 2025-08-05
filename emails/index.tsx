import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  email: string;
}

export const Farm2TableWaitlistEmail = ({ email }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Farm2Table, {email.split("@")[0]}! 🥕</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logoEmoji}>🥕</Text>
        <Text style={greeting}>Hi {email.split("@")[0]},</Text>
        <Text style={paragraph}>
          Thank you for joining the Farm2Table waitlist! We're building a
          platform that connects you directly with local farmers to access
          fresh, locally-sourced produce. We're excited to have you as part of
          our growing community.
        </Text>
        <Text style={paragraph}>
          We'll notify you as soon as Farm2Table launches in your area. You'll
          be among the first to enjoy farm-fresh produce delivered from local
          growers to your table. In the meantime, if you have any questions,
          feel free to reply to this email.
        </Text>
        <Text style={paragraph}>
          Stay tuned for updates about local farmers, seasonal produce, and
          sustainable farming practices in your community.
        </Text>
        <Text style={signOff}>
          Fresh regards,
          <br />
          The Farm2Table Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          You received this email because you signed up for the Farm2Table
          waitlist. If you believe this is a mistake, feel free to ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
);

Farm2TableWaitlistEmail.PreviewProps = {
  email: "tyler@example.com",
} as EmailProps;

export default Farm2TableWaitlistEmail;

const main = {
  background: "linear-gradient(135deg, #F5E6D3 0%, #E8D5B7 50%, #FFB84D 100%)",
  fontFamily: 'figtree, "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: "40px 0",
  color: "#cccccc",
};

const container = {
  margin: "0 auto",
  padding: "24px 32px 48px",
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto",
  paddingBottom: "20px",
};

const logoEmoji = {
  fontSize: "48px",
  textAlign: "center" as const,
  margin: "0 auto",
  paddingBottom: "20px",
};

const greeting = {
  fontSize: "18px",
  lineHeight: "28px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
};

const link = {
  color: "#FFB84D",
  textDecoration: "underline",
};

const signOff = {
  fontSize: "16px",
  lineHeight: "26px",
  marginTop: "20px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8c8c8c",
  fontSize: "12px",
};
