---
name: shadcn-component-setup
description: Guidance on maintaining theme consistency across shadcn/ui, reactbits, and 21st.dev components
---

# UI Design System & Component Guidelines

## Theme & Aesthetic Direction
- **Theme Baseline**: Dark Mode First (`dark` class on `<html>`).
- **Color Palette**:
  - Main background: `zinc-950` (`#09090b`)
  - Surface containers: `zinc-900` with `zinc-800` borders
  - Primary Action /Gotcha Accents: `rose-500` (Gaze booby-trap / warning state), `emerald-500` (Ready state), `indigo-600` / `cyan-500` (Brand gradients)
- **Typography**: Geist Sans & Geist Mono from `next/font/google`.

## Component Conventions
- **shadcn/ui & Radix integration**: `clsx` + `tailwind-merge` utility function `cn(...)`.
- **Framer Motion**:
  - `AnimatePresence` for modal dialog transitions (`PhotoDialog.tsx`) and full-screen overlays (`FlashOverlay.tsx`, `RickrollOverlay.tsx`, `CountdownDisplay.tsx`).
  - `layout` / `layoutId` on thumbnails for smooth shared-element photo viewing.
- **Accessibility & Motion**:
  - Respect `prefers-reduced-motion` settings.
