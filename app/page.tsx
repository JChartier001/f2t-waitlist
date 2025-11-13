"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import CTA from "@/components/cta";
import Form, { FormData } from "@/components/form";
import SocialProof from "@/components/social-proof";
import Features from "@/components/features";
import Particles from "@/components/ui/particles";
import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const particleColor = theme === "dark" ? "#ede4d4" : "#4a3f35";

  const addToWaitlist = useAction(api.waitlist.joinWaitlist);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);

    const promise = addToWaitlist(data);

    toast.promise(promise, {
      pending: "Adding you to our harvest list... 🌾",
      success: {
        render: ({ data }: { data: { isUpdate?: boolean } }) => {
          if (data?.isUpdate) {
            return "Your details have been updated! 🎉";
          }
          return "Welcome to the farm! We'll notify you when we launch 🥕";
        },
        autoClose: 5000,
      },
      error: {
        render: ({ data }: { data: unknown }) => {
          // Handle Convex errors and standard errors
          const errorMessage =
            data instanceof Error ? data.message : String(data);

          if (errorMessage.includes("Email already exists in waitlist")) {
            return "You're already on the waitlist!";
          }

          // Don't show technical error messages to users
          return "Something went wrong. Please try again.";
        },
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-24">
        <CTA />

        <Form onSubmit={handleSubmit} loading={loading} />

        <SocialProof />
      </section>
      <Features />
      <div className="relative w-full max-w-[100%] mx-auto mt-12 mb-8 px-4">
        <div className="relative w-full h-[800px]">
          <Image
            src={"/example.png"}
            alt="Example"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
        </div>
      </div>

      <Particles
        quantityDesktop={250}
        quantityMobile={50}
        ease={80}
        color={particleColor}
        refresh
      />
    </main>
  );
}
