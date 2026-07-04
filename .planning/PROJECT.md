# Pocket Decision Book

## What This Is

A mobile-first, installable, offline-capable PWA that puts ~60 decision-making frameworks in your pocket — anchored in *The Decision Book* (Krogerus & Tschäppeler) and extended with the mental-models canon, cognitive-bias defenses, attention/distraction protocols, and structured decision processes. It is a daily-use tool, not a reference dump: you open it in the moment ("I'm distracted", "I can't choose", "I keep procrastinating") and it hands you the right framework with a visual, an example, and a next action.

## Core Value

**Situation-triggered recall**: from a real-life trigger ("I'm stuck", "too many options", "I keep delaying") to the right framework, understood and applied, in under 60 seconds on a phone.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Installable PWA (manifest + service worker, offline-first, add-to-home-screen) that feels native on a phone
- [ ] Framework cards: every model rendered as a swipeable card with (a) one-line essence, (b) an original SVG visual (2x2 / flow / spectrum as appropriate), (c) when-to-use trigger, (d) universal real-life example, (e) "your life" personal prompt, (f) pitfalls/challenges in applying it
- [ ] Situation-based navigation: entry points by feeling/problem ("I'm distracted", "I can't choose", "conflict with someone", "big irreversible decision") that route to matching frameworks
- [ ] Quadrant browse mode mirroring the book's organization (improve yourself / understand yourself / understand others / improve others) plus categories for the extension sets (biases, attention, processes)
- [ ] Search + favorites (localStorage persistence, no backend)
- [ ] "Daily card" habit loop: one framework surfaced per day with a reflection prompt, to embed the thinking into regular life
- [ ] All text and visuals ORIGINAL — inspired by the concepts (which are not copyrightable) but no copied prose or reproduced diagrams from the book

### Out of Scope

- Backend / accounts / sync — v1 is fully client-side; localStorage is enough for favorites and daily-card state
- Native app store builds — PWA install covers "in the pocket from get go"
- Social/sharing features — personal tool first
- Spaced-repetition engine with scheduling algorithms — v1 ships the simpler daily-card loop; SRS is a v2 candidate

## Context

- Content inventory comes from a deep-research sweep (see .planning/RESEARCH.md when written): the ~50 models of The Decision Book with quadrant placement + visual form, plus mental models (second-order thinking, inversion, pre-mortem, regret minimization, OODA), biases with catch-yourself cues (sunk cost, confirmation, loss aversion, planning fallacy), attention systems (implementation intentions, environment design, deep work, Ulysses pacts), and processes (WRAP, decision journals, weighted scoring, Cynefin).
- Examples are two-layer: one universal example per concept, plus a personal "map it to your day" prompt (user is a founder/builder juggling multiple projects — shipping vs. polishing, project prioritization, notification distraction).
- Built and verified via the agent-harness loop (Planner/Generator/Evaluator); this .planning/ directory is the GYWD spec layer the harness planner consumes.

## Constraints

- **Tech stack**: Vanilla HTML/CSS/JS or a single lightweight build — no heavy framework; must run by opening locally or via a static host, and work fully offline after first load
- **Design**: Mobile-first (375px baseline), thumb-reachable navigation, distinctive visual quality (frontend-design skill standards), dark/light theme support
- **Copyright**: Frameworks/ideas are free to use; all prose, examples, and diagrams must be original re-expressions — no text or artwork lifted from the book
- **Performance**: First load fast on mobile; all framework visuals as inline SVG (no image assets to fetch)
- **Verification**: Every sprint adversarially evaluated by harness-evaluator with real click paths; final acceptance gate before delivery

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PWA over native/PDF | "In the pocket from get go" with zero install friction; offline via service worker | — Pending |
| Content anchored in The Decision Book + 4 extension sets | User's explicit choice in interview | — Pending |
| Two-layer examples (universal + personal prompt) | User chose "Both layers" | — Pending |
| Client-side only, localStorage | Personal daily tool; no auth/sync complexity in v1 | — Pending |
| GYWD for planning, agent-harness for execution | User's requested toolchain | — Pending |

---
*Last updated: 2026-07-04 after initialization*
