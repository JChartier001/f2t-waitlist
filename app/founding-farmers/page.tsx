"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import FarmerApplicationForm, {
  FarmerApplicationData,
} from "@/components/farmer-application-form";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { Check } from "lucide-react";

function getUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}

export default function FoundingFarmersPage() {
  const [loading, setLoading] = useState(false);
  const submitApplication = useAction(
    api.farmerApplications.submitFarmerApplicationAction,
  );

  const handleSubmit = async (data: FarmerApplicationData) => {
    setLoading(true);
    const utm = getUtmParams();

    try {
      await toast.promise(
        submitApplication({
          farmName: data.farmName,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          zipCode: data.zipCode,
          whatSells: data.whatSells,
          description: data.description,
          howSells: data.howSells,
          deliveryPickupOptions: data.deliveryPickupOptions,
          websiteOrSocial: data.websiteOrSocial || undefined,
          ...utm,
        }),
        {
          pending: "Submitting your application...",
          success: "Thank you! We'll be in touch soon.",
          error: {
            render({ data }) {
              const msg =
                data instanceof Error
                  ? data.message
                  : "Something went wrong.";
              if (msg.includes("already been submitted")) {
                return "An application with this email has already been submitted.";
              }
              return "Something went wrong. Please try again.";
            },
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <motion.section
        className="flex flex-col items-center w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-2"
        >
          Founding Farmers Application
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-center text-muted-foreground mb-6"
        >
          Tampa Bay customers are waiting. Farm2Table is an online farmers
          market launching soon. We&apos;re looking for 10–15 founding farms
          to launch with us.
        </motion.p>

        <motion.ul
          variants={itemVariants}
          className="flex flex-col gap-2 mb-8 text-muted-foreground text-sm sm:text-base"
        >
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <span>No upfront cost. Commission only when you sell</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <span>Highest-tier plan free for your first 12 months</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <span>You keep more. No wholesalers, you set your prices</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <span>We already have local customers on our waitlist</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <span>You set your delivery area and products</span>
          </li>
        </motion.ul>

        <FarmerApplicationForm onSubmit={handleSubmit} loading={loading} />
      </motion.section>
    </main>
  );
}
