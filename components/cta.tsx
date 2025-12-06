import { motion } from "framer-motion";

import TextBlur from "@/components/ui/text-blur";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-6 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-4xl font-bold tracking-tight sm:text-6xl text-foreground"
          text="Where local food meets modern connection."
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[600px] text-center text-base text-muted-foreground sm:text-lg px-4 py-3 rounded-lg"
          text="Born in Florida. Built for farmers, makers, and neighbors everywhere. We're reimagining how local food connects communities — starting with you."
          duration={0.8}
        />
      </motion.div>
    </motion.div>
  );
}
