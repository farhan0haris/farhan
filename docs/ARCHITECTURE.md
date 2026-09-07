# Technical Architecture

## Purpose

This document defines the technical architecture of the interactive portfolio.

The project is web-first, but its core concepts should remain reusable for a future CLI implementation.

The architecture must separate:

1. Portfolio content and data
2. Entity relationships
3. Interaction actions
4. Exploration state
5. Command processing
6. Visual presentation

The user interface must not become the owner of the portfolio's core logic.

---

# Architecture Overview

The application follows this conceptual flow:

```text
PORTFOLIO DATA
      │
      ▼
ENTITY RELATIONSHIPS
      │
      ▼
INTERACTION ENGINE
      │
      ▼
EXPLORATION STATE
      │
      ├───────────────┐
      ▼               ▼
WEB UI         COMMAND LAYER
                      │
                      ▼
                FUTURE CLI
```

The web interface is the first client of the portfolio system.

The future CLI should reuse the portfolio data and command/action concepts rather than recreating the portfolio separately.

---

# Core Principles

## Separation of Concerns

Different responsibilities must remain separate.

```text
Data
What exists?

Relationships
How is information connected?

Actions
What can happen?

State
What is currently happening?

UI
How is it displayed?
```

A visual component should not define portfolio relationships or command behavior.

---

## Single Source of Truth

Portfolio entities should have one canonical definition.

For example, a project should not have separate copies of its:

* Name
* Description
* Technologies
* Skills
* Timeline relationships

inside multiple components.

The application should reference structured portfolio data.

---

## Stable Entity Identity

Every entity must have a stable ID.

Example:

```text
project:file-manager
project:interactive-portfolio

technology:react
technology:typescript

skill:frontend-development
skill:problem-solving

milestone:2026-bca
```

Display names may change.

Entity IDs should remain stable whenever possible.

---

# Proposed Project Structure

The initial web application should use a structure conceptually similar to:

```text
src/
│
├── core/
│   │
│   ├── types/
│   │   ├── entity.ts
│   │   ├── project.ts
│   │   ├── skill.ts
│   │   ├── technology.ts
│   │   ├── timeline.ts
│   │   └── interaction.ts
│   │
│   ├── data/
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── technologies.ts
│   │   └── timeline.ts
│   │
│   ├── relationships/
│   │   ├── relationshipTypes.ts
│   │   ├── relationshipRegistry.ts
│   │   └── relationshipResolver.ts
│   │
│   └── actions/
│       ├── explore.ts
│       ├── focus.ts
│       ├── inspect.ts
│       └── navigation.ts
│
├── state/
│   ├── portfolioStore.ts
│   ├── history.ts
│   └── selectors.ts
│
├── commands/
│   ├── commandTypes.ts
│   ├── commandRegistry.ts
│   ├── parser.ts
│   ├── resolver.ts
│   └── executor.ts
│
├── features/
│   ├── explorer/
│   ├── commandPalette/
│   ├── history/
│   └── theme/
│
├── components/
│   ├── layout/
│   ├── common/
│   └── interaction/
│
├── hooks/
│
├── lib/
│
├── App.tsx
└── main.tsx
```

The exact file structure may evolve during implementation.

The architectural boundaries should remain intact.

---

# Portfolio Data Layer

The data layer contains the actual portfolio content.

It should not contain React components.

Example:

```text
Project

ID
Name
Description
Technology IDs
Skill IDs
Timeline IDs
Links
Metadata
```

Conceptually:

```ts
{
  id: "project:file-manager",
  type: "project",
  name: "File Management Application",
  description: "...",
  technologies: [
    "technology:react",
    "technology:typescript"
  ],
  skills: [
    "skill:frontend-development"
  ]
}
```

The exact schema can evolve.

Data should remain structured and machine-readable.

---

# Entity Layer

All portfolio information should follow a common entity model where practical.

Conceptually:

```text
Entity

id
type
name
summary
metadata
```

Specific entity types can extend this model.

Examples:

```text
Project
Technology
Skill
Milestone
```

The application should use discriminated unions or equivalent TypeScript patterns where appropriate.

Avoid excessive use of `any`.

---

# Relationship Layer

Relationships define how entities are connected.

The relationship system should support questions such as:

```text
Which projects use React?

Which skills are associated with this project?

Which milestones relate to this project?

Which projects are related through shared technologies?
```

Relationships may initially be derived from entity data.

For example:

```text
Project
→ Technology IDs
```

can be resolved in reverse:

```text
Technology
→ Projects using that technology
```

The architecture should avoid manually duplicating reverse relationships unless there is a clear performance or modeling reason.

---

# Interaction Action Layer

Actions represent meaningful changes to portfolio exploration.

Core actions include:

```text
explore(context)

focus(entity)

inspect(entity)

back()

forward()

home()
```

Actions should operate against the exploration state.

The UI should request actions rather than directly mutating state.

Conceptually:

```text
UI EVENT

↓

focus("technology:react")

↓

INTERACTION ENGINE

↓

UPDATED STATE

↓

UI REACTS
```

---

# Exploration State

The application must maintain exploration state separately from portfolio data.

Conceptual state:

```text
PortfolioState

currentContext
focusedEntityId
inspectedEntityId
history
historyIndex
```

The state may also track:

```text
visitedEntities
```

if meaningful exploration progress is later implemented.

Portfolio data should remain immutable during normal exploration.

Exploration changes the visitor's state, not the portfolio content.

---

# History System

History must store meaningful snapshots of exploration state.

Conceptually:

```text
HistoryEntry

context
focusedEntityId
inspectedEntityId
timestamp
```

The timestamp is optional and should not be added unless useful.

History navigation should follow predictable behavior.

When the visitor goes backward and then performs a new action:

```text
A → B → C

Back

A → B

New Action → D

Result:

A → B → D
```

The old forward branch should no longer be available.

---

# State Management

The state management solution should remain lightweight.

Possible options include:

* React Context + reducer
* Zustand
* Another minimal solution if justified

The implementation should not introduce complex state infrastructure without a real need.

The interaction model must remain understandable and testable.

For the initial implementation, prefer the simplest architecture that preserves separation between state, actions, and UI.

---

# Command System

The command system is an independent layer.

It should not be implemented directly inside the command palette component.

The conceptual flow is:

```text
INPUT

↓

TOKENIZE / PARSE

↓

IDENTIFY COMMAND

↓

RESOLVE ARGUMENTS

↓

VALIDATE

↓

EXECUTE ACTION

↓

RETURN RESULT
```

Example:

```text
focus react

↓

command = focus

argument = react

↓

resolve("react")

↓

technology:react

↓

focus("technology:react")
```

The parser should produce structured output.

Conceptually:

```ts
{
  command: "focus",
  arguments: ["react"]
}
```

The command executor then performs the appropriate interaction action.

---

# Command Registry

Commands should be registered through structured definitions.

Conceptually:

```text
Command

name
aliases
description
argument schema
handler
```

Example:

```text
focus

aliases:
select

arguments:
entity

description:
Focus an entity in the portfolio.
```

The registry can later support:

* Web command palette
* Future CLI
* Documentation
* Help output

A command should ideally be defined once.

---

# Command Result Model

Command execution should return structured results.

Conceptually:

```text
CommandResult

success
message
data
suggestions
```

This prevents the command system from being tightly coupled to a specific visual presentation.

The web command palette and future CLI can display the result differently.

---

# UI Layer

The UI is responsible for:

* Rendering the current exploration state
* Presenting entities
* Collecting user interactions
* Triggering actions
* Displaying command interfaces
* Providing visual feedback

The UI should not:

* Define portfolio data
* Parse commands
* Resolve entity relationships
* Manually construct exploration history

---

# Feature Boundaries

Features should represent user-facing capabilities.

Initial features include:

```text
Explorer

Command Palette

History Navigation

Theme System
```

Each feature may contain:

```text
components
hooks
utilities
types
```

Features should communicate with core actions and state rather than duplicating core logic.

---

# Component Boundaries

Components should remain focused.

Examples:

```text
ExplorerShell
ContextHeader
FocusedEntityView
RelatedEntities
HistoryControls
CommandPalette
CommandInput
CommandSuggestions
```

Avoid creating one generic component responsible for every entity type.

Different entity types may require different views.

---

# URL Strategy

The first version may keep exploration state entirely client-side.

However, the architecture should allow future URL synchronization.

Conceptually:

```text
/project/file-manager
```

could eventually represent:

```text
Context: Projects
Focused Entity: project:file-manager
```

URL support is not required in the first implementation unless it improves navigation and sharing.

The portfolio should not depend on routing simply to simulate traditional pages.

---

# Theme Architecture

Theme preference should remain separate from exploration state.

Theme state includes:

```text
light

dark

system
```

The implementation should support persistence where appropriate.

Theme logic should not influence the portfolio interaction engine.

---

# Future CLI Compatibility

The future CLI should reuse as much non-visual logic as practical.

Conceptually:

```text
WEB

Button
↓

Action
↓

Portfolio State
```

and:

```text
CLI

Command
↓

Command Parser
↓

Action
↓

Portfolio State
```

Eventually, the project may be reorganized into shared packages.

For the web-first phase, premature monorepo complexity should be avoided.

The architecture should be modular enough to extract:

```text
portfolio data

types

relationship logic

commands

interaction actions
```

when the CLI is introduced.

---

# Dependency Philosophy

Dependencies should be chosen carefully.

Use dependencies that provide meaningful value.

Avoid installing packages simply because they are common in portfolio templates.

Expected categories:

```text
React
Application framework

TypeScript
Type safety

Tailwind CSS
Styling

Framer Motion
Meaningful motion and transitions

Lucide React
Interface icons
```

Additional dependencies require justification.

Avoid:

* Three.js
* React Three Fiber
* WebGL dependencies
* Heavy animation libraries in addition to Framer Motion
* Multiple overlapping state libraries

---

# Testing Strategy

Testing requirements should grow with the project.

Important logic that should eventually be testable independently from UI includes:

* Entity resolution
* Relationship resolution
* Command parsing
* Command validation
* Command execution
* History behavior

UI tests can be introduced later where valuable.

The architecture should allow core logic to be tested without rendering the full application.

---

# Error Handling

The system should handle predictable errors.

Examples:

```text
Unknown entity

Ambiguous entity

Invalid command

Invalid history navigation
```

Errors should return meaningful information rather than failing silently.

Example:

```text
Entity not found.

Did you mean:

React
TypeScript
```

Error handling should remain deterministic.

---

# Architecture Success Criteria

The architecture succeeds when:

* Portfolio data is independent from the UI.
* Relationships can be resolved programmatically.
* Interaction actions are separate from visual components.
* Exploration history behaves predictably.
* Commands are independent from the command palette UI.
* TypeScript provides meaningful type safety.
* Core logic can later be extracted for CLI reuse.
* The web implementation does not require premature monorepo complexity.
* New portfolio entities can be added without rewriting the entire interface.
* The application remains understandable as it grows.

---

# Architectural Principle

The project should be able to answer this question clearly:

> If the entire visual interface were replaced tomorrow, could the portfolio data, relationships, actions, and command system still be reused?

The intended answer is:

> Yes.
