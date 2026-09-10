import { artworks } from '@/data/artworks';
import EditorialArtwork from './EditorialArtwork';

export default function EditorialGallery() {
  // Map artworks by index for explicit asymmetric curation
  const [
    art01, // WEB: Specimen (Portrait)
    art02, // WEB: Graphic Texture (Portrait)
    art03, // Eyes Watches (Portrait)
    art04, // Freedom (Tall 9:16)
    art05, // Shakti (Portrait)
    art06, // Fall of Icarus (Portrait)
    art07, // LIFE (Wide Landscape)
    art08, // Snoopy (Square)
    art09, // Ti Amo (Square)
    art10, // Every Face (Portrait 4:5)
    art11, // Skyfall (Ultra-tall 9:19)
    art12, // Full of Romance (Portrait)
  ] = artworks;

  return (
    <section
      aria-label="Exhibition Gallery"
      className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-24 flex flex-col gap-24 md:gap-36 lg:gap-44"
    >
      {/* ACT 1: Monumental Opening Feature */}
      <div className="grid grid-cols-12 gap-y-8 lg:gap-x-12 items-start">
        <div className="col-span-12 lg:col-span-8">
          <EditorialArtwork
            artwork={art01}
            index={0}
            priority={true}
            className="w-full max-w-2xl"
          />
        </div>
        <div className="col-span-12 lg:col-span-4 lg:pt-16 flex flex-col justify-between h-full">
          <div className="hidden lg:flex flex-col border-l border-white/[0.08] pl-8 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
              EXHIBIT 01 // OVERVIEW
            </span>
            <p className="font-mono text-xs text-neutral-400 leading-relaxed max-w-xs">
              Specimen studies and brutalist typographical compositions exploring anatomical tension and distressed visual hierarchy.
            </p>
          </div>
        </div>
      </div>

      {/* ACT 2: Tension & Contrast — Asymmetric Vertical Pair */}
      <div className="grid grid-cols-12 gap-y-16 md:gap-x-10 lg:gap-x-16 items-start">
        {/* Slender Tall Sky on Left */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-2">
          <EditorialArtwork
            artwork={art04}
            index={3}
            priority={true}
            className="w-full max-w-sm mx-auto md:mx-0"
          />
        </div>

        {/* Dense Monochrome Eye on Right, Staggered Downward */}
        <div className="col-span-12 md:col-span-7 lg:col-span-5 lg:col-start-7 md:mt-24 lg:mt-32">
          <EditorialArtwork
            artwork={art03}
            index={2}
            className="w-full max-w-md mx-auto md:mx-0"
          />
        </div>
      </div>

      {/* ACT 3: The Wide Horizon Landscape */}
      <div className="grid grid-cols-12 gap-y-8 items-center">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <EditorialArtwork
            artwork={art07}
            index={6}
            className="w-full"
          />
        </div>
      </div>

      {/* ACT 4: Classical Renaissance Contrast */}
      <div className="grid grid-cols-12 gap-y-8 items-start">
        <div className="col-span-12 md:col-span-7 md:col-start-5 lg:col-span-6 lg:col-start-6">
          <EditorialArtwork
            artwork={art06}
            index={5}
            className="w-full max-w-lg"
          />
        </div>
      </div>

      {/* ACT 5: High Energy & Cultural Force — Staggered Pair */}
      <div className="grid grid-cols-12 gap-y-16 md:gap-x-10 lg:gap-x-16 items-start">
        {/* Shakti Left Column */}
        <div className="col-span-12 md:col-span-7 lg:col-span-6 lg:col-start-1">
          <EditorialArtwork
            artwork={art05}
            index={4}
            className="w-full max-w-lg"
          />
        </div>

        {/* Web Texture Offset Right & Staggered */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-8 md:mt-20 lg:mt-28">
          <EditorialArtwork
            artwork={art02}
            index={1}
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* ACT 6: Intimate Circular Badge Studies (Square Emblem Duo) */}
      <div className="w-full border-y border-white/[0.06] py-16 md:py-24">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          <div className="w-full max-w-xs">
            <EditorialArtwork
              artwork={art08}
              index={7}
              className="w-full"
            />
          </div>
          <div className="hidden md:block w-[1px] h-48 bg-white/[0.08]" />
          <div className="w-full max-w-xs">
            <EditorialArtwork
              artwork={art09}
              index={8}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* ACT 7: Solitude & Dynamic Verticality */}
      <div className="grid grid-cols-12 gap-y-16 md:gap-x-10 lg:gap-x-16 items-start">
        {/* Dog Portrait 4:5 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-2">
          <EditorialArtwork
            artwork={art10}
            index={9}
            className="w-full max-w-md"
          />
        </div>

        {/* Ultra-Tall Skyfall Mountain Mirror */}
        <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-8 md:mt-20">
          <EditorialArtwork
            artwork={art11}
            index={10}
            className="w-full max-w-sm"
          />
        </div>
      </div>

      {/* ACT 8: The Vibrant Editorial Finale */}
      <div className="grid grid-cols-12 gap-y-8 items-center py-8">
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">
          <EditorialArtwork
            artwork={art12}
            index={11}
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
