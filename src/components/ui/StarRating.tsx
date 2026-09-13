import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

export default function StarRating({ rating, size = 16, interactive, onChange, showValue }: StarRatingProps) {
  const rounded = Math.round(rating);

  return (
    <div
      className="inline-flex items-center gap-1"
      // Display ratings are a single labeled graphic; interactive ratings are a
      // radiogroup of labeled star buttons. Either way, every star is accessible.
      {...(!interactive
        ? { role: 'img', 'aria-label': `${rating.toFixed(1)} out of 5 stars` }
        : { role: 'radiogroup', 'aria-label': 'Your rating' })}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= rounded;
          const starIconProps = {
            style: { width: size, height: size },
            className: filled ? 'fill-accent-400 text-accent-400' : 'fill-slate-200 text-slate-200',
          };
          return interactive ? (
            <button
              key={star}
              type="button"
              role="radio"
              aria-label={`Rate ${star} out of 5 stars`}
              aria-checked={filled}
              onClick={() => onChange?.(star)}
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              <Star {...starIconProps} aria-hidden="true" />
            </button>
          ) : (
            <Star key={star} {...starIconProps} aria-hidden="true" />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-700 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
