'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/artwork';
import { useArtworkDetail } from '@/components/detail/ArtworkDetailContext';

interface FloatingArtworkProps {
  artwork: Artwork;
  priority?: boolean;
  className?: string;
  onCanClick?: () => boolean;
  titlePlacement?: 'left' | 'right' | 'top' | 'bottom';
  onHoverChange?: (id: string | null) => void;
  isDimmed?: boolean;
}

export default function FloatingArtwork({
  artwork,
  priority = false,
  className = '',
  onCanClick,
  titlePlacement = 'right',
  onHoverChange,
  isDimmed = false,
}: FloatingArtworkProps) {
  const { open } = useArtworkDetail();
  const frameRef = useRef<HTMLDivElement>(null);

  // Hover state and subtle pointer tracking (micro-shift only, NO distortion)
  const [isHovering, setIsHovering] = useState(false);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  // Pure black placeholder support (Slot 15 fallback)
  if (artwork.isPlaceholder) {
    return (
      <div
        className={`relative pointer-events-none select-none ${className}`}
        style={{
          aspectRatio: `${artwork.width} / ${artwork.height}`,
          backgroundColor: '#030303',
        }}
        aria-hidden="true"
      />
    );
  }

  // Base depth opacity (calibrated for primary, secondary, and background tiers)
  const getDepthOpacity = () => {
    if (isHovering) return 'opacity-100';
    if (isDimmed) {
      // Gentle atmospheric dimming on surrounding pieces when another is hovered
      return artwork.depthTier === 'primary'
        ? 'opacity-40'
        : artwork.depthTier === 'secondary'
        ? 'opacity-30'
        : 'opacity-15';
    }
    return artwork.depthTier === 'primary'
      ? 'opacity-100'
      : artwork.depthTier === 'secondary'
      ? 'opacity-80'
      : 'opacity-40';
  };

  const handlePointerEnter = () => {
    setIsHovering(true);
    if (onHoverChange) onHoverChange(artwork.id);
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
    setPointerOffset({ x: 0, y: 0 });
    if (onHoverChange) onHoverChange(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Subtle organic shift: -4px to +4px toward the pointer
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setPointerOffset({ x: normX, y: normY });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCanClick && !onCanClick()) return;
    const rect = frameRef.current?.getBoundingClientRect() ?? null;
    open(artwork, rect as DOMRect);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const rect = frameRef.current?.getBoundingClientRect() ?? null;
      open(artwork, rect as DOMRect);
    }
  };

  // Title reveal placement in the surrounding empty negative space
  const getTitlePlacementClasses = () => {
    switch (titlePlacement) {
      case 'left':
        return `right-[calc(100%+28px)] top-1/2 -translate-y-1/2 text-right items-end ${
          isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
        }`;
      case 'top':
        return `bottom-[calc(100%+22px)] left-0 text-left items-start ${
          isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`;
      case 'bottom':
        return `top-[calc(100%+22px)] left-0 text-left items-start ${
          isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`;
      case 'right':
      default:
        return `left-[calc(100%+28px)] top-1/2 -translate-y-1/2 text-left items-start ${
          isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
        }`;
    }
  };

  // Subtle physical scale (1.028 max) + organic micro-shift toward cursor
  const containerTransform = isHovering
    ? `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0) scale(1.028)`
    : 'translate3d(0, 0, 0) scale(1)';

  return (
    <div
      ref={frameRef}
      role="button"
      tabIndex={0}
      data-fisheye-zone="true"
      aria-label={`Inspect artwork: ${artwork.title}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative cursor-pointer select-none transition-transform duration-500 ease-out will-change-transform ${className}`}
      style={{
        aspectRatio: `${artwork.width} / ${artwork.height}`,
        transform: containerTransform,
      }}
    >
      {/* Artwork-Derived Ambient Reflected Light (Sections 7-14) */}
      <div
        className="pointer-events-none absolute -inset-24 sm:-inset-36 md:-inset-48 -z-10 transition-opacity duration-700 ease-out will-change-opacity hidden sm:block"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(ellipse 68% 62% at 50% 50%, ${artwork.ambientColor || 'rgba(120, 120, 120, 0.08)'} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Container Frame with shadow depth & pure flat image (NO distortion) */}
      <div
        className={`relative w-full h-full overflow-hidden transition-all duration-700 ease-out shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] ${getDepthOpacity()}`}
        style={{
          filter: isHovering ? 'contrast(104%) brightness(104%)' : 'none',
        }}
      >
        {/* Pure Specimen Artwork Image — Visually flat and undistorted */}
        <Image
          src={artwork.src}
          alt={artwork.title}
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 26vw"
          className="object-cover object-center pointer-events-none transition-all duration-700 ease-out"
          priority={priority}
          draggable={false}
        />

        {/* Subtle Dark Vignette: Atmospheric gallery edge falloff */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Dynamic Title Reveal in the Negative Space (Section 8 & 9) */}
      <div
        className={`pointer-events-none absolute z-30 flex flex-col gap-1 transition-all duration-500 ease-out whitespace-nowrap hidden sm:flex ${getTitlePlacementClasses()}`}
      >
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
          <span>{artwork.category}</span>
          <span className="text-neutral-700">//</span>
          <span>{artwork.year || '2026'}</span>
        </div>
        <h3 className="font-display text-sm md:text-base font-bold text-white tracking-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          {artwork.title}
        </h3>
        <span className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase">
          CLICK TO ENTER ↗
        </span>
      </div>
    </div>
  );
}
