import type { EntityId } from '../types'
import { getEntity } from '../registry'
import {
  ExplorationActionTypes,
  type FocusEntityAction,
  type InspectEntityAction,
  type ExploreEntityAction,
  type GoBackAction,
  type ResetExplorationAction,
  type ClearInspectionAction,
} from './types'

/**
 * Creates an action to focus a specific entity.
 * Returns null if the entity does not exist in the registry.
 */
export function createFocusAction(entityId: EntityId): FocusEntityAction | null {
  const entity = getEntity(entityId)
  if (!entity) return null
  return {
    type: ExplorationActionTypes.FOCUS_ENTITY,
    payload: { entityId },
  }
}

/**
 * Creates an action to inspect a specific entity.
 * Returns null if the entity does not exist in the registry.
 */
export function createInspectAction(entityId: EntityId): InspectEntityAction | null {
  const entity = getEntity(entityId)
  if (!entity) return null
  return {
    type: ExplorationActionTypes.INSPECT_ENTITY,
    payload: { entityId },
  }
}

/**
 * Creates an action to explore a specific entity.
 * Returns null if the entity does not exist in the registry.
 */
export function createExploreAction(entityId: EntityId): ExploreEntityAction | null {
  const entity = getEntity(entityId)
  if (!entity) return null
  return {
    type: ExplorationActionTypes.EXPLORE_ENTITY,
    payload: { entityId },
  }
}

/**
 * Creates an action to navigate back in exploration history.
 */
export function createGoBackAction(): GoBackAction {
  return {
    type: ExplorationActionTypes.GO_BACK,
  }
}

/**
 * Creates an action to reset exploration to the root profile state.
 */
export function createResetAction(): ResetExplorationAction {
  return {
    type: ExplorationActionTypes.RESET_EXPLORATION,
  }
}

/**
 * Creates an action to clear the currently active inspection overlay.
 */
export function createClearInspectionAction(): ClearInspectionAction {
  return {
    type: ExplorationActionTypes.CLEAR_INSPECTION,
  }
}
