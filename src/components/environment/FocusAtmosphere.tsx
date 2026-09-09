import { useMemo, memo } from 'react'
import type { EntityId, EntityType } from '../../core/types'
import type { ResolvedContext } from '../../core/relationships'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FocusAtmosphereProps {
  readonly focusedEntityType: EntityType
  readonly focusedEntityId: EntityId
  readonly isInspecting: boolean
  readonly isIdle: boolean
  readonly reducedMotion: boolean
  readonly resolvedContext: ResolvedContext | undefined
  readonly visitedEntities: ReadonlySet<EntityId>
  readonly hoveredEntityId: string | null
}

// ---------------------------------------------------------------------------
// Component
// Pure atmospheric depth in Deep Violet (#2C1F33) with Antique Gold (#B9A38B)
// No decorative text, no random initials, no fake objects.
// ---------------------------------------------------------------------------

const ATMOS_TYPES = ['profile', 'project', 'technology', 'skill', 'timeline'] as const

export const FocusAtmosphere = memo(function FocusAtmosphere({
  focusedEntityType,
  isInspecting,
  isIdle,
  reducedMotion,
  hoveredEntityId,
}: FocusAtmosphereProps) {
  const inspectionDim = isInspecting ? 0.35 : 1

  // Atmosphere glow dynamic styling based on entity type in Antique Gold & Deep Violet
  const focalGlowStyle = useMemo(() => {
    switch (focusedEntityType) {
      case 'project':
        return {
          background: 'radial-gradient(circle 650px at 50% 45%, rgba(185, 163, 139, 0.14), transparent 70%)',
          scale: hoveredEntityId ? 'scale(1.08)' : 'scale(1)',
        }
      case 'technology':
        return {
          background: 'radial-gradient(circle 600px at 50% 45%, rgba(185, 163, 139, 0.13), transparent 70%)',
          scale: hoveredEntityId ? 'scale(1.08)' : 'scale(1)',
        }
      case 'skill':
        return {
          background: 'radial-gradient(circle 680px at 50% 45%, rgba(185, 163, 139, 0.12), transparent 75%)',
          scale: hoveredEntityId ? 'scale(1.06)' : 'scale(1)',
        }
      case 'timeline':
        return {
          background: 'radial-gradient(ellipse 900px 450px at 50% 50%, rgba(185, 163, 139, 0.13), transparent 75%)',
          scale: hoveredEntityId ? 'scale(1.05)' : 'scale(1)',
        }
      default: // profile
        return {
          background: 'radial-gradient(circle 750px at 50% 42%, rgba(185, 163, 139, 0.11), transparent 75%)',
          scale: hoveredEntityId ? 'scale(1.06)' : 'scale(1)',
        }
    }
  }, [focusedEntityType, hoveredEntityId])

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity: inspectionDim, transition: 'opacity 400ms ease' }}
      aria-hidden="true"
    >
      {/* Organic Subtle Grain Layer */}
      <div className="env-grain" />

      {/* Focus-type atmosphere gradients — cross-fade on focus change (300–450ms) */}
      {ATMOS_TYPES.map(type => (
        <div
          key={type}
          className={`absolute inset-0 env-atmos-${type}`}
          style={{
            opacity: focusedEntityType === type ? 1 : 0,
            transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            ...(type === 'timeline' ? {
              animationPlayState:
                (reducedMotion || focusedEntityType !== 'timeline') ? 'paused' : 'running',
            } : {}),
          }}
        />
      ))}

      {/* Central Focal Ambient Glow — blends content seamlessly into environment */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: focalGlowStyle.background,
          opacity: isIdle ? 0.45 : 1,
          transform: focalGlowStyle.scale,
        }}
      />

      {/* Hover Illumination Wave: Subtle Antique Gold aura pulse when hovering */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle 500px at 50% 48%, rgba(185, 163, 139, 0.14), transparent 75%)',
          opacity: hoveredEntityId ? 1 : 0,
        }}
      />
    </div>
  )
})
