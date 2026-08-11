import type {
  Contractor,
  Project,
  Review,
  KycSubmission,
  AuditLog,
  PlatformMetrics,
  CostEstimate,
  ContractorMatch,
  AuthUser,
} from '@/types';
import {
  mockContractors,
  mockProjects,
  mockReviews,
  mockKycSubmissions,
  mockAuditLogs,
  mockMetrics,
} from './mockData';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function withFallback<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
  return apiCall().catch(() => fallback);
}

export const apiService = {
  async login(email: string, _password: string): Promise<AuthUser> {
    await delay(800);
    const user = mockProjects.length
      ? { id: 'u-client-1', email, fullName: 'Jordan Blake', role: 'ROLE_CLIENT' as const, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' }
      : { id: 'u-client-1', email, fullName: 'Jordan Blake', role: 'ROLE_CLIENT' as const };
    return user;
  },

  async loginAsRole(role: AuthUser['role']): Promise<AuthUser> {
    await delay(600);
    const presets: Record<AuthUser['role'], AuthUser> = {
      ROLE_CLIENT: { id: 'u-client-1', email: 'jordan@email.com', fullName: 'Jordan Blake', role: 'ROLE_CLIENT', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
      ROLE_CONTRACTOR: { id: 'u-conn-1', email: 'marcus@summitridge.com', fullName: 'Marcus Thornton', role: 'ROLE_CONTRACTOR', kycStatus: 'APPROVED', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0d1ef5d0d2fc?w=200&h=200&fit=crop' },
      ROLE_ADMIN: { id: 'u-admin-1', email: 'admin@buildbond.com', fullName: 'System Admin', role: 'ROLE_ADMIN', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' },
    };
    return presets[role];
  },

  async signup(data: { email: string; fullName: string; role: AuthUser['role'] }): Promise<AuthUser> {
    await delay(800);
    return { id: 'u-new-' + Date.now(), ...data };
  },

  async getContractors(): Promise<Contractor[]> {
    return withFallback(async () => {
      const { default: api } = await import('./axiosClient');
      const res = await api.get('/contractors');
      return res.data;
    }, mockContractors);
  },

  async getContractor(id: string): Promise<Contractor | undefined> {
    await delay(300);
    return mockContractors.find((c) => c.id === id);
  },

  async getProjects(): Promise<Project[]> {
    return withFallback(async () => {
      const { default: api } = await import('./axiosClient');
      const res = await api.get('/projects');
      return res.data;
    }, mockProjects);
  },

  async getReviews(contractorId: string): Promise<Review[]> {
    await delay(300);
    return mockReviews.filter((r) => r.contractorId === contractorId);
  },

  async getKycSubmissions(): Promise<KycSubmission[]> {
    return withFallback(async () => {
      const { default: api } = await import('./axiosClient');
      const res = await api.get('/admin/kyc');
      return res.data;
    }, mockKycSubmissions);
  },

  async approveKyc(id: string): Promise<void> {
    await delay(500);
    const sub = mockKycSubmissions.find((s) => s.id === id);
    if (sub) sub.status = 'APPROVED';
  },

  async rejectKyc(id: string, reason: string): Promise<void> {
    await delay(500);
    const sub = mockKycSubmissions.find((s) => s.id === id);
    if (sub) {
      sub.status = 'REJECTED';
      sub.rejectionReason = reason;
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
  }): Promise<CostEstimate> {
    await delay(1200);
    const baseRates: Record<string, number> = {
      'Kitchen Remodel': 250,
      'Bathroom Remodel': 300,
      'Home Addition': 320,
      'Roofing': 8,
      'Flooring': 12,
      'Electrical': 120,
      'Plumbing': 150,
      'Landscaping': 45,
      'Painting': 4,
    };
    const qualityMultipliers: Record<string, number> = {
      'Budget': 0.8,
      'Standard': 1.0,
      'Premium': 1.35,
      'Luxury': 1.75,
    };
    const locationMultipliers: Record<string, number> = {
      'Denver, CO': 1.05,
      'Austin, TX': 0.95,
      'Phoenix, AZ': 0.92,
      'San Diego, CA': 1.25,
      'Seattle, WA': 1.15,
      'Boston, MA': 1.2,
      'Portland, OR': 1.05,
      'Atlanta, GA': 0.9,
    };

    const baseRate = baseRates[input.projectType] ?? 100;
    const qualityMult = qualityMultipliers[input.materialQuality] ?? 1.0;
    const locMult = locationMultipliers[input.location] ?? 1.0;
    const baseCost = baseRate * input.squareFootage * qualityMult * locMult;

    const lowRange = Math.round(baseCost * 0.85 / 100) * 100;
    const highRange = Math.round(baseCost * 1.25 / 100) * 100;
    const midpoint = Math.round((lowRange + highRange) / 2 / 100) * 100;

    const laborPct = 0.4;
    const materialsPct = 0.35;
    const permitsPct = 0.1;
    const contingencyPct = 0.15;

    const timelineWeeks = Math.max(2, Math.ceil(input.squareFootage / 100));

    return {
      lowRange,
      highRange,
      midpoint,
      breakdown: [
        { category: 'Labor', amount: Math.round(midpoint * laborPct), percentage: laborPct * 100 },
        { category: 'Materials', amount: Math.round(midpoint * materialsPct), percentage: materialsPct * 100 },
        { category: 'Permits & Fees', amount: Math.round(midpoint * permitsPct), percentage: permitsPct * 100 },
        { category: 'Contingency', amount: Math.round(midpoint * contingencyPct), percentage: contingencyPct * 100 },
      ],
      timeline: `${timelineWeeks}–${timelineWeeks + 3} weeks`,
      confidence: 87,
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
        const estCost = c.hourlyRate * 40;
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
