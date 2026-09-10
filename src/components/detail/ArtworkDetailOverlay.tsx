'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useArtworkDetail } from './ArtworkDetailContext';

/**
 * ArtworkDetailOverlay — Cinematic Origin-Based Project Opening
 *
 * Sequence:
 * 1. Artwork smoothly expands from its exact gallery location into the dominant center.
 * 2. Surrounding exhibition deepens to black.
 * 3. Only after the artwork is established does the restrained metadata reveal.
 * 4. Close reverses the animation back to the origin coordinates, preserving gallery context.
 */
export default function ArtworkDetailOverlay() {
  const { state, close } = useArtworkDetail();
  const { artwork, originRect } = state;

  const backdropRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const heroImageWrapRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Stored FLIP offsets for smooth reverse return animation
  const flipOffsetsRef = useRef<{ dx: number; dy: number; sx: number; sy: number } | null>(null);

  // ---------- Cinematic Open Animation ----------
  useEffect(() => {
    if (!artwork) return;
    const backdrop = backdropRef.current;
    const hero = heroImageWrapRef.current;
    const info = infoPanelRef.current;
    if (!backdrop || !hero || !info) return;

    isAnimatingRef.current = true;
    document.body.style.overflow = 'hidden';

    // Measure target position of hero image
    const targetRect = hero.getBoundingClientRect();

    if (originRect && targetRect.width > 0 && targetRect.height > 0) {
      const dx = originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy = originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2);
      const sx = originRect.width / targetRect.width;
      const sy = originRect.height / targetRect.height;

      flipOffsetsRef.current = { dx, dy, sx, sy };

      // Initialize hero directly at clicked origin position
      gsap.set(hero, {
        x: dx,
        y: dy,
        scaleX: sx,
        scaleY: sy,
        transformOrigin: 'center center',
      });
    } else {
      flipOffsetsRef.current = null;
      gsap.set(hero, { scale: 0.85, opacity: 0 });
    }

    gsap.set(backdrop, { opacity: 0, pointerEvents: 'all' });
    gsap.set(info, { opacity: 0, x: 25 });

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // 0.0 - 0.6s: Background recedes to pure deep black
    tl.to(backdrop, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);

    // 0.0 - 0.8s: Artwork expands from origin into dominant position
    if (flipOffsetsRef.current) {
      tl.to(
        hero,
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.8,
          ease: 'power3.inOut',
        },
        0
      );
    } else {
      tl.to(
        hero,
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
        },
        0.1
      );
    }

    // 0.75s+: Information arrives AFTER artwork has reached dominant position
    tl.to(
      info,
      {
        opacity: 1,
        x: 0,
        duration: 0.55,
        ease: 'power2.out',
      },
      0.75
    );
  }, [artwork, originRect]);

  // ---------- Keyboard close (Escape) ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork]);

  // ---------- Cinematic Close Animation ----------
  const handleClose = useCallback(() => {
    if (isAnimatingRef.current) return;
    const backdrop = backdropRef.current;
    const hero = heroImageWrapRef.current;
    const info = infoPanelRef.current;
    if (!backdrop || !hero || !info) return;

    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        document.body.style.overflow = '';
        close();
      },
    });

    // 1. Information fades out first
    tl.to(info, {
      opacity: 0,
      x: 20,
      duration: 0.25,
      ease: 'power2.in',
    }, 0);

    // 2. Artwork returns smoothly toward its original gallery location
    if (flipOffsetsRef.current) {
      tl.to(
        hero,
        {
          x: flipOffsetsRef.current.dx,
          y: flipOffsetsRef.current.dy,
          scaleX: flipOffsetsRef.current.sx,
          scaleY: flipOffsetsRef.current.sy,
          duration: 0.65,
          ease: 'power3.inOut',
        },
        0.1
      );
    } else {
      tl.to(hero, {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.1);
    }

    // 3. Exhibition restores back to transparent
    tl.to(backdrop, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, 0.35);
  }, [close]);

  if (!artwork) return null;

  return (
    <div
      ref={backdropRef}
      id="artwork-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail view: ${artwork.title}`}
      className="fixed inset-0 z-[8000] flex items-center justify-center opacity-0 p-4 sm:p-8 md:p-12 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      {/* Background — Click outside to close */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Main Exhibition Inspection Container */}
      <div
        ref={modalContainerRef}
        className="relative z-10 w-full max-w-6xl max-h-[92vh] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 overflow-y-auto lg:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left / Center: Dominant Artwork Specimen */}
        <div
          ref={heroImageWrapRef}
          className="relative flex-shrink-0 will-change-transform shadow-[0_30px_90px_rgba(0,0,0,1)]"
          style={{
            aspectRatio: `${artwork.width} / ${artwork.height}`,
            maxHeight: '80vh',
            maxWidth: '100%',
            width: 'auto',
          }}
        >
          <div className="relative w-full h-full min-w-[280px] sm:min-w-[340px] md:min-w-[420px] max-h-[80vh] overflow-hidden">
            <Image
              src={artwork.src}
              alt={artwork.title}
              width={artwork.width}
              height={artwork.height}
              className="w-auto h-auto max-h-[80vh] max-w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: Restrained Exhibition Information (Arrives after artwork settles) */}
        <div
          ref={infoPanelRef}
          className="flex flex-col flex-1 max-w-md gap-6 text-left will-change-transform"
        >
          {/* Top Row: Category & Close Trigger */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
              {artwork.category} // {artwork.year || '2026'}
            </span>
            <button
              onClick={handleClose}
              className="group flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition-colors"
              aria-label="Close detail view"
            >
              <span>ESC / CLOSE</span>
              <span className="text-neutral-600 group-hover:text-white transition-colors">✕</span>
            </button>
          </div>

          {/* Artwork Title */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-[1.05]">
            {artwork.title}
          </h2>

          {/* Short Honest Description */}
          <p className="font-body text-sm md:text-base text-neutral-300 leading-relaxed">
            {artwork.description}
          </p>

          {/* Visual Summary Snippet */}
          {artwork.visualSummary && (
            <div className="border-l border-neutral-800 pl-4 py-1">
              <p className="font-mono text-[11px] text-neutral-400 leading-relaxed tracking-wide">
                {artwork.visualSummary}
              </p>
            </div>
          )}

          {/* Technical Taxonomy Meta */}
          <div className="flex items-center gap-4 pt-4 border-t border-neutral-900 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>{artwork.orientation}</span>
            <span>·</span>
            <span>{artwork.width}×{artwork.height}</span>
            {artwork.dominantColor && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: artwork.dominantColor }}
                    aria-hidden="true"
                  />
                  <span>{artwork.dominantColor}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
