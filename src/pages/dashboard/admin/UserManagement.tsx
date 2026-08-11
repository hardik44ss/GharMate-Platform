import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Ban, CheckCircle2, Users, Wrench, Home, Shield } from 'lucide-react';
import DashboardHeader from '../DashboardHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { mockUsers, mockContractors } from '@/api/mockData';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'BLOCKED';
  joined: string;
}

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  const users: ManagedUser[] = [
    ...mockUsers.map((u) => ({ id: u.id, name: u.fullName, email: u.email, role: u.role, status: 'ACTIVE' as const, joined: '2026-01-15' })),
    ...mockContractors.slice(0, 5).map((c) => ({ id: c.userId, name: c.ownerName, email: `contact@${c.businessName.toLowerCase().replace(/[^a-z]/g, '')}.com`, role: 'ROLE_CONTRACTOR' as UserRole, status: 'ACTIVE' as const, joined: '2026-02-20' })),
    { id: 'u-spam-1', name: 'Spam Account', email: 'spam@temp.com', role: 'ROLE_CLIENT', status: 'BLOCKED', joined: '2026-08-01' },
  ];

  const filtered = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const roleIcons: Record<UserRole, typeof Users> = { ROLE_CLIENT: Home, ROLE_CONTRACTOR: Wrench, ROLE_ADMIN: Shield };
  const roleLabels: Record<UserRole, string> = { ROLE_CLIENT: 'Client', ROLE_CONTRACTOR: 'Contractor', ROLE_ADMIN: 'Admin' };

  const toggleBlock = (user: ManagedUser) => {
    toast.success(user.status === 'ACTIVE' ? `${user.name} has been blocked` : `${user.name} has been unblocked`);
  };

  return (
    <div>
      <DashboardHeader title="User Management" subtitle="Manage user roles, block accounts, and oversee platform users." />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center"><Home className="w-5 h-5 text-brand-600 mx-auto mb-1" /><p className="text-2xl font-bold text-slate-900 font-display">{users.filter(u => u.role === 'ROLE_CLIENT').length}</p><p className="text-xs text-slate-500">Clients</p></Card>
        <Card className="p-4 text-center"><Wrench className="w-5 h-5 text-accent-600 mx-auto mb-1" /><p className="text-2xl font-bold text-slate-900 font-display">{users.filter(u => u.role === 'ROLE_CONTRACTOR').length}</p><p className="text-xs text-slate-500">Contractors</p></Card>
        <Card className="p-4 text-center"><Shield className="w-5 h-5 text-green-600 mx-auto mb-1" /><p className="text-2xl font-bold text-slate-900 font-display">{users.filter(u => u.role === 'ROLE_ADMIN').length}</p><p className="text-xs text-slate-500">Admins</p></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-white rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'ROLE_CLIENT', 'ROLE_CONTRACTOR', 'ROLE_ADMIN'] as const).map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${roleFilter === r ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {r === 'ALL' ? 'All' : roleLabels[r]}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">User</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Joined</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u, i) => {
                const RoleIcon = roleIcons[u.role];
                return (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">{u.name.charAt(0)}</div>
                        <div><p className="text-sm font-semibold text-slate-900">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="inline-flex items-center gap-1.5 text-sm text-slate-600"><RoleIcon className="w-3.5 h-3.5" /> {roleLabels[u.role]}</span></td>
                    <td className="px-5 py-3">{u.status === 'ACTIVE' ? <StatusBadge status="APPROVED" /> : <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-red-50 text-red-700 border-red-200">Blocked</span>}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{new Date(u.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant={u.status === 'ACTIVE' ? 'danger' : 'primary'} onClick={() => toggleBlock(u)}>
                        {u.status === 'ACTIVE' ? <><Ban className="w-3.5 h-3.5" /> Block</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Unblock</>}
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
