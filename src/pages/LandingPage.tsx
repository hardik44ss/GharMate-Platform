import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ShieldCheck, Calculator, Sparkles, Star, ArrowRight,
  Hammer, Wrench, Home, FileCheck, Users, TrendingUp, Quote,
  Mail, CheckCircle, Lock, Zap,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StarRating from '@/components/ui/StarRating';
import AuthModal from '@/components/AuthModal';
import { mockContractors } from '@/api/mockData';
import { allSpecializations } from '@/api/mockData';
import { toast } from 'sonner';

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const formatContractorPricing = (specialization: string, rate: number) => {
    if (['New Home Construction', 'Civil Construction', 'Structural Work'].includes(specialization)) {
      return `Starting from ₹${rate.toLocaleString('en-IN')}/sq. ft.`;
    }
    if (['Interior Design', 'Modular Kitchen', 'Flooring', 'False Ceiling'].includes(specialization)) {
      return `Starting from ₹${rate.toLocaleString('en-IN')}/sq. ft.`;
    }
    return `Labour from ₹${rate.toLocaleString('en-IN')}/day`;
  };

  const handleSearch = () => {
    navigate(`/contractors${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar onAuthClick={() => setAuthOpen(true)} />

      {/* Hero */}
      <section className="relative gradient-hero pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px gold-rule" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-brand-200 shadow-soft mb-7"
          >
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span className="text-sm font-medium text-brand-700">AI-Driven GharMate Platform for Smart Construction Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-950 font-display leading-tight"
          >
            Build Smarter.
            <br />
            <span className="italic text-accent-600">Manage Better.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-brand-600 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with verified contractors, estimate construction costs with AI, track labour and project milestones, and manage your entire construction project in one place.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-brand-200 shadow-float">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-brand-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="What are you planning to build?"
                  className="w-full py-3 text-sm text-brand-800 placeholder-brand-400 outline-none bg-transparent"
                />
              </div>
              <Button size="lg" onClick={handleSearch} className="shrink-0">
                Find Contractors <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-brand-400">Popular:</span>
              {['New Home Construction', 'Home Renovation', 'Interior Design', 'Kitchen Renovation', 'Bathroom Renovation', 'Painting', 'Electrical Work', 'Plumbing', 'Flooring', 'Civil Work'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setSearchQuery(tag); navigate(`/contractors?q=${encodeURIComponent(tag)}`); }}
                  className="text-xs px-3 py-1 bg-white hover:bg-brand-100 text-brand-700 rounded-full border border-brand-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-y border-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '4,800+', label: 'Homeowners' },
            { icon: ShieldCheck, value: '890+', label: 'Verified Contractors' },
            { icon: FileCheck, value: '340+', label: 'Active Projects' },
            { icon: Star, value: '4.8★', label: 'Average Rating' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <div className="p-2.5 bg-brand-50 rounded-xl">
                <stat.icon className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 font-display">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">How GharMate Works</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">From planning to execution in four focused steps.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Search, step: '01', title: 'Plan Your Project', desc: 'Tell GharMate what you want to build or renovate, including location, property type, area and requirements.' },
              { icon: Calculator, step: '02', title: 'Estimate with AI', desc: 'Get an AI-assisted construction cost estimate based on project details, location, materials and labour requirements.' },
              { icon: ShieldCheck, step: '03', title: 'Find & Hire', desc: 'Discover verified contractors based on expertise, location, budget, ratings and project requirements.' },
              { icon: FileCheck, step: '04', title: 'Build & Track', desc: 'Track milestones, labour, budget, payments and project progress from one dashboard.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-50 rounded-xl">
                      <item.icon className="w-6 h-6 text-brand-600" />
                    </div>
                    <span className="text-3xl font-bold text-slate-100 font-display">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Preview */}
      <section id="ai-tools" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-50 rounded-full mb-3">
              <Sparkles className="w-4 h-4 text-accent-600" />
              <span className="text-xs font-semibold text-accent-700">AI-Powered</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">AI-Powered Construction Tools</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">Plan your construction project with intelligent estimates and contractor recommendations.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="p-8 bg-gradient-to-br from-brand-50 to-white border-brand-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-brand-600 rounded-xl">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">AI Cost Estimator</h3>
                </div>
                <p className="text-slate-600 mb-6">Get an AI-assisted estimate for your construction or renovation project with estimated material, labour, professional and miscellaneous costs.</p>
                <div className="space-y-2 mb-6">
                  {['Location-adjusted pricing by city', 'Built-up area and material quality based estimate', 'Labour cost, duration, cost breakdown and budget range'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" /> {f}
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setAuthOpen(true)}>Estimate My Project <ArrowRight className="w-4 h-4" /></Button>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="p-8 bg-gradient-to-br from-accent-50 to-white border-accent-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-accent-500 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">AI Contractor Recommender</h3>
                </div>
                <p className="text-slate-600 mb-6">Find contractors matched to your project requirements, location, budget and preferred timeline.</p>
                <div className="space-y-2 mb-6">
                  {['Specialty and location match', 'Budget compatibility and availability', 'Experience, ratings and KYC verification'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" /> {f}
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={() => setAuthOpen(true)}>Find My Contractor <ArrowRight className="w-4 h-4" /></Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contractor Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">Top-Rated Contractors</h2>
              <p className="mt-2 text-slate-500">Verified professionals for construction, renovation, interiors, and civil work.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/contractors')} className="hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockContractors.slice(0, 6).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card hover className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-32 overflow-hidden">
                    <img src={c.coverUrl} alt={c.businessName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    {c.verified && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Verified</span>
                      </div>
                    )}
                    {c.aiRecommended && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-accent-500 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-semibold text-white">AI Pick</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-3">
                      <img src={c.avatarUrl} alt={c.ownerName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm -mt-8" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{c.businessName}</h3>
                        <p className="text-xs text-slate-500">{c.location} · {c.yearsActive} yrs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <StarRating rating={c.rating} showValue size={14} />
                      <span className="text-xs text-slate-400">({c.reviewCount} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {c.specializations.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{s}</span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">{formatContractorPricing(c.specializations[0], c.hourlyRate)}</span>
                      <Button size="sm" variant="ghost" onClick={() => navigate('/contractors')}>View Profile</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">Loved by Homeowners</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rahul Sharma', text: 'I could compare contractors, understand the estimated budget and track my construction progress from one place.', role: 'Home Construction' },
              { name: 'Priya Gupta', text: 'The project milestones and budget tracking made it much easier to understand where our renovation was actually going.', role: 'Home Renovation' },
              { name: 'Amit Verma', text: 'The contractor verification and AI-assisted estimate helped us shortlist professionals with much more confidence.', role: 'New Home Construction' },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <Quote className="w-8 h-8 text-brand-200 mb-3" />
                  <p className="text-slate-600 leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                    <StarRating rating={5} size={14} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-brand">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">Ready to build your next project?</h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">Plan your construction, find verified professionals and track your project with GharMate.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => setAuthOpen(true)} className="bg-white text-brand-800 hover:bg-white/90">
              Start Your Project <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate('/contractors')} className="text-white border-white/30 hover:bg-white/10">
              Explore Contractors
            </Button>
          </div>
        </div>
      </section>

      {/* Finishing Section — Newsletter & Trust */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold mb-4">
              <Mail className="w-3.5 h-3.5" /> Stay in the loop
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">Get project tips and construction insights</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">Join our newsletter for practical guides on construction planning, contractor hiring, and project tracking updates.</p>
          </div>

          <div className="max-w-md mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Thanks for subscribing!'); }} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
              />
              <Button type="submit" size="lg">Subscribe <ArrowRight className="w-4 h-4" /></Button>
            </form>
            <p className="text-xs text-slate-400 text-center mt-3">By subscribing you agree to our Privacy Policy.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-16 pt-12 border-t border-slate-200">
            {[
              { icon: Lock, title: 'Secure Platform Design', desc: 'Role-based access and protected application flows for clients, contractors, and admins.' },
              { icon: ShieldCheck, title: 'Verified Professionals', desc: 'KYC information and verification status are displayed for contractors on the platform.' },
              { icon: Zap, title: 'Project Transparency', desc: 'Budgets, milestones, labour updates and project details are organized in one place.' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12 text-slate-400">
            {['Verified contractor profiles', 'AI-assisted project planning', 'Milestone and budget visibility', 'Transparent estimate breakdowns'].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5 text-sm font-medium">
                <CheckCircle className="w-4 h-4 text-green-500" /> {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-white/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-brand-700 rounded-lg">
                  <Hammer className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white font-display">GharMate</span>
              </div>
              <p className="text-sm">An AI-driven construction and contractor management platform helping homeowners plan, build and manage projects with greater confidence.</p>
            </div>
            {[
              { title: 'For Homeowners', links: ['Find Contractors', 'AI Cost Estimator', 'Project Tracking', 'How It Works', 'Reviews'] },
              { title: 'For Contractors', links: ['Get Verified', 'Manage Projects', 'Manage Labour', 'Find Projects', 'Contractor Dashboard'] },
              { title: 'Platform', links: ['AI Recommendations', 'Construction Estimates', 'Milestone Tracking', 'KYC & Verification'] },
              { title: 'Company', links: ['About', 'Contact', 'Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2026 GharMate. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {allSpecializations.slice(0, 4).map((s) => (
                <span key={s} className="text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
