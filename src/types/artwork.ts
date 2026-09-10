export type Orientation = 'portrait' | 'landscape' | 'square';

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  originalFilename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: Orientation;
  category: string;
  year?: string;
  description: string;
  visualSummary: string;
  dominantColor?: string;
  ambientColor?: string;
  isPlaceholder?: boolean;
  depthTier?: 'primary' | 'secondary' | 'background';
}
