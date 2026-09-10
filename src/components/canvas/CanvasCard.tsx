'use client';

import React from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/artwork';
import { useArtworkDetail } from '@/components/detail/ArtworkDetailContext';

interface CanvasCardProps {
  artwork: Artwork;
  index: number;
  total: number;
  onCanClick?: () => boolean;
}

export default function CanvasCard({
  artwork,
  index,
  total,
  onCanClick,
}: CanvasCardProps) {
  const { open } = useArtworkDetail();
  const cardRef = React.useRef<HTMLDivElement>(null);

  const formattedIndex = String(index + 1).padStart(2, '0');
  const formattedTotal = String(total).padStart(2, '0');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCanClick && !onCanClick()) {
      return;
    }
    const rect = cardRef.current?.getBoundingClientRect() ?? null;
    open(artwork, rect as DOMRect);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="group relative flex flex-col w-[300px] md:w-[360px] bg-[#0c0c0c] border border-neutral-800/80 hover:border-neutral-400 transition-colors duration-300 select-none cursor-pointer rounded-none shadow-2xl overflow-hidden"
      style={{
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Top Metadata Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#101010] border-b border-neutral-800/60 font-mono text-[11px] tracking-wider text-neutral-400">
        <span className="font-semibold text-neutral-300">
          {formattedIndex} <span className="text-neutral-600">//</span> {formattedTotal}
        </span>
        <span className="uppercase text-[10px] text-neutral-400 truncate max-w-[170px]">
          {artwork.category}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-[3/4.1] bg-[#050505] overflow-hidden">
        <Image
          src={artwork.src}
          alt={artwork.title}
          fill
          sizes="(max-width: 768px) 300px, 360px"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          priority={index < 4}
          draggable={false}
        />

        {/* Subtle Dark Vignette & Hover Sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

        {/* Hover Quick Prompt Pill */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-black font-mono text-[10px] font-bold tracking-wider uppercase">
            VIEW WORK <span>↗</span>
          </span>
        </div>
      </div>

      {/* Bottom Title & Details */}
      <div className="p-3.5 bg-[#0c0c0c] border-t border-neutral-800/60 flex flex-col gap-1">
        <h3 className="font-display text-sm md:text-base font-bold text-[#f0f0f0] group-hover:text-white transition-colors duration-200 uppercase tracking-tight line-clamp-1">
          {artwork.title}
        </h3>
        <p className="font-body text-[11px] text-neutral-400 line-clamp-1 leading-relaxed">
          {artwork.visualSummary || artwork.description}
        </p>
      </div>
    </div>
  );
}
