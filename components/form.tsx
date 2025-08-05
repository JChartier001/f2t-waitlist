import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { MoveRight } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-btn";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

interface FormProps {
  email: string;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading: boolean;
}

export default function Form({
  email,
  handleEmailChange,
  handleSubmit,
  loading,
}: FormProps) {
  return (
    <motion.div
      className="mt-8 flex w-full max-w-[28rem] flex-col gap-4 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex gap-3 w-full">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={handleEmailChange}
          className="flex-1 bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500"
        />
        <EnhancedButton
          onClick={handleSubmit}
          className=" px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          disabled={loading}
          Icon={MoveRight}
          iconPlacement="right"
          variant="shine"
          size="lg"
        >
          {loading ? "Loading..." : "Get Early Access"}
        </EnhancedButton>
      </motion.div>
    </motion.div>
  );
}
