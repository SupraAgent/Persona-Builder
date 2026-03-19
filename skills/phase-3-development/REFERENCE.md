# Phase 3 Reference: Consultation Cadence

## Three Levels of Persona Consultation

### Level 1: Feature Planning (before starting a feature)

Consult the Product Lead + any domain-relevant persona.

- What's the minimum version that proves the hypothesis?
- What does the 10-star version look like? (Then scope back.)
- What would [relevant persona] push back on?

### Level 2: Implementation Review (before each PR)

Consult the relevant domain persona.

- Does the UI match the UX Lead's principles?
- Does the architecture satisfy the Tech Architect's constraints?
- Does the engagement model align with the Retention Lead's framework?

### Level 3: Integration Check (after completing a feature)

Consult 2-3 personas together using the [Consensus Protocol](../../CONSENSUS_PROTOCOL.md).

- Does this feature hold up when multiple perspectives evaluate it?
- Are there conflicts? Resolve them now.

## Decision-to-Persona Mapping

| Decision Type | Persona to Consult | When |
|--------------|-------------------|------|
| Screen layout, components, colors | UI/UX Lead | Before building any UI |
| Feature scope, include/exclude | Product Lead | Before starting a feature |
| Onboarding, notifications, streaks | Retention Lead | Building engagement features |
| Database schema, API design, caching | Technical Architect | Before technical decisions |
| Copy, positioning, CTAs | Growth Lead | Writing user-facing text |
| Multi-domain decisions | 2+ personas | Use Consensus Protocol |

## Consultation Format

```
CONTEXT: [What you're building and current state]
DECISION: [The specific choice to make]
CONSTRAINTS: [Limitations -- time, tech, resources]
As [Persona Name], [Title] at [Company], what is your recommendation?
```
