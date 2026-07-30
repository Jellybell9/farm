# Greenacre Farm

## Overview

Greenacre Farm is a browser-based 3D farming game built with TypeScript, Vite, and Three.js. It renders a low-poly farm world with harvesting, baling, livestock care, vehicles, a marketplace, and purchasable equipment upgrades.

## Project layout

- `src/main.ts` contains the game UI, Three.js scene, gameplay state, input handling, marketplace, and animation loop.
- `src/style.css` contains all HUD, marketplace, help-panel, and responsive styling.
- `src/assets/` and `public/` contain static visual assets.

## Gameplay notes

- Arrow keys move the farmer or active vehicle; `E` interacts and enters/exits vehicles.
- The combine harvests wheat, the green tractor collects sheaves and creates bales, and the blue loader moves bales.
- Marketplace purchases include farm animals, vegetable plots, and one-time equipment upgrades.
- Keep marketplace mechanics and displayed descriptions in sync when adding or changing an item.

## Development

Use the following commands when Node.js and npm are available:

```sh
npm install
npm run dev
npm run build
```

`npm run build` runs TypeScript checking followed by the Vite production build.

## Change guidelines

- Prefer small, focused changes in `src/main.ts`; most systems intentionally live together there.
- Preserve the existing low-poly Three.js style and responsive UI behavior.
- Verify TypeScript/build output after gameplay changes when the toolchain is available.
