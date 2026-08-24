import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, FolderKanban, ShieldCheck, DollarSign, TrendingUp, Wrench, Home, ArrowUpRight } from 'lucide-react';
import { apiService } from '@/api/apiService';
import DashboardHeader from '../DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminOverview() {
  const { data: metrics } = useQuery({ queryKey: ['metrics'], queryFn: apiService.getMetrics });
  const { data: kycSubs = [] } = useQuery({ queryKey: ['kyc'], queryFn: apiService.getKycSubmissions });
  const { data: logs = [] } = useQuery({ queryKey: ['audit'], queryFn: apiService.getAuditLogs });

  if (!metrics) return null;
  const pendingKycs = kycSubs.filter((k) => k.status === 'PENDING');

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" subtitle="Platform overview, metrics, and system health." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={metrics.totalUsers.toLocaleString()} icon={Users} accent="brand" trend={`${metrics.monthlyGrowth}%`} trendUp />
        <StatCard label="Active Projects" value={metrics.activeProjects} icon={FolderKanban} accent="accent" />
        <StatCard label="Pending KYCs" value={metrics.pendingKycs} icon={ShieldCheck} accent="red" />
        <StatCard label="Total Volume" value={`₹${(metrics.totalRevenue / 1e5).toFixed(1)}L`} icon={DollarSign} accent="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><Wrench className="w-5 h-5 text-brand-600" /><h3 className="font-bold text-slate-900">Contractors</h3></div>
          <p className="text-3xl font-bold text-slate-900 font-display">{metrics.totalContractors.toLocaleString()}</p>
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-slate-500">Verified: <strong className="text-green-600">{metrics.verifiedContractors}</strong></span>
            <span className="text-slate-500">Pending: <strong className="text-amber-600">{metrics.pendingKycs}</strong></span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><Home className="w-5 h-5 text-accent-600" /><h3 className="font-bold text-slate-900">Clients</h3></div>
          <p className="text-3xl font-bold text-slate-900 font-display">{metrics.totalClients.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600"><TrendingUp className="w-4 h-4" /> {metrics.monthlyGrowth}% growth this month</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-5 h-5 text-green-600" /><h3 className="font-bold text-slate-900">Platform Volume</h3></div>
          <p className="text-3xl font-bold text-slate-900 font-display">₹{(metrics.totalRevenue / 1e5).toFixed(2)}L</p>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600"><ArrowUpRight className="w-4 h-4" /> +12.4% vs last month</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending KYCs */}
        <Card className="p-5">
          <h3 className="font-bold text-slate-900 mb-4">Pending KYC Approvals</h3>
          {pendingKycs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No pending approvals</p>
          ) : (
            <div className="space-y-3">
              {pendingKycs.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{k.businessName}</p>
                    <p className="text-xs text-slate-500">{k.contractorName} · {new Date(k.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <StatusBadge status={k.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <StatusBadge status={log.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 truncate">{log.details}</p>
                  <p className="text-xs text-slate-400">{log.userName} · {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
