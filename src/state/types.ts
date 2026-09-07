import type { EntityId, EntityType } from '../core/types'

/**
 * The contextual scope of the current exploration view.
 * Either aligned with an entity type or 'root' when exploring the portfolio overview.
 */
export type ExplorationContextType = EntityType | 'root'

/**
 * A historical snapshot capturing an exploration navigation state.
 */
export interface HistoryEntry {
  readonly focusedEntityId: EntityId
  readonly focusedEntityType: EntityType
  readonly inspectedEntityId: EntityId | null
  readonly context: ExplorationContextType
}

/**
 * Complete exploration state model.
 * Purely references entity IDs and types; never duplicates canonical entity data.
 */
export interface ExplorationState {
  readonly focusedEntityId: EntityId
  readonly focusedEntityType: EntityType
  readonly inspectedEntityId: EntityId | null
  readonly context: ExplorationContextType
  readonly history: readonly HistoryEntry[]
  readonly historyIndex: number
}
