# Portfolio Development Status: PAUSED

- **Status:** PAUSED
- **Reason:** Temporarily paused to focus on and complete an independent college project.
- **Date Paused:** September 9, 2026
- **Current Git Branch:** `main`

---

## 1. Current Development State & Phase Status

- **Architecture Completed to Date:**
  - **Phase 0 (Project Definition & Documentation):** Complete and documented (`VISION.md`, `EXPERIENCE.md`, `DESIGN.md`, `INTERACTIONS.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `DECISIONS.md`).
  - **Phase 1 (Application Foundation):** Complete (Vite + React + TypeScript + Tailwind CSS design system + Editorial Atelier visual language).
  - **Phase 2 (Portfolio Data Model):** Complete (Entities for Profile, Projects, Technologies, Skills, and Timeline Milestones with typed relationship graphs).
  - **Phase 3 (Exploration Engine & Context Resolution):** Complete (Bi-directional graph traversal, contextual relationship discovery, exploration history stack with retrace/navigation controls).
  - **Phase 4A (2D Spatial Exploration Stage):** Complete (Full-viewport spatial stage, focal entity cards, contextual relationship chips, analytical inspection lens drawer).

- **Phase 4B — Living Background & Environmental Reactivity Status:**
  - **Status:** **PARTIALLY COMPLETED / IN PROGRESS**
  - **What Has Been Implemented:**
    - Ambient atmospheric layers in Deep Violet (`#2C1F33`) and Antique Gold (`#B9A38B`) within `src/components/environment/`.
    - `FocusAtmosphere.tsx`: Dynamic focal radial illumination adapting to active entity types (`profile`, `project`, `technology`, `skill`, `timeline`).
    - `ParticleField.tsx`: Deterministic seeded floating particle embers with idle drift and reduced-motion support.
    - `CursorInfluence.tsx`: Pointer proximity illumination.
    - `EnvironmentalTraces.tsx`: Spatial relation traces and hover response.
    - `hoverState.ts`: Zero-dependency event bus bridging foreground nodes to environment reactivity without global re-renders.
    - `EnvironmentLayer.tsx`: Background composition orchestrator mounted behind content in `AppShell.tsx`.
  - **What Remains for Phase 4B & Subsequent Phases:**
    - Fine-tuning atmospheric balance and distant project constellation integration (`DistantProjectMarkers.tsx`).
    - Phase 5: Deep contextual views and specialized templates per entity type.
    - Phase 6: Further relationship discovery mechanisms.
    - Phase 8: Keyboard-driven Command Palette (`Ctrl+K` / `Cmd+K` interaction layer).
    - Future CLI: Terminal exploration package (`npx farhan`).

---

## 2. Important Documentation to Read When Resuming

Before writing any new code or modifying existing components, thoroughly review these documents:

| Document | Purpose |
| :--- | :--- |
| [`README.md`](file:///README.md) | High-level portfolio philosophy, interaction model, and project goals |
| [`docs/VISION.md`](file:///docs/VISION.md) | Architectural vision, core principles, anti-patterns (what this project is NOT) |
| [`docs/EXPERIENCE.md`](file:///docs/EXPERIENCE.md) | Visitor journey, exploration states, direct and keyboard interaction models |
| [`docs/INTERACTIONS.md`](file:///docs/INTERACTIONS.md) | Formal state transitions: `EXPLORE`, `FOCUS`, `INSPECT`, `RELATE`, `NAVIGATE` |
| [`docs/ROADMAP.md`](file:///docs/ROADMAP.md) | Full phased implementation plan from Phase 0 through Phase 13 + Future CLI |
| [`docs/ARCHITECTURE.md`](file:///docs/ARCHITECTURE.md) | Separation of data, relationships, state engine, and presentation layer |
| [`docs/DESIGN.md`](file:///docs/DESIGN.md) | Visual language: Editorial Atelier, Antique Gold on Deep Violet, typography & tokens |
| [`docs/DECISIONS.md`](file:///docs/DECISIONS.md) | Architectural Decision Records (ADRs) explaining past design choices |

---

## 3. Critical Resumption Guideline

> [!IMPORTANT]
> **MANDATORY FIRST STEP BEFORE CONTINUING IMPLEMENTATION:**
>
> When development resumes, **run and visually review the existing portfolio application first** before writing any new code:
>
> 1. Run `npm run dev` and open `http://localhost:5173/` in a browser.
> 2. Test the 2D Exploration Stage: click projects, technologies, and skills.
> 3. Verify the breadcrumb exploration history, back/reset navigation, and inspection lens drawer.
> 4. Inspect the living background layer (ambient atmosphere and particles).
> 5. Review the new college project that was completed during this hiatus to plan how it will be integrated into the portfolio data model (`src/core/data/projects.ts`) and relationship graph (`src/core/relationships/`).

---

## 4. Step-by-Step Instructions to Resume Development

1. **Verify Environment & Dependencies:**
   ```bash
   npm install
   npm run build
   ```
2. **Start the Local Development Server:**
   ```bash
   npm run dev
   ```
3. **Assess the Current Phase (Phase 4B):**
   - Check `src/components/environment/` and verify that background responsiveness, idle transitions, and reduced-motion modes perform smoothly without visual distractions.
   - Conclude and stabilize Phase 4B with a clean verification pass.
4. **Plan Next Milestones:**
   - Incorporate the newly finished college project into `src/core/data/projects.ts` with accurate metadata, technologies, and skills.
   - Proceed according to `docs/ROADMAP.md` (e.g., Phase 5: Contextual Explorer refinements, Phase 8: Command Layer).
