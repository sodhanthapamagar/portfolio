'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroCurtainProps {
  onComplete?: () => void;
}

export default function IntroCurtain({ onComplete }: IntroCurtainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    const container = containerRef.current;
    const archiveEl = archiveRef.current;
    const nameEl = nameRef.current;
    const roleEl = roleRef.current;
    const accentEl = accentRef.current;

    if (!container || !nameEl || !roleEl) return;

    // Timeline choreography with intentional breathing room (~3.2s total)
    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        if (onComplete) onComplete();
      },
    });

    // Initial states
    gsap.set(container, { yPercent: 0, autoAlpha: 1 });
    if (archiveEl) gsap.set(archiveEl, { opacity: 0, y: -6 });
    gsap.set(nameEl, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      opacity: 0,
      x: -15,
    });
    gsap.set(roleEl, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      opacity: 0,
      x: -10,
    });
    if (accentEl) gsap.set(accentEl, { scaleX: 0, transformOrigin: 'left center' });

    // 0.2 - 0.5s: ARCHIVE 001—015 appears subtly
    if (archiveEl) {
      tl.to(archiveEl, { opacity: 0.8, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
    }

    // 0.5 - 1.4s: Sabir Maharjan reveals
    tl.to(
      nameEl,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
      },
      0.5
    );

    // 1.4 - 1.8s: Brief intentional pause (settle)

    // 1.8 - 2.4s: GRAPHIC DESIGNER reveals with typographic contrast
    tl.to(
      roleEl,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      1.8
    );

    // 2.3 - 2.6s: Tiny deep crimson accent appears
    if (accentEl) {
      tl.to(
        accentEl,
        {
          scaleX: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        2.3
      );
    }

    // 2.6 - 3.1s: Hold to absorb identity
    tl.to({}, { duration: 0.5 });

    // ~3.1s: Clean upward exhibition reveal
    tl.to(container, {
      yPercent: -100,
      duration: 0.9,
      ease: 'expo.inOut',
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  // Click anywhere to enter immediately
  const handleSkip = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.45,
        ease: 'power3.inOut',
        onComplete: () => {
          setIsDone(true);
          if (onComplete) onComplete();
        },
      });
    } else {
      setIsDone(true);
      if (onComplete) onComplete();
    }
  };

  if (isDone) return null;

  return (
    <aside
      ref={containerRef}
      id="intro-curtain"
      aria-label="Exhibition Introduction"
      onClick={handleSkip}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#000000] p-8 sm:p-14 md:p-20 select-none cursor-pointer overflow-hidden"
    >
      {/* Top Header: ARCHIVE 001—015 */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
        <span ref={archiveRef} className="opacity-0">
          ARCHIVE 001—015
        </span>
        <span className="text-[9px] text-neutral-600 hover:text-neutral-400 transition-colors">
          [ TAP ANYWHERE TO ENTER ]
        </span>
      </div>

      {/* Center Main Identity: Typographic Contrast */}
      <div className="flex flex-col items-start gap-4 max-w-4xl my-auto">
        {/* Primary Name: Elegant Editorial Syne */}
        <h1
          ref={nameRef}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase leading-[0.95]"
        >
          Sabir Maharjan
        </h1>

        {/* Small Deep Crimson / Muted Red Visual Accent */}
        <div
          ref={accentRef}
          className="w-12 h-[2px] bg-[#991b1b]"
          aria-hidden="true"
        />

        {/* Secondary: Narrow High-Contrast Grotesk */}
        <p
          ref={roleRef}
          className="font-mono text-sm sm:text-base md:text-xl font-normal text-neutral-300 tracking-[0.25em] uppercase mt-2"
        >
          GRAPHIC DESIGNER
        </p>
      </div>

      {/* Bottom Footer: Minimal Location Context */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
        <span>KATHMANDU, NEPAL</span>
        <span>DIGITAL EXHIBITION</span>
      </div>
    </aside>
  );
}
