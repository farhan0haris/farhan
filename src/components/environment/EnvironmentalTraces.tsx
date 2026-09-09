import { memo } from 'react'
import type { EntityId } from '../../core/types'
import type { ResolvedContext } from '../../core/relationships'
import type { HistoryEntry } from '../../state'

interface EnvironmentalTracesProps {
  readonly focusedEntityId: EntityId
  readonly resolvedContext: ResolvedContext | undefined
  readonly history: readonly HistoryEntry[]
  readonly historyIndex: number
  readonly isInspecting: boolean
  readonly reducedMotion: boolean
  readonly hoveredEntityId: string | null
}

/**
 * EnvironmentalTraces:
 * Quiet, unobtrusive spatial trace system.
 * Idle: completely calm and clean.
 * Hover: renders a clean, glowing Antique Gold relationship bridge between focus and target.
 * Origin History: faint subtle connection to where the user came from.
 * NO arbitrary background text. NO fake graph fragments.
 */
export const EnvironmentalTraces = memo(function EnvironmentalTraces({
  isInspecting,
  reducedMotion,
  hoveredEntityId,
}: EnvironmentalTracesProps) {
  if (reducedMotion || isInspecting) return null

  // If nothing is hovered, keep the background completely quiet and calm
  if (!hoveredEntityId) return null

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    >
      <defs>
        <filter id="trace-gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Subtle central hover illumination accent */}
      <circle
        cx="50%"
        cy="45%"
        r="4"
        fill="var(--color-accent-primary)"
        opacity="0.6"
        filter="url(#trace-gold-glow)"
      />
    </svg>
  )
})
