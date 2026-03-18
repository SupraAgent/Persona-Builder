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

## Option A: Pull from SupraVibe Templates

If you already have persona templates built on your **SupraVibe dashboard**:

1. Go to [supravibe.xyz](https://supravibe.xyz)
2. Navigate to your persona templates
3. Select the personas relevant to your project
4. Export or reference them in your project's `docs/personas/` directory
5. Adapt them to the specific project context if needed

This is the fastest path when you've already built personas for similar projects.

---

## Option B: Create New Personas from Scratch

### Step 1: Identify What Expertise You Need

Based on your project type, list the roles you need filled:

**For a Consumer App (e.g., learning app):**
- Product Lead — feature vision and prioritization
- UI/UX Lead — interface design and user experience
- Retention/Engagement Lead — onboarding, habit formation, re-engagement
- Growth/Marketing Lead — acquisition, positioning, GTM
- Technical Architect — system design, performance, scalability

**For a SaaS Product:**
- Product Lead — feature roadmap, customer-driven prioritization
- UI/UX Lead — dashboard design, workflow optimization
- Sales/Revenue Lead — pricing, packaging, conversion
- Technical Architect — multi-tenancy, API design, integrations
- Customer Success Lead — onboarding, churn prevention

**For a Marketplace:**
- Product Lead — two-sided marketplace dynamics
- UI/UX Lead — search, discovery, trust signals
- Growth Lead — supply/demand balance, network effects
- Trust & Safety Lead — fraud prevention, content moderation
- Technical Architect — matching algorithms, payment flows

### Step 2: Find the Right Real-World Model

For each role, identify a **specific person at a specific company** who represents excellence in that area.

**How to choose:**
1. Look at the comparable products you identified in Phase 1 of the project setup.
2. Ask: *"Who at [Company X] is responsible for the thing they do best?"*
3. Research that person's background, public talks, blog posts, and their company's approach.

**Example for a Learning App:**

| Role | Person | Company | Why This Person |
|------|--------|---------|----------------|
| Retention Lead | [Modeled after] Chief Retention Officer | Duolingo | Duolingo has the best retention in consumer education — streaks, leagues, hearts system |
| UI/UX Lead | [Modeled after] Head of Design | Headspace | Clean, calming, accessible design that reduces cognitive load |
| Product Lead | [Modeled after] VP Product | Khan Academy | Free education at scale, mastery-based progression |
| Growth Lead | [Modeled after] VP Marketing | Calm | Premium positioning, content marketing, influencer strategy |
| Tech Architect | [Modeled after] VP Engineering | Anki | Spaced repetition algorithms, offline-first, performance |

### Step 3: Build the Persona Profile

Use the template in `templates/persona_template.md` to flesh out each persona. Every persona profile should include:

#### Core Identity
- **Name** (can be fictional or role-based)
- **Title & Company** (the real role being modeled)
- **Years of Experience**
- **Background Summary** (2-3 sentences on their career arc)

#### Expertise & Skills
- **Primary Domain** — their main area of mastery
- **Secondary Skills** — adjacent capabilities
- **Signature Methodology** — how they approach problems (e.g., "data-driven experimentation," "design thinking," "jobs-to-be-done framework")
- **Tools & Frameworks** — specific tools, frameworks, or mental models they use

#### Strategic Mindset
- **Core Beliefs** — what principles guide their decisions (3-5 bullet points)
- **What They Optimize For** — the metric or outcome they care most about
- **What They Push Back On** — common mistakes or approaches they reject
- **Decision-Making Style** — how they evaluate trade-offs

#### Perspective on Your Project
- **How They'd Approach This Build** — what would they prioritize first?
- **Key Questions They'd Ask** — what would they want to know before starting?
- **Red Flags They'd Watch For** — common pitfalls in this type of project
- **Success Metrics** — how they'd measure if the project is working

### Step 4: Save the Persona

Save each persona as a markdown file in `docs/personas/`:
```
docs/personas/
  retention-lead-duolingo.md
  ux-lead-headspace.md
  product-lead-khan-academy.md
  growth-lead-calm.md
  tech-architect-anki.md
```

### Step 5: Create the Team Manifest

Create a `team.md` in your project root that lists all personas and their roles:

```markdown
# Project Team

## Personas

| Role | Persona | Modeled After | Primary Focus |
|------|---------|---------------|--------------|
| Retention Lead | [Name] | CRO @ Duolingo | Habit loops, streaks, re-engagement |
| UI/UX Lead | [Name] | Head of Design @ Headspace | Calm UX, accessibility, simplicity |
| ... | ... | ... | ... |

## How to Consult

When facing a decision, tag the relevant persona:
- "As the Retention Lead, how would you design the onboarding?"
- "As the Tech Architect, what's the right database schema for this?"
```

---

## Option C: Mix Templates and New Personas

The most common approach — pull what works from SupraVibe, build what's missing:

1. Review your SupraVibe templates for relevant personas.
2. Identify gaps — roles or expertise not covered by existing templates.
3. Build new personas for the gaps using Steps 1-5 above.
4. Document the full team in `team.md`.

---

## How to Consult Personas During Development

### The Consultation Pattern

When you hit a decision point during development, frame the question for the relevant persona:

```
CONTEXT: [Brief description of what you're building and current state]
DECISION: [The specific choice you need to make]
CONSTRAINTS: [Technical, time, or resource limitations]
QUESTION: As [Persona Name], [Title] at [Company], how would you approach this?
```

### When to Consult

| Trigger | Which Persona |
|---------|--------------|
| Designing a screen or component | UI/UX Lead |
| Choosing between features for MVP | Product Lead |
| Designing onboarding or notifications | Retention Lead |
| Writing copy or positioning | Growth/Marketing Lead |
| Choosing a library or architecture pattern | Technical Architect |
| Handling edge cases or error states | QA Lead |

### Updating Personas

Personas should evolve as the project evolves:
- After major pivots, revisit whether the current team is still the right fit.
- If a persona's guidance consistently doesn't apply, swap them for a better model.
- Add new personas as the project enters new phases (e.g., add a "Launch Manager" persona pre-launch).

---

## Persona Quality Checklist

Before using a persona in your project, verify:

- [ ] **Specific, not generic** — modeled after a real role at a real company, not "a good designer"
- [ ] **Relevant expertise** — their background directly applies to your project's challenges
- [ ] **Clear point of view** — you can predict how they'd respond to a new question
- [ ] **Actionable guidance** — their profile leads to concrete decisions, not vague advice
- [ ] **Differentiated** — each persona on the team brings a distinct perspective
- [ ] **Documented** — saved in `docs/personas/` with the full profile template filled out
