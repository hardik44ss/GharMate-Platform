import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  const { user } = useAuth();
  const firstName = user?.fullName.split(' ')[0] || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
    >
      <div>
        <p className="text-sm text-slate-500">Welcome back, {firstName}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-0.5">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
