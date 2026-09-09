/**
 * Lightweight, zero-dependency hover event bridge between foreground exploration
 * nodes and the background environment.
 * Does not introduce global React context or modify Phase 3A/3B state.
 */

type HoverListener = (entityId: string | null) => void
const listeners = new Set<HoverListener>()

let currentHoveredEntityId: string | null = null

export function setEnvironmentHover(entityId: string | null) {
  if (currentHoveredEntityId === entityId) return
  currentHoveredEntityId = entityId
  listeners.forEach(fn => fn(entityId))
}

export function subscribeEnvironmentHover(fn: HoverListener): () => void {
  listeners.add(fn)
  fn(currentHoveredEntityId)
  return () => {
    listeners.delete(fn)
  }
}
