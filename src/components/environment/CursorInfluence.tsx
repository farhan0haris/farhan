import { useRef, useEffect, memo } from 'react'
import type { EntityType } from '../../core/types'

// ---------------------------------------------------------------------------
// Focus-Type Cursor Tints
// Extremely subtle color shifts that subconsciously reinforce the current context.
// ---------------------------------------------------------------------------

const FOCUS_TINTS: Record<EntityType, string> = {
  profile: 'rgba(185, 163, 139, 0.14)',
  project: 'rgba(195, 170, 142, 0.16)',
  technology: 'rgba(180, 158, 135, 0.15)',
  skill: 'rgba(175, 152, 130, 0.15)',
  timeline: 'rgba(190, 165, 140, 0.16)',
}

const DARK_FOCUS_TINTS: Record<EntityType, string> = {
  profile: 'rgba(210, 192, 171, 0.18)',
  project: 'rgba(220, 200, 178, 0.22)',
  technology: 'rgba(205, 185, 162, 0.20)',
  skill: 'rgba(200, 180, 158, 0.19)',
  timeline: 'rgba(215, 195, 172, 0.22)',
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CursorInfluenceProps {
  readonly focusedEntityType: EntityType
  readonly isInspecting: boolean
  readonly reducedMotion: boolean
  readonly isIdle: boolean
}

// ---------------------------------------------------------------------------
// Component
// Desktop-only soft radial illumination that follows the pointer.
// Self-contained: manages its own pointer tracking.
// ---------------------------------------------------------------------------

export const CursorInfluence = memo(function CursorInfluence({
  focusedEntityType,
  isInspecting,
  reducedMotion,
  isIdle,
}: CursorInfluenceProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const isInspectingRef = useRef(isInspecting)
  isInspectingRef.current = isInspecting
  const isIdleRef = useRef(isIdle)
  isIdleRef.current = isIdle

  // Direct pointer tracking — no shared state, no context
  useEffect(() => {
    if (reducedMotion) return
    // Skip on mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 640) return

    const el = elRef.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX - 350}px, ${e.clientY - 350}px)`
      el.style.opacity = isInspectingRef.current ? '0.2' : isIdleRef.current ? '0.3' : '1'
    }

    const onLeave = () => {
      if (el) el.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [reducedMotion])

  // Don't render on mobile or with reduced motion
  if (reducedMotion) return null

  const isDark = typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  const tints = isDark ? DARK_FOCUS_TINTS : FOCUS_TINTS
  const tint = tints[focusedEntityType] || tints.profile

  return (
    <div
      ref={elRef}
      className="absolute hidden sm:block"
      style={{
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${tint}, transparent 70%)`,
        opacity: 0,
        willChange: 'transform',
        transition: 'opacity 300ms ease',
        pointerEvents: 'none',
      }}
    />
  )
})
