import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, authOpen: true }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    const dashMap: Record<UserRole, string> = {
      ROLE_CLIENT: '/dashboard/client',
      ROLE_CONTRACTOR: '/dashboard/contractor',
      ROLE_ADMIN: '/dashboard/admin',
    };
    return <Navigate to={dashMap[user.role]} replace />;
  }

  return <>{children}</>;
}
