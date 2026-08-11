export type UserRole = 'ROLE_CLIENT' | 'ROLE_CONTRACTOR' | 'ROLE_ADMIN';

export type KycStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type ProjectStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'AWAITING_REVIEW'
  | 'COMPLETED'
  | 'REJECTED';

export type BookingStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  kycStatus?: KycStatus;
}

export interface Contractor {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  bio: string;
  location: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  hourlyRate: number;
  avatarUrl: string;
  coverUrl: string;
  verified: boolean;
  aiRecommended?: boolean;
  yearsActive: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
  amount: number;
  completedDate?: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  contractorId: string;
  contractorName: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  budget: number;
  startDate: string;
  estimatedEndDate: string;
  location: string;
  milestones: Milestone[];
  progress: number;
}

export interface Review {
  id: string;
  projectId: string;
  contractorId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface KycSubmission {
  id: string;
  contractorId: string;
  contractorName: string;
  businessName: string;
  email: string;
  status: KycStatus;
  submittedAt: string;
  documents: KycDocument[];
  businessAddress: string;
  taxId: string;
  licenseNumber: string;
  rejectionReason?: string;
}

export interface KycDocument {
  id: string;
  type: 'ID_PROOF' | 'LICENSE' | 'INSURANCE' | 'BUSINESS_REGISTRATION';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeProjects: number;
  pendingKycs: number;
  totalRevenue: number;
  totalContractors: number;
  totalClients: number;
  verifiedContractors: number;
  monthlyGrowth: number;
}

export interface CostEstimate {
  lowRange: number;
  highRange: number;
  midpoint: number;
  breakdown: { category: string; amount: number; percentage: number }[];
  timeline: string;
  confidence: number;
}

export interface ContractorMatch {
  contractor: Contractor;
  matchScore: number;
  matchReasons: string[];
}
