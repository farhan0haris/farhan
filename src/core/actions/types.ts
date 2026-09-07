import type { EntityId } from '../types'

/**
 * Action type constants for the exploration system.
 * Designed for both web application exploration and future CLI invocation.
 */
export const ExplorationActionTypes = {
  FOCUS_ENTITY: 'exploration/FOCUS_ENTITY',
  INSPECT_ENTITY: 'exploration/INSPECT_ENTITY',
  EXPLORE_ENTITY: 'exploration/EXPLORE_ENTITY',
  GO_BACK: 'exploration/GO_BACK',
  RESET_EXPLORATION: 'exploration/RESET_EXPLORATION',
  CLEAR_INSPECTION: 'exploration/CLEAR_INSPECTION',
} as const

export type ExplorationActionType =
  (typeof ExplorationActionTypes)[keyof typeof ExplorationActionTypes]

// ---------------------------------------------------------------------------
// Action Interfaces
// ---------------------------------------------------------------------------

export interface FocusEntityAction {
  readonly type: typeof ExplorationActionTypes.FOCUS_ENTITY
  readonly payload: {
    readonly entityId: EntityId
  }
}

export interface InspectEntityAction {
  readonly type: typeof ExplorationActionTypes.INSPECT_ENTITY
  readonly payload: {
    readonly entityId: EntityId
  }
}

export interface ExploreEntityAction {
  readonly type: typeof ExplorationActionTypes.EXPLORE_ENTITY
  readonly payload: {
    readonly entityId: EntityId
  }
}

export interface GoBackAction {
  readonly type: typeof ExplorationActionTypes.GO_BACK
}

export interface ResetExplorationAction {
  readonly type: typeof ExplorationActionTypes.RESET_EXPLORATION
}

export interface ClearInspectionAction {
  readonly type: typeof ExplorationActionTypes.CLEAR_INSPECTION
}

/**
 * Discriminated union of all exploration domain actions.
 */
export type ExplorationAction =
  | FocusEntityAction
  | InspectEntityAction
  | ExploreEntityAction
  | GoBackAction
  | ResetExplorationAction
  | ClearInspectionAction
