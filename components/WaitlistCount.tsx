"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function WaitlistCount() {
  const count = useQuery(api.waitlist.getWaitlistCount);

  if (count === undefined) {
    return <span>Loading...</span>;
  }

  return (
    <span className="text-lg font-semibold">
      {count.toLocaleString()} farmers already growing with us! 🌱
    </span>
  );
}
