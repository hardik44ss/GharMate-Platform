import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban, Clock, CheckCircle2, DollarSign, TrendingUp,
  ArrowRight, Sparkles, Calculator,
} from 'lucide-react';
import { apiService } from '@/api/apiService';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '../DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function ClientOverview() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: apiService.getMyProjects,
  });

  const myProjects = projects;
  const activeProjects = myProjects.filter((p) => ['ACCEPTED', 'IN_PROGRESS', 'AWAITING_REVIEW'].includes(p.status));
  const pendingApprovals = myProjects.filter((p) => p.status === 'AWAITING_REVIEW' || p.status === 'REQUESTED');
  const totalBudget = myProjects.reduce((sum, p) => sum + p.budget, 0);
  const completedProjects = myProjects.filter((p) => p.status === 'COMPLETED');

  return (
    <div>
      <DashboardHeader
        title="Project Overview"
        subtitle="Track your active projects, milestones, and spending at a glance."
        action={
          <Link to="/dashboard/client/estimator">
            <Button variant="accent" size="sm">
              <Calculator className="w-4 h-4" /> Estimate a Project
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Projects" value={activeProjects.length} icon={FolderKanban} accent="brand" />
        <StatCard label="Pending Approvals" value={pendingApprovals.length} icon={Clock} accent="accent" />
        <StatCard label="Completed" value={completedProjects.length} icon={CheckCircle2} accent="green" />
        <StatCard label="Total Invested" value={`₹${(totalBudget / 100000).toFixed(1)} lakh`} icon={DollarSign} accent="slate" />
      </div>

      {/* AI Tools Quick Access */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link to="/dashboard/client/estimator">
          <Card hover className="p-5 bg-gradient-to-br from-brand-50 to-white border-brand-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-brand-600 rounded-xl"><Calculator className="w-5 h-5 text-white" /></div>
              <div><h3 className="font-bold text-slate-900">AI Cost Estimator</h3><p className="text-xs text-slate-500">Get instant project cost estimates</p></div>
            </div>
            <p className="text-sm text-slate-600">Plan your budget with AI-powered estimates based on project scope, materials, and location.</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 mt-3">Open tool <ArrowRight className="w-4 h-4" /></span>
          </Card>
        </Link>
        <Link to="/dashboard/client/recommender">
          <Card hover className="p-5 bg-gradient-to-br from-accent-50 to-white border-accent-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-accent-500 rounded-xl"><Sparkles className="w-5 h-5 text-white" /></div>
              <div><h3 className="font-bold text-slate-900">AI Contractor Recommender</h3><p className="text-xs text-slate-500">Find your perfect match</p></div>
            </div>
            <p className="text-sm text-slate-600">Let our AI match you with the best contractors based on your budget, project type, and timeline.</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 mt-3">Open tool <ArrowRight className="w-4 h-4" /></span>
          </Card>
        </Link>
      </div>

      {/* Active Projects */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Active Projects</h2>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : activeProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No active projects yet</h3>
          <p className="text-sm text-slate-500 mt-1">Browse contractors and request a booking to get started.</p>
          <Link to="/contractors"><Button size="sm" className="mt-4">Find Contractors</Button></Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeProjects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate">{p.title}</h3>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-slate-500 truncate">{p.contractorName} · {p.category} · {p.location}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Budget: <strong className="text-slate-700">₹{p.budget.toLocaleString('en-IN')}</strong></span>
                      <span>Due: <strong className="text-slate-700">{new Date(p.estimatedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong></span>
                      <span>{p.milestones.filter((m) => m.status === 'COMPLETED').length}/{p.milestones.length} milestones</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Progress</p>
                      <p className="text-lg font-bold text-brand-600">{p.progress}%</p>
                    </div>
                    <div className="w-24">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <Link to="/dashboard/client/bookings">
                      <Button size="sm" variant="ghost">View <ArrowRight className="w-4 h-4" /></Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
