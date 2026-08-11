import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-soft focus:ring-brand-300',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-300',
  outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-300',
  ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft focus:ring-red-300',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-soft focus:ring-accent-300',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
