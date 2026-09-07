import { getEntity, profileData } from '../core'
import { ExplorationActionTypes, type ExplorationAction } from '../core/actions'
import type { ExplorationState, HistoryEntry } from './types'

/**
 * Logical root entry: The portfolio owner profile.
 */
export const INITIAL_HISTORY_ENTRY: HistoryEntry = {
  focusedEntityId: profileData.id,
  focusedEntityType: profileData.type,
  inspectedEntityId: null,
  context: 'profile',
}

/**
 * Deterministic initial state for the exploration system.
 */
export const INITIAL_EXPLORATION_STATE: ExplorationState = {
  focusedEntityId: profileData.id,
  focusedEntityType: profileData.type,
  inspectedEntityId: null,
  context: 'profile',
  history: [INITIAL_HISTORY_ENTRY],
  historyIndex: 0,
}

/**
 * Pure, deterministic exploration reducer.
 * Handles focus transitions, contextual exploration, temporary inspection overlays,
 * history backtracking, branch truncation, and root reset.
 *
 * Safety: Any action referencing an invalid/unregistered entity ID is safely rejected,
 * preventing state and history corruption.
 */
export function explorationReducer(
  state: ExplorationState = INITIAL_EXPLORATION_STATE,
  action: ExplorationAction
): ExplorationState {
  switch (action.type) {
    case ExplorationActionTypes.FOCUS_ENTITY: {
      const entity = getEntity(action.payload.entityId)
      if (!entity) {
        // Defensive: Invalid entity IDs are rejected without modifying history
        return state
      }

      // No-op if entity is already focused with no active inspection
      if (
        state.focusedEntityId === entity.id &&
        state.inspectedEntityId === null &&
        state.context === entity.type
      ) {
        return state
      }

      // Truncate any forward history branch if navigating from a backtracked state
      const truncatedHistory = state.history.slice(0, state.historyIndex + 1)
      const newEntry: HistoryEntry = {
        focusedEntityId: entity.id,
        focusedEntityType: entity.type,
        inspectedEntityId: null,
        context: entity.type,
      }

      return {
        focusedEntityId: entity.id,
        focusedEntityType: entity.type,
        inspectedEntityId: null,
        context: entity.type,
        history: [...truncatedHistory, newEntry],
        historyIndex: truncatedHistory.length,
      }
    }

    case ExplorationActionTypes.EXPLORE_ENTITY: {
      const entity = getEntity(action.payload.entityId)
      if (!entity) {
        return state
      }

      if (
        state.focusedEntityId === entity.id &&
        state.inspectedEntityId === null &&
        state.context === entity.type
      ) {
        return state
      }

      const truncatedHistory = state.history.slice(0, state.historyIndex + 1)
      const newEntry: HistoryEntry = {
        focusedEntityId: entity.id,
        focusedEntityType: entity.type,
        inspectedEntityId: null,
        context: entity.type,
      }

      return {
        focusedEntityId: entity.id,
        focusedEntityType: entity.type,
        inspectedEntityId: null,
        context: entity.type,
        history: [...truncatedHistory, newEntry],
        historyIndex: truncatedHistory.length,
      }
    }

    case ExplorationActionTypes.INSPECT_ENTITY: {
      const entity = getEntity(action.payload.entityId)
      if (!entity) {
        return state
      }

      // No-op if already inspecting this exact entity
      if (state.inspectedEntityId === entity.id) {
        return state
      }

      // Inspection records a snapshot into history so Back can restore uninspected state
      const truncatedHistory = state.history.slice(0, state.historyIndex + 1)
      const newEntry: HistoryEntry = {
        focusedEntityId: state.focusedEntityId,
        focusedEntityType: state.focusedEntityType,
        inspectedEntityId: entity.id,
        context: state.context,
      }

      return {
        ...state,
        inspectedEntityId: entity.id,
        history: [...truncatedHistory, newEntry],
        historyIndex: truncatedHistory.length,
      }
    }

    case ExplorationActionTypes.CLEAR_INSPECTION: {
      if (state.inspectedEntityId === null) {
        return state
      }

      // If the current entry in history is an inspection snapshot on the same entity,
      // popping it back aligns with dismissing the modal
      const currentEntry = state.history[state.historyIndex]
      if (
        state.historyIndex > 0 &&
        currentEntry &&
        currentEntry.inspectedEntityId !== null
      ) {
        const prevIndex = state.historyIndex - 1
        const prevEntry = state.history[prevIndex]
        if (prevEntry) {
          return {
            focusedEntityId: prevEntry.focusedEntityId,
            focusedEntityType: prevEntry.focusedEntityType,
            inspectedEntityId: prevEntry.inspectedEntityId,
            context: prevEntry.context,
            history: state.history.slice(0, state.historyIndex),
            historyIndex: prevIndex,
          }
        }
      }

      return {
        ...state,
        inspectedEntityId: null,
      }
    }

    case ExplorationActionTypes.GO_BACK: {
      if (state.historyIndex <= 0) {
        // Cannot navigate back past initial entry
        return state
      }

      const prevIndex = state.historyIndex - 1
      const prevEntry = state.history[prevIndex]
      if (!prevEntry) {
        return state
      }

      return {
        focusedEntityId: prevEntry.focusedEntityId,
        focusedEntityType: prevEntry.focusedEntityType,
        inspectedEntityId: prevEntry.inspectedEntityId,
        context: prevEntry.context,
        history: state.history,
        historyIndex: prevIndex,
      }
    }

    case ExplorationActionTypes.RESET_EXPLORATION: {
      return INITIAL_EXPLORATION_STATE
    }

    default:
      return state
  }
}
