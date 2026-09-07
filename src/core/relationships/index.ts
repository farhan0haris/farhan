import type { EntityId, Project, Technology, Skill, TimelineEntry } from '../types'
import {
  getProjects,
  getTechnology,
  getSkill,
  getTimelineEntry,
} from '../registry'

/**
 * Derives all projects that utilize the specified technology ID.
 * Resolves reverse relationship dynamically without data duplication.
 */
export function getProjectsForTechnology(technologyId: EntityId): readonly Project[] {
  return getProjects().filter((project) =>
    project.technologyIds.includes(technologyId)
  )
}

/**
 * Derives all projects associated with the specified skill ID.
 */
export function getProjectsForSkill(skillId: EntityId): readonly Project[] {
  return getProjects().filter((project) =>
    project.skillIds.includes(skillId)
  )
}

/**
 * Derives all projects associated with a given timeline milestone.
 */
export function getProjectsForTimeline(timelineId: EntityId): readonly Project[] {
  const entry = getTimelineEntry(timelineId)
  if (!entry) return []
  return getProjects().filter((project) =>
    entry.projectIds.includes(project.id) || project.timelineIds.includes(timelineId)
  )
}

/**
 * Resolves all Technology entities used by a given project.
 */
export function getTechnologiesForProject(project: Project): readonly Technology[] {
  return project.technologyIds
    .map((techId) => getTechnology(techId))
    .filter((tech): tech is Technology => tech !== undefined)
}

/**
 * Resolves all Skill entities demonstrated by a given project.
 */
export function getSkillsForProject(project: Project): readonly Skill[] {
  return project.skillIds
    .map((skillId) => getSkill(skillId))
    .filter((skill): skill is Skill => skill !== undefined)
}

/**
 * Resolves the timeline milestones associated with a project.
 */
export function getTimelineForProject(project: Project): readonly TimelineEntry[] {
  return project.timelineIds
    .map((timelineId) => getTimelineEntry(timelineId))
    .filter((entry): entry is TimelineEntry => entry !== undefined)
}

/**
 * Finds related projects that share one or more technologies or skills with the target project.
 */
export function getRelatedProjects(project: Project): readonly Project[] {
  const techSet = new Set(project.technologyIds)
  const skillSet = new Set(project.skillIds)

  return getProjects().filter((other) => {
    if (other.id === project.id) return false
    const sharesTech = other.technologyIds.some((id) => techSet.has(id))
    const sharesSkill = other.skillIds.some((id) => skillSet.has(id))
    return sharesTech || sharesSkill
  })
}
