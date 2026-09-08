import { useEffect, useState } from 'react';

interface CoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

/**
 * Banner/cover image that degrades to a brand gradient instead of a broken-image
 * icon with overflowing alt text when the remote source is missing or fails.
 */
export default function CoverImage({ src, alt, className = '' }: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return <div aria-hidden="true" className={`bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
