import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, subtitle, icon: Icon, colorClass, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colorClass)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}