'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { artworks } from '@/data/artworks';
import FloatingArtwork from './FloatingArtwork';

interface PositionDef {
  index: number;
  left: string;
  top: number; // in vh
  width: string;
  mobileLeft: string;
  mobileTop: number; // in vh
  mobileWidth: string;
}

// 15 Art-directed positions across a 560vh cycle
const CURATED_POSITIONS: PositionDef[] = [
  // First Viewport (0vh - 100vh): 4 pieces, massive negative space, discovery-oriented
  { index: 0,  left: '8%',  top: 18,  width: '25vw', mobileLeft: '6%',  mobileTop: 16,  mobileWidth: '60vw' }, // Primary (WEB 01)
  { index: 1,  left: '60%', top: 10,  width: '17vw', mobileLeft: '52%', mobileTop: 8,   mobileWidth: '42vw' }, // Secondary (WEB Texture)
  { index: 2,  left: '84%', top: 52,  width: '15vw', mobileLeft: '68%', mobileTop: 50,  mobileWidth: '38vw' }, // Background (Eyes Watches, partially clipped right)
  { index: 3,  left: '36%', top: 68,  width: '16vw', mobileLeft: '12%', mobileTop: 65,  mobileWidth: '48vw' }, // Secondary (Freedom)

  // Region 2 (100vh - 200vh)
  { index: 4,  left: '10%', top: 125, width: '26vw', mobileLeft: '8%',  mobileTop: 112, mobileWidth: '64vw' }, // Primary (Shakti)
  { index: 5,  left: '72%', top: 145, width: '14vw', mobileLeft: '56%', mobileTop: 142, mobileWidth: '38vw' }, // Background (Icarus)
  { index: 6,  left: '34%', top: 180, width: '23vw', mobileLeft: '14%', mobileTop: 175, mobileWidth: '62vw' }, // Secondary (LIFE Landscape)

  // Region 3 (200vh - 300vh)
  { index: 7,  left: '64%', top: 228, width: '21vw', mobileLeft: '40%', mobileTop: 218, mobileWidth: '50vw' }, // Primary (Snoopy)
  { index: 8,  left: '12%', top: 255, width: '14vw', mobileLeft: '6%',  mobileTop: 252, mobileWidth: '38vw' }, // Background (Ti Amo)
  { index: 9,  left: '40%', top: 290, width: '18vw', mobileLeft: '22%', mobileTop: 286, mobileWidth: '52vw' }, // Secondary (Face)

  // Region 4 (300vh - 400vh)
  { index: 10, left: '8%',  top: 335, width: '18vw', mobileLeft: '6%',  mobileTop: 332, mobileWidth: '46vw' }, // Primary (Skyfall)
  { index: 11, left: '66%', top: 368, width: '19vw', mobileLeft: '44%', mobileTop: 365, mobileWidth: '50vw' }, // Secondary (Romance)
  { index: 12, left: '36%', top: 408, width: '25vw', mobileLeft: '16%', mobileTop: 405, mobileWidth: '64vw' }, // Primary (Shringaar)

  // Region 5 (400vh - 560vh)
  { index: 13, left: '10%', top: 458, width: '20vw', mobileLeft: '8%',  mobileTop: 455, mobileWidth: '54vw' }, // Secondary (Pyaar)
  { index: 14, left: '62%', top: 485, width: '26vw', mobileLeft: '32%', mobileTop: 490, mobileWidth: '62vw' }, // Primary (Obsession)
];

const CYCLE_HEIGHT_VH = 560;

export default function ExhibitionWall() {
  const [isMobile, setIsMobile] = useState(false);
  const isTeleporting = useRef(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Infinite Seamless Loop Teleportation
  useEffect(() => {
    const cyclePx = (CYCLE_HEIGHT_VH * window.innerHeight) / 100;
    
    // Set initial scroll to start of Clone B (the middle cycle)
    if (window.scrollY === 0) {
      window.scrollTo(0, cyclePx);
    }

    const handleScroll = () => {
      if (isTeleporting.current) return;

      const currentY = window.scrollY;
      const vhPx = window.innerHeight;
      const oneCyclePx = (CYCLE_HEIGHT_VH * vhPx) / 100;

      // When reaching bottom boundary of Clone B, teleport back by one cycle
      if (currentY >= oneCyclePx * 2) {
        isTeleporting.current = true;
        window.scrollTo(0, currentY - oneCyclePx);
        requestAnimationFrame(() => {
          isTeleporting.current = false;
        });
      }
      // When reaching top boundary of Clone B, teleport forward by one cycle
      else if (currentY <= oneCyclePx * 0.1) {
        isTeleporting.current = true;
        window.scrollTo(0, currentY + oneCyclePx);
        requestAnimationFrame(() => {
          isTeleporting.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clones: [-1, 0, 1] => Clone A, Clone B, Clone C
  const CLONES = [-1, 0, 1];

  return (
    <div className="relative w-full bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* Three identical cycles for seamless mathematical infinite looping */}
      <div
        className="relative w-full"
        style={{ height: `${CYCLE_HEIGHT_VH * 3}vh` }}
      >
        {CLONES.map((cloneMultiplier, cloneIdx) => {
          const cloneOffsetVh = (cloneMultiplier + 1) * CYCLE_HEIGHT_VH;

          return (
            <div
              key={`cycle-${cloneMultiplier}`}
              className="absolute left-0 right-0 w-full"
              style={{
                top: `${cloneOffsetVh}vh`,
                height: `${CYCLE_HEIGHT_VH}vh`,
              }}
              aria-hidden={cloneMultiplier !== 0}
            >
              {CURATED_POSITIONS.map((pos) => {
                const artwork = artworks[pos.index];
                if (!artwork) return null;

                const left = isMobile ? pos.mobileLeft : pos.left;
                const top = isMobile ? pos.mobileTop : pos.top;
                const width = isMobile ? pos.mobileWidth : pos.width;

                return (
                  <div
                    key={`art-${artwork.id}-c${cloneIdx}`}
                    className="absolute"
                    style={{
                      left,
                      top: `${top}vh`,
                      width,
                    }}
                  >
                    <FloatingArtwork
                      artwork={artwork}
                      priority={cloneMultiplier === 0 && pos.index < 4}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Quiet Fixed Identity (Top Left) */}
      <div className="fixed top-6 left-6 z-30 pointer-events-none flex flex-col gap-0.5">
        <h1 className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
          SABIR MAHARJAN
        </h1>
        <p className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
          GRAPHIC DESIGNER
        </p>
      </div>

      {/* Quiet Fixed About Trigger (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30">
        <Link
          href="/about"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-white text-neutral-400 hover:text-black border border-white/10 hover:border-white transition-all duration-300 font-mono text-[11px] tracking-widest uppercase backdrop-blur-sm"
        >
          <span>ABOUT</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </Link>
      </div>
    </div>
  );
}
