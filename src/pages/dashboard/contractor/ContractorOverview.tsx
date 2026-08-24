import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, DollarSign, Clock, CheckCircle2, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { apiService } from '@/api/apiService';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '../DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function ContractorOverview() {
  const { user } = useAuth();
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: apiService.getProjects,
  });

  const myProjects = projects.filter((p) => p.contractorId === 'c1');
  const activeProjects = myProjects.filter((p) => ['ACCEPTED', 'IN_PROGRESS', 'AWAITING_REVIEW'].includes(p.status));
  const pendingRequests = myProjects.filter((p) => p.status === 'REQUESTED');
  const totalEarnings = myProjects.filter((p) => p.status === 'COMPLETED').reduce((s, p) => s + p.budget, 0);
  const completed = myProjects.filter((p) => p.status === 'COMPLETED');

  return (
    <div>
      <DashboardHeader
        title="Contractor Dashboard"
        subtitle="Manage your projects, track earnings, and maintain your verification status."
        action={
          <Link to="/dashboard/contractor/kyc">
            <Button size="sm" variant={user?.kycStatus === 'APPROVED' ? 'outline' : 'accent'}>
              <ShieldCheck className="w-4 h-4" /> KYC Status
            </Button>
          </Link>
        }
      />

      {/* KYC Banner */}
      {user?.kycStatus !== 'APPROVED' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5 mb-6 bg-gradient-to-r from-accent-50 to-amber-50 border-accent-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-500 rounded-xl"><ShieldCheck className="w-6 h-6 text-white" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Complete your KYC Verification</h3>
                <p className="text-sm text-slate-600">Get verified to start accepting project requests from clients.</p>
              </div>
              <Link to="/dashboard/contractor/kyc"><Button size="sm">Start Verification</Button></Link>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Projects" value={activeProjects.length} icon={FolderKanban} accent="brand" />
        <StatCard label="Pending Bookings" value={pendingRequests.length} icon={Clock} accent="accent" />
        <StatCard label="Today’s Workforce" value="8 Workers" icon={CheckCircle2} accent="green" />
        <StatCard label="Total Earnings" value={`₹${(totalEarnings / 100000).toFixed(1)} lakh`} icon={DollarSign} accent="slate" />
        <StatCard label="Pending Payments" value="₹3.4L" icon={TrendingUp} accent="brand" />
        <StatCard label="Average Rating" value="4.8/5" icon={ShieldCheck} accent="green" />
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Project Requests</h2>
      {myProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No projects yet</h3>
          <p className="text-sm text-slate-500 mt-1">Once clients request your services, projects will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {myProjects.slice(0, 4).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{p.title}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm text-slate-500">{p.clientName} · {p.location} · ₹{p.budget.toLocaleString('en-IN')}</p>
                </div>
                <Link to="/dashboard/contractor/projects"><Button size="sm" variant="ghost">Manage <ArrowRight className="w-4 h-4" /></Button></Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
