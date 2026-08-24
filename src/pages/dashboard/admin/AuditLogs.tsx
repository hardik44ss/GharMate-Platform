import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, ScrollText, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '@/api/apiService';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import type { AuditLog } from '@/types';

const PAGE_SIZE = 8;

export default function AuditLogs() {
  const { data: logs = [] } = useQuery({ queryKey: ['audit'], queryFn: apiService.getAuditLogs });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'WARNING'>('ALL');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
      if (search && !l.userName.toLowerCase().includes(search.toLowerCase()) && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.details.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [logs, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <DashboardHeader title="Audit Logs" subtitle="System activity log showing all user actions and events." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-white rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search by user, action, or details..." className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'SUCCESS', 'FAILED', 'WARNING'] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }} className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${statusFilter === s ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{s}</button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">User</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Action</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Details</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">IP Address</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pageData.map((log: AuditLog, i: number) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50">
                  <td className="px-5 py-3"><p className="text-sm font-medium text-slate-700">{log.userName}</p></td>
                  <td className="px-5 py-3"><span className="text-xs font-mono px-2 py-1 bg-slate-100 text-slate-600 rounded">{log.action}</span></td>
                  <td className="px-5 py-3 max-w-xs"><p className="text-sm text-slate-500 truncate">{log.details}</p></td>
                  <td className="px-5 py-3"><span className="text-xs text-slate-400 font-mono">{log.ipAddress}</span></td>
                  <td className="px-5 py-3"><StatusBadge status={log.status} /></td>
                  <td className="px-5 py-3 text-sm text-slate-500">{new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ScrollText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No audit logs found</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">Page {page + 1} of {totalPages} · {filtered.length} total</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
