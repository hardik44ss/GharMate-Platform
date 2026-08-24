import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowLeft, Star, Sparkles, CalendarCheck, Building2,
  Users, Clock, CheckCircle2, ChevronRight, Ruler, Hammer, Quote, Send, X, BadgeCheck, MapPin,
} from 'lucide-react';
import { mockContractors, mockProjects, mockReviews } from '@/api/mockData';
import type { Review, Project } from '@/types';

const GALLERY = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581244277913-9f8760d2e9c0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1562259949-5c8e95e6c4be?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558618666fcd6c8a6e9c8b0?w=800&h=600&fit=crop',
];

const WEEK_SCHEDULE = [
  { day: 'Monday', slots: ['09:00 AM', '02:00 PM'] },
  { day: 'Tuesday', slots: ['09:00 AM', '11:30 AM'] },
  { day: 'Wednesday', slots: [] },
  { day: 'Thursday', slots: ['10:00 AM', '03:30 PM'] },
  { day: 'Friday', slots: ['09:00 AM'] },
  { day: 'Saturday', slots: ['10:00 AM', '01:00 PM'] },
  { day: 'Sunday', slots: [] },
];

/** Animated number that counts up when scrolled into view */
function CountUp({ value, decimals = 0, suffix = '' }: {
  value: number; decimals?: number; suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  if (inView && display === 0 && value !== 0) {
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  return <span ref={ref} className="tabular-nums">{display.toFixed(decimals)}{suffix}</span>;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-7">
      <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-accent-400/80">{eyebrow}</p>
      <div className="flex items-end justify-between gap-4 mt-1">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-900">{title}</h2>
        <div className="gold-rule flex-1 max-w-40 mb-2 hidden sm:block" />
      </div>
    </div>
  );
}

export default function ContractorDetailPage() {
  const { id } = useParams();
  const contractor = mockContractors.find((c) => c.id === id) ?? mockContractors[0];
  const reviews: Review[] = mockReviews.filter((r) => r.contractorId === contractor.id);
  const projects: Project[] = mockProjects.filter((p) => p.contractorId === contractor.id);

  const [tab, setTab] = useState<'overview' | 'gallery' | 'projects' | 'reviews'>('overview');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeShot, setActiveShot] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isSqFtModel = ['Civil Construction', 'New Home Construction', 'Structural Work', 'Interior Design', 'Modular Kitchen', 'Flooring']
    .some((s) => contractor.specializations.includes(s));
  const priceLabel = isSqFtModel
    ? `₹${contractor.hourlyRate.toLocaleString('en-IN')}/sq.ft`
    : `₹${contractor.hourlyRate.toLocaleString('en-IN')}/day`;

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'gallery' as const, label: 'Gallery' },
    { key: 'projects' as const, label: 'Projects', count: projects.length },
    { key: 'reviews' as const, label: 'Reviews', count: contractor.reviewCount },
  ];

  return (
    <div className="dark-page min-h-screen text-brand-900 pb-24">
      {/* ── Top bar ── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 220 }}
        className="sticky top-0 z-40 bg-brand-50/85 backdrop-blur-xl border-b border-brand-200/`10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2.5 text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors"
          >
            <span className="p-1.5 rounded-lg border border-brand-200/`15 group-hover:border-accent-400/50 group-hover:bg-brand-100 transition-all">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </span>
            Back to results
          </button>
          <Link to="/" className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
            <div className="p-1.5 bg-brand-700 rounded-lg"><Hammer className="w-4 h-4 text-brand-900" /></div>
            <span className="font-serif text-lg font-bold">GharMate</span>
          </Link>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={contractor.coverUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-brand-50" />
        </motion.div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center gap-2.5 mb-6"
          >
            {contractor.verified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                <BadgeCheck className="w-3.5 h-3.5" /> KYC Verified Professional
              </span>
            )}
            {contractor.aiRecommended && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-400/10 border border-accent-400/30 text-xs font-semibold text-accent-300 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommended
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 border border-brand-200/`15 text-xs font-medium text-brand-700 backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5" /> {contractor.yearsActive} years in business
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 18, stiffness: 200 }}
              className="relative shrink-0 w-fit"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-accent-400/50 to-brand-500/40 blur-md opacity-60" />
              {contractor.avatarUrl ? (
                <img src={contractor.avatarUrl} alt={contractor.ownerName}
                  className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border border-brand-200/`20" />
              ) : (
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-brand-900 border border-brand-200/`20 flex items-center justify-center font-serif text-2xl font-bold text-accent-300">
                  {contractor.ownerName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 min-w-0"
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent-400/90 mb-1">Contractor Profile</p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">{contractor.businessName}</h1>
              <p className="mt-2.5 text-brand-700 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5"><Building2 className="w-4 h-4 text-accent-400/80" /> {contractor.ownerName}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent-400/80" /> {contractor.location}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
                  <strong className="text-brand-900">{contractor.rating.toFixed(1)}</strong>
                  <span className="text-brand-500">({contractor.reviewCount.toLocaleString('en-IN')} reviews)</span>
                </span>
              </p>

              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Rating', value: contractor.rating, decimals: 1, suffix: '/5', icon: Star },
                  { label: 'Projects Done', value: contractor.projectsCompleted, decimals: 0, suffix: '+', icon: Ruler },
                  { label: 'Years Active', value: contractor.yearsActive, decimals: 0, suffix: '', icon: Clock },
                  { label: 'Crew Size', value: 24, decimals: 0, suffix: '', icon: Users },
                ].map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.08, duration: 0.5 }}
                    className="dark-panel dark-panel-hover px-4 py-3"
                  >
                    <s.icon className="w-4 h-4 text-accent-400/80 mb-1.5" />
                    <p className="text-xl font-bold leading-none"><CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} /></p>
                    <p className="text-[11px] text-brand-500 mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, type: 'spring', damping: 20, stiffness: 180 }}
              className="shrink-0 lg:w-64"
            >
              <div className="dark-panel p-5 bg-white backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-wider text-brand-500">Starting from</p>
                <p className="font-serif text-3xl font-bold text-accent-300 mt-1">{priceLabel}</p>
                <div className="gold-rule my-4" />
                <ul className="space-y-2 text-xs text-brand-700 mb-5">
                  {['Free site visit & quote', 'Milestone-based payments', 'Dedicated site supervisor'].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> {t}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-white text-sm font-bold transition-all duration-300 active:scale-[0.97]"
                >
                  <CalendarCheck className="w-4 h-4" /> Request Booking
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky tabs ── */}
      <div className="sticky top-16 z-30 bg-brand-50/90 backdrop-blur-xl border-y border-brand-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors ${
                tab === t.key ? 'text-accent-300' : 'text-brand-500 hover:text-brand-800'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-accent-400/20 text-accent-300' : 'bg-brand-100 text-brand-500'}`}>
                  {t.count}
                </span>
              )}
              {tab === t.key && (
                <motion.span layoutId="tab-underline" className="absolute left-3 right-3 bottom-0 h-0.5 bg-accent-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <AnimatePresence mode="wait">

          {tab === 'overview' && (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-10">
                  <section>
                    <SectionTitle eyebrow="About" title={`The ${contractor.businessName} story`} />
                    <Reveal><p className="text-brand-700 leading-relaxed">{contractor.bio}</p></Reveal>
                    <Reveal delay={0.08}>
                      <p className="text-brand-500 leading-relaxed mt-4">
                        With {contractor.yearsActive} years of on-ground experience across {contractor.location.split(',')[0]} and
                        nearby regions, our crews follow documented quality checklists at every stage — from excavation and structure
                        to finishing handover. Every project runs on milestone billing, so you only pay for verified completed work.
                      </p>
                    </Reveal>
                  </section>

                  <section>
                    <SectionTitle eyebrow="Services" title="Areas of specialisation" />
                    <div className="flex flex-wrap gap-2.5">
                      {contractor.specializations.map((s, i) => (
                        <motion.span
                          key={s}
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, type: 'spring', damping: 16, stiffness: 260 }}
                          whileHover={{ y: -3 }}
                          className="px-4 py-2 rounded-full border border-brand-200/`15 bg-brand-50 text-sm font-medium text-brand-800 cursor-default"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <SectionTitle eyebrow="Availability" title="Weekly site visit slots" />
                    <div className="dark-panel divide-y divide-brand-100 overflow-hidden">
                      {WEEK_SCHEDULE.map((d, i) => (
                        <motion.div key={d.day}
                          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between px-5 py-3.5 hover:bg-brand-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-brand-800 w-28">{d.day}</span>
                          {d.slots.length ? (
                            <div className="flex gap-2">
                              {d.slots.map((slot) => (
                                <span key={slot} className="px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-400/25 text-xs font-semibold text-emerald-300">
                                  {slot}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-brand-400 italic">Unavailable</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="space-y-4 lg:sticky lg:top-32 h-fit">
                  <Reveal>
                    <div className="dark-panel p-6">
                      <h3 className="font-serif text-lg font-semibold mb-4">Contact & documents</h3>
                      {[['Business', contractor.ownerName], ['Service area', contractor.location], ['Response time', '~2 hours'], ['Payment terms', 'Milestone based']].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-brand-200/`5 last:mb-0 last:border-0 last:pb-0">
                          <span className="text-brand-500 text-sm shrink-0">{k}</span>
                          <span className="font-semibold text-right text-brand-800 text-sm truncate">{v}</span>
                        </div>
                      ))}
                      <div className="gold-rule my-4" />
                      <button
                        onClick={() => setBookingOpen(true)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-accent-400/40 text-accent-300 hover:bg-accent-400/10 text-sm font-semibold transition-all active:scale-[0.97]"
                      >
                        <Send className="w-4 h-4" /> Enquire Now
                      </button>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <div className="dark-panel p-5 flex items-start gap-3">
                      <Quote className="w-6 h-6 text-accent-400/60 shrink-0 rotate-180" />
                      <p className="text-sm italic text-brand-700 leading-relaxed">
                        Quality is remembered long after the price is forgotten — we build like it's our own home.
                      </p>
                    </div>
                  </Reveal>
                </aside>
              </div>
            </motion.div>
          )}

          {tab === 'gallery' && (
            <motion.div key="gallery"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <SectionTitle eyebrow="Portfolio" title="Recent work gallery" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {GALLERY.map((src, i) => (
                  <motion.button
                    key={src}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveShot(src)}
                    className="group relative rounded-2xl overflow-hidden border border-brand-200/`10 aspect-[4/3]"
                  >
                    <img src={src} alt={`Work ${i + 1}`} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-3 left-4 text-xs font-semibold text-brand-900 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      View full size →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'projects' && (
            <motion.div key="projects"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <SectionTitle eyebrow="Track record" title="Projects delivered" />
              {projects.length === 0 ? (
                <p className="text-brand-500 text-sm py-10 text-center">No project history listed for this contractor yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((p, i) => (
                    <Reveal key={p.id} delay={i * 0.08}>
                      <div className="dark-panel dark-panel-hover overflow-hidden h-full flex flex-col">
                        <img src={GALLERY[i % GALLERY.length]} alt={p.title} loading="lazy" className="w-full h-40 object-cover" />
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <h3 className="font-serif font-semibold text-lg leading-snug">{p.title}</h3>
                            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              p.status === 'COMPLETED' ? 'bg-emerald-400/15 text-emerald-300'
                              : p.status === 'REQUESTED' ? 'bg-sky-400/15 text-sky-300'
                              : 'bg-accent-400/15 text-accent-300'}`}>
                              {p.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-brand-500 line-clamp-2">{p.description}</p>
                          <div className="mt-auto pt-4">
                            <div className="flex justify-between text-xs text-brand-500 mb-2">
                              <span>{p.category}</span>
                              <span className="font-bold text-accent-300">₹{(p.budget / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${p.progress}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full bg-gradient-to-r from-brand-500 to-accent-400 rounded-full"
                              />
                            </div>
                            <p className="text-[11px] text-brand-400 mt-1.5">{p.progress}% complete · {p.location}</p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'reviews' && (
            <motion.div key="reviews"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <SectionTitle eyebrow="Testimonials" title="What clients say" />
              {reviews.length === 0 ? (
                <p className="text-brand-500 text-sm py-10 text-center">
                  No written reviews on the platform yet — rated {contractor.rating.toFixed(1)}★ across {contractor.reviewCount} jobs.
                </p>
              ) : (
                <div className="space-y-4 max-w-3xl">
                  {reviews.map((r, i) => (
                    <Reveal key={r.id} delay={i * 0.08}>
                      <div className="dark-panel dark-panel-hover p-6 relative">
                        <Quote className="absolute top-5 right-6 w-8 h-8 text-brand-900/[0.07]" />
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} className={`w-4 h-4 ${s < r.rating ? 'fill-accent-400 text-accent-400' : 'fill-brand-200 text-brand-200'}`} />
                          ))}
                        </div>
                        <p className="text-brand-800 leading-relaxed">“{r.comment}”</p>
                        <div className="mt-4 pt-3 border-t border-brand-200/`5 flex items-center justify-between">
                          <span className="text-sm font-semibold">{r.clientName}</span>
                          <span className="text-xs text-brand-400">
                            {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {activeShot && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveShot(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              src={activeShot} alt="Work preview"
              className="max-w-4xl w-full rounded-2xl border border-brand-200/`15"
            />
            <button className="absolute top-6 right-6 p-2.5 rounded-xl bg-brand-100 hover:bg-brand-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking modal ── */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setBookingOpen(false); setSubmitted(false); }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 16, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="dark-panel w-full max-w-md p-7 relative"
            >
              <button
                onClick={() => { setBookingOpen(false); setSubmitted(false); }}
                className="absolute top-4 right-4 p-2 rounded-lg text-brand-500 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="mx-auto mb-5 w-14 h-14 rounded-full bg-emerald-400/15 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </motion.div>
                  <h3 className="font-serif text-2xl font-semibold">Request sent!</h3>
                  <p className="text-sm text-brand-500 mt-2 leading-relaxed">
                    {contractor.businessName} will get back to you within 24 hours to confirm your free site visit.
                  </p>
                  <button
                    onClick={() => { setBookingOpen(false); setSubmitted(false); }}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-white text-sm font-bold transition-colors active:scale-[0.97]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-accent-400/80">Free consultation</p>
                  <h3 className="font-serif text-2xl font-semibold mt-1">Book {contractor.businessName}</h3>
                  <div className="gold-rule my-4" />

                  <form
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="booking-name" className="block text-xs font-semibold text-brand-700 mb-1.5">Your name</label>
                      <input
                        id="booking-name" required placeholder="e.g. Priya Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-100 border border-brand-200/`10 focus:border-accent-400/60 focus:outline-none text-sm placeholder:text-brand-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-phone" className="block text-xs font-semibold text-brand-700 mb-1.5">Phone</label>
                      <input
                        id="booking-phone" required type="tel" pattern="[0-9+ -]{10,15}" placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-100 border border-brand-200/`10 focus:border-accent-400/60 focus:outline-none text-sm placeholder:text-brand-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-date" className="block text-xs font-semibold text-brand-700 mb-1.5">Preferred date</label>
                      <input
                        id="booking-date" required type="date"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-100 border border-brand-200/`10 focus:border-accent-400/60 focus:outline-none text-sm [color-scheme:dark] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-notes" className="block text-xs font-semibold text-brand-700 mb-1.5">Project details <span className="font-normal text-brand-400">(optional)</span></label>
                      <textarea
                        id="booking-notes" rows={3} placeholder="Tell them about your project…"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-100 border border-brand-200/`10 focus:border-accent-400/60 focus:outline-none text-sm placeholder:text-brand-400 resize-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-white text-sm font-bold transition-all duration-300 active:scale-[0.97]"
                    >
                      <Send className="w-4 h-4" /> Send request
                    </button>
                    <p className="text-[11px] text-brand-400 text-center">
                      No advance payment · Free site visit included
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}





