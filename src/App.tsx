import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LandingPage from '@/pages/LandingPage';
import ContractorDiscoveryPage from '@/pages/ContractorDiscoveryPage';
import ContractorDetailPage from '@/pages/ContractorDetailPage';
import ClientOverview from '@/pages/dashboard/client/ClientOverview';
import AICostEstimator from '@/pages/dashboard/client/AICostEstimator';
import AIRecommender from '@/pages/dashboard/client/AIRecommender';
import BookingManager from '@/pages/dashboard/client/BookingManager';
import ReviewManager from '@/pages/dashboard/client/ReviewManager';
import ContractorOverview from '@/pages/dashboard/contractor/ContractorOverview';
import KycPortal from '@/pages/dashboard/contractor/KycPortal';
import ProjectKanban from '@/pages/dashboard/contractor/ProjectKanban';
import AdminOverview from '@/pages/dashboard/admin/AdminOverview';
import KycApprovalQueue from '@/pages/dashboard/admin/KycApprovalQueue';
import UserManagement from '@/pages/dashboard/admin/UserManagement';
import AuditLogs from '@/pages/dashboard/admin/AuditLogs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      // Fall back to demo data quickly when the backend/DB is unavailable
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contractors" element={<ContractorDiscoveryPage />} />
        <Route path="/contractors/:id" element={<ContractorDetailPage />} />

            {/* Client Dashboard */}
            <Route path="/dashboard/client" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<ClientOverview />} />
              <Route path="estimator" element={<AICostEstimator />} />
              <Route path="recommender" element={<AIRecommender />} />
              <Route path="bookings" element={<BookingManager />} />
              <Route path="reviews" element={<ReviewManager />} />
            </Route>

            {/* Contractor Dashboard */}
            <Route path="/dashboard/contractor" element={<ProtectedRoute allowedRoles={['ROLE_CONTRACTOR']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<ContractorOverview />} />
              <Route path="kyc" element={<KycPortal />} />
              <Route path="projects" element={<ProjectKanban />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="kyc" element={<KycApprovalQueue />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="audit" element={<AuditLogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
