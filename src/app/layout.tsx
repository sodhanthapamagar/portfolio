import type { Metadata } from 'next';
import { Syne, Space_Grotesk, Geist_Mono } from 'next/font/google';
import CustomCursor from '@/components/foundation/CustomCursor';
import { ArtworkDetailProvider } from '@/components/detail/ArtworkDetailContext';
import ArtworkDetailOverlay from '@/components/detail/ArtworkDetailOverlay';
import './globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sabir Maharjan — Graphic Design Exhibition',
  description: 'An interactive digital exhibition of graphic design work by Sabir Maharjan. Poster design, editorial layout, typography, and visual identity from Kathmandu, Nepal.',
  keywords: ['graphic design', 'poster design', 'editorial', 'typography', 'Kathmandu', 'Nepal', 'Sabir Maharjan'],
  authors: [{ name: 'Sabir Maharjan' }],
  openGraph: {
    title: 'Sabir Maharjan — Graphic Design Exhibition',
    description: 'An interactive digital exhibition of graphic design work by Sabir Maharjan.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-[#ededed] font-body selection:bg-neutral-800 selection:text-white">
        <ArtworkDetailProvider>
          <CustomCursor />
          {children}
          <ArtworkDetailOverlay />
        </ArtworkDetailProvider>
      </body>
    </html>
  );
}
