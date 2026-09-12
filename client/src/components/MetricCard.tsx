import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
}

export function MetricCard({ label, value, icon: Icon, hint }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <Icon size={16} className="text-accent-light" />
      </div>
      <div className="text-2xl font-semibold text-text">{value}</div>
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </motion.div>
  );
}
