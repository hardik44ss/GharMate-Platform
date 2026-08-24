import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Upload, FileText, CheckCircle2, Clock, XCircle,
  IdCard, Award, Building2, FileCheck, Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import type { KycStatus } from '@/types';

interface DocSlot {
  type: 'ID_PROOF' | 'LICENSE' | 'INSURANCE' | 'BUSINESS_REGISTRATION';
  label: string;
  icon: typeof IdCard;
  required: boolean;
}

const docSlots: DocSlot[] = [
  { type: 'ID_PROOF', label: 'Government ID', icon: IdCard, required: true },
  { type: 'LICENSE', label: 'Contractor License', icon: Award, required: true },
  { type: 'INSURANCE', label: 'Insurance Certificate', icon: ShieldCheck, required: true },
  { type: 'BUSINESS_REGISTRATION', label: 'Business Registration', icon: Building2, required: false },
];

export default function KycPortal() {
  const { user } = useAuth();
  const [status, setStatus] = useState<KycStatus>(user?.kycStatus ?? 'NOT_SUBMITTED');
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleUpload = (type: string) => {
    setUploaded((prev) => ({ ...prev, [type]: `${type}_document.pdf` }));
    toast.success('Document uploaded');
  };

  const handleSubmit = () => {
    if (!businessName || !businessAddress || !taxId || !licenseNumber) {
      toast.error('Please fill in all required fields');
      return;
    }
    const missing = docSlots.filter((d) => d.required && !uploaded[d.type]);
    if (missing.length) {
      toast.error(`Please upload: ${missing.map((m) => m.label).join(', ')}`);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStatus('PENDING');
      toast.success('KYC application submitted for review!');
    }, 1500);
  };

  if (status === 'APPROVED') {
    return (
      <div>
        <DashboardHeader title="KYC Verification" subtitle="Your contractor verification status." />
        <Card className="p-10 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Verified Contractor</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Your KYC verification has been approved. You can now accept project requests and appear in contractor search results with a verified badge.</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StatusBadge status="APPROVED" />
            <span className="text-sm text-slate-500">Verified since Aug 2026</span>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'PENDING') {
    return (
      <div>
        <DashboardHeader title="KYC Verification" subtitle="Your contractor verification status." />
        <Card className="p-10 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Under Review</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Your documents are being reviewed by our admin team. This typically takes 1-2 business days. You will be notified once the review is complete.</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StatusBadge status="PENDING" />
            <span className="text-sm text-slate-500">Submitted on Aug 11, 2026</span>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div>
        <DashboardHeader title="KYC Verification" subtitle="Your contractor verification status." />
        <Card className="p-10 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Verification Rejected</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Your KYC submission was rejected. Please review the reason below and resubmit with updated documents.</p>
          <div className="mt-4 p-4 bg-red-50 rounded-xl text-left">
            <p className="text-sm font-semibold text-red-700">Reason:</p>
            <p className="text-sm text-red-600 mt-1">Expired license document. Please upload a current, valid contractor license.</p>
          </div>
          <Button className="mt-6" onClick={() => setStatus('NOT_SUBMITTED')}>Resubmit Application</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="KYC Verification" subtitle="Submit your business details and credentials to get verified." />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-brand-600" /> Business Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Name *</label>
                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-brand-400 outline-none" placeholder="PrimeBuild Contractors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">License Number *</label>
                <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-brand-400 outline-none" placeholder="HR-CON-459812" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Address *</label>
                <input value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-brand-400 outline-none" placeholder="Sector 14, Gurugram, Haryana 122001" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">PAN / GSTIN *</label>
                <input value={taxId} onChange={(e) => setTaxId(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-brand-400 outline-none" placeholder="27ABCDE1234F1Z9" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileCheck className="w-5 h-5 text-brand-600" /> Document Upload</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {docSlots.map((slot) => {
                const isUploaded = !!uploaded[slot.type];
                return (
                  <div
                    key={slot.type}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(slot.type); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(null); handleUpload(slot.type); }}
                    className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-colors ${dragOver === slot.type ? 'border-brand-500 bg-brand-50' : isUploaded ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    {isUploaded ? (
                      <div>
                        <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">{uploaded[slot.type]}</p>
                        <button onClick={() => setUploaded((prev) => { const n = { ...prev }; delete n[slot.type]; return n; })} className="text-xs text-red-500 mt-1">Remove</button>
                      </div>
                    ) : (
                      <div>
                        <slot.icon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">{slot.label}{slot.required && <span className="text-red-500"> *</span>}</p>
                        <p className="text-xs text-slate-400 mt-1">Drag & drop or click</p>
                        <button onClick={() => handleUpload(slot.type)} className="text-xs text-brand-600 font-semibold mt-2">Browse</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-900">Verification Checklist</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Business details', done: !!(businessName && businessAddress && taxId && licenseNumber) },
                ...docSlots.map((d) => ({ label: d.label, done: !!uploaded[d.type] })),
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> : <Clock className="w-4 h-4 text-slate-300 shrink-0" />}
                  <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span>
                </div>
              ))}
            </div>
            <Button fullWidth className="mt-5" onClick={handleSubmit} loading={submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit for Review'}
            </Button>
            <p className="text-xs text-slate-400 mt-3 text-center">Review typically takes 1-2 business days</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
