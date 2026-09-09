import { useState, useEffect, useRef, useCallback } from 'react'
import type { EntityId } from '../../core/types'
import { useExploration } from '../../state'
import { FocusAtmosphere } from './FocusAtmosphere'
import { EnvironmentalTraces } from './EnvironmentalTraces'
import { ParticleField } from './ParticleField'
import { CursorInfluence } from './CursorInfluence'
import { subscribeEnvironmentHover } from './hoverState'

// ---------------------------------------------------------------------------
// EnvironmentLayer — Orchestrator
//
// Composes all environment sublayers into a single reactive background.
// Sits behind all foreground content. Never mutates exploration state.
// Pure visual consumer of state.
// ---------------------------------------------------------------------------

export function EnvironmentLayer() {
  const { state, resolvedContext, inspectedEntity } = useExploration()

  // -----------------------------------------------------------------------
  // Internal pointer tracking (no global state, no context)
  // -----------------------------------------------------------------------

  const pointerRef = useRef<{ x: number; y: number } | null>(null)

  // -----------------------------------------------------------------------
  // Idle detection (5 seconds without meaningful pointer movement)
  // -----------------------------------------------------------------------

  const [isIdle, setIsIdle] = useState(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetIdle = useCallback(() => {
    setIsIdle(false)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setIsIdle(true), 5000)
  }, [])

  useEffect(() => {
    resetIdle()
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [resetIdle])

  // -----------------------------------------------------------------------
  // prefers-reduced-motion
  // -----------------------------------------------------------------------

  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // -----------------------------------------------------------------------
  // Window-level pointer tracking for idle reset + particle proximity ref
  // -----------------------------------------------------------------------

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
      resetIdle()
    }
    const onLeave = () => {
      pointerRef.current = null
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [resetIdle])

  // -----------------------------------------------------------------------
  // Hover reactivity: listen to hovered entity from foreground
  // -----------------------------------------------------------------------

  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)

  useEffect(() => {
    return subscribeEnvironmentHover((id) => {
      setHoveredEntityId(id)
      if (id) resetIdle()
    })
  }, [resetIdle])

  // -----------------------------------------------------------------------
  // Progressive revelation: track which entities the visitor has explored
  // -----------------------------------------------------------------------

  const [visitedEntities, setVisitedEntities] = useState<Set<EntityId>>(
    () => new Set([state.focusedEntityId]),
  )

  useEffect(() => {
    setVisitedEntities(prev => {
      if (prev.has(state.focusedEntityId)) return prev
      const next = new Set(prev)
      next.add(state.focusedEntityId)
      return next
    })
  }, [state.focusedEntityId])

  // -----------------------------------------------------------------------
  // Derived state
  // -----------------------------------------------------------------------

  const isInspecting = inspectedEntity !== null
  const focusedEntityType = state.focusedEntityType
  const focusedEntityId = state.focusedEntityId

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <FocusAtmosphere
        focusedEntityType={focusedEntityType}
        focusedEntityId={focusedEntityId}
        isInspecting={isInspecting}
        isIdle={isIdle}
        reducedMotion={reducedMotion}
        resolvedContext={resolvedContext}
        visitedEntities={visitedEntities}
        hoveredEntityId={hoveredEntityId}
      />

      <ParticleField
        focusedEntityType={focusedEntityType}
        isInspecting={isInspecting}
        isIdle={isIdle}
        reducedMotion={reducedMotion}
        pointerRef={pointerRef}
        hoveredEntityId={hoveredEntityId}
      />

      <EnvironmentalTraces
        focusedEntityId={focusedEntityId}
        resolvedContext={resolvedContext}
        history={state.history}
        historyIndex={state.historyIndex}
        isInspecting={isInspecting}
        reducedMotion={reducedMotion}
        hoveredEntityId={hoveredEntityId}
      />

      <CursorInfluence
        focusedEntityType={focusedEntityType}
        isInspecting={isInspecting}
        reducedMotion={reducedMotion}
        isIdle={isIdle}
      />
    </div>
  )
}
