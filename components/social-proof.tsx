"use client";
import { faker } from "@faker-js/faker";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { itemVariants } from "@/lib/animation-variants";

export default function SocialProof() {
  const count = useQuery(api.waitlist.getWaitlistCount) || 0;

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center gap-3 mt-6"
    >
      <div className="flex -space-x-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <Avatar key={index} className="h-8 w-8">
            <AvatarImage
              src={faker.image.avatar()}
              alt={`Avatar ${index + 1}`}
            />
          </Avatar>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Join {count + 17} others already growing with us 🌱!
      </p>
    </motion.div>
  );
}
