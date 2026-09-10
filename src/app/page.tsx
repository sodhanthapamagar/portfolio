import Infinite2DExhibition from '@/components/exhibition/Infinite2DExhibition';
import IntroCurtain from '@/components/intro/IntroCurtain';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#000000] text-white relative overflow-hidden">
      {/* 3-Second Intro Experience */}
      <IntroCurtain />

      {/* 15-Artwork 2D Infinite Panning & Scrolling Exhibition Wall */}
      <Infinite2DExhibition />
    </main>
  );
}
