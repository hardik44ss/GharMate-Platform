import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, X, MapPin, DollarSign, Calendar, User, Loader2,
} from 'lucide-react';
import { apiService } from '@/api/apiService';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import type { Project, ProjectStatus } from '@/types';

const columns: { status: ProjectStatus; title: string; color: string }[] = [
  { status: 'REQUESTED', title: 'New Requests', color: 'border-t-blue-400' },
  { status: 'ACCEPTED', title: 'Accepted', color: 'border-t-accent-400' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-brand-400' },
  { status: 'AWAITING_REVIEW', title: 'Awaiting Review', color: 'border-t-amber-400' },
  { status: 'COMPLETED', title: 'Completed', color: 'border-t-green-400' },
];

export default function ProjectKanban() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: apiService.getProjects,
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const myProjects = projects.filter((p) => p.contractorId === 'c1');

  const updateStatus = (projectId: string, newStatus: ProjectStatus) => {
    queryClient.setQueryData(['projects', user?.id], (old: Project[]) =>
      old.map((p) => p.id === projectId ? { ...p, status: newStatus } : p)
    );
    toast.success(`Project moved to ${newStatus.replace('_', ' ').toLowerCase()}`);
    setSelectedProject(null);
  };

  const workforce = [
    { role: 'Masons', count: 3, rate: 900 },
    { role: 'Helpers', count: 3, rate: 600 },
    { role: 'Electrician', count: 1, rate: 1000 },
    { role: 'Plumber', count: 1, rate: 900 },
  ];
  const labourCost = workforce.reduce((sum, item) => sum + item.count * item.rate, 0);

  return (
    <div>
      <DashboardHeader title="Smart Construction Project Management" subtitle="Track bookings, milestone progress, labour and payments across active projects." />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-xs text-slate-500">Project Value</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹12.8L</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">Amount Paid</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹5.2L</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹7.6L</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">Progress</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">64%</p>
        </Card>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Current milestone</p>
            <p className="text-lg font-bold text-slate-900 mt-1">Electrical Work</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-slate-500">Expected Completion</p>
            <p className="font-semibold text-slate-700">18 September 2026</p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Today’s Workforce</h3>
          <span className="text-sm font-semibold text-brand-600">8 Workers</span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {workforce.map((member) => (
            <div key={member.role} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="font-semibold text-slate-800">{member.role}</p>
                <p className="text-xs text-slate-500">{member.count} workers</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">₹{member.rate}/day</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <p className="text-sm text-slate-600">Today’s Labour Cost</p>
          <p className="text-lg font-bold text-slate-900">₹{labourCost.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {columns.map((col) => {
          const colProjects = myProjects.filter((p) => p.status === col.status);
          return (
            <div key={col.status} className="w-72 shrink-0">
              <div className={`bg-white rounded-2xl border border-slate-200 border-t-4 ${col.color} shadow-soft p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700">{col.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{colProjects.length}</span>
                </div>
                <div className="space-y-3 min-h-[100px]">
                  {colProjects.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedProject(p)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><User className="w-3 h-3" /> {p.clientName}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {p.location.split(',')[0]}</span>
                        <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" /> ₹{(p.budget / 100000).toFixed(1)}L</span>
                      </div>
                      {p.progress > 0 && (
                        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {colProjects.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-300">No projects</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-float max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-slate-900">{selectedProject.title}</h2>
                <StatusBadge status={selectedProject.status} />
              </div>
              <p className="text-sm text-slate-500">{selectedProject.description}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-slate-400">Client</p><p className="font-semibold text-slate-700">{selectedProject.clientName}</p></div>
                <div><p className="text-xs text-slate-400">Budget</p><p className="font-semibold text-slate-700">₹{selectedProject.budget.toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-slate-400">Location</p><p className="font-semibold text-slate-700">{selectedProject.location}</p></div>
                <div><p className="text-xs text-slate-400">Start Date</p><p className="font-semibold text-slate-700">{new Date(selectedProject.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Milestones</p>
                <div className="space-y-2">
                  {selectedProject.milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm">
                      <span className={m.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-700'}>{m.title}</span>
                      <span className="text-xs text-slate-500">₹{m.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons based on status */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {selectedProject.status === 'REQUESTED' && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(selectedProject.id, 'ACCEPTED')}><Check className="w-4 h-4" /> Accept</Button>
                    <Button size="sm" variant="danger" onClick={() => updateStatus(selectedProject.id, 'REJECTED')}><X className="w-4 h-4" /> Reject</Button>
                  </>
                )}
                {selectedProject.status === 'ACCEPTED' && (
                  <Button size="sm" onClick={() => updateStatus(selectedProject.id, 'IN_PROGRESS')}>Start Work <ArrowRight className="w-4 h-4" /></Button>
                )}
                {selectedProject.status === 'IN_PROGRESS' && (
                  <Button size="sm" onClick={() => updateStatus(selectedProject.id, 'AWAITING_REVIEW')}>Request Client Review <ArrowRight className="w-4 h-4" /></Button>
                )}
                {selectedProject.status === 'AWAITING_REVIEW' && (
                  <Button size="sm" onClick={() => updateStatus(selectedProject.id, 'COMPLETED')}><Check className="w-4 h-4" /> Mark Completed</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setSelectedProject(null)}>Close</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
