import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send } from 'lucide-react';
import { apiService } from '@/api/apiService';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import Modal from '@/components/ui/Modal';
import { toast } from 'sonner';
import type { Project } from '@/types';

export default function ReviewManager() {
  const { user } = useAuth();
  const { data: projects = [] } = useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: apiService.getMyProjects,
  });
  const myProjects = projects;
  const reviewable = myProjects.filter((p) => p.status === 'COMPLETED' || p.status === 'AWAITING_REVIEW');
  const [reviewOpen, setReviewOpen] = useState<Project | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = () => {
    toast.success('Review submitted successfully!');
    setReviewOpen(null);
    setRating(5);
    setComment('');
  };

  return (
    <div>
      <DashboardHeader title="Reviews & Ratings" subtitle="Share your experience and help others find great contractors." />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 text-center">
          <p className="text-3xl font-bold text-accent-500 font-display">{myProjects.filter(p => p.status === 'COMPLETED').length}</p>
          <p className="text-sm text-slate-500 mt-1">Completed Projects</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-3xl font-bold text-brand-600 font-display">{reviewable.length}</p>
          <p className="text-sm text-slate-500 mt-1">Awaiting Review</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-3xl font-bold text-slate-700 font-display">4.8</p>
          <p className="text-sm text-slate-500 mt-1">Your Avg Rating Given</p>
        </Card>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Projects to Review</h2>
      {reviewable.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No projects to review yet</h3>
          <p className="text-sm text-slate-500 mt-1">Completed projects will appear here for you to leave a review.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviewable.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{p.contractorName} · Completed {new Date(p.estimatedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <Button size="sm" onClick={() => { setReviewOpen(p); setRating(5); setComment(''); }}>
                  <MessageSquare className="w-4 h-4" /> Write Review
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!reviewOpen} onClose={() => setReviewOpen(null)} title="Leave a Review" subtitle={reviewOpen?.title}
        footer={<><Button variant="ghost" onClick={() => setReviewOpen(null)}>Cancel</Button><Button onClick={submitReview}><Send className="w-4 h-4" /> Submit Review</Button></>}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Rating</label>
            <div className="flex items-center gap-2">
              <StarRating rating={rating} interactive onChange={setRating} size={32} />
              <span className="text-lg font-bold text-slate-700 ml-2">{rating}.0</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience working with this contractor..."
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
