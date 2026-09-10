'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { artworks } from '@/data/artworks';
import CanvasCard from './CanvasCard';

// Grid Configuration
const CARD_WIDTH = 360;
const CARD_HEIGHT = 490;
const GAP_X = 64;
const GAP_Y = 64;
const CELL_WIDTH = CARD_WIDTH + GAP_X; // 424px
const CELL_HEIGHT = CARD_HEIGHT + GAP_Y; // 554px
const COLS = 5;
const ROWS = 3;
const UNIT_WIDTH = COLS * CELL_WIDTH; // 2120px
const UNIT_HEIGHT = ROWS * CELL_HEIGHT; // 1662px

// 3x3 repetition offsets to cover all directions infinitely without visible edges
const CLUSTERS = [
  { cx: -1, cy: -1 },
  { cx: 0, cy: -1 },
  { cx: 1, cy: -1 },
  { cx: -1, cy: 0 },
  { cx: 0, cy: 0 },
  { cx: 1, cy: 0 },
  { cx: -1, cy: 1 },
  { cx: 0, cy: 1 },
  { cx: 1, cy: 1 },
];

export default function InfiniteCanvas2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Position tracking refs
  const currentX = useRef<number>(-UNIT_WIDTH / 4);
  const currentY = useRef<number>(-UNIT_HEIGHT / 4);
  const targetX = useRef<number>(-UNIT_WIDTH / 4);
  const targetY = useRef<number>(-UNIT_HEIGHT / 4);

  // Velocity & Drag state refs
  const velocityX = useRef<number>(0);
  const velocityY = useRef<number>(0);
  const isPointerDown = useRef<boolean>(false);
  const startPointerX = useRef<number>(0);
  const startPointerY = useRef<number>(0);
  const lastPointerX = useRef<number>(0);
  const lastPointerY = useRef<number>(0);
  const hasDragged = useRef<boolean>(false);

  // Cursor state
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Setup initial centering
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialCenterX = -(UNIT_WIDTH - window.innerWidth) / 2;
      const initialCenterY = -(UNIT_HEIGHT - window.innerHeight) / 2;
      currentX.current = initialCenterX;
      currentY.current = initialCenterY;
      targetX.current = initialCenterX;
      targetY.current = initialCenterY;
    }
  }, []);

  // Animation & Physics Loop
  useEffect(() => {
    let animFrameId: number;

    const tick = () => {
      // Smooth interpolation (lerp)
      currentX.current += (targetX.current - currentX.current) * 0.14;
      currentY.current += (targetY.current - currentY.current) * 0.14;

      // Apply inertial friction when not holding down
      if (!isPointerDown.current) {
        targetX.current += velocityX.current;
        targetY.current += velocityY.current;
        velocityX.current *= 0.93;
        velocityY.current *= 0.93;
      }

      // Mathematical continuous modulo wrap
      // Keeps coordinates strictly within [-UNIT_WIDTH, 0] and [-UNIT_HEIGHT, 0]
      const modX = ((((currentX.current % UNIT_WIDTH) - UNIT_WIDTH) % UNIT_WIDTH) + UNIT_WIDTH) % UNIT_WIDTH - UNIT_WIDTH;
      const modY = ((((currentY.current % UNIT_HEIGHT) - UNIT_HEIGHT) % UNIT_HEIGHT) + UNIT_HEIGHT) % UNIT_HEIGHT - UNIT_HEIGHT;

      if (boardRef.current) {
        boardRef.current.style.transform = `translate3d(${modX}px, ${modY}px, 0)`;
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // Native wheel listener for passive: false (prevents browser back/forward and default scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Sensitivity multiplier
      const factor = 1.1;
      targetX.current -= e.deltaX * factor;
      targetY.current -= e.deltaY * factor;
      velocityX.current = -e.deltaX * 0.4;
      velocityY.current = -e.deltaY * 0.4;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Pointer down (mouse & touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Do not capture pointer yet so clicks on cards and links propagate naturally
    isPointerDown.current = true;
    hasDragged.current = false;
    startPointerX.current = e.clientX;
    startPointerY.current = e.clientY;
    lastPointerX.current = e.clientX;
    lastPointerY.current = e.clientY;
    velocityX.current = 0;
    velocityY.current = 0;
  };

  // Pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;

    const dx = e.clientX - lastPointerX.current;
    const dy = e.clientY - lastPointerY.current;

    // Check if threshold exceeded to count as drag
    const totalDist = Math.hypot(e.clientX - startPointerX.current, e.clientY - startPointerY.current);
    if (totalDist > 6) {
      if (!hasDragged.current) {
        hasDragged.current = true;
        setIsGrabbing(true);
        if (containerRef.current && !containerRef.current.hasPointerCapture(e.pointerId)) {
          try {
            containerRef.current.setPointerCapture(e.pointerId);
          } catch {
            // Ignore if pointer capture fails
          }
        }
      }
    }

    targetX.current += dx;
    targetY.current += dy;
    currentX.current += dx;
    currentY.current += dy;

    // Update instantaneous velocity for release inertia
    velocityX.current = dx * 0.8;
    velocityY.current = dy * 0.8;

    lastPointerX.current = e.clientX;
    lastPointerY.current = e.clientY;
  };

  // Pointer up / cancel
  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDown.current = false;
    setIsGrabbing(false);

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  const handleCardCanClick = useCallback(() => {
    // Return true only if user didn't drag
    return !hasDragged.current;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`fixed inset-0 w-full h-full bg-[#060606] overflow-hidden select-none touch-none ${
        isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* 2D Transform Board */}
      <div
        ref={boardRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{
          width: `${UNIT_WIDTH * 3}px`,
          height: `${UNIT_HEIGHT * 3}px`,
        }}
      >
        {CLUSTERS.map(({ cx, cy }) => (
          <div
            key={`cluster-${cx}-${cy}`}
            className="absolute"
            style={{
              left: `${(cx + 1) * UNIT_WIDTH}px`,
              top: `${(cy + 1) * UNIT_HEIGHT}px`,
              width: `${UNIT_WIDTH}px`,
              height: `${UNIT_HEIGHT}px`,
            }}
          >
            {artworks.slice(0, 15).map((artwork, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              // Slight aesthetic vertical stagger on odd columns for architectural rhythm
              const staggerOffset = col % 2 === 1 ? 36 : 0;
              const posX = col * CELL_WIDTH;
              const posY = row * CELL_HEIGHT + staggerOffset;

              return (
                <div
                  key={`${artwork.id}-${cx}-${cy}`}
                  className="absolute"
                  style={{
                    left: `${posX}px`,
                    top: `${posY}px`,
                  }}
                >
                  <CanvasCard
                    artwork={artwork}
                    index={i}
                    total={artworks.length}
                    onCanClick={handleCardCanClick}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Discrete Corner Overlays (No Navbar, Pure Atmosphere) */}

      {/* Top Left: Discreet Identity */}
      <div className="fixed top-6 left-6 z-20 pointer-events-none flex flex-col gap-0.5">
        <h1 className="font-display font-bold text-sm tracking-tight text-white uppercase">
          SABIR MAHARJAN
        </h1>
        <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
          VISUAL ARCHIVE // 15 PROJECTS
        </p>
      </div>

      {/* Bottom Left: Navigation coordinates & interaction prompt */}
      <div className="fixed bottom-6 left-6 z-20 pointer-events-none hidden sm:flex flex-col gap-1">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>KATHMANDU, NEPAL [27.7172° N, 85.3240° E]</span>
        </div>
        <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
          DRAG OR WHEEL SCROLL IN ANY DIRECTION
        </p>
      </div>

      {/* Bottom Right: Dedicated About Page Trigger */}
      <div className="fixed bottom-6 right-6 z-20">
        <Link
          href="/about"
          className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-[#121212]/90 hover:bg-white text-neutral-200 hover:text-black border border-neutral-800 hover:border-white transition-all duration-300 font-mono text-xs tracking-wider uppercase backdrop-blur-md shadow-2xl"
        >
          <span>ABOUT // INFO</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </Link>
      </div>
    </div>
  );
}
