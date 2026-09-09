import { ExplorationHeader } from '../exploration/ExplorationHeader'
import { ExplorationStage } from '../exploration/ExplorationStage'
import { InspectionLens } from '../exploration/InspectionLens'
import { EnvironmentLayer } from '../environment'

export function AppShell() {
  return (
    <div
      className="w-screen h-screen flex flex-col bg-bg-base text-fg-primary transition-colors overflow-hidden select-text relative"
    >
      {/* Phase 4B: Living Background Environment */}
      <EnvironmentLayer />

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
