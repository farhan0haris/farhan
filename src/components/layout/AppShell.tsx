import { useState } from 'react'
import { ExplorationHeader } from '../exploration/ExplorationHeader'
import { ExplorationStage } from '../exploration/ExplorationStage'
import { InspectionLens } from '../exploration/InspectionLens'

export function AppShell() {
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null)

  return (
    <div
      onPointerMove={(e) => setPointerPos({ x: e.clientX, y: e.clientY })}
      className="w-screen h-screen flex flex-col bg-bg-base text-fg-primary transition-colors overflow-hidden select-text relative"
    >
      {/* Background Atmosphere Layers: Subtle Grid & Ambient Illumination */}
      <div className="fixed inset-0 bg-ambient-grid opacity-[0.22] dark:opacity-[0.10] pointer-events-none z-0" />
      <div className="fixed inset-0 ambient-illumination pointer-events-none z-0" />

      {/* Subtle Reactive Cursor Proximity Illumination (Desktop) */}
      {pointerPos && (
        <div
          className="fixed pointer-events-none transition-opacity duration-300 z-0 hidden sm:block"
          style={{
            left: pointerPos.x - 300,
            top: pointerPos.y - 300,
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.04), transparent 70%)',
            borderRadius: '50%',
          }}
        />
      )}

      {/* Top Editorial Exploration Header */}
      <ExplorationHeader />

      {/* Main Persistent 2D Exploration Stage (100vw × calc(100vh - 3.5rem)) */}
      <main
        className="relative z-10 flex-1 min-h-0 w-full flex flex-col overflow-hidden"
        id="exploration-main"
      >
        <section
          aria-label="Interactive Exploration Stage"
          className="flex-1 min-h-0 w-full flex flex-col overflow-y-auto lg:overflow-hidden scrollbar-none focus:outline-none"
          tabIndex={0}
        >
          <ExplorationStage />
        </section>
      </main>

      {/* Secondary Analytical Lens Layer (Inspection) */}
      <InspectionLens />
    </div>
  )
}
