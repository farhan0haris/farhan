import type { BaseEntity, EntityId } from './entity'

// ---------------------------------------------------------------------------
// Project Category
// ---------------------------------------------------------------------------

export type ProjectCategory =
  | 'web-application'
  | 'developer-tool'
  | 'ai-application'
  | 'knowledge-platform'
  | 'portfolio'

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

export interface Project extends BaseEntity {
  readonly type: 'project'
  readonly description: string
  readonly featured: boolean
  readonly category: ProjectCategory
  readonly repositoryUrl: string
  readonly liveUrl: string
  readonly technologyIds: readonly EntityId[]
  readonly skillIds: readonly EntityId[]
  readonly timelineIds: readonly EntityId[]
  readonly tags: readonly string[]
}
