# Experience Design

## Purpose

This document defines how a visitor experiences and interacts with the portfolio.

The portfolio is designed as an exploration experience rather than a sequence of traditional web pages.

The visitor should always understand where they are and what they can do, while still having opportunities to discover deeper information.

The experience should support both casual visitors and visitors who want to explore deeply.

---

# Experience Overview

The general experience follows this model:

```text
ENTER
  ↓
ORIENT
  ↓
CHOOSE A DIRECTION
  ↓
EXPLORE
  ↓
FOCUS
  ↓
DISCOVER RELATIONSHIPS
  ↓
CHANGE CONTEXT
  ↓
CONTINUE EXPLORING
```

The visitor should not be forced through this sequence.

They may enter the system from different directions and move between information freely.

---

# Entry Experience

The first screen should create curiosity without requiring the visitor to understand the entire system immediately.

The visitor should immediately understand:

* Who this portfolio belongs to
* What kind of person or developer they are exploring
* That the portfolio is interactive
* Where they can begin

The entry experience should be minimal.

It should introduce:

```text
Farhan Haris

Developer / BCA Student

Interactive Portfolio
```

The initial interface should provide several meaningful starting directions.

For example:

* Explore Work
* Explore Skills
* Explore Journey

These are entry points into the exploration system rather than traditional navigation links.

---

# Orientation

After entering the portfolio, the visitor should always be able to understand the current context.

The interface should communicate:

```text
What am I currently exploring?
```

For example:

```text
CURRENT CONTEXT

Projects
```

or:

```text
FOCUSED ENTITY

React
```

The current context should influence the information presented around the visitor.

The interface must not make the visitor feel lost inside the system.

---

# Exploration

Exploration is the primary interaction model.

Visitors can start with a high-level area such as:

* Projects
* Skills
* Technologies
* Journey

From there, they can move deeper into specific entities.

Example:

```text
Projects
  ↓
File Management Application
  ↓
React
  ↓
Related Skills
  ↓
Other React Projects
```

The visitor should never need to return to the homepage simply to continue exploring.

Related information should provide natural paths forward.

---

# Entity Focus

An entity can become the primary focus of the interface.

Entities include:

* Project
* Skill
* Technology
* Timeline milestone
* Profile information

When an entity is focused, the interface reorganizes around it.

For example:

```text
FOCUS: React

Projects using React
Related technologies
Relevant skills
Timeline relevance
```

The focused entity should become the center of the current experience.

However, the interface should still make related information accessible.

---

# Contextual Exploration

The same portfolio information may be presented differently depending on context.

For example, a technology can be explored through a project:

```text
Project
→ Technologies Used
→ React
```

The visitor can then focus on React.

The system should now reveal:

```text
React
→ Projects using React
→ Related skills
→ Related technologies
→ Development history
```

The portfolio should therefore behave as a contextual information system.

The visitor determines the direction of exploration.

---

# Relationship Discovery

Relationships are an important part of the experience.

The portfolio should make meaningful connections visible.

Examples include:

```text
Project
↔ Technology

Project
↔ Skills

Technology
↔ Skills

Project
↔ Timeline

Skill
↔ Development Progression
```

Relationships should not be displayed as a permanent node graph.

Instead, relationships should appear naturally when they are relevant to the current context.

The visitor should discover connections through exploration.

---

# Exploration History

The system should remember how the visitor arrived at their current context.

For example:

```text
Home
→ Projects
→ File Management Application
→ React
→ TypeScript
```

The visitor should be able to move backward through this exploration.

The interface should support:

* Back
* Forward
* Return Home

The history system should behave predictably.

Navigation history is part of the experience rather than merely a browser feature.

---

# Multiple Interaction Methods

The portfolio should support multiple ways of performing similar actions.

## Direct Interaction

Visitors can interact through:

* Clicking
* Tapping
* Selecting
* Opening
* Focusing
* Inspecting

The visual interface should make available actions understandable without requiring instructions.

---

## Keyboard Interaction

Keyboard interaction should support efficient exploration.

Examples may include:

```text
Arrow Keys
Navigate available interactive elements

Enter
Select or open

Escape
Close or return from a temporary interface

Backspace
Return to the previous exploration state where appropriate

Ctrl + K / Cmd + K
Open the command layer
```

The final keyboard interaction model should be refined during implementation.

Keyboard controls must not conflict with normal browser behavior unnecessarily.

---

## Command Interaction

The command layer provides another way to interact with the portfolio.

It should be accessible through:

```text
Ctrl + K
```

or:

```text
Cmd + K
```

The command layer should understand actions rather than functioning only as a search box.

Examples:

```text
projects
skills
timeline
profile
```

These move the portfolio into the relevant context.

More specific commands may include:

```text
open <entity>

focus <entity>

back

forward

home

help
```

The command system must trigger the same interaction actions used by the visual interface.

The command layer should not contain a separate fake representation of the portfolio.

---

# Progressive Discovery

The experience should have multiple levels of depth.

A casual visitor should be able to:

1. Understand who Farhan Haris is.
2. See important work.
3. Understand core skills.
4. Access contact information.

A deeper visitor should be able to:

* Explore project relationships.
* Investigate technologies.
* Move through development progression.
* Discover related projects.
* Use keyboard interactions.
* Use the command layer.

Advanced interaction should be optional.

The portfolio must never require a visitor to "play a game" before accessing basic portfolio information.

---

# Session State

The portfolio may remember certain exploration state during a session.

Possible state includes:

* Entities visited
* Current context
* Focused entity
* Exploration history
* Theme preference

The system should avoid intrusive gamification.

Exploration progress should only be visible when it adds meaningful value.

The visitor should not feel pressured to unlock content.

All important portfolio information must remain accessible.

---

# Desktop Experience

Desktop provides the richest interaction environment.

The design can take advantage of:

* Larger contextual layouts
* Keyboard interaction
* Command access
* Simultaneous visibility of related information
* Smooth contextual transitions

Desktop interactions should feel application-like rather than like a traditional website.

---

# Mobile Experience

Mobile is not a reduced desktop mode.

The interaction model must adapt to touch and limited screen space.

Mobile priorities:

* Clear current context
* Large interaction targets
* Simple transitions between focused entities
* Accessible history controls
* Functional command interface
* Progressive information disclosure

Related information may be displayed sequentially rather than simultaneously.

The mobile experience should remain interactive without becoming visually crowded.

---

# Motion and Transitions

Motion should communicate changes in the exploration state.

Important transitions include:

* Entering a new context
* Focusing an entity
* Returning through history
* Revealing relationships
* Opening and closing the command layer

Motion should provide spatial and contextual continuity.

Animations must not exist purely as decoration.

The visitor should understand that the interface has changed because something meaningful happened.

---

# Desired Visitor Feeling

The ideal visitor experience is:

```text
I understand this immediately.

↓

This is different from a normal portfolio.

↓

I can explore this in my own direction.

↓

Interesting, these things are connected.

↓

I want to see what else is here.
```

The portfolio should create curiosity without creating confusion.

---

# Experience Constraints

The experience must avoid:

* Requiring visitors to understand complicated game mechanics
* Hiding essential portfolio information
* Making interaction slower than normal navigation
* Using novelty as a replacement for useful content
* Forcing visitors into a predetermined exploration path
* Excessive tutorials or instructions
* Visual complexity without interaction value

The system can be technically sophisticated while remaining easy to use.

---

# Future CLI Relationship

The future CLI should provide an alternative experience rather than a separate portfolio.

Conceptually:

```text
WEB

Click Project
→ Focus Project

CLI

open project
→ Focus Project
```

Both interfaces should eventually perform equivalent actions against the same portfolio model.

The web experience is the first implementation of this interaction philosophy.

The CLI will later provide a terminal-native way to explore the same portfolio.
