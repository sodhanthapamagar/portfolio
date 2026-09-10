# Sabir Maharjan — Digital Design Exhibition

An interactive digital exhibition showcasing 15 graphic design works by **Sabir Maharjan**, a graphic designer and visual artist based in Kathmandu, Nepal.

Built as an infinite 2D exhibition space — inspired by the experience of a physical gallery. Artwork is the interface. Black space is part of the composition.

---

## Live Experience

- Pan in any direction to explore the exhibition
- Hover over any artwork to reveal its title and category
- Click an artwork to open a full cinematic detail view
- Press `Esc` or click outside to return to the gallery

---

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org/) (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **Animation** — [GSAP](https://gsap.com/)
- **Fonts** — Syne (display), Space Grotesk (body), Geist Mono (mono)

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/sabir-portfolio.git
cd sabir-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — exhibition wall
│   ├── about/page.tsx        # About & contact
│   └── globals.css           # Design system & tokens
├── components/
│   ├── exhibition/
│   │   ├── Infinite2DExhibition.tsx   # 2D infinite pan canvas
│   │   └── FloatingArtwork.tsx        # Individual artwork card
│   ├── detail/
│   │   ├── ArtworkDetailOverlay.tsx   # Cinematic detail view
│   │   └── ArtworkDetailContext.tsx   # Detail open/close state
│   ├── intro/
│   │   └── IntroCurtain.tsx           # Intro animation
│   └── foundation/
│       └── CustomCursor.tsx           # VIEW cursor
├── data/
│   └── artworks.ts           # All 15 artwork definitions
└── types/
    └── artwork.ts            # Artwork TypeScript interface
public/
└── assets/                   # Artwork image files
```

---

## Design Philosophy

> The homepage is an exhibition wall, not a portfolio grid.

- Artwork floats in a large dark space — **3400 × 2600px** virtual canvas
- Infinite wrapping in both X and Y axes — there are no edges
- Information is hidden until the visitor intentionally hovers
- The opening trio (OBSESSION, Skyfall, Fragrant Flower) appears centered on first load
- No fake metrics, no client logos, no case study templates

---

## Contact

**Sabir Maharjan** — Graphic Designer, Kathmandu, Nepal  
✉ sabirmaharjan7@gmail.com

---

© 2026 Sabir Maharjan. All rights reserved.
