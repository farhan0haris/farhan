import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react'
import type { Entity, EntityId } from '../core/types'
import { getEntity } from '../core/registry'
import { ExplorationActionTypes } from '../core/actions'
import { resolveContext, type ResolvedContext } from '../core/relationships'
import type { ExplorationState } from './types'
import {
  explorationReducer,
  INITIAL_EXPLORATION_STATE,
} from './explorationReducer'

// ---------------------------------------------------------------------------
// Context Interface
// ---------------------------------------------------------------------------

export interface ExplorationContextValue {
  /** Current exploration state */
  readonly state: ExplorationState

  /** Currently focused Entity resolved from the canonical registry */
  readonly focusedEntity: Entity | undefined

  /** Fully resolved contextual information and available actions for the focused entity */
  readonly resolvedContext: ResolvedContext | undefined

  /** Currently inspected Entity resolved from the canonical registry, if any */
  readonly inspectedEntity: Entity | undefined

  /** Whether Back navigation is available (historyIndex > 0) */
  readonly canGoBack: boolean

  /** Focus a specific entity by its EntityId */
  readonly focus: (entityId: EntityId) => void

  /** Inspect a specific entity in detail */
  readonly inspect: (entityId: EntityId) => void

  /** Explore an entity moving context and focus to it */
  readonly explore: (entityId: EntityId) => void

  /** Navigate backward to the previous exploration history snapshot */
  readonly back: () => void

  /** Reset exploration state back to the root profile */
  readonly reset: () => void

  /** Clear any active temporary inspection overlay */
  readonly clearInspection: () => void
}

const ExplorationContext = createContext<ExplorationContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------

export interface ExplorationProviderProps {
  readonly children: ReactNode
  readonly initialState?: ExplorationState
}

export function ExplorationProvider({
  children,
  initialState = INITIAL_EXPLORATION_STATE,
}: ExplorationProviderProps) {
  const [state, dispatch] = useReducer(explorationReducer, initialState)

  const focusedEntity = useMemo(
    () => getEntity(state.focusedEntityId),
    [state.focusedEntityId]
  )

  const resolvedContext = useMemo(
    () => resolveContext(state.focusedEntityId),
    [state.focusedEntityId]
  )

  const inspectedEntity = useMemo(
    () => (state.inspectedEntityId ? getEntity(state.inspectedEntityId) : undefined),
    [state.inspectedEntityId]
  )

  const canGoBack = state.historyIndex > 0

  const focus = useCallback((entityId: EntityId) => {
    dispatch({ type: ExplorationActionTypes.FOCUS_ENTITY, payload: { entityId } })
  }, [])

  const inspect = useCallback((entityId: EntityId) => {
    dispatch({ type: ExplorationActionTypes.INSPECT_ENTITY, payload: { entityId } })
  }, [])

  const explore = useCallback((entityId: EntityId) => {
    dispatch({ type: ExplorationActionTypes.EXPLORE_ENTITY, payload: { entityId } })
  }, [])

  const back = useCallback(() => {
    dispatch({ type: ExplorationActionTypes.GO_BACK })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: ExplorationActionTypes.RESET_EXPLORATION })
  }, [])

  const clearInspection = useCallback(() => {
    dispatch({ type: ExplorationActionTypes.CLEAR_INSPECTION })
  }, [])

  const value = useMemo<ExplorationContextValue>(
    () => ({
      state,
      focusedEntity,
      resolvedContext,
      inspectedEntity,
      canGoBack,
      focus,
      inspect,
      explore,
      back,
      reset,
      clearInspection,
    }),
    [
      state,
      focusedEntity,
      resolvedContext,
      inspectedEntity,
      canGoBack,
      focus,
      inspect,
      explore,
      back,
      reset,
      clearInspection,
    ]
  )

  return (
    <ExplorationContext.Provider value={value}>
      {children}
    </ExplorationContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the current exploration state and navigation actions.
 * Must be used within an ExplorationProvider.
 */
export function useExploration(): ExplorationContextValue {
  const context = useContext(ExplorationContext)
  if (!context) {
    throw new Error('useExploration must be used within an ExplorationProvider')
  }
  return context
}
