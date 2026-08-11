import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

export default function StarRating({ rating, size = 16, interactive, onChange, showValue }: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            >
              <Star
                style={{ width: size, height: size }}
                className={filled ? 'fill-accent-400 text-accent-400' : 'fill-slate-200 text-slate-200'}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-700 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
