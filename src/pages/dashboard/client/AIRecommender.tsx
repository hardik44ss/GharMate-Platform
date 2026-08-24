import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Star, Loader2, Wand2 } from 'lucide-react';
import { apiService } from '@/api/apiService';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { allSpecializations, allLocations } from '@/api/mockData';
import type { ContractorMatch } from '@/types';

export default function AIRecommender() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState(25000);
  const [timeline, setTimeline] = useState('1-3 months');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [matches, setMatches] = useState<ContractorMatch[] | null>(null);

  const { isFetching, refetch } = useQuery({
    queryKey: ['contractor-matches', projectType, budget, timeline, location],
    queryFn: () => apiService.recommendContractors({ budget, projectType, timeline, location }),
    enabled: false,
  });

  const findMatches = async () => {
    const res = await refetch();
    if (res.data) {
      setMatches(res.data);
      setStep(3);
    }
  };

  const steps = ['Project Type', 'Budget', 'Location & Timeline'];

  return (
    <div>
      <DashboardHeader title="AI-Powered Contractor Recommendation" subtitle="Smart contractor matching for construction and renovation projects in India." />

      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                i <= step ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded-full ${i < step ? 'bg-brand-600' : 'bg-slate-100'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What type of project are you planning?</h3>
                <p className="text-sm text-slate-500 mb-6">Select the category that best describes your project.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allSpecializations.slice(0, 9).map((s) => (
                    <button key={s} onClick={() => setProjectType(s)} className={`p-4 rounded-xl border-2 text-left transition-all ${projectType === s ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <p className="text-sm font-semibold text-slate-900">{s}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <Button disabled={!projectType} onClick={() => setStep(1)}>Continue <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What is your budget range?</h3>
                <p className="text-sm text-slate-500 mb-6">This helps us match you with contractors who fit your budget.</p>
                <div className="text-center py-8">
                  <p className="text-4xl font-bold text-brand-600 font-display">₹{budget.toLocaleString('en-IN')}</p>
                  <input type="range" min="10000" max="1000000" step="5000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mt-6 accent-brand-600" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹10,000</span><span>₹10,00,000+</span></div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(2)}>Continue <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Location & Timeline</h3>
                <p className="text-sm text-slate-500 mb-6">Where is the project and when do you need it done?</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-400 bg-slate-50">
                      {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Timeline</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['< 1 month', '1-3 months', '3-6 months', '6+ months'].map((t) => (
                        <button key={t} onClick={() => setTimeline(t)} className={`py-2.5 text-sm font-semibold rounded-lg border transition-colors ${timeline === t ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={findMatches} loading={isFetching} className="bg-accent-500 hover:bg-accent-600">
                    <Wand2 className="w-4 h-4" /> Find My Matches
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && matches && (
            <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <h3 className="text-lg font-bold text-slate-900">Recommended for You</h3>
                <span className="text-sm text-slate-500">· {matches.length} contractors matched</span>
              </div>
              <div className="space-y-4">
                {matches.map((m, i) => (
                  <motion.div key={m.contractor.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card hover className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <img src={m.contractor.avatarUrl} alt={m.contractor.businessName} className="w-14 h-14 rounded-xl object-cover" />
                          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full">{m.matchScore}% Match</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 truncate">{m.contractor.businessName}</h4>
                            {m.contractor.verified && <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{m.contractor.specializations[0]} · {m.contractor.location}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <StarRating rating={m.contractor.rating} showValue size={12} />
                            <span>{m.contractor.yearsActive} years experience</span>
                            <span>{m.contractor.projectsCompleted} completed projects</span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-slate-700 mb-2">Why GharMate recommends him</p>
                            <div className="flex flex-wrap gap-1.5">
                              {m.matchReasons.map((r) => (
                                <span key={r} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium flex items-center gap-1">
                                  <span className="w-1 h-1 bg-green-500 rounded-full" /> {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="shrink-0">Contact</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button variant="ghost" onClick={() => { setStep(0); setMatches(null); }}>Start Over</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
