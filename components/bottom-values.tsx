import { motion } from "framer-motion";
import {
  Clock4Icon,
  Heart,
  Map,
  Navigation,
  Smartphone,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import { containerVariants, itemVariants } from "@/lib/animation-variants";
const values = [
  {
    icon: <Map className="text-3xl mb-3" />,
    title: "Local First",
    description: "Empowering producers and communities at the source.",
  },
  {
    icon: <Navigation className="text-3xl mb-3" />,
    title: "Direct Access",
    description: "Shop straight from growers, makers, and producers.",
  },
  {
    icon: <Clock4Icon className="text-3xl mb-3" />,
    title: "Seasonal Freshness",
    description: "Experience produce at its peak, every time.",
  },
  {
    icon: <Smartphone className="text-3xl mb-3" />,
    title: "Effortless Ordering",
    description: "Smart, simple tools for busy lives.",
  },
  {
    icon: <Zap className="text-3xl mb-3" />,
    title: "Community Powered",
    description: "Built to strengthen food connections everywhere.",
  },
  {
    icon: <Heart className="text-3xl mb-3" />,
    title: "Sustainably Made",
    description: "Support earth-conscious producers and reduce food miles.",
  },
  {
    icon: <Upload className="text-3xl mb-3" />,
    title: "Transparent Sourcing",
    description: "See who made it, how it’s made, and where.",
  },
  {
    icon: <Sparkles className="text-3xl mb-3" />,
    title: "Built to Grow",
    description: "Fueling local food communities with room to thrive.",
  },
];

export default function BottomValues() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-24 mb-16 max-w-6xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {values.map((value, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="text-center "
        >
          <div className="text-3xl mb-3">{value.icon}</div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {value.title}
          </h3>
          <p className="text-gray-600 text-sm">{value.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
