# Interaction System

## Purpose

This document defines the core interactions of the interactive portfolio.

The portfolio is not organized primarily around traditional pages.

Instead, visitors interact with portfolio entities and move between contexts.

Every major interaction should produce a meaningful state change.

The interaction system must remain independent from the visual presentation so that the same concepts can later support both the web interface and a command-line interface.

---

# Core Interaction Model

The interaction system is based on five primary concepts:

```text
EXPLORE
FOCUS
INSPECT
RELATE
NAVIGATE
```

These concepts define how visitors move through the portfolio.

---

# Portfolio Entities

The system initially supports the following entity types:

* Profile
* Project
* Skill
* Technology
* Timeline Milestone

Each entity must have a stable identifier.

Example:

```text
project:file-manager
technology:react
skill:frontend-development
timeline:2026
```

Relationships must reference entity identifiers rather than visual components.

---

# 1. Explore

## Purpose

Explore moves the visitor into a broader portfolio context.

Examples:

```text
Projects
Skills
Technologies
Journey
Profile
```

## Trigger

Possible triggers:

* Click or tap
* Keyboard selection
* Command palette
* Future CLI command

Examples:

```text
explore projects
explore skills
explore journey
```

## State Change

Conceptually:

```text
currentContext = "projects"
focusedEntity = null
```

The actual implementation may use a more sophisticated state model.

## Result

The interface changes to present the selected context.

Example:

```text
ACTION

Explore Projects

↓

STATE

Context = Projects

↓

RESULT

The interface presents the available projects
and meaningful ways to investigate them.
```

---

# 2. Focus

## Purpose

Focus makes a specific entity the primary subject of the current experience.

Examples:

```text
Focus File Management Application

Focus React

Focus Frontend Development
```

## Trigger

Possible triggers:

* Selecting an entity
* Clicking a relationship
* Keyboard interaction
* Command execution

Examples:

```text
focus react
open file-manager
```

## State Change

Conceptually:

```text
focusedEntity = "technology:react"
```

The previous context remains part of exploration history.

## Result

The interface reorganizes around the focused entity.

Example:

```text
FOCUS

React

↓

PRIMARY INFORMATION

React

↓

RELATED

Projects using React
Related Skills
Related Technologies
Relevant Milestones
```

The focused entity should have visual priority.

---

# 3. Inspect

## Purpose

Inspect reveals more detailed information without necessarily changing the primary exploration context.

Inspection is useful for temporary or secondary exploration.

## Example

While focused on a project:

```text
File Management Application
```

The visitor may inspect:

```text
TypeScript
```

without immediately leaving the project context.

## State Change

Inspection may create temporary state such as:

```text
inspectedEntity = "technology:typescript"
```

The exact implementation should distinguish between:

```text
Focused Entity
```

and:

```text
Temporarily Inspected Entity
```

## Result

The visitor receives additional information while maintaining awareness of their primary context.

---

# 4. Relate

## Purpose

Relate reveals meaningful connections between entities.

The system should answer questions such as:

```text
What projects use this technology?

What skills are associated with this project?

What else is related to this milestone?
```

## Example

The visitor focuses:

```text
React
```

The system reveals:

```text
PROJECTS USING REACT

Portfolio
File Management Application

RELATED SKILLS

Frontend Development
Component Architecture

RELATED TECHNOLOGIES

TypeScript
JavaScript
```

Relationships must come from the portfolio relationship model.

They must not be manually duplicated across unrelated UI components.

---

# 5. Navigate

## Purpose

Navigate changes the visitor's position in the exploration history.

Supported actions:

```text
Back
Forward
Home
```

## Back

Returns to the previous exploration state.

Example:

```text
Projects
→ File Manager
→ React

BACK

↓

File Manager
```

## Forward

Restores a previously reversed exploration state.

Example:

```text
Projects
→ File Manager
→ React

BACK

↓

File Manager

FORWARD

↓

React
```

## Home

Returns to the portfolio entry state.

Home should not erase the exploration history unless intentionally designed to do so.

---

# Interaction State

The interaction system should maintain a structured state.

Conceptually:

```text
PortfolioInteractionState

currentContext
focusedEntity
inspectedEntity
history
historyIndex
```

The implementation may add additional state where required.

UI-specific state should remain separate where possible.

Examples of UI-specific state:

```text
isCommandPaletteOpen
isThemeMenuOpen
isMobileMenuOpen
```

These should not become part of the core exploration model.

---

# Interaction History

History must store meaningful exploration states.

Example:

```text
State 1

Context: Home
Focus: None

↓

State 2

Context: Projects
Focus: None

↓

State 3

Context: Projects
Focus: File Manager

↓

State 4

Context: Technologies
Focus: React
```

History should preserve enough information to restore the experience correctly.

The history system should not simply store URLs unless URLs are later adopted as an additional representation of state.

---

# Direct Interaction

Direct interaction is performed through the visual interface.

Examples:

```text
Click Project
↓

Focus Project
```

```text
Click Related Technology
↓

Focus Technology
```

```text
Click Back
↓

Navigate Back
```

The visual interface should call the interaction engine rather than modifying portfolio state directly.

Conceptually:

```text
UI

↓

Interaction Action

↓

State Engine

↓

Updated State

↓

UI Re-renders
```

---

# Keyboard Interaction

Keyboard interaction should improve exploration efficiency.

Potential controls:

```text
Ctrl + K / Cmd + K
Open command palette

Escape
Close temporary interface

Enter
Execute selected action

Arrow Keys
Move through selectable command results

Alt + Left Arrow
Back where supported

Alt + Right Arrow
Forward where supported
```

Keyboard behavior must remain compatible with browser expectations.

The final shortcuts should be tested before being considered permanent.

---

# Command Interaction

The command layer exposes interaction actions through text commands.

The command system should eventually be reusable by both:

```text
WEB COMMAND PALETTE
```

and:

```text
FUTURE CLI
```

## Initial Command Categories

### Context Commands

```text
home
profile
projects
skills
technologies
timeline
```

These change the current exploration context.

---

### Entity Commands

```text
open <entity>
focus <entity>
inspect <entity>
```

Examples:

```text
open file-manager

focus react

inspect typescript
```

The command system must resolve entity names safely.

If multiple entities match, the system should request clarification or present suggestions.

---

### Navigation Commands

```text
back

forward

home
```

These interact with exploration history.

---

### Utility Commands

```text
help

clear
```

`help` displays available commands.

`clear` is primarily useful in terminal-native environments but may later have a meaningful web equivalent.

The command definitions should be structured so unsupported actions are not artificially forced into the web interface.

---

# Command Processing

The command system should conceptually follow:

```text
USER INPUT

↓

PARSE

↓

IDENTIFY COMMAND

↓

RESOLVE ARGUMENTS

↓

VALIDATE

↓

EXECUTE ACTION

↓

UPDATE PORTFOLIO STATE

↓

RETURN RESULT
```

Example:

```text
focus react

↓

COMMAND

focus

↓

ARGUMENT

react

↓

RESOLUTION

technology:react

↓

ACTION

Focus Entity

↓

STATE

focusedEntity = technology:react

↓

RESULT

Interface reorganizes around React
```

The parser must not be embedded directly inside the command palette component.

---

# Unknown Commands

The system should handle invalid commands clearly.

Example:

```text
focus reactjsz
```

Result:

```text
No matching entity found.

Did you mean:

React
```

The experience should be helpful without pretending to be an AI assistant.

Command resolution should remain deterministic unless future functionality intentionally expands it.

---

# Ambiguous Commands

If an entity name could refer to multiple entities:

```text
open portfolio
```

The system should provide choices.

Example:

```text
Multiple matches found:

1. Portfolio Website
2. Portfolio Architecture
3. Portfolio Case Study
```

The user should then be able to select a result.

---

# Contextual Actions

Available actions may change based on the current state.

Example:

When focused on a project:

```text
Available Actions

Inspect Technology
View Related Projects
Explore Timeline
Open Repository
Return
```

When focused on a skill:

```text
Available Actions

View Projects
Explore Technologies
View Development History
Return
```

The system should not expose every possible action at all times.

Context should determine relevance.

---

# Interaction Transitions

Every important interaction should have three layers:

```text
ACTION

↓

STATE CHANGE

↓

VISUAL RESPONSE
```

Example:

```text
ACTION

Focus React

↓

STATE CHANGE

focusedEntity = technology:react

↓

VISUAL RESPONSE

React becomes primary content.
Related projects appear.
Related skills become available.
Previous context remains accessible through history.
```

This separation ensures that the visual implementation can change without redefining the interaction logic.

---

# Exploration Principles

The interaction system should follow these rules:

## No Dead Ends

Every major entity should provide meaningful next actions.

A visitor should not reach a detailed view with nowhere useful to continue.

---

## No Forced Path

Visitors should be able to choose their own exploration direction.

The portfolio should not behave like a linear presentation.

---

## Context Preservation

When moving between related information, the system should preserve enough context for the visitor to understand how they arrived there.

History and transitions should support this.

---

## Progressive Depth

Basic information should be immediately accessible.

Detailed relationships should become available through interaction.

The system should not overwhelm visitors with all possible information simultaneously.

---

## Reversible Actions

Exploration actions should generally be reversible.

Visitors should be able to:

```text
Go Back
Change Focus
Return Home
```

without losing orientation.

---

# Future CLI Compatibility

The interaction system is intentionally designed so the same actions can later be represented through commands.

Example:

```text
WEB

Click "React"

↓

focus("technology:react")
```

Future CLI:

```text
focus react

↓

focus("technology:react")
```

Both interfaces should eventually invoke equivalent core actions.

The web interface should be the first implementation, not the permanent owner of the interaction model.

---

# Interaction Success Criteria

The interaction system succeeds when:

* Every major action has a clear purpose.
* The current context is understandable.
* Related information is easy to discover.
* Visitors can move naturally between entities.
* History behaves predictably.
* The command layer affects real application state.
* The interaction engine is independent from visual components.
* The same interaction concepts can later support a CLI.
* Complexity exists in the system without creating unnecessary difficulty for the visitor.
