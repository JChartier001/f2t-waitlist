"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import CTA from "@/components/cta";
import Form from "@/components/form";
import SocialProof from "@/components/social-proof";
import Features from "@/components/features";
import Particles from "@/components/ui/particles";
import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const particleColor = theme === "dark" ? "#ede4d4" : "#4a3f35";

  const addToWaitlist = useAction(api.waitlist.joinWaitlist);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    const promise = addToWaitlist({ email });

    toast.promise(promise, {
      pending: "Adding you to our harvest list... 🌾",
      success: {
        render: "Welcome to the farm! We'll notify you when we launch 🥕",
        onClose: () => setEmail(""),
        autoClose: 5000,
      },
      error: {
        render: (error: unknown) => {
          if (
            error instanceof Error &&
            error.message === "Email already exists in waitlist"
          ) {
            return "You're already on the waitlist!";
          }
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

        <Form
          email={email}
          handleEmailChange={handleEmailChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <SocialProof />
      </section>
      <Features />
      <div className="relative w-full max-w-4xl mx-auto mt-12 mb-8">
        <Image src={"/example.png"} alt="Example" fill />
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
