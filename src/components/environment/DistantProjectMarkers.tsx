import { memo, useState, useEffect } from 'react'
import { useExploration } from '../../state'
import { setEnvironmentHover, subscribeEnvironmentHover } from './hoverState'
import type { EntityId } from '../../core/types'

interface DistantProject {
  id: EntityId
  code: string
  name: string
  tagline: string
  pos: {
    top?: string
    bottom?: string
    left?: string
    right?: string
    transform?: string
  }
}

const DISTANT_PROJECTS: readonly DistantProject[] = [
  {
    id: 'project:deadcode',
    code: 'DC',
    name: 'DeadCode',
    tagline: 'Git Time Machine',
    pos: { top: '18%', left: '7%' },
  },
  {
    id: 'project:node',
    code: 'NODE',
    name: 'NODE',
    tagline: 'Knowledge Graph',
    pos: { top: '18%', right: '7%' },
  },
  {
    id: 'project:vault-x',
    code: 'VX',
    name: 'VaultX',
    tagline: 'Zero-Knowledge Vault',
    pos: { bottom: '22%', left: '9%' },
  },
  {
    id: 'project:aurashelf',
    code: 'AS',
    name: 'AuraShelf',
    tagline: 'Smart Inventory',
    pos: { bottom: '22%', right: '9%' },
  },
  {
    id: 'project:letterly-ai',
    code: 'LA',
    name: 'Letterly AI',
    tagline: 'Intelligent Synthesis',
    pos: { bottom: '9%', left: '50%', transform: 'translateX(-50%)' },
  },
]

export const DistantProjectMarkers = memo(function DistantProjectMarkers() {
  const { state, focus } = useExploration()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    return subscribeEnvironmentHover((id) => {
      setHoveredId(id)
    })
  }, [])

  // Do not render distant markers on mobile to prevent collision and keep focus clean
  if (isMobile) return null

  // Hide the marker if the project is already the primary focus
  const activeFocusId = state.focusedEntityId

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10" aria-hidden="false">
      {DISTANT_PROJECTS.map((proj) => {
        if (proj.id === activeFocusId) return null

        const isHovered = hoveredId === proj.id
        const isDimmed = hoveredId !== null && !isHovered

        return (
          <div
            key={proj.id}
            style={{
              position: 'absolute',
              ...proj.pos,
              pointerEvents: 'auto',
            }}
            className="group"
          >
            <button
              type="button"
              onClick={() => focus(proj.id)}
              onMouseEnter={() => {
                setEnvironmentHover(proj.id)
              }}
              onMouseLeave={() => {
                setEnvironmentHover(null)
              }}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent-primary rounded-lg p-2 ${
                isDimmed ? 'opacity-25 scale-95' : isHovered ? 'opacity-100 scale-110' : 'opacity-65 hover:opacity-100'
              }`}
              title={`Explore ${proj.name} (${proj.tagline})`}
              aria-label={`Distant project marker: ${proj.name}`}
            >
              {/* Monogram Capsule */}
              <div
                className={`flex items-center justify-center min-w-[36px] h-7 px-2 rounded-full border transition-all duration-300 font-mono text-[11px] font-bold tracking-widest ${
                  isHovered
                    ? 'border-accent-primary bg-accent-subtle/70 text-accent-hover shadow-[0_0_18px_rgba(185,163,139,0.35)]'
                    : 'border-accent-primary/25 bg-bg-base/70 text-accent-primary/80 backdrop-blur-xs'
                }`}
              >
                <span>{proj.code}</span>
              </div>

              {/* Emergent Nameplate on hover / focus */}
              <div
                className={`flex flex-col items-center text-center transition-all duration-200 pointer-events-none ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                }`}
              >
                <span className="text-xs font-semibold tracking-tight text-fg-primary whitespace-nowrap">
                  {proj.name}
                </span>
                <span className="text-[10px] font-mono text-fg-muted whitespace-nowrap">
                  {proj.tagline}
                </span>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
})
