'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollWrapperProps {
  children: ReactNode;
}

/**
 * InfiniteScrollWrapper — Phase 05
 *
 * Strategy: Triple-clone (A | B | C) with silent scroll teleportation.
 * - Three identical copies of gallery content are rendered in the DOM.
 * - User starts at the top of copy B (middle).
 * - When the user scrolls into copy C (forward), we silently jump back to B.
 * - When the user scrolls into copy A (backward), we silently jump forward to B.
 * - Result: seamless, invisible infinite loop with fixed DOM size (no growth).
 */
export default function InfiniteScrollWrapper({ children }: InfiniteScrollWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pageCopyRef = useRef<HTMLDivElement>(null);
  const copyHeightRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pageCopy = pageCopyRef.current;
    if (!wrapper || !pageCopy) return;

    const measureAndInit = () => {
      // Measure the height of one gallery copy
      copyHeightRef.current = pageCopy.getBoundingClientRect().height;

      // Silently start the user at the top of the middle copy (B)
      if (copyHeightRef.current > 0) {
        isJumpingRef.current = true;
        window.scrollTo({ top: copyHeightRef.current, behavior: 'instant' as ScrollBehavior });
        // Reset flag after browser paints
        requestAnimationFrame(() => {
          isJumpingRef.current = false;
        });
      }
    };

    // Wait for full layout paint
    const initTimer = setTimeout(measureAndInit, 120);

    // Re-measure on resize (layout may shift)
    const handleResize = () => {
      if (pageCopy) {
        copyHeightRef.current = pageCopy.getBoundingClientRect().height;
      }
    };

    const handleScroll = () => {
      if (isJumpingRef.current) return;
      const ph = copyHeightRef.current;
      if (!ph) return;

      const scrollY = window.scrollY;

      // Scrolled into copy C → jump back to same position in copy B
      if (scrollY >= ph * 2) {
        isJumpingRef.current = true;
        window.scrollTo({ top: scrollY - ph, behavior: 'instant' as ScrollBehavior });
        requestAnimationFrame(() => { isJumpingRef.current = false; });
      }
      // Scrolled into copy A → jump forward to same position in copy B
      else if (scrollY < ph) {
        isJumpingRef.current = true;
        window.scrollTo({ top: scrollY + ph, behavior: 'instant' as ScrollBehavior });
        requestAnimationFrame(() => { isJumpingRef.current = false; });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={wrapperRef} role="feed" aria-label="Exhibition gallery — scrolls continuously">
      {/* Copy A — backwards buffer (aria-hidden: screen readers skip) */}
      <div
        aria-hidden="true"
        data-infinite-copy="a"
        style={{ contentVisibility: 'auto' } as React.CSSProperties}
      >
        {children}
      </div>

      {/* Copy B — the canonical, accessible content (user starts here) */}
      <div ref={pageCopyRef} data-infinite-copy="b">
        {children}
      </div>

      {/* Copy C — forwards buffer (aria-hidden: screen readers skip) */}
      <div
        aria-hidden="true"
        data-infinite-copy="c"
        style={{ contentVisibility: 'auto' } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
