import type { TimelineEntry } from '../types/timeline'

/**
 * Timeline entries derived strictly from verifiable GitHub repository creation timestamps
 * for verified live portfolio projects.
 *
 * Chronological order:
 * 1. 2026-07-24: Letterly AI
 * 2. 2026-08-09: VaultX
 * 3. 2026-08-11: DeadCode
 * 4. 2026-08-14: AuraShelf
 * 5. 2026-08-21: NODE
 */
export const timelineData: readonly TimelineEntry[] = [
  {
    id: 'timeline:2026-07-letterly',
    type: 'timeline',
    name: 'Letterly AI Inception',
    date: '2026-07-24',
    summary:
      'Initial public release and repository creation of Letterly AI, an AI-powered cover letter generator using Groq AI and client-side processing.',
    projectIds: ['project:letterly-ai'],
  },
  {
    id: 'timeline:2026-08-vault-x',
    type: 'timeline',
    name: 'VaultX Inception',
    date: '2026-08-09',
    summary:
      'Repository creation and development of VaultX, a cybersecurity password manager and vault dashboard with Firebase and Next.js.',
    projectIds: ['project:vault-x'],
  },
  {
    id: 'timeline:2026-08-deadcode',
    type: 'timeline',
    name: 'DeadCode Inception',
    date: '2026-08-11',
    summary:
      'Repository creation of DeadCode, an open-source Git time machine, AI codebase intelligence, and developer analytics platform.',
    projectIds: ['project:deadcode'],
  },
  {
    id: 'timeline:2026-08-aurashelf',
    type: 'timeline',
    name: 'AuraShelf Inception',
    date: '2026-08-14',
    summary:
      'Repository creation of AuraShelf, an aesthetic mood-based media tracking shelf using Next.js 16 and SQLite.',
    projectIds: ['project:aurashelf'],
  },
  {
    id: 'timeline:2026-08-node',
    type: 'timeline',
    name: 'NODE Inception',
    date: '2026-08-21',
    summary:
      'Repository creation of NODE, a living digital knowledge platform combining 3D WebGL particle cosmos, living knowledge graphs, and rabbit hole traversals.',
    projectIds: ['project:node'],
  },
] as const
