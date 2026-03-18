# Creating Personas

> Detailed guide on building expert personas for your project team.

## Option A: Pull from SupraVibe Templates

If you have persona templates on your [SupraVibe dashboard](https://supravibe.xyz):

1. Navigate to your persona templates
2. Select personas relevant to your project
3. Export or reference them in `docs/personas/`
4. Adapt to the specific project context

> **Future:** SupraVibe will expose a persona API for direct agent access. Until then, use manual export.

## Option B: Create from Scratch

### Step 1: Identify Required Expertise

Based on project type, list the roles needed. See [Phase 1 Reference](../../skills/phase-1-personas/REFERENCE.md) for suggestions by project type.

### Step 2: Find the Right Real-World Model

For each role, identify a specific person at a specific company:

1. Look at comparable products from your project brief
2. Ask: "Who at [Company X] is responsible for the thing they do best?"
3. Research their background, talks, and methodology

**Example for a Learning App:**

| Role | Company | Why |
|------|---------|-----|
| Retention Lead | Duolingo | Best retention in consumer education |
| UI/UX Lead | Headspace | Clean, calm, accessible design |
| Product Lead | Khan Academy | Mastery-based progression at scale |
| Growth Lead | Calm | Premium positioning, content-led growth |
| Tech Architect | Anki | Spaced repetition, offline-first |

### Step 3: Build the Profile

Use `templates/persona_template.md`. For detailed instructions on writing quality personas, see [skills/write-a-persona/SKILL.md](../../skills/write-a-persona/SKILL.md).

### Step 4: Save and Organize

Save each persona as `docs/personas/[role]-[company].md`. Create a `team.md` manifest in the project root.

## Option C: Mix Templates and New Personas

The most common approach:

1. Review SupraVibe templates for relevant personas
2. Identify gaps not covered by existing templates
3. Build new personas for the gaps
4. Document the full team in `team.md`
