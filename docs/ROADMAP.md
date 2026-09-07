# Development Roadmap

## Purpose

This roadmap defines the development sequence for the interactive portfolio.

The project should be built in controlled phases.

Do not attempt to implement the entire portfolio in one generation or development pass.

Each phase should produce a stable checkpoint before the next phase begins.

---

# Project Status

Current stage:

```text
Planning and Documentation
```

Current implementation target:

```text
Web Application
```

Future implementation target:

```text
CLI Application
```

The CLI is not part of the initial web implementation.

---

# Phase 0 — Project Definition

## Goal

Define the product before implementation.

## Deliverables

* Repository created
* Documentation structure created
* `VISION.md`
* `EXPERIENCE.md`
* `DESIGN.md`
* `INTERACTIONS.md`
* `ARCHITECTURE.md`
* `ROADMAP.md`
* `DECISIONS.md`

## Completion Criteria

The project should have a clear answer to:

* What are we building?
* How should visitors experience it?
* What makes it interactive?
* What should the design avoid?
* How should the system be architected?
* What is the implementation sequence?

## Checkpoint

Commit documentation before application development begins.

Suggested commit:

```text
docs: define interactive portfolio vision and architecture
```

---

# Phase 1 — Application Foundation

## Goal

Create a clean, stable web application foundation.

## Tasks

* Initialize React
* Configure TypeScript
* Configure Vite
* Configure Tailwind CSS
* Install required minimal dependencies
* Establish source directory structure
* Configure light and dark theme support
* Create the initial application shell
* Establish global styles and design tokens

## Deliverables

A working application that:

* Runs locally
* Builds successfully
* Has no TypeScript errors
* Supports responsive layouts
* Supports light and dark themes

## Completion Criteria

```text
npm run dev
```

works correctly.

```text
npm run build
```

completes successfully.

No unnecessary application features should be implemented yet.

## Checkpoint

Suggested commit:

```text
chore: initialize interactive portfolio foundation
```

---

# Phase 2 — Portfolio Data Model

## Goal

Create the structured portfolio data layer.

## Tasks

Define entity types for:

* Profile
* Project
* Skill
* Technology
* Timeline Milestone

Create:

* Stable entity IDs
* Typed schemas
* Representative portfolio data
* Relationship references

## Example

```text
Project
→ Technology IDs
→ Skill IDs
→ Timeline IDs
```

The UI must not own this data.

## Completion Criteria

The system should be able to:

* Retrieve an entity by ID
* Retrieve entities by type
* Resolve basic relationships
* Validate entity references through TypeScript

## Checkpoint

Suggested commit:

```text
feat: add structured portfolio data model
```

---

# Phase 3 — Interaction Engine

## Goal

Build the core exploration system.

## Tasks

Implement:

```text
Explore
Focus
Inspect
Relate
Navigate
```

Create structured exploration state:

```text
currentContext

focusedEntity

inspectedEntity

history

historyIndex
```

## Required Behavior

The system should support:

```text
Explore Projects

Focus Project

Focus Related Technology

Navigate Back

Navigate Forward

Return Home
```

The interaction logic must remain independent from visual components.

## Completion Criteria

The interaction engine should work through application actions before advanced UI is added.

History behavior should be predictable.

## Checkpoint

Suggested commit:

```text
feat: add portfolio exploration engine
```

---

# Phase 4 — Home and Entry Experience

## Goal

Create the portfolio entry experience.

## Requirements

The visitor should immediately understand:

* Who the portfolio belongs to
* What the portfolio represents
* That the experience is interactive
* Where they can begin exploring

The entry experience should provide meaningful directions such as:

```text
Explore Work

Explore Skills

Explore Journey
```

These should trigger exploration state changes.

They should not simply link to traditional pages.

## Completion Criteria

A visitor can enter the portfolio and begin exploring without needing a tutorial.

## Checkpoint

Suggested commit:

```text
feat: add interactive portfolio entry experience
```

---

# Phase 5 — Contextual Explorer

## Goal

Build the primary interactive web experience.

## Tasks

Create contextual views for:

* Projects
* Technologies
* Skills
* Timeline
* Profile

The interface should reorganize according to the current context and focused entity.

Example:

```text
Focus Project
```

should reveal:

```text
Project Information

Related Technologies

Related Skills

Related Projects

Relevant Timeline Entries
```

The same layout must not be reused blindly for every entity type.

## Completion Criteria

The visitor can explore connected portfolio information without relying on traditional navigation.

## Checkpoint

Suggested commit:

```text
feat: build contextual portfolio explorer
```

---

# Phase 6 — Relationship Discovery

## Goal

Make entity relationships a meaningful part of the experience.

## Tasks

Implement contextual discovery of:

* Project → Technologies
* Project → Skills
* Project → Timeline
* Technology → Projects
* Technology → Skills
* Skill → Related Projects
* Timeline → Related Work

Relationships should be resolved programmatically.

Do not implement a permanent node graph.

## Completion Criteria

The visitor can naturally move from one entity to related information.

The interface should always provide meaningful next exploration paths.

## Checkpoint

Suggested commit:

```text
feat: add contextual relationship exploration
```

---

# Phase 7 — History and Navigation

## Goal

Provide predictable exploration history.

## Tasks

Implement:

* Back
* Forward
* Home

Add:

* Visible history controls
* Appropriate keyboard support
* Disabled states where navigation is unavailable

## Required Behavior

```text
A → B → C

Back

A → B

Forward

A → B → C
```

If the visitor goes back and performs a new action:

```text
A → B → C

Back

A → B

New Action → D

Result:

A → B → D
```

The previous forward state should no longer be available.

## Completion Criteria

History behavior should be consistent and testable.

## Checkpoint

Suggested commit:

```text
feat: add exploration history navigation
```

---

# Phase 8 — Command Layer

## Goal

Add a command-driven interaction method to the web application.

## Tasks

Implement:

* Command palette
* Command registry
* Parser
* Entity resolver
* Command executor
* Suggestions
* Keyboard navigation

Initial commands:

```text
home

profile

projects

skills

technologies

timeline

open <entity>

focus <entity>

inspect <entity>

back

forward

help
```

The command system must interact with the real exploration state.

## Completion Criteria

Example:

```text
focus react
```

must produce the same portfolio state as visually selecting React.

## Checkpoint

Suggested commit:

```text
feat: add command-driven portfolio navigation
```

---

# Phase 9 — Motion and Interaction Polish

## Goal

Use motion to improve contextual understanding.

## Tasks

Add meaningful transitions for:

* Context changes
* Entity focus
* Relationship discovery
* History navigation
* Command palette

Use Framer Motion selectively.

## Completion Criteria

Motion should clarify what changed.

No decorative animation should be required for the experience to function.

## Checkpoint

Suggested commit:

```text
feat: refine contextual transitions and interactions
```

---

# Phase 10 — Responsive Experience

## Goal

Design intentionally for multiple screen sizes.

## Targets

* Desktop
* Laptop
* Tablet
* Mobile

## Tasks

Test:

* Entry experience
* Entity exploration
* Relationship navigation
* History controls
* Command palette
* Light theme
* Dark theme

Mobile should reorganize information rather than merely scaling desktop layouts.

## Completion Criteria

The application remains understandable and interactive on small screens.

No critical action should depend exclusively on hover.

## Checkpoint

Suggested commit:

```text
feat: optimize interactive experience for responsive layouts
```

---

# Phase 11 — Portfolio Content

## Goal

Replace representative data with complete portfolio content.

## Content Areas

* Personal profile
* Projects
* Skills
* Technologies
* Education
* Timeline
* Links
* Contact information

Content should be added through the structured data layer.

Avoid placing portfolio content directly inside presentation components.

## Completion Criteria

The portfolio contains accurate, complete, and maintainable content.

## Checkpoint

Suggested commit:

```text
content: add complete portfolio information
```

---

# Phase 12 — Accessibility and Quality Assurance

## Goal

Validate the complete experience.

## Review Areas

### Accessibility

* Keyboard navigation
* Focus visibility
* Color contrast
* Screen-reader semantics
* Reduced motion support

### Functional Testing

* Entity resolution
* Relationship resolution
* Command parsing
* Command execution
* History behavior

### Visual Testing

* Desktop layouts
* Tablet layouts
* Mobile layouts
* Light theme
* Dark theme

### Technical Quality

* TypeScript errors
* Console errors
* Production build
* Dependency review
* Performance review

## Completion Criteria

The application should build successfully and have no known critical interaction failures.

## Checkpoint

Suggested commit:

```text
chore: complete portfolio quality and accessibility review
```

---

# Phase 13 — Deployment

## Goal

Deploy the web portfolio.

## Tasks

* Configure production environment
* Verify production build
* Configure hosting
* Verify deployed routes
* Test command palette in production
* Test responsive behavior
* Verify theme persistence
* Review performance

## Completion Criteria

The deployed portfolio matches the intended local behavior.

## Checkpoint

Suggested commit:

```text
chore: prepare portfolio for production deployment
```

---

# Future Phase — CLI Portfolio

This phase begins only after the web experience is stable.

## Goal

Create a real command-line interface for the portfolio.

Conceptual usage:

```bash
npx farhan
```

The CLI should support:

```text
profile

projects

skills

timeline

open <entity>

focus <entity>

help
```

The CLI should reuse or extract:

* Portfolio data
* Entity types
* Relationship logic
* Command definitions
* Command parsing
* Entity resolution

The CLI must not become a manually duplicated portfolio.

## Possible Future Structure

```text
packages/
│
├── core/
│
├── web/
│
└── cli/
```

A monorepo should be introduced only when shared code makes it valuable.

---

# Development Rules

During all phases:

1. Do not reuse the previous 3D portfolio implementation.
2. Do not introduce 3D or WebGL.
3. Do not add dependencies without a clear purpose.
4. Do not build the entire project in one pass.
5. Complete and test each phase before moving forward.
6. Keep commits meaningful and focused.
7. Do not duplicate portfolio data across components.
8. Keep interaction logic independent from visual presentation.
9. Do not allow the project to drift into a generic portfolio template.
10. Prioritize functional interaction over decorative effects.

---

# Roadmap Principle

The project should grow in this order:

```text
CLARITY

↓

FOUNDATION

↓

DATA

↓

INTERACTION

↓

EXPERIENCE

↓

VISUAL DEPTH

↓

POLISH

↓

CLI
```

The visual experience should be built on a functioning interaction system, not used to hide an incomplete architecture.
