# Architecture and Product Decisions

## Purpose

This document records important product, design, and technical decisions made during the development of the interactive portfolio.

Its purpose is to preserve context and prevent previously resolved decisions from being repeatedly reconsidered without a clear reason.

Each decision should include:

* Decision
* Context
* Reasoning
* Status
* Consequences

New significant decisions should be added as the project evolves.

---

# DECISION 001 — Create a New Portfolio Project

## Status

Accepted

## Decision

The interactive portfolio will be developed as a completely new project.

It will not continue development from the previous portfolio implementation.

## Context

A previous portfolio experiment existed as an interactive 3D project.

The repository was:

```text id="ssbsu7"
farhan0haris/portfolio
```

Development of that experiment ended at:

```text id="r2a0sd"
4327f74
```

## Reasoning

The new portfolio has a fundamentally different product direction.

The previous approach focused on:

* Interactive 3D environments
* A game-like world
* Spatial exploration
* 3D visual presentation

The new approach focuses on:

* Interactive information exploration
* Contextual relationships
* Application-like interaction
* Structured portfolio data
* A future command-line interface

Reusing the previous implementation would introduce unnecessary architectural and conceptual baggage.

## Consequences

* No previous source code is required.
* No previous visual system is reused.
* No previous 3D architecture is reused.
* The new project begins with a clean repository and independent documentation.

---

# DECISION 002 — Web First

## Status

Accepted

## Decision

The web application will be implemented before the command-line interface.

## Context

The long-term portfolio concept supports both:

* Web interaction
* Terminal interaction

Building both interfaces simultaneously would create unnecessary complexity.

## Reasoning

The web experience requires the largest amount of visual and interaction design work.

Building it first allows the project to establish:

* Portfolio data
* Entity types
* Relationships
* Interaction actions
* Exploration state
* Command concepts

These concepts can later be extracted or reused by the CLI.

## Consequences

* The initial project focuses entirely on the web application.
* The CLI is not implemented during early phases.
* Architecture should remain modular enough for future extraction.
* A monorepo is not introduced prematurely.

---

# DECISION 003 — The Portfolio Is an Exploration System

## Status

Accepted

## Decision

The portfolio will be designed around exploration rather than traditional page navigation.

## Context

Traditional portfolios commonly follow:

```text id="0b2mdt"
Home
→ About
→ Skills
→ Projects
→ Contact
```

This structure does not reflect the intended interactive direction of the project.

## Reasoning

Portfolio information naturally contains relationships.

For example:

```text id="6o8e85"
Project
↔ Technology

Project
↔ Skill

Technology
↔ Other Projects

Project
↔ Development Timeline
```

The interface should allow visitors to move through these relationships naturally.

## Consequences

* Projects, skills, technologies, and milestones become connected entities.
* Traditional navigation is not the primary interaction model.
* Context becomes an important part of application state.
* Related information becomes a major exploration mechanism.

---

# DECISION 004 — No 3D Environment

## Status

Accepted

## Decision

The portfolio will not use a 3D environment.

## Context

The previous portfolio experiment explored a 3D world.

The new project intentionally moves away from that direction.

## Reasoning

The objective is meaningful interaction, not visual dimensionality.

A 3D environment would introduce:

* Rendering complexity
* Performance costs
* Additional dependencies
* Mobile compatibility concerns
* Interaction overhead

without necessarily improving portfolio exploration.

## Consequences

The project will not use:

* Three.js
* React Three Fiber
* WebGL environments
* 3D worlds
* 3D characters
* Walking mechanics

---

# DECISION 005 — No Node-Based Portfolio Map

## Status

Accepted

## Decision

The portfolio will not use a permanent node graph as its primary navigation system.

## Context

Connected portfolio entities could be represented visually as a graph.

However, this would make relationships the visual interface rather than allowing them to support exploration contextually.

## Reasoning

A node graph can:

* Overwhelm new visitors
* Become difficult to use on mobile
* Prioritize visual novelty over information clarity
* Make simple navigation unnecessarily complicated

Relationships should instead appear when relevant.

## Consequences

* Relationships are resolved programmatically.
* Related information appears contextually.
* Exploration remains understandable.
* No permanent graph visualization is required.

---

# DECISION 006 — No Fake Terminal Experience

## Status

Accepted

## Decision

The web portfolio will not be designed to look like a terminal.

## Context

The project will eventually support a real CLI.

It would be easy to imitate that concept using a fake terminal website.

## Reasoning

A fake terminal would reduce the web experience to a visual gimmick.

The command layer should instead be a genuine interaction method inside a broader application experience.

## Consequences

* The web interface remains visually independent from terminal aesthetics.
* The command palette integrates with the design system.
* Monospace typography is used selectively.
* The future CLI provides the actual terminal-native experience.

---

# DECISION 007 — Command Layer Uses Real Application Actions

## Status

Accepted

## Decision

Commands must interact with the real portfolio exploration system.

## Context

The command palette is intended to be more than a search interface.

## Reasoning

The following interactions should be equivalent:

```text id="iyn2qz"
WEB

Click React

↓

Focus React
```

and:

```text id="aeyup0"
COMMAND

focus react

↓

Focus React
```

Both should eventually invoke equivalent actions.

## Consequences

* Commands are parsed independently from UI components.
* Commands resolve real portfolio entities.
* Commands update exploration state.
* The command palette does not maintain duplicate navigation logic.

---

# DECISION 008 — Data Is Independent from Presentation

## Status

Accepted

## Decision

Portfolio content will be stored as structured data independent from UI components.

## Context

Portfolio applications often embed project information directly inside page components.

This makes reuse and future interfaces more difficult.

## Reasoning

The same portfolio information should eventually be usable by:

* Web UI
* Command palette
* Future CLI

## Consequences

Portfolio entities are stored independently from presentation.

The UI consumes data and exploration state.

The data layer should remain reusable.

---

# DECISION 009 — Relationships Are Derived Where Possible

## Status

Accepted

## Decision

Reverse relationships should be derived from canonical entity references where practical.

## Context

A project may reference technologies:

```text id="18z8p3"
Project
→ React
→ TypeScript
```

The application can derive:

```text id="rwj6aj"
React
→ Projects using React
```

## Reasoning

Manually storing both directions creates duplicated data.

Duplicated relationship data can become inconsistent.

## Consequences

* Canonical relationships are stored once where possible.
* Relationship resolvers generate reverse connections.
* Manual duplication requires justification.

---

# DECISION 010 — Exploration State Is Separate from Portfolio Data

## Status

Accepted

## Decision

The visitor's exploration state must remain separate from portfolio content.

## Context

Portfolio content is relatively static.

The visitor's current experience changes continuously.

## Reasoning

These represent different concerns:

```text id="1pny55"
PORTFOLIO

What exists
```

and:

```text id="zt5vhz"
STATE

What the visitor is currently exploring
```

## Consequences

* Portfolio data remains immutable during exploration.
* Current context is stored separately.
* Focus state is stored separately.
* History is stored separately.

---

# DECISION 011 — History Is Part of the Experience

## Status

Accepted

## Decision

The application will maintain exploration history.

## Context

Visitors may move between multiple related entities.

Example:

```text id="n0cr5b"
Projects
→ File Manager
→ React
→ TypeScript
```

Without history, contextual exploration can become disorienting.

## Reasoning

Visitors should be able to understand and reverse their exploration path.

## Consequences

The interaction system supports:

* Back
* Forward
* Home

History should store meaningful exploration state.

---

# DECISION 012 — Interaction Before Decoration

## Status

Accepted

## Decision

Functional interaction takes priority over visual effects.

## Context

Interactive portfolios can easily become demonstrations of animation rather than useful portfolios.

## Reasoning

The project is intended to demonstrate both design and engineering.

Meaningful interaction is more valuable than decorative complexity.

## Consequences

* Animations require a purpose.
* Motion communicates state changes.
* Effects do not replace content.
* Core interactions are implemented before advanced polish.

---

# DECISION 013 — Light and Dark Themes Are First-Class

## Status

Accepted

## Decision

The portfolio will support light and dark themes.

## Context

The application should remain comfortable across different environments and preferences.

## Reasoning

Theme support affects:

* Design tokens
* Contrast
* Surface hierarchy
* Focus states
* Motion perception

It should therefore be considered early.

## Consequences

* Theme architecture is included in the application foundation.
* Both themes are tested during development.
* Theme preference may persist across sessions.

---

# DECISION 014 — Responsive Design Is an Interaction Concern

## Status

Accepted

## Decision

Responsive design will adapt the interaction experience, not merely scale the desktop layout.

## Context

The portfolio supports:

* Desktop
* Laptop
* Tablet
* Mobile

These environments provide different interaction capabilities.

## Reasoning

Desktop can display multiple contextual relationships simultaneously.

Mobile requires progressive disclosure and touch-friendly interaction.

## Consequences

* Hover cannot be required for essential interactions.
* Keyboard interactions are supplementary.
* Mobile layouts may reorganize information.
* Command interaction must remain functional on smaller screens.

---

# DECISION 015 — Avoid Premature Architectural Complexity

## Status

Accepted

## Decision

The project will remain web-first and avoid premature infrastructure.

## Context

The future CLI may eventually require shared packages.

Creating a monorepo immediately would increase setup complexity before shared code actually exists.

## Reasoning

Architecture should solve current problems while allowing future evolution.

## Consequences

The initial implementation remains a single web project.

Core modules should be organized so future extraction is practical.

A monorepo is considered only when the CLI requires shared code.

---

# DECISION 016 — Dependencies Require Justification

## Status

Accepted

## Decision

Dependencies must provide clear value.

## Context

Portfolio projects often accumulate packages for minor effects and convenience.

## Reasoning

Unnecessary dependencies increase:

* Bundle size
* Maintenance complexity
* Version conflicts
* Learning overhead

## Consequences

Dependencies should be evaluated based on:

* Functional value
* Bundle impact
* Maintenance
* Compatibility

Avoid overlapping libraries.

---

# DECISION 017 — Build in Stable Phases

## Status

Accepted

## Decision

Development will follow the roadmap in controlled phases.

## Context

AI-assisted development can produce large amounts of code quickly, which increases the risk of hidden architectural problems.

## Reasoning

Each phase should establish a working checkpoint.

Problems should be identified before more complexity is added.

## Consequences

* Major phases are implemented separately.
* Each phase is tested.
* Each stable phase receives a meaningful commit.
* Large rewrites should be avoided where incremental improvement is possible.

---

# Decision Update Rules

A decision may be changed when:

* New technical evidence makes it unsuitable.
* Product requirements change.
* A constraint was previously unknown.
* The implementation reveals a significant issue.

A decision should not be changed merely because an alternative appears visually interesting.

When changing an accepted decision:

1. Add a new decision entry.
2. Reference the previous decision.
3. Explain why the decision changed.
4. Record the consequences.

---

# Current Direction Summary

The project direction is:

```text id="ny7wum"
NEW PROJECT

↓

WEB FIRST

↓

STRUCTURED PORTFOLIO DATA

↓

CONNECTED ENTITIES

↓

CONTEXTUAL EXPLORATION

↓

INTERACTION ENGINE

↓

COMMAND LAYER

↓

RESPONSIVE WEB EXPERIENCE

↓

FUTURE REAL CLI
```

The portfolio is not intended to be a traditional website with interactive decoration.

It is an interactive portfolio application whose content, relationships, and interactions are designed as part of the same system.
