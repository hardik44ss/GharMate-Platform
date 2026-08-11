import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ glass, hover, className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl ${glass ? 'glass-card' : 'bg-white border border-slate-200/80 shadow-soft'} ${hover ? 'transition-all duration-300 hover:shadow-float hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';
export default Card;
