"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  Sun,
  Users,
  ShieldCheck,
  ChevronDown,
  Sprout,
  MoveRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { EnhancedButton } from "@/components/ui/enhanced-btn";

/* ─── UTM helpers ─── */
function getUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* ─── Scroll-triggered section wrapper ─── */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── FAQ data ─── */
const faqs = [
  {
    q: "What does it cost?",
    a: "Founding vendors get our Pro plan (normally $149/month) free for the first 12 months. We take a 12% transaction fee on sales, which is our lowest rate. If you don't sell, you don't pay. After 12 months, you pick the plan that works for you.",
  },
  {
    q: "What will I need to do?",
    a: "You'll set up your store profile, add your products with photos and descriptions, set your prices, and connect a Stripe account for payments. When orders come in, you pack them and handle delivery or pickup. We provide the platform, the marketplace, and the customers. You run your store.",
  },
  {
    q: "Do I need to be tech-savvy?",
    a: "You don't need to be a tech expert, but you should be comfortable using a website. Things like uploading photos, writing descriptions, and checking orders. Our dashboard walks you through everything step by step, and we're always available by email or phone if you need a hand.",
  },
  {
    q: "What if I get too many orders?",
    a: "You're always in control. Inventory is tracked in real time, so as orders come in your stock updates automatically. As long as your inventory is set correctly, overselling isn't really an issue. You also choose your delivery area, set your own schedule, and can pause your store anytime.",
  },
  {
    q: "How long does setup take?",
    a: "Most vendors get their store up and running in an afternoon. You'll add your products with photos, connect Stripe for payments, and set up delivery or pickup options. Once that's done, you're live.",
  },
  {
    q: "When do you launch?",
    a: "Soon. Founding vendors get early access and a direct line to our team as we build this together. The sooner you join, the more say you have in how it all works.",
  },
];

/* ─── FAQ item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className="border-b border-primary/15 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left cursor-pointer"
      >
        <span className="text-base sm:text-lg font-semibold text-foreground pr-4">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-muted-foreground leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Interest form data ─── */
interface InterestFormData {
  contactName: string;
  email: string;
  whatSells: string;
}

/* ─── Page ─── */
export default function FoundingFarmersLandingPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitInterest = useAction(
    api.farmerApplications.submitFarmerInterestAction,
  );
  const waitlistCount = useQuery(api.waitlist.getWaitlistCount) ?? 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InterestFormData>();

  const onSubmit = async (data: InterestFormData) => {
    setLoading(true);
    const utm = getUtmParams();
    try {
      await submitInterest({ ...data, ...utm });
      toast.success("You're in! Check your email for next steps.");
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "w-full bg-white/80 dark:bg-card/80 border-primary/20 dark:border-input text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground h-12 text-base";

  const displayCount = waitlistCount + 17;

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-24">
        {/* Warm radial glow behind hero */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[140%] aspect-square rounded-full bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl" />
        </div>

        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/15 px-4 py-1.5 text-sm font-medium text-primary">
              <Sprout className="h-4 w-4" />
              Only 10 to 15 founding vendor spots
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Your neighbors want to buy from you
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {displayCount > 0 ? (
              <>
                <strong className="text-foreground">{displayCount}+ Tampa Bay families (and growing)</strong>{" "}
                are on our waitlist looking to buy local.
              </>
            ) : (
              <>Tampa Bay families are on our waitlist looking to buy local.</>
            )}{" "}
            Farm2Table is an online farmers market launching soon. Your store,
            your prices, no monthly fee for a full year.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <a
              href="#join"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3.5 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Reserve Your Spot
              <MoveRight className="h-5 w-5" />
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Takes 30 seconds. No commitment.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ PAIN POINTS ═══════════════════ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <RevealSection className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            className="text-center text-2xl sm:text-3xl font-bold text-foreground mb-4"
          >
            You already do the hard part
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            You grow it, you make it, you put the work in. Farm2Table gives you a place to sell it without the usual headaches.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <motion.div
              variants={fadeUp}
              className="group relative rounded-xl border border-primary/10 bg-card/60 dark:bg-card/40 backdrop-blur-sm p-6 sm:p-8 hover:border-primary/25 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/15 mb-5">
                <Sun className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Sell all week, not just Saturdays
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your online store is always open. Customers browse and order when it&apos;s convenient for them, and you manage inventory and fulfill orders on your own schedule.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeUp}
              className="group relative rounded-xl border border-primary/10 bg-card/60 dark:bg-card/40 backdrop-blur-sm p-6 sm:p-8 hover:border-primary/25 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/15 mb-5">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Customers are already waiting
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {displayCount}+ local families (and growing) have joined our waitlist to buy directly from Tampa Bay vendors. You focus on your products and we drive the traffic to your store.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeUp}
              className="group relative rounded-xl border border-primary/10 bg-card/60 dark:bg-card/40 backdrop-blur-sm p-6 sm:p-8 hover:border-primary/25 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/15 mb-5">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Your prices. Your rules. No monthly fee.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You set your own prices and choose your delivery area. No wholesalers, no middlemen. Our Pro plan (normally $149/month) is free for founding vendors for a full year.
              </p>
            </motion.div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ PLATFORM PREVIEW ═══════════════════ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <RevealSection className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeUp}
            className="text-center text-2xl sm:text-3xl font-bold text-foreground mb-3"
          >
            See what your storefront looks like
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Add your products, set your prices, and your store is live. Customers can browse, order, and pay all in one place.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store image */}
            <motion.div variants={fadeUp} className="flex flex-col">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-primary/10">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/store.png"
                    alt="Individual vendor storefront on Farm2Table showing products for sale"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3">
                This is what <strong className="text-foreground">your store</strong> looks like
              </p>
            </motion.div>

            {/* Marketplace image */}
            <motion.div variants={fadeUp} className="flex flex-col">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-primary/10">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/marketplace.png"
                    alt="Farm2Table marketplace showing local farm products available for purchase"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3">
                This is where <strong className="text-foreground">customers find you</strong>
              </p>
            </motion.div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ FORM SECTION ═══════════════════ */}
      <section
        id="join"
        className="w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 scroll-mt-24"
      >
        <RevealSection className="mx-auto max-w-lg">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">🌾</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                You&apos;re in!
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Check your email for the next step to tell us more about your
                business. If you have any questions, just reply to that email.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.h2
                variants={fadeUp}
                className="text-center text-2xl sm:text-3xl font-bold text-foreground mb-2"
              >
                Interested? Let&apos;s talk.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-center text-muted-foreground mb-8"
              >
                Drop your info and we&apos;ll send you the next steps. Takes 30 seconds.
              </motion.p>

              <motion.form
                variants={fadeUp}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Your name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    {...register("contactName", {
                      required: "Your name is required",
                    })}
                    className={inputClassName}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-xs">
                      {errors.contactName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={inputClassName}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    What do you sell?
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Produce, eggs, honey, baked goods, handmade crafts"
                    {...register("whatSells", {
                      required: "Please tell us what you sell",
                    })}
                    className={inputClassName}
                  />
                  {errors.whatSells && (
                    <p className="text-red-500 text-xs">
                      {errors.whatSells.message}
                    </p>
                  )}
                </div>

                <EnhancedButton
                  type="submit"
                  className="w-full h-12 text-base font-semibold rounded-lg mt-2"
                  disabled={loading}
                  Icon={MoveRight}
                  iconPlacement="right"
                  variant="shine"
                  size="lg"
                >
                  {loading ? "Submitting..." : "Reserve Your Spot"}
                </EnhancedButton>

                <p className="text-center text-xs text-muted-foreground mt-1">
                  No commitment. We&apos;ll email you the next step.
                </p>
              </motion.form>
            </>
          )}
        </RevealSection>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <RevealSection className="mx-auto max-w-2xl">
          <motion.h2
            variants={fadeUp}
            className="text-center text-2xl sm:text-3xl font-bold text-foreground mb-10"
          >
            Common questions
          </motion.h2>
          <div className="rounded-xl border border-primary/10 bg-card/60 dark:bg-card/40 backdrop-blur-sm px-6 sm:px-8 divide-y-0">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ ABOUT JEN ═══════════════════ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <RevealSection className="mx-auto max-w-2xl">
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-primary/10 bg-card/60 dark:bg-card/40 backdrop-blur-sm p-6 sm:p-8"
          >
            <div className="shrink-0">
              <Image
                src="/jenChartier.jpeg"
                alt="Jen Chartier, founder of Farm2Table"
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20"
              />
            </div>
            <div>
              <p className="text-foreground leading-relaxed">
                &ldquo;I&apos;m Jen. I&apos;m a registered nurse and a software
                engineer, and I built Farm2Table from the ground up because I
                believe local vendors deserve better tools to reach their
                communities. I saw how hard it is to sell local without giving up
                your margins or spending all day at a market. I&apos;m not a big
                company. I&apos;m one person who cares about making this work
                for you.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Jen Chartier, Founder
              </p>
            </div>
          </motion.div>
        </RevealSection>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <RevealSection className="mx-auto max-w-2xl text-center">
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-lg mb-6 leading-relaxed"
          >
            Still thinking about it? That&apos;s OK. If you have questions or just
            want to chat about whether this is a good fit for your business, reach out
            anytime.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#join"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Reserve Your Spot
              <MoveRight className="h-5 w-5" />
            </a>
            <a
              href="mailto:customerservice@farm2table.app"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Or email Jen directly
            </a>
          </motion.div>
        </RevealSection>
      </section>
    </main>
  );
}
