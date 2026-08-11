import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: 'brand' | 'accent' | 'green' | 'red' | 'slate';
}

const accentMap = {
  brand: { bg: 'bg-brand-50', text: 'text-brand-600', ring: 'ring-brand-100' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600', ring: 'ring-accent-100' },
  green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
};

export default function StatCard({ label, value, icon: Icon, trend, trendUp, accent = 'brand' }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-display">{value}</p>
          {trend && (
            <p className={`text-xs font-semibold mt-2 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${a.bg} ${a.text} ring-1 ${a.ring}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 opacity-5">
        <Icon className="w-20 h-20" />
      </div>
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return <div className="h-[110px] rounded-2xl bg-slate-100 animate-pulse" />;
}
