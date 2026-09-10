'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface FisheyeArtworkProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Parallax strength passed through from Phase 06. */
  parallaxStrength?: number;
}

/**
 * FisheyeArtwork — Phase 07
 *
 * Combines Phase 06 parallax with a Phase 07 local fisheye/lens effect.
 *
 * Fisheye technique: Pure CSS transforms — no WebGL, no Three.js.
 * The image is split into a 5×5 grid of absolutely-positioned tiles.
 * On mouse enter/move, each tile is displaced radially from the cursor
 * with an intensity that falls off with distance (Gaussian-style bell curve).
 * This creates a convincing bulge/lens effect entirely in CSS + JS.
 *
 * On mouse leave, all tiles animate back to their rest positions.
 *
 * Respects prefers-reduced-motion — effect is fully disabled.
 * Custom cursor state is communicated via a data attribute on the root,
 * read by the global CustomCursor component.
 */

const GRID = 4; // 4×4 tile grid — 16 tiles vs 25, significant DOM reduction
const LENS_RADIUS = 0.40; // fraction of container short-side (slightly wider for 4×4)
const LENS_STRENGTH = 24; // max px displacement at center
const FALLOFF = 2.2; // Gaussian sigma-like exponent

export default function FisheyeArtwork({
  src,
  alt,
  priority = false,
  sizes,
  parallaxStrength = 0.06,
}: FisheyeArtworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const prefersReducedRef = useRef(false);
  const isActiveRef = useRef(false);

  // Phase 06 parallax — viewport-relative y transform on wrapper
  useEffect(() => {
    if (typeof window === 'undefined') return;
    prefersReducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wrapper = wrapperRef.current;
    if (!wrapper || prefersReducedRef.current) return;

    // Entrance fade
    gsap.set(wrapper, { opacity: 0 });
    const entranceObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        gsap.to(wrapper, { opacity: 1, duration: 0.85, ease: 'power2.out' });
        entranceObs.disconnect();
      }
    }, { threshold: 0.06 });
    entranceObs.observe(wrapper);

    // Parallax ticker
    let visible = false;
    const visObs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '120px 0px' });
    visObs.observe(wrapper);

    const setY = gsap.quickSetter(wrapper, 'y', 'px');
    const tick = () => {
      if (!visible || isActiveRef.current) return;
      const rect = wrapper.getBoundingClientRect();
      const vH = window.innerHeight;
      const n = (rect.top + rect.height * 0.5 - vH * 0.5) / vH;
      setY(n * vH * parallaxStrength);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      entranceObs.disconnect();
      visObs.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [parallaxStrength]);

  // Build tile refs array
  const setTileRef = useCallback((el: HTMLDivElement | null, i: number) => {
    if (el) tilesRef.current[i] = el;
  }, []);

  // Fisheye helpers
  const applyFisheye = useCallback((mx: number, my: number) => {
    if (prefersReducedRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const R = Math.min(W, H) * LENS_RADIUS;

    // Cursor in [0,1] space relative to container
    const cx = (mx - rect.left) / W;
    const cy = (my - rect.top) / H;

    tilesRef.current.forEach((tile, idx) => {
      if (!tile) return;
      const col = idx % GRID;
      const row = Math.floor(idx / GRID);
      // Center of this tile in [0,1] space
      const tx = (col + 0.5) / GRID;
      const ty = (row + 0.5) / GRID;

      // Distance from cursor to tile center in pixels
      const dxPx = (tx - cx) * W;
      const dyPx = (ty - cy) * H;
      const distPx = Math.sqrt(dxPx * dxPx + dyPx * dyPx);

      // Gaussian fall-off: 1 at center, ~0 outside lens radius
      const influence = Math.exp(-Math.pow(distPx / R, FALLOFF));
      const mag = influence * LENS_STRENGTH;

      const angle = Math.atan2(dyPx, dxPx);
      // Displace away from cursor (push outward from lens center)
      const offsetX = -Math.cos(angle) * mag;
      const offsetY = -Math.sin(angle) * mag;

      gsap.to(tile, {
        x: offsetX,
        y: offsetY,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }, []);

  const resetFisheye = useCallback(() => {
    tilesRef.current.forEach((tile) => {
      if (!tile) return;
      gsap.to(tile, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    isActiveRef.current = true;
    applyFisheye(e.clientX, e.clientY);
  }, [applyFisheye]);

  const handleMouseLeave = useCallback(() => {
    isActiveRef.current = false;
    resetFisheye();
  }, [resetFisheye]);

  // Tile dimensions as percentages
  const tileW = 100 / GRID;
  const tileH = 100 / GRID;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full overflow-hidden"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Fisheye tile grid — rendered only on non-touch devices via CSS */}
      <div
        ref={containerRef}
        className="absolute inset-0 hidden sm:block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-fisheye-zone="true"
        aria-hidden="true"
      >
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const col = i % GRID;
          const row = Math.floor(i / GRID);
          return (
            <div
              key={i}
              ref={(el) => setTileRef(el, i)}
              className="absolute overflow-hidden"
              style={{
                width: `${tileW + 0.5}%`,   // +0.5% overlap to prevent seam lines
                height: `${tileH + 0.5}%`,
                left: `${col * tileW}%`,
                top: `${row * tileH}%`,
                willChange: 'transform',
              }}
            >
              {/* Each tile shows the full image, clipped by the tile's position */}
              <div
                className="absolute"
                style={{
                  width: `${GRID * 100}%`,
                  height: `${GRID * 100}%`,
                  left: `${-col * 100}%`,
                  top: `${-row * 100}%`,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={priority && i === 0}
                  loading={priority && i === 0 ? 'eager' : 'lazy'}
                  sizes={sizes ?? '(max-width: 640px) 100vw, 55vw'}
                  className="object-contain"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Fallback single image for mobile (no fisheye, no tile overhead) */}
      <div className="absolute inset-0 sm:hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* Screen-reader accessible label only — no duplicate image render */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
