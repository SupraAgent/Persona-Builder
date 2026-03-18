# Persona Builder Guide

> How to create, manage, and deploy expert personas for your project team.

---

## What Is a Persona?

A persona is a detailed profile of a **specific expert** modeled after a real role at a real company. Personas are not generic job descriptions — they carry the strategic mindset, priorities, and decision-making patterns of someone who has actually solved the problems your project faces.

**Example:** Instead of "a UX designer," you create *"Sarah Chen, VP of Design at Duolingo"* — someone who thinks in terms of gamification loops, streak psychology, and progressive difficulty curves.

---

## When to Use Personas

| Scenario | What to Do |
|----------|-----------|
| Starting a new project | Assemble a team of 4-6 personas covering core roles |
| Making a design decision | Consult the UI/UX persona |
| Prioritizing features | Consult the Product Lead persona |
| Planning go-to-market | Consult the Marketing/Growth persona |
| Solving a technical problem | Consult the Technical Architect persona |
| Improving retention | Consult the Retention/Engagement persona |

---

## Creating Personas

Three options for building your team. See [docs/reference/creating-personas.md](./docs/reference/creating-personas.md) for detailed instructions.

- **Option A:** Pull from SupraVibe templates (fastest when you have existing personas)
- **Option B:** Create from scratch using `templates/persona_template.md`
- **Option C:** Mix templates and new personas (most common)

For agent-executable instructions, use [skills/write-a-persona/SKILL.md](./skills/write-a-persona/SKILL.md).

---

## Consulting Personas

Use each persona's **consultation triggers** (defined in their YAML frontmatter) to know when to consult them. See [docs/reference/consulting-personas.md](./docs/reference/consulting-personas.md) for the full consultation pattern and multi-persona resolution.

---

## Quality Standards

Every persona must pass the quality checklist before use. See [docs/reference/persona-quality.md](./docs/reference/persona-quality.md) for the full checklist and common anti-patterns.

---

## Resolving Persona Conflicts

When multiple personas disagree, follow the [Consensus Protocol](./CONSENSUS_PROTOCOL.md):

1. Each persona states Position, Confidence, Risk, and Compromise
2. >= 67% weighted agreement = consensus, proceed
3. Deadlock = CEO Tiebreaker
4. User always has final override
