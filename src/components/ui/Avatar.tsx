import { useEffect, useState } from 'react';

interface AvatarProps {
  src?: string | null;
  /** Used for the alt text and to derive the initials fallback */
  name: string;
  alt?: string;
  /** Colour scheme of the initials fallback — pick the one that suits the surface behind it */
  tone?: 'light' | 'dark';
  /** Sizing/shape classes are shared by the image and the initials fallback */
  className?: string;
}

const tones = {
  light: 'bg-brand-100 text-brand-700',
  dark: 'bg-brand-900 text-accent-300',
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * Profile image that degrades to initials instead of a broken-image icon when
 * the remote source is missing or fails to load.
 */
export default function Avatar({ src, name, alt, tone = 'light', className = '' }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  // A new src deserves a fresh attempt
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt ?? name}
        className={`flex items-center justify-center font-semibold select-none ${tones[tone]} ${className}`}
      >
        {initials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
