import type { EntityId, Project, Technology, Skill, TimelineEntry } from '../types'
import {
  getProjects,
  getProject,
  getTechnology,
  getSkill,
  getTimelineEntry,
} from '../registry'
import type { EntityRelationship, RelatedProject } from './types'

// ---------------------------------------------------------------------------
// Helper: Normalize project or ID to Project entity
// ---------------------------------------------------------------------------

function toProject(projectOrId: Project | EntityId): Project | undefined {
  if (typeof projectOrId === 'string') {
    return getProject(projectOrId)
  }
  return projectOrId
}

// ---------------------------------------------------------------------------
// Project Outbound Queries
// ---------------------------------------------------------------------------

/**
 * Resolves all Technology entities utilized by a project.
 * Handles missing/invalid IDs safely, returning empty array if project not found.
 */
export function getTechnologiesForProject(
  projectOrId: Project | EntityId
): readonly Technology[] {
  const project = toProject(projectOrId)
  if (!project) return []

  return project.technologyIds
    .map((techId) => getTechnology(techId))
    .filter((tech): tech is Technology => tech !== undefined)
}

/**
 * Resolves all Skill entities demonstrated by a project.
 */
export function getSkillsForProject(
  projectOrId: Project | EntityId
): readonly Skill[] {
  const project = toProject(projectOrId)
  if (!project) return []

  return project.skillIds
    .map((skillId) => getSkill(skillId))
    .filter((skill): skill is Skill => skill !== undefined)
}

/**
 * Resolves all Timeline milestones associated with a project.
 */
export function getTimelineForProject(
  projectOrId: Project | EntityId
): readonly TimelineEntry[] {
  const project = toProject(projectOrId)
  if (!project) return []

  return project.timelineIds
    .map((timelineId) => getTimelineEntry(timelineId))
    .filter((entry): entry is TimelineEntry => entry !== undefined)
}

// ---------------------------------------------------------------------------
// Reverse Inbound Queries
// ---------------------------------------------------------------------------

/**
 * Derives all canonical projects that utilize the specified technology ID.
 * Returns strictly projects present in the canonical dataset.
 */
export function getProjectsForTechnology(technologyId: EntityId): readonly Project[] {
  return getProjects().filter((project) =>
    project.technologyIds.includes(technologyId)
  )
}

/**
 * Derives all canonical projects associated with the specified skill ID.
 */
export function getProjectsForSkill(skillId: EntityId): readonly Project[] {
  return getProjects().filter((project) =>
    project.skillIds.includes(skillId)
  )
}

/**
 * Derives all canonical projects associated with a given timeline milestone ID.
 */
export function getProjectsForTimeline(timelineId: EntityId): readonly Project[] {
  const entry = getTimelineEntry(timelineId)
  if (!entry) return []

  return getProjects().filter(
    (project) =>
      entry.projectIds.includes(project.id) ||
      project.timelineIds.includes(timelineId)
  )
}

// ---------------------------------------------------------------------------
// Project-to-Project Relationship Queries
// ---------------------------------------------------------------------------

/**
 * Discovers related projects based on shared technologies and shared skills.
 * Includes connection strength (matchScore) and an explicit human-readable reason.
 * Projects with zero shared technologies and zero shared skills are strictly excluded.
 */
export function getRelatedProjectsWithReasons(
  projectOrId: Project | EntityId
): readonly RelatedProject[] {
  const target = toProject(projectOrId)
  if (!target) return []

  const targetTechIds = new Set(target.technologyIds)
  const targetSkillIds = new Set(target.skillIds)

  const related: RelatedProject[] = []

  for (const other of getProjects()) {
    if (other.id === target.id) continue

    const sharedTechIds = other.technologyIds.filter((id) => targetTechIds.has(id))
    const sharedSkillIds = other.skillIds.filter((id) => targetSkillIds.has(id))

    // Require at least one concrete connection point
    if (sharedTechIds.length === 0 && sharedSkillIds.length === 0) {
      continue
    }

    const sharedTechnologies = sharedTechIds
      .map((id) => getTechnology(id))
      .filter((t): t is Technology => t !== undefined)

    const sharedSkills = sharedSkillIds
      .map((id) => getSkill(id))
      .filter((s): s is Skill => s !== undefined)

    // Match score: Weight technology overlap slightly higher (2x) than skill overlap (1x)
    const matchScore = sharedTechnologies.length * 2 + sharedSkills.length

    // Human-readable explanation of the relationship
    const reasons: string[] = []
    if (sharedTechnologies.length > 0) {
      const techNames = sharedTechnologies.map((t) => t.name).join(', ')
      reasons.push(`Shares ${sharedTechnologies.length} tech (${techNames})`)
    }
    if (sharedSkills.length > 0) {
      const skillNames = sharedSkills.map((s) => s.name).join(', ')
      reasons.push(`Shares ${sharedSkills.length} skill area (${skillNames})`)
    }

    related.push({
      project: other,
      sharedTechnologies,
      sharedSkills,
      matchScore,
      matchReason: reasons.join('; '),
    })
  }

  // Sort by highest connection strength first
  return related.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Returns related projects for a given project as an array of Project entities.
 */
export function getRelatedProjects(projectOrId: Project | EntityId): readonly Project[] {
  return getRelatedProjectsWithReasons(projectOrId).map((r) => r.project)
}

// ---------------------------------------------------------------------------
// Cross-Domain Relationship Queries
// ---------------------------------------------------------------------------

/**
 * Discovers skills demonstrated in projects that use the specified technology.
 */
export function getRelatedSkillsForTechnology(technologyId: EntityId): readonly Skill[] {
  const projects = getProjectsForTechnology(technologyId)
  const skillIds = new Set<EntityId>()

  for (const p of projects) {
    for (const sid of p.skillIds) {
      skillIds.add(sid)
    }
  }

  return Array.from(skillIds)
    .map((id) => getSkill(id))
    .filter((s): s is Skill => s !== undefined)
}

/**
 * Discovers technologies utilized in projects that demonstrate the specified skill.
 */
export function getRelatedTechnologiesForSkill(skillId: EntityId): readonly Technology[] {
  const projects = getProjectsForSkill(skillId)
  const techIds = new Set<EntityId>()

  for (const p of projects) {
    for (const tid of p.technologyIds) {
      techIds.add(tid)
    }
  }

  return Array.from(techIds)
    .map((id) => getTechnology(id))
    .filter((t): t is Technology => t !== undefined)
}

/**
 * Discovers technologies that co-occur with the target technology across projects.
 */
export function getRelatedTechnologiesForTechnology(
  technologyId: EntityId
): readonly Technology[] {
  const projects = getProjectsForTechnology(technologyId)
  const techIds = new Set<EntityId>()

  for (const p of projects) {
    for (const tid of p.technologyIds) {
      if (tid !== technologyId) {
        techIds.add(tid)
      }
    }
  }

  return Array.from(techIds)
    .map((id) => getTechnology(id))
    .filter((t): t is Technology => t !== undefined)
}

// ---------------------------------------------------------------------------
// Comprehensive Entity Relationships with Metadata
// ---------------------------------------------------------------------------

/**
 * Generates all typed, descriptive relationships originating from or targeting an entity.
 */
export function getEntityRelationships(entityId: EntityId): readonly EntityRelationship[] {
  const [type] = entityId.split(':')
  const relationships: EntityRelationship[] = []

  switch (type) {
    case 'project': {
      const project = getProject(entityId)
      if (!project) return []

      // Outbound: Project uses Technologies
      for (const techId of project.technologyIds) {
        const tech = getTechnology(techId)
        relationships.push({
          sourceId: project.id,
          targetId: techId,
          type: 'uses-technology',
          kind: 'direct',
          description: `${project.name} built with ${tech?.name ?? techId}`,
        })
      }

      // Outbound: Project demonstrates Skills
      for (const skillId of project.skillIds) {
        const skill = getSkill(skillId)
        relationships.push({
          sourceId: project.id,
          targetId: skillId,
          type: 'demonstrates-skill',
          kind: 'direct',
          description: `${project.name} demonstrates ${skill?.name ?? skillId}`,
        })
      }

      // Outbound: Project associated with Timeline
      for (const timeId of project.timelineIds) {
        const entry = getTimelineEntry(timeId)
        relationships.push({
          sourceId: project.id,
          targetId: timeId,
          type: 'associated-with-timeline',
          kind: 'direct',
          description: `${project.name} launched on milestone ${entry?.name ?? timeId}`,
        })
      }

      // Outbound: Related Projects (Derived from concrete shared technology and skill evidence)
      const related = getRelatedProjectsWithReasons(project)
      for (const rel of related) {
        relationships.push({
          sourceId: project.id,
          targetId: rel.project.id,
          type: 'shares-technology',
          kind: 'derived',
          description: `${project.name} connects to ${rel.project.name}: ${rel.matchReason}`,
          sharedIds: [
            ...rel.sharedTechnologies.map((t) => t.id),
            ...rel.sharedSkills.map((s) => s.id),
          ],
        })
      }
      break
    }

    case 'technology': {
      const tech = getTechnology(entityId)
      if (!tech) return []

      // Inbound: Projects using this technology (Direct reverse relationships)
      const projects = getProjectsForTechnology(entityId)
      for (const proj of projects) {
        relationships.push({
          sourceId: entityId,
          targetId: proj.id,
          type: 'used-by-project',
          kind: 'reverse',
          description: `${tech.name} used in ${proj.name}`,
        })
      }

      // Connected skills (Co-occurrence in shared projects)
      const skills = getRelatedSkillsForTechnology(entityId)
      for (const skill of skills) {
        relationships.push({
          sourceId: entityId,
          targetId: skill.id,
          type: 'co-occurs-with-skill',
          kind: 'co-occurrence',
          description: `${tech.name} co-occurs in projects practicing ${skill.name}`,
        })
      }

      // Connected technologies (Co-occurrence in shared project stacks)
      const coTechs = getRelatedTechnologiesForTechnology(entityId)
      for (const coTech of coTechs) {
        relationships.push({
          sourceId: entityId,
          targetId: coTech.id,
          type: 'co-occurs-with-technology',
          kind: 'co-occurrence',
          description: `${tech.name} co-occurs with ${coTech.name} in shared project stacks`,
        })
      }
      break
    }

    case 'skill': {
      const skill = getSkill(entityId)
      if (!skill) return []

      // Inbound: Projects demonstrating this skill (Direct reverse relationships)
      const projects = getProjectsForSkill(entityId)
      for (const proj of projects) {
        relationships.push({
          sourceId: entityId,
          targetId: proj.id,
          type: 'demonstrated-in-project',
          kind: 'reverse',
          description: `${skill.name} demonstrated in ${proj.name}`,
        })
      }

      // Connected technologies (Co-occurrence in shared projects)
      const techs = getRelatedTechnologiesForSkill(entityId)
      for (const tech of techs) {
        relationships.push({
          sourceId: entityId,
          targetId: tech.id,
          type: 'co-occurs-with-technology',
          kind: 'co-occurrence',
          description: `${skill.name} practiced in projects using ${tech.name}`,
        })
      }
      break
    }

    case 'timeline': {
      const entry = getTimelineEntry(entityId)
      if (!entry) return []

      // Inbound: Projects launched on milestone (Direct reverse relationships)
      const projects = getProjectsForTimeline(entityId)
      for (const proj of projects) {
        relationships.push({
          sourceId: entityId,
          targetId: proj.id,
          type: 'milestone-for-project',
          kind: 'reverse',
          description: `${entry.name} created repository for ${proj.name}`,
        })
      }
      break
    }

    case 'profile': {
      for (const proj of getProjects().filter((p) => p.featured)) {
        relationships.push({
          sourceId: entityId,
          targetId: proj.id,
          type: 'featured-in-profile',
          kind: 'direct',
          description: `Featured project: ${proj.name}`,
        })
      }
      break
    }
  }

  return relationships
}
