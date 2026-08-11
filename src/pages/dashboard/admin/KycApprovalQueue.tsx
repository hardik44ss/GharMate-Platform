import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Check, X, MapPin, Award, Building2, Eye, Loader2 } from 'lucide-react';
import { apiService } from '@/api/apiService';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { toast } from 'sonner';
import type { KycSubmission } from '@/types';

const docTypeLabels: Record<string, string> = {
  ID_PROOF: 'ID Proof',
  LICENSE: 'License',
  INSURANCE: 'Insurance',
  BUSINESS_REGISTRATION: 'Business Registration',
};

export default function KycApprovalQueue() {
  const queryClient = useQueryClient();
  const { data: submissions } = useQuery({ queryKey: ['kyc'], queryFn: apiService.getKycSubmissions, initialData: [] });
  const [selected, setSelected] = useState<KycSubmission | null>(null);
  const [rejectOpen, setRejectOpen] = useState<KycSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiService.approveKyc(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kyc'] }); toast.success('KYC approved'); setSelected(null); },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => apiService.rejectKyc(id, reason),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kyc'] }); toast.success('KYC rejected'); setRejectOpen(null); setRejectReason(''); },
  });

  const filtered = filter === 'ALL' ? submissions : submissions.filter((s) => s.status === filter);
  const pendingCount = submissions.filter((s) => s.status === 'PENDING').length;

  return (
    <div>
      <DashboardHeader title="KYC Approval Queue" subtitle={`${pendingCount} pending verification requests awaiting review.`} />

      <div className="flex gap-2 mb-6">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No {filter.toLowerCase()} submissions</h3>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub, i) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-brand-50 rounded-xl shrink-0">
                      <Building2 className="w-6 h-6 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{sub.businessName}</h3>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="text-sm text-slate-500">{sub.contractorName} · {sub.email}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {sub.businessAddress}</span>
                        <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {sub.licenseNumber}</span>
                        <span>Submitted {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {sub.documents.length} documents</span>
                      </div>
                      {sub.rejectionReason && <p className="text-xs text-red-500 mt-2">Rejected: {sub.rejectionReason}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(sub)}><Eye className="w-4 h-4" /> Review</Button>
                    {sub.status === 'PENDING' && (
                      <>
                        <Button size="sm" onClick={() => approveMutation.mutate(sub.id)} loading={approveMutation.isPending} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /> Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => setRejectOpen(sub)}><X className="w-4 h-4" /> Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="KYC Review" subtitle={selected?.businessName} size="lg"
        footer={selected?.status === 'PENDING' ? (
          <>
            <Button variant="danger" onClick={() => { setRejectOpen(selected); setSelected(null); }}><X className="w-4 h-4" /> Reject</Button>
            <Button onClick={() => approveMutation.mutate(selected.id)} loading={approveMutation.isPending}><Check className="w-4 h-4" /> Approve</Button>
          </>
        ) : <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>}
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-400">Contractor</p><p className="font-semibold text-slate-700">{selected.contractorName}</p></div>
              <div><p className="text-xs text-slate-400">Email</p><p className="font-semibold text-slate-700">{selected.email}</p></div>
              <div><p className="text-xs text-slate-400">Business Address</p><p className="font-semibold text-slate-700">{selected.businessAddress}</p></div>
              <div><p className="text-xs text-slate-400">Tax ID</p><p className="font-semibold text-slate-700">{selected.taxId}</p></div>
              <div><p className="text-xs text-slate-400">License Number</p><p className="font-semibold text-slate-700">{selected.licenseNumber}</p></div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Documents</p>
              <div className="space-y-2">
                {selected.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{doc.fileName}</p>
                      <p className="text-xs text-slate-400">{docTypeLabels[doc.type]} · {new Date(doc.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <Button size="sm" variant="ghost">Preview</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal open={!!rejectOpen} onClose={() => setRejectOpen(null)} title="Reject KYC" subtitle={rejectOpen?.businessName} size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setRejectOpen(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => rejectOpen && rejectMutation.mutate({ id: rejectOpen.id, reason: rejectReason })} disabled={!rejectReason}>Confirm Rejection</Button>
        </>}
      >
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rejection Reason *</label>
          <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} placeholder="Explain why this KYC is being rejected..." className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-brand-400 outline-none resize-none" />
        </div>
      </Modal>
    </div>
  );
}
