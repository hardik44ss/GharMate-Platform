import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, Calculator, Sparkles, FileText, Star,
  ShieldCheck, KanbanSquare, Users, ScrollText, LogOut, ChevronLeft,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const navByRole: Record<UserRole, NavItem[]> = {
  ROLE_CLIENT: [
    { label: 'Overview', to: '/dashboard/client', icon: LayoutDashboard },
    { label: 'Find Contractors', to: '/contractors', icon: Search },
    { label: 'AI Cost Estimator', to: '/dashboard/client/estimator', icon: Calculator },
    { label: 'AI Recommender', to: '/dashboard/client/recommender', icon: Sparkles },
    { label: 'Bookings & Documents', to: '/dashboard/client/bookings', icon: FileText },
    { label: 'Reviews', to: '/dashboard/client/reviews', icon: Star },
  ],
  ROLE_CONTRACTOR: [
    { label: 'Overview', to: '/dashboard/contractor', icon: LayoutDashboard },
    { label: 'KYC Verification', to: '/dashboard/contractor/kyc', icon: ShieldCheck },
    { label: 'Project Board', to: '/dashboard/contractor/projects', icon: KanbanSquare },
  ],
  ROLE_ADMIN: [
    { label: 'Overview', to: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'KYC Approvals', to: '/dashboard/admin/kyc', icon: ShieldCheck },
    { label: 'User Management', to: '/dashboard/admin/users', icon: Users },
    { label: 'Audit Logs', to: '/dashboard/admin/audit', icon: ScrollText },
  ],
};

const roleLabels: Record<UserRole, string> = {
  ROLE_CLIENT: 'Client',
  ROLE_CONTRACTOR: 'Contractor',
  ROLE_ADMIN: 'Administrator',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;
  const items = navByRole[user.role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`hidden lg:flex flex-col bg-brand-950 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} shrink-0 sticky top-0 h-screen`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div>
            <p className="text-xs text-white/50 font-medium">Signed in as</p>
            <p className="text-sm font-semibold truncate">{user.fullName}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === `/dashboard/${user.role.split('_')[1].toLowerCase()}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className={`flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-white/5`}>
          <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold shrink-0">
            {user.fullName.charAt(0)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{roleLabels[user.role]}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const items = navByRole[user.role].slice(0, 4);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-950 border-t border-white/10 z-30">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === `/dashboard/${user.role.split('_')[1].toLowerCase()}`}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium ${isActive ? 'text-white' : 'text-white/50'}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="max-w-[60px] truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
