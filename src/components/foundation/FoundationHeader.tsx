'use client';

import { useState } from 'react';
import AboutPanel from './AboutPanel';

/**
 * FoundationHeader — Phase 10 update
 *
 * Minimal exhibition header with:
 * - Exhibition identity (name, discipline, location)
 * - Status badge (12 works)
 * - "About" trigger → opens AboutPanel
 */
export default function FoundationHeader() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header className="w-full hairline-bottom bg-[#060606]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">

          {/* Left: Identity */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 mb-1 uppercase">
              Exhibition · Archive
            </span>
            <h1 className="font-display text-lg md:text-xl font-bold tracking-tight text-[#f5f5f5] uppercase leading-none">
              Sabir Maharjan
            </h1>
            <p className="font-mono text-[11px] text-neutral-400 tracking-wider mt-0.5">
              Graphic Designer
            </p>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Live badge */}
            <div className="hidden sm:flex items-center gap-2 font-mono text-neutral-400 border border-white/[0.08] px-3 py-1.5 bg-[#0c0c0c]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
              <span className="text-[10px] tracking-wider uppercase">12 Works</span>
            </div>

            {/* Location — desktop only */}
            <span className="text-neutral-500 font-mono text-[10px] tracking-widest uppercase hidden lg:inline">
              Kathmandu, NP
            </span>

            {/* About button */}
            <button
              id="about-trigger-btn"
              onClick={() => setAboutOpen(true)}
              aria-label="Open About panel"
              className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-400 hover:text-white transition-colors duration-200"
            >
              <span
                className="w-4 h-px bg-neutral-500 group-hover:bg-white group-hover:w-6 transition-all duration-300"
                aria-hidden="true"
              />
              About
            </button>
          </div>
        </div>
      </header>

      {/* About panel — conditionally rendered */}
      {aboutOpen && (
        <AboutPanel isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      )}
    </>
  );
}
