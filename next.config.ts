import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats: AVIF first, then WebP, fallback JPEG
    formats: ['image/avif', 'image/webp'],
    // Quality tuned for photography/design work — high fidelity
    qualities: [75, 85, 95],
    // Device size breakpoints aligned with editorial layout breakpoints
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [64, 128, 256, 384, 512],
    // Minimize layout shift — all images have explicit dimensions
    minimumCacheTTL: 31536000, // 1 year
  },
  // Allow local network devices (phones, tablets) to access the dev server
  // without being blocked by the cross-origin HMR safety check.
  // Add your local network IP below if it changes (check with `ipconfig`).
  allowedDevOrigins: [
    '192.168.1.66',
    '192.168.1.*',
    '192.168.0.*',
    '10.0.0.*',
  ],
};

export default nextConfig;
