import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Upload, FileText, CheckCircle2, Clock, Circle, MapPin,
  Calendar, DollarSign, X, FileCheck,
} from 'lucide-react';
import { apiService } from '@/api/apiService';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { toast } from 'sonner';
import type { Milestone } from '@/types';

const milestoneIcons = {
  COMPLETED: CheckCircle2,
  IN_PROGRESS: Clock,
  PENDING: Circle,
};

const milestoneColors = {
  COMPLETED: 'text-green-600 bg-green-50',
  IN_PROGRESS: 'text-blue-600 bg-blue-50',
  PENDING: 'text-slate-400 bg-slate-50',
};

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function BookingManager() {
  const { user } = useAuth();
  const { data: projects = [] } = useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: apiService.getMyProjects,
  });
  const myProjects = projects;
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a PDF, JPG or PNG file.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} is larger than 10MB.`);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length) {
      // De-duplicate by name + size so re-picking the same file does not stack up
      setFiles((prev) => {
        const seen = new Set(prev.map((f) => `${f.name}:${f.size}`));
        return [...prev, ...accepted.filter((f) => !seen.has(`${f.name}:${f.size}`))];
      });
    }
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const closeUpload = () => {
    setUploadOpen(false);
    setFiles([]);
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Select at least one file to upload.');
      return;
    }
    setUploading(true);
    try {
      await apiService.uploadProjectDocuments(files);
      toast.success(`${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully`);
      closeUpload();
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Bookings & Documents"
        subtitle="Track project milestones and manage your project documents."
        action={<Button size="sm" onClick={() => setUploadOpen(true)}><Upload className="w-4 h-4" /> Upload Document</Button>}
      />

      <div className="space-y-6">
        {myProjects.map((project, i) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{project.title}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-slate-500">{project.contractorName} · {project.category}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due {new Date(project.estimatedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ₹{project.budget.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Milestone Timeline */}
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {project.milestones.map((m: Milestone) => {
                    const Icon = milestoneIcons[m.status];
                    return (
                      <div key={m.id} className="relative flex items-start gap-4 pl-0">
                        <div className={`p-1.5 rounded-full ${milestoneColors[m.status]} shrink-0 z-10`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 flex items-center justify-between gap-3 pb-2">
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${m.status === 'COMPLETED' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{m.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                            <p className="text-xs text-slate-400 mt-1">Due {new Date(m.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-slate-700">₹{m.amount.toLocaleString('en-IN')}</p>
                            {m.completedDate && <p className="text-xs text-green-600">Completed {new Date(m.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Documents */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Project Documents</h4>
                  <Button size="sm" variant="ghost" onClick={() => setUploadOpen(true)}><Upload className="w-3.5 h-3.5" /> Upload</Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {['contract_agreement.pdf', 'site_survey.pdf', 'architectural_plans.pdf'].map((doc) => (
                    <div key={doc} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <FileCheck className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="text-sm text-slate-600 truncate flex-1">{doc}</span>
                      <button className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal open={uploadOpen} onClose={closeUpload} title="Upload Document" subtitle="Securely upload project documents to Cloudinary." size="md"
        footer={
          <>
            <Button variant="ghost" onClick={closeUpload}>Cancel</Button>
            <Button onClick={handleUpload} loading={uploading} disabled={uploading || files.length === 0}>
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading…' : `Upload${files.length ? ` (${files.length})` : ''}`}
            </Button>
          </>
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors outline-none focus-visible:border-brand-500 ${dragOver ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Drag & drop files here</p>
          <p className="text-xs text-slate-500 mt-1">or click to browse. PDF, JPG, PNG up to 10MB.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Browse Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Selected ({files.length})</p>
            {files.map((file, i) => (
              <div key={`${file.name}-${file.size}`} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
                <span className="text-xs text-slate-400 shrink-0">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(i)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
