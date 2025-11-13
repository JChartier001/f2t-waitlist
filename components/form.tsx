import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { MoveRight } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-btn";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export interface FormData {
  name: string;
  email: string;
  userType: "vendor" | "consumer";
}

interface FormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

export default function Form({ onSubmit, loading }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      userType: "consumer",
      name: "",
      email: "",
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      // Reset form only after successful submission
      reset();
    } catch (error) {
      // Don't reset form on error - keep user data visible
      console.error("Form submission error:", error);
    }
  };

  return (
    <motion.div
      className="mt-8 flex w-full max-w-md flex-col gap-4 items-center"
      // @ts-expect-error - variants is valid but TS has issues with framer-motion types
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
        {/* @ts-expect-error - variants is valid but TS has issues with framer-motion types */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex gap-4 justify-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="vendor"
                {...register("userType")}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                I&apos;m a Vendor
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="consumer"
                {...register("userType")}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                I&apos;m a Consumer
              </span>
            </label>
          </div>
        </motion.div>
        {/* @ts-expect-error - variants is valid but TS has issues with framer-motion types */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 w-full"
        >
          <div>
            <Input
              type="text"
              placeholder="Your name"
              {...register("name", { required: "Name is required" })}
              className="w-full bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex gap-3 w-full">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="flex-1 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <EnhancedButton
              type="submit"
              className=" px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={loading}
              Icon={MoveRight}
              iconPlacement="right"
              variant="shine"
              size="lg"
            >
              {loading ? "Loading..." : "Get Early Access"}
            </EnhancedButton>
          </div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
