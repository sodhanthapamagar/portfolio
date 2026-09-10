'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AboutPanel — Phase 10
 *
 * Exhibition-style identity placard.
 * Slides in from the right on open, slides out on close.
 * Shows only real, honest information about Sabir — no fabricated history.
 * Contact is a bare mailto link — no form.
 */
export default function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Open animation
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      isAnimatingRef.current = true;
      gsap.set(backdrop, { opacity: 0, pointerEvents: 'all' });
      gsap.set(panel, { x: '100%' });
      const tl = gsap.timeline({ onComplete: () => { isAnimatingRef.current = false; } });
      tl.to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .to(panel, { x: '0%', duration: 0.45, ease: 'power3.out' }, '-=0.2');
    } else {
      if (!isAnimatingRef.current) return;
      // Close handled by handleClose
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (isAnimatingRef.current) return;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    isAnimatingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        document.body.style.overflow = '';
        onClose();
      },
    });
    tl.to(panel, { x: '100%', duration: 0.35, ease: 'power2.in' })
      .to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.1');
  }, [onClose]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[8500] opacity-0"
      style={{ pointerEvents: 'none' }}
      role="dialog"
      aria-modal="true"
      aria-label="About Sabir Maharjan"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-[#090909] border-l border-white/[0.07] flex flex-col overflow-y-auto translate-x-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <span className="font-mono text-[10px] tracking-[0.22em] text-neutral-500 uppercase">
            Identity
          </span>
          <button
            id="about-close-btn"
            onClick={handleClose}
            aria-label="Close About panel"
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-neutral-500 hover:text-white transition-colors uppercase"
          >
            <span>Close</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 px-8 py-10 flex-1">

          {/* Name + discipline */}
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#f5f5f5] leading-[1.05]">
              Sabir<br />Maharjan
            </h2>
            <p className="font-mono text-xs text-neutral-400 tracking-widest uppercase mt-1">
              Graphic Designer
            </p>
          </div>

          {/* Exhibition concept note */}
          <div className="border-l-2 border-white/10 pl-5">
            <p className="text-sm text-neutral-300 leading-relaxed">
              This is an interactive digital exhibition — not a portfolio template.
              The work speaks. The website is the frame.
            </p>
          </div>

          {/* Location + status */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">Location</span>
              <span className="font-mono text-[11px] text-neutral-300 tracking-wide">Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">Status</span>
              <span className="flex items-center gap-2 font-mono text-[11px] text-neutral-300 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available for work
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/[0.06]">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">Works</span>
              <span className="font-mono text-[11px] text-neutral-300 tracking-wide">12 on exhibition</span>
            </div>
          </div>

          {/* Disciplines */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">Disciplines</span>
            <div className="flex flex-wrap gap-2">
              {[
                'Poster Design',
                'Editorial Layout',
                'Typography',
                'Visual Identity',
                'Cultural Design',
                'Brutalist Aesthetics',
              ].map((d) => (
                <span
                  key={d}
                  className="font-mono text-[10px] tracking-wider text-neutral-400 border border-white/[0.08] px-2.5 py-1"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Contact — email only, no form */}
          <div className="mt-auto pt-8 border-t border-white/[0.06]">
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase block mb-3">
              Contact
            </span>
            <a
              id="contact-email-link"
              href="mailto:sabirmaharjan7@gmail.com"
              className="group inline-flex items-center gap-3 font-mono text-sm text-[#f5f5f5] hover:text-white transition-colors"
              aria-label="Send email to Sabir Maharjan"
            >
              <span className="w-8 h-px bg-white/20 group-hover:bg-white/60 transition-all duration-300 group-hover:w-12" />
              sabirmaharjan7@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom mark */}
        <div className="px-8 pb-8">
          <p className="font-mono text-[10px] text-neutral-600 tracking-widest">
            © {new Date().getFullYear()} Sabir Maharjan — All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
