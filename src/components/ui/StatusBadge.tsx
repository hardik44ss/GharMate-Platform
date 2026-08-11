import type { KycStatus, ProjectStatus, BookingStatus, AuditLog } from '@/types';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileEdit, Loader, CircleDot } from 'lucide-react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  accent: 'bg-accent-50 text-accent-700 border-accent-200',
};

const variantIcons: Record<BadgeVariant, typeof CheckCircle2 | null> = {
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
  info: Clock,
  neutral: null,
  accent: null,
};

interface StatusBadgeProps {
  status: KycStatus | ProjectStatus | BookingStatus | AuditLog['status'];
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${variantStyles[config.variant]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}

function getStatusConfig(status: string): { variant: BadgeVariant; label: string; icon: typeof CheckCircle2 | null } {
  const map: Record<string, { variant: BadgeVariant; label: string; icon: typeof CheckCircle2 | null }> = {
    APPROVED: { variant: 'success', label: 'Approved', icon: CheckCircle2 },
    PENDING: { variant: 'warning', label: 'Pending', icon: Clock },
    REJECTED: { variant: 'danger', label: 'Rejected', icon: XCircle },
    NOT_SUBMITTED: { variant: 'neutral', label: 'Not Submitted', icon: null },

    REQUESTED: { variant: 'info', label: 'Requested', icon: CircleDot },
    ACCEPTED: { variant: 'accent', label: 'Accepted', icon: FileEdit },
    IN_PROGRESS: { variant: 'info', label: 'In Progress', icon: Loader },
    AWAITING_REVIEW: { variant: 'warning', label: 'Awaiting Review', icon: AlertCircle },
    COMPLETED: { variant: 'success', label: 'Completed', icon: CheckCircle2 },

    ACTIVE: { variant: 'info', label: 'Active', icon: Loader },
    CANCELLED: { variant: 'danger', label: 'Cancelled', icon: XCircle },
    SUCCESS: { variant: 'success', label: 'Success', icon: CheckCircle2 },
    FAILED: { variant: 'danger', label: 'Failed', icon: XCircle },
    WARNING: { variant: 'warning', label: 'Warning', icon: AlertCircle },
  };
  return map[status] ?? { variant: 'neutral', label: status, icon: null };
}
