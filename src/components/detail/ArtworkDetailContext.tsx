'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Artwork } from '@/types/artwork';

interface DetailState {
  artwork: Artwork | null;
  originRect: DOMRect | null;
}

interface ArtworkDetailContextValue {
  open: (artwork: Artwork, originRect: DOMRect) => void;
  close: () => void;
  state: DetailState;
}

const ArtworkDetailContext = createContext<ArtworkDetailContextValue | null>(null);

export function ArtworkDetailProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DetailState>({ artwork: null, originRect: null });

  const open = useCallback((artwork: Artwork, originRect: DOMRect) => {
    setState({ artwork, originRect });
  }, []);

  const close = useCallback(() => {
    setState({ artwork: null, originRect: null });
  }, []);

  return (
    <ArtworkDetailContext.Provider value={{ open, close, state }}>
      {children}
    </ArtworkDetailContext.Provider>
  );
}

export function useArtworkDetail() {
  const ctx = useContext(ArtworkDetailContext);
  if (!ctx) throw new Error('useArtworkDetail must be used inside ArtworkDetailProvider');
  return ctx;
}
