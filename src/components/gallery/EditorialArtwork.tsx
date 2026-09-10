'use client';

import { useCallback, useRef } from 'react';
import { Artwork } from '@/types/artwork';
import FisheyeArtwork from './FisheyeArtwork';
import { useArtworkDetail } from '@/components/detail/ArtworkDetailContext';

interface EditorialArtworkProps {
  artwork: Artwork;
  index: number;
  priority?: boolean;
  className?: string;
}

export default function EditorialArtwork({
  artwork,
  index,
  priority = false,
  className = '',
}: EditorialArtworkProps) {
  const { open } = useArtworkDetail();
  const stageRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    const rect = stageRef.current?.getBoundingClientRect() ?? null;
    open(artwork, rect as DOMRect);
  }, [artwork, open]);

  return (
    <figure
      id={`exhibit-${artwork.id}`}
      className={`group relative flex flex-col ${className}`}
    >
      {/* Artwork Stage — clickable */}
      <div
        ref={stageRef}
        role="button"
        tabIndex={0}
        aria-label={`Open detail view for ${artwork.title}`}
        onClick={handleOpen}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); }}
        className="relative w-full bg-[#0a0a0a] border border-white/[0.07] p-3 sm:p-5 md:p-6 transition-all duration-500 hover:border-white/20 cursor-none"
      >
        <div
          className="relative w-full shadow-2xl shadow-black overflow-hidden"
          style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }}
        >
          <FisheyeArtwork
            src={artwork.src}
            alt={artwork.title}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 55vw"
            parallaxStrength={0.06}
          />
        </div>
      </div>

      {/* Editorial Caption */}
      <figcaption className="mt-4 flex flex-col gap-1.5 px-1">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-neutral-400">
              № {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-neutral-700 text-xs">/</span>
            <span className="font-mono text-[10px] tracking-[0.15em] text-neutral-400 uppercase">
              {artwork.orientation}
            </span>
          </div>
          <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
            {artwork.width} × {artwork.height}
          </span>
        </div>

        <h3 className="font-display text-base md:text-lg font-semibold tracking-tight text-[#f5f5f5] group-hover:text-white transition-colors mt-0.5">
          {artwork.title}
        </h3>

        <p className="font-mono text-[11px] text-neutral-400 tracking-wide">
          {artwork.category}
        </p>

        <p className="text-xs text-neutral-400 leading-relaxed max-w-lg mt-1">
          {artwork.description}
        </p>
      </figcaption>
    </figure>
  );
}
