# Project Overview: Interactive Wedding Invitation

## 1. System Prompt Context (For AI Agents)
You are working on a web application that serves as a digital wedding invitation. The core directive is to build an experience that mimics a classic, retro 2D side-scrolling platformer game (e.g., Super Mario Bros), but implemented entirely using DOM elements and CSS transforms rather than an HTML `<canvas>`. 

Performance on low-end mobile devices is the absolute highest priority. The application must achieve 60fps animations. Do not introduce heavy animation libraries (like GSAP or Framer Motion); rely exclusively on CSS transitions, CSS custom properties, and native `requestAnimationFrame` loops.

## 2. Core Mechanics & UX Flow
- **Initialization**: The user starts at a Title Screen (`$gameState === 'title'`). They select an avatar (Bride or Groom), which updates the global state and drops the character into the game world (`$gameState === 'playing'`).
- **The Game World**: A wide, horizontally scrolling `div` (`2500px` wide). 
- **Movement**: 
  - On-screen left/right buttons trigger continuous movement.
  - Movement is calculated in a `requestAnimationFrame` loop updating Svelte stores (`charX` and `cameraX`).
  - The camera is clamped to ensure it does not reveal areas outside the world boundaries.
- **Interactions (The "Houses")**:
  - The world contains "Houses" at fixed `x` coordinates.
  - A proximity system calculates the distance between the character (`charX`) and each house.
  - If the distance is `< 100px`, the house animates (CSS scale/translate bounce) and reveals its label.
  - Tapping a house locks all character movement, triggers a full-screen blurred backdrop (`backdrop-filter: blur(8px)`), and opens a UI Modal containing specific menu content.

## 3. Technology Stack (Strict Requirements)
- **Frontend Framework**: SvelteKit (App Router, SSR enabled).
- **Reactivity Paradigm**: Svelte 5 Runes (`$state`, `$derived`, `$effect`) are mandatory for local state. Global state utilizes standard Svelte `writable` and `spring` stores.
- **Styling**: Vanilla CSS. No TailwindCSS. Use CSS Variables for color theming to maintain a pastel, pixel-art aesthetic.
- **Database**: MySQL (MariaDB compatible), currently orchestrated locally via Docker Compose.
- **ORM**: Drizzle ORM (`drizzle-kit` for migrations, `mysql2` driver).
- **Authentication**: Lucia Auth (To be implemented exclusively for the `/admin` dashboard).

## 4. Design Aesthetics
- **Pixel Art**: Images should have `image-rendering: pixelated` applied.
- **Color Palette**: Soft, romantic pastel colors (`#ffb3ba`, `#ffdfba`, `#baffc9`, `#bae1ff`, `#e6b3ff`).
- **Layout**: Mobile-first (portrait orientation). Desktop users will see the same container, but stretched to fit horizontal proportions where necessary, though a centered mobile-viewport container is preferred if desktop styling breaks.
