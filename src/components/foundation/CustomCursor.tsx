'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor — Exhibition Viewport Pointer
 *
 * Smooth-following circular cursor for desktop.
 * - Default: Small 8px minimal white dot.
 * - Artwork Hover: Expands smoothly into a balanced 68px circle containing "VIEW" cleanly centered without clipping.
 * - Interpolated physics with GSAP ticker (subtle physical lag, highly responsive).
 * - Disabled on touch devices and prefers-reduced-motion.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const text = textRef.current;
    if (!cursor || !ring || !dot || !text) return;

    // Hide native cursor
    document.documentElement.style.cursor = 'none';

    // Target coordinates (actual mouse position)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Current smooth interpolated coordinates
    let currentX = mouseX;
    let currentY = mouseY;

    let isOverArtwork = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      const zone = target?.closest('[data-fisheye-zone="true"]');
      const entering = !!zone;

      if (entering !== isOverArtwork) {
        isOverArtwork = entering;
        if (entering) {
          // Smoothly expand ring into VIEW state
          gsap.to(ring, {
            width: 68,
            height: 68,
            borderColor: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            duration: 0.35,
            ease: 'power3.out',
          });
          // Hide small center dot
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
          // Reveal VIEW text
          gsap.to(text, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: 0.05,
            ease: 'power2.out',
          });
        } else {
          // Collapse back to minimal dot
          gsap.to(ring, {
            width: 8,
            height: 8,
            borderColor: 'rgba(255, 255, 255, 1)',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            duration: 0.3,
            ease: 'power3.out',
          });
          gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25 });
          gsap.to(text, { opacity: 0, scale: 0.8, duration: 0.15 });
        }
      }
    };

    const onLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const onEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    // Smooth physical lerp follow in GSAP ticker
    const tick = () => {
      currentX += (mouseX - currentX) * 0.22;
      currentY += (mouseY - currentY) * 0.22;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    };

    gsap.ticker.add(tick);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.documentElement.style.cursor = '';
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      {/* Centered Circular Element */}
      <div
        ref={ringRef}
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white flex items-center justify-center backdrop-blur-[2px] transition-colors"
        style={{
          width: 8,
          height: 8,
        }}
      >
        {/* Core resting dot */}
        <div
          ref={dotRef}
          className="w-full h-full rounded-full bg-white"
        />

        {/* Clean VIEW label: comfortably centered, never clipped */}
        <span
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold tracking-[0.2em] text-white select-none pointer-events-none opacity-0 scale-90"
        >
          VIEW
        </span>
      </div>
    </div>
  );
}
