import type {
  Entity,
  EntityId,
  EntityType,
  Profile,
  Project,
  Technology,
  Skill,
  TimelineEntry,
} from '../types'
import {
  profileData,
  projectsData,
  technologiesData,
  skillsData,
  timelineData,
} from '../data'

/**
 * Fast lookup map indexing all entities by their unique EntityId.
 */
const entityMap: ReadonlyMap<EntityId, Entity> = new Map<EntityId, Entity>([
  [profileData.id, profileData],
  ...projectsData.map((p): [EntityId, Entity] => [p.id, p]),
  ...technologiesData.map((t): [EntityId, Entity] => [t.id, t]),
  ...skillsData.map((s): [EntityId, Entity] => [s.id, s]),
  ...timelineData.map((m): [EntityId, Entity] => [m.id, m]),
])

/**
 * Retrieve any entity by its unique EntityId.
 */
export function getEntity(id: EntityId): Entity | undefined {
  return entityMap.get(id)
}

/**
 * Retrieve an entity with strict type narrowing by EntityType and EntityId.
 */
export function getEntityByType<T extends EntityType>(
  type: T,
  id: EntityId
): Extract<Entity, { type: T }> | undefined {
  const entity = entityMap.get(id)
  if (entity && entity.type === type) {
    return entity as Extract<Entity, { type: T }>
  }
  return undefined
}

/**
 * Retrieve the portfolio owner's profile entity.
 */
export function getProfile(): Profile {
  return profileData
}

/**
 * Retrieve all public projects.
 */
export function getProjects(): readonly Project[] {
  return projectsData
}

/**
 * Retrieve only projects designated as featured.
 */
export function getFeaturedProjects(): readonly Project[] {
  return projectsData.filter((project) => project.featured)
}

/**
 * Retrieve a single project by its EntityId.
 */
export function getProject(id: EntityId): Project | undefined {
  return getEntityByType('project', id)
}

/**
 * Retrieve all registered technologies.
 */
export function getTechnologies(): readonly Technology[] {
  return technologiesData
}

/**
 * Retrieve a single technology by its EntityId.
 */
export function getTechnology(id: EntityId): Technology | undefined {
  return getEntityByType('technology', id)
}

/**
 * Retrieve all registered skills.
 */
export function getSkills(): readonly Skill[] {
  return skillsData
}

/**
 * Retrieve a single skill by its EntityId.
 */
export function getSkill(id: EntityId): Skill | undefined {
  return getEntityByType('skill', id)
}

/**
 * Retrieve all timeline entries sorted chronologically.
 */
export function getTimeline(): readonly TimelineEntry[] {
  return timelineData
}

/**
 * Retrieve a single timeline entry by its EntityId.
 */
export function getTimelineEntry(id: EntityId): TimelineEntry | undefined {
  return getEntityByType('timeline', id)
}

/**
 * Retrieve all entities across the entire portfolio system.
 */
export function getAllEntities(): readonly Entity[] {
  return Array.from(entityMap.values())
}
