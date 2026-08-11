import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wrench, Loader2, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'login' | 'signup';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Include one uppercase letter')
    .regex(/[0-9]/, 'Include one number'),
  confirmPassword: z.string(),
  role: z.enum(['ROLE_CLIENT', 'ROLE_CONTRACTOR']),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ROLE_CLIENT');
  const { login, signup, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', role: 'ROLE_CLIENT' },
  });

  const dashMap: Record<UserRole, string> = {
    ROLE_CLIENT: '/dashboard/client',
    ROLE_CONTRACTOR: '/dashboard/contractor',
    ROLE_ADMIN: '/dashboard/admin',
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      const u = await login(data.email, data.password);
      toast.success(`Welcome back, ${u.fullName.split(' ')[0]}!`);
      onClose();
      navigate(dashMap[u.role]);
    } catch {
      toast.error('Login failed. Check your credentials.');
    }
  };

  const onSignup = async (data: SignupFormData) => {
    try {
      const u = await signup({ email: data.email, fullName: data.fullName, role: data.role });
      toast.success(`Account created! Welcome, ${u.fullName.split(' ')[0]}.`);
      onClose();
      navigate(dashMap[u.role]);
    } catch {
      toast.error('Signup failed. Please try again.');
    }
  };

  const quickLogin = async (role: UserRole) => {
    try {
      const u = await loginAsRole(role);
      toast.success(`Signed in as ${u.fullName}`);
      onClose();
      navigate(dashMap[role]);
    } catch {
      toast.error('Quick login failed.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="mb-6">
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'login' ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'signup' ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500'}`}
          >
            Create Account
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'login' ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-4"
          >
            <Field label="Email" icon={Mail} error={loginForm.formState.errors.email?.message}>
              <input type="email" {...loginForm.register('email')} className="auth-input" placeholder="you@example.com" />
            </Field>
            <Field label="Password" icon={Lock} error={loginForm.formState.errors.password?.message}>
              <input type="password" {...loginForm.register('password')} className="auth-input" placeholder="••••••••" />
            </Field>
            <Button type="submit" fullWidth size="lg" loading={loginForm.formState.isSubmitting}>
              Sign In
            </Button>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-center text-slate-500 mb-3">Quick demo login:</p>
              <div className="grid grid-cols-3 gap-2">
                <QuickLoginBtn label="Client" icon={Home} onClick={() => quickLogin('ROLE_CLIENT')} />
                <QuickLoginBtn label="Contractor" icon={Wrench} onClick={() => quickLogin('ROLE_CONTRACTOR')} />
                <QuickLoginBtn label="Admin" icon={ShieldCheck} onClick={() => quickLogin('ROLE_ADMIN')} />
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={signupForm.handleSubmit(onSignup)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard
                  icon={Home}
                  label="Homeowner"
                  description="Find contractors and manage projects"
                  selected={selectedRole === 'ROLE_CLIENT'}
                  onClick={() => { setSelectedRole('ROLE_CLIENT'); signupForm.setValue('role', 'ROLE_CLIENT'); }}
                />
                <RoleCard
                  icon={Wrench}
                  label="Contractor"
                  description="Get verified and find new clients"
                  selected={selectedRole === 'ROLE_CONTRACTOR'}
                  onClick={() => { setSelectedRole('ROLE_CONTRACTOR'); signupForm.setValue('role', 'ROLE_CONTRACTOR'); }}
                />
              </div>
              {signupForm.formState.errors.role && (
                <p className="text-xs text-red-500 mt-1">{signupForm.formState.errors.role.message}</p>
              )}
            </div>

            <Field label="Full Name" icon={User} error={signupForm.formState.errors.fullName?.message}>
              <input {...signupForm.register('fullName')} className="auth-input" placeholder="Jane Doe" />
            </Field>
            <Field label="Email" icon={Mail} error={signupForm.formState.errors.email?.message}>
              <input type="email" {...signupForm.register('email')} className="auth-input" placeholder="you@example.com" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" icon={Lock} error={signupForm.formState.errors.password?.message}>
                <input type="password" {...signupForm.register('password')} className="auth-input" placeholder="••••••••" />
              </Field>
              <Field label="Confirm" icon={Lock} error={signupForm.formState.errors.confirmPassword?.message}>
                <input type="password" {...signupForm.register('confirmPassword')} className="auth-input" placeholder="••••••••" />
              </Field>
            </div>

            <Button type="submit" fullWidth size="lg" loading={signupForm.formState.isSubmitting}>
              Create Account
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}

function Field({ label, icon: Icon, error, children }: { label: string; icon: typeof Mail; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function RoleCard({ icon: Icon, label, description, selected, onClick }: { icon: typeof Home; label: string; description: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
        selected ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className={`p-2 rounded-lg ${selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function QuickLoginBtn({ label, icon: Icon, onClick }: { label: string; icon: typeof Home; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50 transition-all"
    >
      <Icon className="w-5 h-5 text-slate-500" />
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </button>
  );
}
