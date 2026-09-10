'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [copied, setCopied] = useState(false);
  const email = 'sabirmaharjan7@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#ededed] font-body relative selection:bg-neutral-800 selection:text-white flex flex-col justify-between p-6 md:p-12 lg:p-20 overflow-x-hidden">
      {/* Top Header / Back link */}
      <header className="w-full flex items-center justify-between pb-8 border-b border-neutral-900">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>RETURN TO EXHIBITION</span>
        </Link>
        <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
          SABIR MAHARJAN // 2026
        </span>
      </header>

      {/* Main Editorial Content */}
      <section className="my-16 md:my-24 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Big Statement Typography */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-neutral-400 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>KATHMANDU, NEPAL &mdash; GRAPHIC DESIGN</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white leading-[1.05]">
            SABIR MAHARJAN
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 font-body leading-relaxed max-w-xl">
            Graphic designer and visual artist creating high-contrast poster designs,
            experimental typography, and editorial visual compositions.
          </p>

          <p className="text-sm md:text-base text-neutral-400 font-body leading-relaxed max-w-xl">
            My work investigates brutalist typography, organic and technical specimen studies,
            distressed textures, and dynamic geometric framing. Every piece is developed as an
            autonomous exploration of tension, rhythm, and typographic weight.
          </p>
        </div>

        {/* Right Column: Disciplines & Direct Communication */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          {/* Disciplines Box */}
          <div className="border border-neutral-800/90 bg-[#0c0c0c] p-6 sm:p-8 flex flex-col gap-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3">
              PRACTICES & DISCIPLINES
            </h2>
            <ul className="flex flex-col gap-4 font-mono text-xs tracking-wider text-neutral-300">
              <li className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <span>01 // POSTER & PRINT DESIGN</span>
                <span className="text-neutral-400">ANALOG / DIGITAL</span>
              </li>
              <li className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <span>02 // TYPOGRAPHY & RESEARCH</span>
                <span className="text-neutral-400">BRUTALIST / DISPLAY</span>
              </li>
              <li className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <span>03 // EDITORIAL & LAYOUT</span>
                <span className="text-neutral-400">ASYMMETRIC GRID</span>
              </li>
              <li className="flex items-center justify-between pb-1">
                <span>04 // VISUAL IDENTITY</span>
                <span className="text-neutral-400">MINIMAL / RAW</span>
              </li>
            </ul>
          </div>

          {/* Direct Email (No forms, direct & authentic) */}
          <div className="border border-neutral-800/90 bg-[#0c0c0c] p-6 sm:p-8 flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              DIRECT INQUIRIES
            </h2>
            <p className="text-xs text-neutral-400 font-body leading-relaxed">
              Available for visual identity commissions, poster design, and collaborative editorial projects.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={`mailto:${email}`}
                className="flex-1 px-4 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider text-center hover:bg-neutral-200 transition-colors"
              >
                EMAIL DIRECTLY ↗
              </a>
              <button
                onClick={handleCopyEmail}
                className="px-4 py-3 bg-[#171717] hover:bg-[#222] text-neutral-200 font-mono text-xs tracking-wider uppercase border border-neutral-700 transition-colors"
              >
                {copied ? 'COPIED ✓' : 'COPY EMAIL'}
              </button>
            </div>

            <span className="font-mono text-[11px] text-neutral-400 select-all pt-1">
              {email}
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-400">
        <span>© {new Date().getFullYear()} SABIR MAHARJAN. ALL RIGHTS RESERVED.</span>
        <span>KATHMANDU, NEPAL</span>
      </footer>
    </main>
  );
}
