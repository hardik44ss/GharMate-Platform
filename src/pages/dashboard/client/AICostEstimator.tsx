import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Sparkles, TrendingUp, Clock, DollarSign, Loader2 } from 'lucide-react';
import { apiService } from '@/api/apiService';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { allSpecializations, allLocations } from '@/api/mockData';
import type { CostEstimate } from '@/types';

export default function AICostEstimator() {
  const [projectType, setProjectType] = useState('New Home Construction');
  const [squareFootage, setSquareFootage] = useState(200);
  const [materialQuality, setMaterialQuality] = useState('Standard');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);

  const { isFetching, refetch } = useQuery({
    queryKey: ['cost-estimate', projectType, squareFootage, materialQuality, location],
    queryFn: () => apiService.estimateCost({ projectType, squareFootage, materialQuality, location }),
    enabled: false,
  });

  const handleEstimate = async () => {
    const res = await refetch();
    if (res.data) setEstimate(res.data);
  };

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div>
      <DashboardHeader title="AI-Assisted Cost Estimator" subtitle="Estimate construction and renovation budgets using your area, location, and material quality." />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-brand-50 rounded-lg"><Calculator className="w-5 h-5 text-brand-600" /></div>
              <h3 className="font-bold text-slate-900">Project Inputs</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Type</label>
                <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-400 bg-slate-50 focus:bg-white">
                  {allSpecializations.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Built-up Area: <span className="text-brand-600">{squareFootage} sq ft</span></label>
                <input type="range" min="50" max="2000" step="10" value={squareFootage} onChange={(e) => setSquareFootage(Number(e.target.value))} className="w-full accent-brand-600" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>50 sq ft</span><span>2000 sq ft</span></div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Material Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Budget', 'Standard', 'Premium', 'Luxury'].map((q) => (
                    <button key={q} onClick={() => setMaterialQuality(q)} className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${materialQuality === q ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{q}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-400 bg-slate-50 focus:bg-white">
                  {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <Button fullWidth size="lg" onClick={handleEstimate} loading={isFetching} className="bg-accent-500 hover:bg-accent-600">
                <Sparkles className="w-4 h-4" /> Estimate My Project
              </Button>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {isFetching ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="p-12 text-center">
                  <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-700">Analyzing project parameters...</h3>
                  <p className="text-sm text-slate-500 mt-1">GharMate is preparing an AI-assisted estimate based on city rates, area, and quality inputs.</p>
                </Card>
              </motion.div>
            ) : estimate ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="p-6 mb-4 bg-gradient-to-br from-brand-50 to-white border-brand-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-accent-500" />
                    <h3 className="font-bold text-slate-900">AI-Assisted Cost Estimate</h3>
                    <span className="ml-auto text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-semibold">{estimate.confidence}% confidence</span>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500">Estimated Construction Budget Range</p>
                    <p className="text-3xl font-bold text-slate-900 font-display mt-1">{formatCurrency(estimate.lowRange)} – {formatCurrency(estimate.highRange)}</p>
                    <p className="text-sm text-slate-500 mt-2">Midpoint: <strong className="text-brand-600">{formatCurrency(estimate.midpoint)}</strong></p>
                    {estimate.recommendedRange && <p className="text-sm text-brand-700 mt-2 font-semibold">{estimate.recommendedRange}</p>}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600"><Clock className="w-4 h-4 text-slate-400" /> Timeline: {estimate.timeline}</div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-bold text-slate-900 mb-4">Cost Breakdown</h4>
                  <div className="space-y-3">
                    {estimate.breakdown.map((item, i) => (
                      <motion.div key={item.category} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">{item.category}</span>
                          <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} className={`h-full rounded-full ${['bg-brand-500', 'bg-accent-500', 'bg-slate-400', 'bg-green-500'][i]}`} />
                        </div>
                        <span className="text-xs text-slate-400">{item.percentage}% of total</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      This is an AI-assisted estimate for planning. Actual contractor quotations may vary based on site conditions, scope changes, and material selections.
                    </p>
                  </div>
                  <Button fullWidth className="mt-4" variant="primary">
                    <DollarSign className="w-4 h-4" /> Find Contractors in Budget
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="p-12 text-center">
                  <div className="p-4 bg-brand-50 rounded-2xl w-fit mx-auto mb-4"><Calculator className="w-10 h-10 text-brand-500" /></div>
                  <h3 className="font-bold text-slate-900 text-lg">Ready to estimate</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Fill in your project details and click Generate Estimate to get an AI-powered cost breakdown.</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
