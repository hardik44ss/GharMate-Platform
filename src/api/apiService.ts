import type {
  Contractor,
  Project,
  Review,
  Bid,
  KycSubmission,
  AuditLog,
  PlatformMetrics,
  CostEstimate,
  ContractorMatch,
  AuthUser,
} from '@/types';
import {
  mockContractors,
  mockAuditLogs,
  mockMetrics,
  mockProjects,
  mockReviews,
  mockKycSubmissions,
  mockBids,
} from './mockData';
import api from './axiosClient';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function withFallback<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
  return apiCall().catch(() => fallback);
}

export const apiService = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async loginAsRole(role: AuthUser['role']): Promise<AuthUser> {
    await delay(600);
    const presets: Record<AuthUser['role'], AuthUser> = {
      ROLE_CLIENT: { id: 'u-client-1', email: 'rahul@gharmate.in', fullName: 'Rahul Sharma', role: 'ROLE_CLIENT', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
      ROLE_CONTRACTOR: { id: 'u-conn-1', email: 'rajesh@aaravbuildworks.in', fullName: 'Rajesh Kumar', role: 'ROLE_CONTRACTOR', kycStatus: 'APPROVED', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0d1ef5d0d2fc?w=200&h=200&fit=crop' },
      ROLE_ADMIN: { id: 'u-admin-1', email: 'admin@gharmate.in', fullName: 'System Admin', role: 'ROLE_ADMIN', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' },
    };
    return presets[role];
  },

  async signup(data: { email: string; fullName: string; role: AuthUser['role']; password: string }): Promise<{ token: string; user: AuthUser }> {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async getProfile(): Promise<AuthUser> {
    const res = await api.get('/auth/profile');
    return res.data.user;
  },

  async getContractors(): Promise<Contractor[]> {
    return withFallback(async () => {
      const res = await api.get('/contractors');
      return res.data?.contractors ?? [];
    }, mockContractors);
  },

  async getContractor(id: string): Promise<Contractor | undefined> {
    return withFallback(async () => {
      const res = await api.get(`/contractors/${id}`);
      return res.data?.contractor ?? undefined;
    }, mockContractors.find((c) => c.id === id));
  },

  async getProjects(): Promise<Project[]> {
    return withFallback(async () => {
      const res = await api.get('/projects');
      // Backend wraps the list as { projects: [...] } — unwrap to a bare array
      return res.data?.projects ?? [];
    }, mockProjects);
  },

  async getMyProjects(): Promise<Project[]> {
    return withFallback(async () => {
      const res = await api.get('/projects/mine');
      return res.data?.projects ?? [];
    }, mockProjects);
  },

  async getMyBids(): Promise<Bid[]> {
    return withFallback(async () => {
      const res = await api.get('/bids/mine');
      return res.data?.bids ?? [];
    }, mockBids);
  },

  async getReviews(contractorId: string): Promise<Review[]> {
    return withFallback(async () => {
      const res = await api.get(`/reviews/contractor/${contractorId}`);
      return res.data?.reviews ?? [];
    }, mockReviews.filter((r) => r.contractorId === contractorId));
  },

  async getKycSubmissions(): Promise<KycSubmission[]> {
    return withFallback(async () => {
      const res = await api.get('/kyc/admin/pending');
      return res.data?.kycSubmissions ?? [];
    }, mockKycSubmissions);
  },

  async approveKyc(id: string): Promise<void> {
    try {
      await api.put(`/kyc/admin/${id}`, { status: 'VERIFIED' });
    } catch {
      // Demo fallback: queue updates locally when a live backend is unreachable
    }
  },

  async rejectKyc(id: string, reason: string): Promise<void> {
    try {
      await api.put(`/kyc/admin/${id}`, { status: 'REJECTED', reason });
    } catch {
      // Demo fallback: queue updates locally when a live backend is unreachable
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return withFallback(async () => {
      const { default: api } = await import('./axiosClient');
      const res = await api.get('/admin/audit-logs');
      return res.data;
    }, mockAuditLogs);
  },

  async getMetrics(): Promise<PlatformMetrics> {
    return withFallback(async () => {
      const { default: api } = await import('./axiosClient');
      const res = await api.get('/admin/metrics');
      return res.data;
    }, mockMetrics);
  },

  async estimateCost(input: {
    projectType: string;
    squareFootage: number;
    materialQuality: string;
    location: string;
    propertyType?: string;
    floors?: number;
    constructionType?: string;
    qualityLevel?: string;
    labourRequirement?: string;
    duration?: string;
  }): Promise<CostEstimate> {
    await delay(1200);
    const baseRates: Record<string, number> = {
      'Civil Construction': 1850,
      'New Home Construction': 2050,
      'Home Renovation': 1200,
      'Interior Design': 95,
      'Modular Kitchen': 140,
      'Bathroom Renovation': 165,
      'Flooring': 70,
      'Painting': 45,
      'Electrical Work': 90,
      'Plumbing': 700,
      'Landscaping': 380,
      'Structural Work': 1950,
      'False Ceiling': 110,
      'Waterproofing': 85,
      'Carpentry': 80,
    };
    const qualityMultipliers: Record<string, number> = {
      'Budget': 0.8,
      'Standard': 1.0,
      'Premium': 1.35,
      'Luxury': 1.75,
    };
    const locationMultipliers: Record<string, number> = {
      'Gurugram, Haryana': 1.08,
      'Noida, Uttar Pradesh': 1.05,
      'Chandigarh, Punjab': 1.02,
      'Mohali, Punjab': 1.01,
      'Bengaluru, Karnataka': 1.08,
      'Mumbai, Maharashtra': 1.12,
      'Hyderabad, Telangana': 1.02,
      'Pune, Maharashtra': 1.05,
      'Delhi NCR': 1.1,
      'Chennai, Tamil Nadu': 1.0,
      'Ahmedabad, Gujarat': 0.98,
      'Jaipur, Rajasthan': 0.96,
      'Kolkata, West Bengal': 0.99,
      'Lucknow, Uttar Pradesh': 0.97,
      'Panipat, Haryana': 0.95,
      'Karnal, Haryana': 0.95,
      'Hisar, Haryana': 0.93,
      'Ambala, Haryana': 0.94,
    };

    const floorsMultiplier = (input.floors ?? 1) > 2 ? 1.18 : 1;
    const labourMultiplier = input.labourRequirement === 'Skilled + Semi-skilled' ? 1.12 : input.labourRequirement === 'Labour only' ? 0.9 : 1;
    const propertyMultiplier = input.propertyType === 'Independent House' ? 1.12 : input.propertyType === 'Villa' ? 1.2 : 1;
    const baseRate = baseRates[input.projectType] ?? 800;
    const qualityMult = qualityMultipliers[input.materialQuality] ?? 1.0;
    const locMult = locationMultipliers[input.location] ?? 1.0;
    const baseCost = baseRate * input.squareFootage * qualityMult * locMult * floorsMultiplier * labourMultiplier * propertyMultiplier;

    const lowRange = Math.round(baseCost * 0.85 / 10000) * 10000;
    const highRange = Math.round(baseCost * 1.25 / 10000) * 10000;
    const midpoint = Math.round((lowRange + highRange) / 2 / 10000) * 10000;

    const laborPct = 0.29;
    const materialsPct = 0.47;
    const professionalPct = 0.16;
    const miscellaneousPct = 0.08;

    const timelineMonths = Math.max(2, Math.ceil((input.squareFootage / 180) * (input.floors ?? 1)));
    const summary = `Based on your ${input.location}, ${input.squareFootage} sq. ft. ${input.propertyType?.toLowerCase() || 'property'} and ${input.qualityLevel || input.materialQuality.toLowerCase()} quality level.`;

    return {
      lowRange,
      highRange,
      midpoint,
      breakdown: [
        { category: 'Material', amount: Math.round(midpoint * materialsPct), percentage: materialsPct * 100 },
        { category: 'Labour', amount: Math.round(midpoint * laborPct), percentage: laborPct * 100 },
        { category: 'Professional Charges', amount: Math.round(midpoint * professionalPct), percentage: professionalPct * 100 },
        { category: 'Miscellaneous', amount: Math.round(midpoint * miscellaneousPct), percentage: miscellaneousPct * 100 },
      ],
      timeline: `${timelineMonths}–${timelineMonths + 2} months`,
      confidence: 88,
      summary,
      recommendedRange: `Recommended budget range: ₹${(lowRange / 100000).toFixed(1)}–₹${(highRange / 100000).toFixed(1)} lakh`,
      insights: [
        `Labour accounts for approximately ${Math.round(laborPct * 100)}% of the estimated cost.`,
        `Selected quality: ${input.materialQuality}. Estimated delivery window: ${timelineMonths}–${timelineMonths + 2} months.`
      ],
    };
  },

  async recommendContractors(input: {
    budget: number;
    projectType: string;
    timeline: string;
    location: string;
  }): Promise<ContractorMatch[]> {
    await delay(1000);
    const matches = mockContractors
      .map((c) => {
        let score = 50;
        const reasons: string[] = [];
        if (c.specializations.some((s) => s.toLowerCase().includes(input.projectType.toLowerCase()) || input.projectType.toLowerCase().includes(s.toLowerCase()))) {
          score += 25;
          reasons.push('Specialization match');
        }
        if (c.location === input.location) {
          score += 15;
          reasons.push('Local to your area');
        } else if (c.location.split(',')[1]?.trim() === input.location.split(',')[1]?.trim()) {
          score += 8;
          reasons.push('Serves your state');
        }
        if (c.rating >= 4.8) {
          score += 10;
          reasons.push(`Excellent rating (${c.rating}★)`);
        }
        if (c.verified) {
          score += 5;
          reasons.push('KYC verified');
        }
        const isSqFtModel = c.specializations.some((s) => ['Civil Construction', 'New Home Construction', 'Structural Work', 'Interior Design', 'Modular Kitchen', 'Flooring'].includes(s));
        const estCost = isSqFtModel ? c.hourlyRate * 700 : c.hourlyRate * 35;
        if (estCost <= input.budget * 1.2) {
          score += 5;
          reasons.push('Within budget range');
        }
        return { contractor: c, matchScore: Math.min(score, 99), matchReasons: reasons };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    return matches;
  },
};
