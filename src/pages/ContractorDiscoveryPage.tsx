import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, ShieldCheck, Sparkles, MapPin,
  Star, Wrench, X, ChevronDown,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { mockContractors, allSpecializations, allLocations } from '@/api/mockData';

export default function ContractorDiscoveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'price'>('rating');

  const filtered = useMemo(() => {
    let result = [...mockContractors];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((c) =>
        c.businessName.toLowerCase().includes(q) ||
        c.specializations.some((s) => s.toLowerCase().includes(q)) ||
        c.location.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q)
      );
    }
    if (selectedSpecs.length) {
      result = result.filter((c) => selectedSpecs.some((s) => c.specializations.includes(s)));
    }
    if (selectedLocation) {
      result = result.filter((c) => c.location === selectedLocation);
    }
    if (minRating > 0) {
      result = result.filter((c) => c.rating >= minRating);
    }
    if (verifiedOnly) {
      result = result.filter((c) => c.verified);
    }
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return a.hourlyRate - b.hourlyRate;
    });
    return result;
  }, [query, selectedSpecs, selectedLocation, minRating, verifiedOnly, sortBy]);

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) => prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]);
  };

  const clearFilters = () => {
    setSelectedSpecs([]);
    setSelectedLocation('');
    setMinRating(0);
    setVerifiedOnly(false);
    setQuery('');
  };

  const activeFilterCount = selectedSpecs.length + (selectedLocation ? 1 : 0) + (minRating > 0 ? 1 : 0) + (verifiedOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onAuthClick={() => navigate('/')} />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 font-display">Find Contractors</h1>
            <p className="mt-1 text-slate-500">Browse verified professionals for your home improvement project.</p>
          </div>

          {/* Search + Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-soft">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, specialty, or location..."
                className="flex-1 text-sm outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')}><X className="w-4 h-4 text-slate-400" /></button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                  showFilters || activeFilterCount > 0 ? 'bg-brand-50 border-brand-300 text-brand-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-brand-600 text-white text-xs rounded-full">{activeFilterCount}</span>
                )}
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'price')}
                  className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 cursor-pointer outline-none focus:border-brand-400"
                >
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="price">Lowest Price</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Clear all</button>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Specialization</label>
                    <div className="flex flex-wrap gap-2">
                      {allSpecializations.slice(0, 8).map((spec) => (
                        <button
                          key={spec}
                          onClick={() => toggleSpec(spec)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            selectedSpecs.includes(spec) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-brand-400"
                    >
                      <option value="">All Locations</option>
                      {allLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Minimum Rating</label>
                    <div className="flex gap-2">
                      {[0, 4, 4.5, 4.8].map((r) => (
                        <button
                          key={r}
                          onClick={() => setMinRating(r)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            minRating === r ? 'bg-accent-500 text-white border-accent-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {r === 0 ? 'Any' : <>{r}★+</>}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                      <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="w-4 h-4 accent-brand-600" />
                      <span className="text-sm text-slate-600 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-600" /> Verified only</span>
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <p className="text-sm text-slate-500 mb-4">{filtered.length} contractor{filtered.length !== 1 ? 's' : ''} found</p>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <StarRating rating={c.rating} showValue size={14} />
                      <span className="text-xs text-slate-400">({c.reviewCount})</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-3 line-clamp-2">{c.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {c.specializations.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{s}</span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                      <div>
                        <span className="text-sm font-bold text-slate-900">${c.hourlyRate}</span>
                        <span className="text-xs text-slate-400">/hr</span>
                        <span className="text-xs text-slate-400 ml-2">· {c.projectsCompleted} projects</span>
                      </div>
                      <Button size="sm" onClick={() => navigate('/')}>View</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No contractors found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
