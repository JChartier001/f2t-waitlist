import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import {
  Map,
  Navigation,
  Clock4Icon,
  Smartphone,
  Zap,
  Heart,
  Upload,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <Map className="text-primary w-6 h-6" />,
    title: "Local First",
    description: "Tampa Bay farms and artisans at the source.",
  },
  {
    icon: <Navigation className="text-primary w-6 h-6" />,
    title: "Direct Access",
    description: "Buy straight from farms. No middlemen, no mystery.",
  },
  {
    icon: <Clock4Icon className="text-primary w-6 h-6" />,
    title: "Seasonal Freshness",
    description: "Experience produce at its peak, every time.",
  },
  {
    icon: <Smartphone className="text-primary w-6 h-6" />,
    title: "Effortless Ordering",
    description: "Shop local farms from your couch.",
  },
  {
    icon: <Zap className="text-primary w-6 h-6" />,
    title: "Community Powered",
    description: "Connecting Tampa Bay neighbors with local growers.",
  },
  {
    icon: <Heart className="text-primary w-6 h-6" />,
    title: "Sustainably Made",
    description: "Support earth-conscious producers and reduce food miles.",
  },
  {
    icon: <Upload className="text-primary w-6 h-6" />,
    title: "Transparent Sourcing",
    description: "Know your farmer. See who grew it and how.",
  },
  {
    icon: <Sparkles className="text-primary w-6 h-6" />,
    title: "Built to Grow",
    description: "Fueling local food communities with room to thrive.",
  },
];

export default function Features() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-6xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.div key={index} variants={itemVariants} className="text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {feature.icon}
              <h3 className="font-semibold text-lg text-foreground ">
                {feature.title}
              </h3>
            </div>
            <p className="text-muted-foreground text-balance text-sm">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
