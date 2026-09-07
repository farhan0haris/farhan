import type { BaseEntity, EntityId } from './entity'

// ---------------------------------------------------------------------------
// Timeline Entry
// ---------------------------------------------------------------------------

/**
 * Represents a chronological milestone or repository event.
 * In accordance with data quality rules, chronology is only populated
 * when verified from repository metadata (e.g. creation timestamps).
 */
export interface TimelineEntry extends BaseEntity {
  readonly type: 'timeline'
  readonly date: string // ISO 8601 date (YYYY-MM-DD) or year
  readonly projectIds: readonly EntityId[]
}
