'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { artworks } from '@/data/artworks';
import FloatingArtwork from './FloatingArtwork';

// Virtual 2D Canvas Dimensions (Expansive spatial field)
const CANVAS_WIDTH = 3400;
const CANVAS_HEIGHT = 2600;

// Curated 2D coordinates for the 15 artworks floating inside the 3400x2600 black space
interface SpatialArtwork {
  id: string;
  x: number;
  y: number;
  width: number;
  titlePlacement: 'left' | 'right' | 'top' | 'bottom';
}

const SPATIAL_POSITIONS: SpatialArtwork[] = [
  // --- PRIMARY OPENING TRIO (Centered in initial viewport when intro curtain lifts) ---
  // 1. OBSESSION: Love Can Be A Prison (Center Anchor)
  { id: 'art-15', x: 1520, y: 1120, width: 380, titlePlacement: 'top' },
  // 2. Skyfall: In The Zone (Flanking Left)
  { id: 'art-11', x: 1020, y: 1160, width: 270, titlePlacement: 'left' },
  // 3. Full of Romance: Fragrant Flower (Flanking Right)
  { id: 'art-12', x: 2120, y: 1100, width: 310, titlePlacement: 'right' },

  // --- SURROUNDING EXHIBITION (Discovered as visitor pans in any direction) ---
  // Upper Region
  { id: 'art-13', x: 1540, y: 380,  width: 370, titlePlacement: 'right' }, // श्रृङ्गार Shringaar
  { id: 'art-01', x: 620,  y: 320,  width: 350, titlePlacement: 'right' }, // WEB: Arachnid Specimen
  { id: 'art-02', x: 2350, y: 280,  width: 270, titlePlacement: 'left' },  // WEB: Graphic Texture
  { id: 'art-03', x: 1120, y: 580,  width: 240, titlePlacement: 'right' }, // Eyes Watches
  { id: 'art-04', x: 2850, y: 520,  width: 250, titlePlacement: 'left' },  // Freedom

  // Flanking Outer Regions
  { id: 'art-05', x: 320,  y: 1080, width: 360, titlePlacement: 'right' }, // शक्ति Shakti
  { id: 'art-06', x: 480,  y: 1750, width: 230, titlePlacement: 'right' }, // Fall of Icarus
  { id: 'art-08', x: 2750, y: 1180, width: 310, titlePlacement: 'left' },  // Snoopy & Woodstock
  { id: 'art-09', x: 2850, y: 1720, width: 230, titlePlacement: 'left' },  // Ti Amo

  // Lower Region
  { id: 'art-14', x: 1080, y: 1880, width: 280, titlePlacement: 'right' }, // प्यार Pyaar
  { id: 'art-07', x: 1600, y: 1820, width: 440, titlePlacement: 'top' },   // LIFE: Inverted Perspective
  { id: 'art-10', x: 2280, y: 1850, width: 270, titlePlacement: 'left' },  // Every Face Tells a Story
];



// 3x3 repetition offsets to cover all 2D directions infinitely
const CLUSTERS = [
  { cx: -1, cy: -1 }, { cx: 0, cy: -1 }, { cx: 1, cy: -1 },
  { cx: -1, cy:  0 }, { cx: 0, cy:  0 }, { cx: 1, cy:  0 },
  { cx: -1, cy:  1 }, { cx: 0, cy:  1 }, { cx: 1, cy:  1 },
];

export default function Infinite2DExhibition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Continuous Camera Coordinates
  const currentX = useRef<number>(-CANVAS_WIDTH / 4);
  const currentY = useRef<number>(-CANVAS_HEIGHT / 4);
  const targetX = useRef<number>(-CANVAS_WIDTH / 4);
  const targetY = useRef<number>(-CANVAS_HEIGHT / 4);

  // Velocity & Drag Tracking
  const velocityX = useRef<number>(0);
  const velocityY = useRef<number>(0);
  const isPointerDown = useRef<boolean>(false);
  const startPointerX = useRef<number>(0);
  const startPointerY = useRef<number>(0);
  const lastPointerX = useRef<number>(0);
  const lastPointerY = useRef<number>(0);
  const hasDragged = useRef<boolean>(false);

  // Hover Focus Management
  const [hoveredArtworkId, setHoveredArtworkId] = useState<string | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Initial centering on first load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initX = -(CANVAS_WIDTH - window.innerWidth) / 2;
      const initY = -(CANVAS_HEIGHT - window.innerHeight) / 2;
      currentX.current = initX;
      currentY.current = initY;
      targetX.current = initX;
      targetY.current = initY;
    }
  }, []);

  // Continuous Physics & Modulo Wrapping Animation Loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Lerp smooth interpolation
      currentX.current += (targetX.current - currentX.current) * 0.15;
      currentY.current += (targetY.current - currentY.current) * 0.15;

      // Inertia when finger/mouse released
      if (!isPointerDown.current) {
        targetX.current += velocityX.current;
        targetY.current += velocityY.current;
        velocityX.current *= 0.93;
        velocityY.current *= 0.93;
      }

      // Mathematical continuous modulo wrap in both X and Y
      const modX =
        ((((currentX.current % CANVAS_WIDTH) - CANVAS_WIDTH) % CANVAS_WIDTH) +
          CANVAS_WIDTH) %
          CANVAS_WIDTH -
        CANVAS_WIDTH;

      const modY =
        ((((currentY.current % CANVAS_HEIGHT) - CANVAS_HEIGHT) % CANVAS_HEIGHT) +
          CANVAS_HEIGHT) %
          CANVAS_HEIGHT -
        CANVAS_HEIGHT;

      if (boardRef.current) {
        boardRef.current.style.transform = `translate3d(${modX}px, ${modY}px, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Native wheel listener for 2D trackpad and mouse wheel scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = 1.15;
      targetX.current -= e.deltaX * factor;
      targetY.current -= e.deltaY * factor;
      velocityX.current = -e.deltaX * 0.35;
      velocityY.current = -e.deltaY * 0.35;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Pointer Down (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    hasDragged.current = false;
    startPointerX.current = e.clientX;
    startPointerY.current = e.clientY;
    lastPointerX.current = e.clientX;
    lastPointerY.current = e.clientY;
    velocityX.current = 0;
    velocityY.current = 0;
  };

  // Pointer Move (Drag)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;

    const dx = e.clientX - lastPointerX.current;
    const dy = e.clientY - lastPointerY.current;

    const totalDist = Math.hypot(
      e.clientX - startPointerX.current,
      e.clientY - startPointerY.current
    );

    if (totalDist > 6) {
      if (!hasDragged.current) {
        hasDragged.current = true;
        setIsGrabbing(true);
        if (containerRef.current && !containerRef.current.hasPointerCapture(e.pointerId)) {
          try {
            containerRef.current.setPointerCapture(e.pointerId);
          } catch {}
        }
      }
    }

    targetX.current += dx;
    targetY.current += dy;
    currentX.current += dx;
    currentY.current += dy;

    velocityX.current = dx * 0.75;
    velocityY.current = dy * 0.75;

    lastPointerX.current = e.clientX;
    lastPointerY.current = e.clientY;
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDown.current = false;
    setIsGrabbing(false);

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Only allow artwork click if user didn't drag
  const handleCanClick = useCallback(() => {
    return !hasDragged.current;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`fixed inset-0 w-full h-full bg-[#030303] overflow-hidden select-none touch-none ${
        isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* Subtle Viewport Vignette (Section 4): Very soft gallery edge falloff without visible gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.65) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Very Subtle Film Grain (Section 5): Prevents digital flatness at <2% opacity */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.018] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* 2D Infinite Transform Plane */}
      <div
        ref={boardRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{
          width: `${CANVAS_WIDTH * 3}px`,
          height: `${CANVAS_HEIGHT * 3}px`,
        }}
      >
        {CLUSTERS.map(({ cx, cy }) => (
          <div
            key={`cluster-${cx}-${cy}`}
            className="absolute"
            style={{
              left: `${(cx + 1) * CANVAS_WIDTH}px`,
              top: `${(cy + 1) * CANVAS_HEIGHT}px`,
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
            }}
          >


            {/* Curated Foreground Floating Artworks (15 Pieces) */}
            {SPATIAL_POSITIONS.map((pos) => {
              const artwork = artworks.find((a) => a.id === pos.id);
              if (!artwork) return null;

              const isDimmed =
                hoveredArtworkId !== null && hoveredArtworkId !== artwork.id;

              // Eagerly load the 3 opening-trio artworks in the center cluster only
              // (cx=0, cy=0) to satisfy Next.js LCP requirements
              const isOpeningTrio =
                cx === 0 && cy === 0 &&
                (pos.id === 'art-15' || pos.id === 'art-11' || pos.id === 'art-12');

              return (
                <div
                  key={`${artwork.id}-${cx}-${cy}`}
                  className="absolute"
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${pos.width}px`,
                  }}
                >
                  <FloatingArtwork
                    artwork={artwork}
                    priority={isOpeningTrio}
                    onCanClick={handleCanClick}
                    titlePlacement={pos.titlePlacement}
                    onHoverChange={setHoveredArtworkId}
                    isDimmed={isDimmed}
                  />
                </div>
              );
            })}
          </div>
        ))}
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

      {/* Quiet Navigation Hint (Bottom Left, Subtle) */}
      <div className="fixed bottom-6 left-6 z-30 pointer-events-none hidden sm:flex flex-col gap-1">
        <p className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
          PAN IN ANY DIRECTION // 15 WORKS
        </p>
      </div>

      {/* Quiet Fixed About Link (Bottom Right) */}
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
