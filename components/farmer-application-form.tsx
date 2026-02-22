"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoveRight } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-btn";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export interface FarmerApplicationData {
  farmName: string;
  contactName: string;
  email: string;
  phone: string;
  zipCode: string;
  whatSells: string;
  description: string;
  howSells: string;
  deliveryPickupOptions: string;
  websiteOrSocial?: string;
}

interface FarmerApplicationFormProps {
  onSubmit: (data: FarmerApplicationData) => Promise<void>;
  loading: boolean;
}

const inputClassName =
  "w-full bg-white/80 dark:bg-card/80 border-gray-300 dark:border-input text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-muted-foreground";

export default function FarmerApplicationForm({
  onSubmit,
  loading,
}: FarmerApplicationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FarmerApplicationData>({
    defaultValues: {
      farmName: "",
      contactName: "",
      email: "",
      phone: "",
      zipCode: "",
      whatSells: "",
      description: "",
      howSells: "",
      deliveryPickupOptions: "",
      websiteOrSocial: "",
    },
  });

  const handleFormSubmit = async (data: FarmerApplicationData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <motion.div
      className="mt-8 flex w-full max-w-lg flex-col gap-4 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Farm/Business name
          </label>
          <Input
            type="text"
            placeholder="Your farm or business name"
            {...register("farmName", { required: "Farm name is required" })}
            className={inputClassName}
          />
          {errors.farmName && (
            <p className="text-red-500 text-xs mt-0.5">{errors.farmName.message}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Contact name
          </label>
          <Input
            type="text"
            placeholder="Your name"
            {...register("contactName", { required: "Contact name is required" })}
            className={inputClassName}
          />
          {errors.contactName && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.contactName.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Email</label>
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
            <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input
            type="tel"
            placeholder="(555) 123-4567"
            {...register("phone", { required: "Phone is required" })}
            className={inputClassName}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-0.5">{errors.phone.message}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Zip code
          </label>
          <Input
            type="text"
            placeholder="5-digit zip code"
            {...register("zipCode", {
              required: "Zip code is required",
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: "Please enter a valid zip code (e.g. 33602)",
              },
            })}
            className={inputClassName}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.zipCode.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            What do you sell?
          </label>
          <Textarea
            placeholder="e.g. Produce, Meat, Eggs, Dairy, Baked goods, Honey, Handmade goods"
            rows={2}
            {...register("whatSells", { required: "Please tell us what you sell" })}
            className={inputClassName}
          />
          {errors.whatSells && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.whatSells.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Brief description
          </label>
          <Textarea
            placeholder="Tell us about your farm in 2-3 sentences"
            rows={4}
            {...register("description", {
              required: "Please describe your farm",
            })}
            className={inputClassName}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.description.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            How do you currently sell?
          </label>
          <Input
            type="text"
            placeholder="e.g. Farmers market, Farm stand, Online, Wholesale"
            {...register("howSells", {
              required: "Please tell us how you sell",
            })}
            className={inputClassName}
          />
          {errors.howSells && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.howSells.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Delivery/pickup options
          </label>
          <Textarea
            placeholder="Do you deliver? How far? Pickup only? Ship?"
            rows={3}
            {...register("deliveryPickupOptions", {
              required: "Please tell us about delivery or pickup options",
            })}
            className={inputClassName}
          />
          {errors.deliveryPickupOptions && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.deliveryPickupOptions.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Website or social media (optional)
          </label>
          <Input
            type="text"
            placeholder="https://..."
            {...register("websiteOrSocial")}
            className={inputClassName}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-2">
          <EnhancedButton
            type="submit"
            className="w-full px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            disabled={loading}
            Icon={MoveRight}
            iconPlacement="right"
            variant="shine"
            size="lg"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </EnhancedButton>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
