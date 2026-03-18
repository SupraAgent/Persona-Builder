# Project Setup Process

> Agent-executable runbook for bootstrapping a new application from zero to development-ready.
> Follow each phase in order. Stop at every `>>> GATE` before proceeding.

---

## Phase 0: Project Brief

> Goal: Understand what we're building before making any decisions.

### Step 0.1 — Gather Requirements `[ASK]`

Ask the user the following questions. Do not proceed until you have answers to at least questions 1-3:

> **Questions to ask the user:**
> 1. "What are we building? Describe the app/website in 1-2 sentences."
> 2. "Who is the target user? (e.g., students, professionals, parents, developers)"
> 3. "What problem does this solve for them?"
> 4. "What platforms should it run on? (web, iOS, Android, desktop)"
> 5. "What are the 3-5 core features for the MVP — the minimum to be useful?"

### Step 0.2 — Identify Comparable Products `[ASK]`

> **Ask the user:**
> "What are 3-5 existing products that do something similar or that you admire? For each one, what do they do well?"
>
> If the user isn't sure, suggest comparables based on the project description and ask them to confirm or adjust.

### Step 0.3 — Document the Brief `[AGENT]`

Create a `project-brief.md` file in the project root with the answers from Steps 0.1 and 0.2. This document will be referenced throughout the build.

```
>>> GATE: Phase 0 → Phase 1
    REQUIRED: project-brief.md exists with answers to all questions
    ASK: "Here's the project brief I've documented: [summary]. Does this look right before we move on to building the team?"
    CANNOT SKIP: This gate. Every project needs a brief.
```

---

## Phase 1: Assemble the Persona Team

> Goal: Build a team of expert personas BEFORE touching any code.
> This phase is **mandatory**. No infrastructure, no scaffolding, no code until the team is assembled.

### Step 1.1 — Determine Required Roles `[AGENT]`

Based on the project brief, determine which roles the team needs. Use these defaults as a starting point, then adjust based on project type:

**Default roles (every project):**
- Product Lead
- Technical Architect
- UI/UX Lead

**Add based on project type:**

| Project Type | Additional Roles |
|-------------|-----------------|
| Consumer app | Retention/Engagement Lead, Growth/Marketing Lead |
| SaaS product | Sales/Revenue Lead, Customer Success Lead |
| Marketplace | Growth Lead, Trust & Safety Lead |
| Content platform | Content Strategy Lead, Community Lead |
| E-commerce | Conversion Optimization Lead, Growth Lead |

### Step 1.2 — Check for Existing Personas `[ASK]`

Before creating anything, check what already exists:

> **Ask the user:**
> "I need these roles for the team: [list roles from Step 1.1].
>
> Before I create new personas, do you have any existing ones I should use?
> - Do you have persona templates on SupraVibe (supravibe.xyz) you'd like to pull in?
> - Are there personas from a previous project we should reuse?
> - Or should I create all of them fresh?"

Also check the current project directory:
- `[AGENT]` Look for `docs/personas/` — do any persona files already exist?
- `[AGENT]` Look for `team.md` — does a team manifest already exist?

### Step 1.3 — Select Companies to Model `[ASK]`

For each role that needs a new persona, the agent should suggest companies based on the comparable products from Phase 0, then confirm with the user:

> **Ask the user:**
> "Based on the comparable products you mentioned, here's who I'd model each persona after:
>
> | Role | Suggested Company | Why |
> |------|------------------|-----|
> | [Role 1] | [Company] | [1-line reason based on what they do well] |
> | [Role 2] | [Company] | [1-line reason] |
> | ... | ... | ... |
>
> Want to change any of these? You can swap in a different company for any role — for example, if you love [Company A]'s design but [Company B]'s growth strategy."

### Step 1.4 — Create Each Persona `[AGENT]`

For each role, create a persona file using the template at `templates/persona_template.md`:

1. Read the template
2. Research the company and role (use web search if available)
3. Fill in every section — Core Identity, Expertise, Strategic Mindset, Perspective on This Project
4. Generate the consultation prompt at the bottom
5. Save to `docs/personas/[role]-[company].md`

Present each persona to the user as it's completed:

> **After creating each persona, tell the user:**
> "I've created [Name], modeled after [Title] at [Company], as the [Role]. Here's a quick summary:
> - Optimizes for: [primary metric]
> - Core belief: [most distinctive belief]
> - Would push back on: [key anti-pattern]
>
> Does this persona fit, or should I adjust anything?"

### Step 1.5 — Create the Team Manifest `[AGENT]`

Once all personas are approved, create `team.md` in the project root with:
- The full roster table (role, name, company, focus, link to profile)
- Quick reference guide (which persona to consult for which decisions)
- Team dynamics / conflict resolution guidance
- Phase-based priority (who has the loudest voice at each stage)

### Step 1.6 — Run Persona Pre-Flight Check `[AGENT]`

Run through the checklist in `templates/persona_check.md` to verify:
- All required roles have a persona
- All personas have complete profiles
- `team.md` exists with the full roster
- Consultation prompts are ready

```
>>> GATE: Phase 1 → Phase 2
    REQUIRED:
      - Persona file exists in docs/personas/ for every required role
      - team.md exists in project root with full roster
      - User has approved each persona
      - Persona pre-flight check passes
    ASK: "The team is assembled: [list names and roles]. All personas are documented and ready. Should I move on to choosing the tech stack and setting up infrastructure?"
    CANNOT SKIP: This gate. Personas MUST exist before any code is written.
    HARD BLOCK: If any required role is missing a persona, DO NOT proceed. Ask the user how they want to fill the gap.
```

---

## Phase 2: Tech Stack & Infrastructure

> Goal: Choose the tech stack and set up the project skeleton.
> Consult the Technical Architect persona for all stack decisions.

### Step 2.1 — Recommend a Tech Stack `[ASK]`

Based on the project brief and platform requirements, recommend a stack. **Consult the Technical Architect persona** to inform the recommendation.

> **Present to the user:**
> "Based on the project requirements, here's the tech stack I recommend (informed by [Tech Architect Persona Name]'s perspective):
>
> | Layer | Choice | Why |
> |-------|--------|-----|
> | Frontend | [Framework] | [1-line reason] |
> | Backend/API | [Service] | [1-line reason] |
> | Database | [Service] | [1-line reason] |
> | Auth | [Provider] | [1-line reason] |
> | Hosting | [Platform] | [1-line reason] |
> | Payments | [Provider] | [if applicable] |
> | Analytics | [Tool] | [1-line reason] |
>
> Want to change anything?"

### Step 2.2 — Create the GitHub Repository `[ASK]`

> **Ask the user:**
> "Should I create a new GitHub repo for this project? If so:
> - What org/account? (e.g., SupraAgent)
> - Repo name?
> - Public or private?"

`[AGENT]` Once confirmed, create the repo and initialize with the chosen framework.

### Step 2.3 — Set Up the Database & Auth `[AGENT]`

Based on the approved tech stack:
1. Set up the database service (Supabase, Firebase, etc.)
2. Configure authentication providers
3. Create initial schema based on project requirements
4. Set up environment variables (`.env.local`)

> **Tell the user what was set up** and what manual steps they need to take (e.g., "You'll need to enable Google OAuth in the Supabase dashboard and add the client ID").

### Step 2.4 — Set Up Hosting & Deployment `[AGENT]`

1. Connect the repo to the hosting platform
2. Configure environment variables
3. Set up preview deployments for PRs
4. Verify the deployment pipeline works

### Step 2.5 — Create Project Structure `[AGENT]`

Scaffold the directory structure appropriate for the chosen framework. Always include:

```
docs/
  personas/           # Persona files created in Phase 1
```

Copy the persona files into the project's `docs/personas/` directory so they travel with the project.

```
>>> GATE: Phase 2 → Phase 3
    REQUIRED:
      - GitHub repo exists and is accessible
      - Tech stack is set up and deployable
      - Auth is configured (at least one provider)
      - Database is connected
      - Persona files are in the project's docs/personas/
    ASK: "Infrastructure is set up. The app is deployable (even though it's empty). Ready to start building features?"
    CANNOT SKIP: This gate.
```

---

## Phase 3: Development Kickoff

> Goal: Start building the application, consulting personas at every decision point.

### Step 3.1 — Create the Project CLAUDE.md `[AGENT]`

Write a `CLAUDE.md` in the new project root (not the Persona Builder repo) with:
- Project description and goals (from the brief)
- Tech stack and key dependencies
- Coding conventions and patterns to follow
- **Persona team reference** — link to `team.md` and instruct future agents to consult personas
- Any project-specific rules or constraints

### Step 3.2 — Plan the Build Order `[ASK]`

**Consult the Product Lead persona** to determine feature priority, then present to the user:

> **Ask the user:**
> "Based on [Product Lead Name]'s prioritization, here's the build order:
>
> 1. **[Foundation]** — database schema, auth flows, app shell
> 2. **[Core Feature #1]** — [description] (this is the primary user value)
> 3. **[Core Feature #2]** — [description]
> 4. **[Core Feature #3]** — [description]
> 5. **[Polish]** — loading states, error handling, responsive design
>
> Does this order make sense, or should I reprioritize?"

### Step 3.3 — Build with Persona Consultation `[AGENT]`

As you build each feature, consult the relevant persona at **specific checkpoints** — not after the fact, but before committing to an approach.

#### Consultation Cadence

Persona consultation happens at three levels:

**Level 1: Feature Planning (before starting a feature)**
Consult the Product Lead + any domain-relevant persona. This is the "what and why" check.
- What's the minimum version that proves the hypothesis?
- What does the 10-star version look like? (Then scope back from there.)
- What would [relevant persona] push back on?

**Level 2: Implementation Review (before each PR / major commit)**
Consult the relevant domain persona. This is the "how" check.
- Does the UI match [UX Lead]'s principles? (Minimal cognitive load, accessibility, etc.)
- Does the architecture satisfy [Tech Architect]'s constraints? (Offline-first, performance, etc.)
- Does the engagement model align with [Retention Lead]'s framework? (Hook, habit, loop)

**Level 3: Integration Check (after completing a feature, before moving to the next)**
Consult 2-3 personas together using the [Consensus Protocol](./CONSENSUS_PROTOCOL.md).
- Does this feature hold up when multiple persona perspectives evaluate it simultaneously?
- Are there conflicts between what different personas would want? Resolve them now.

#### Decision-to-Persona Mapping

| Decision Type | Persona to Consult | When |
|--------------|-------------------|------|
| Screen layout, components, colors | UI/UX Lead | Before building any UI |
| Feature scope, what to include/exclude | Product Lead | Before starting a feature |
| Onboarding, notifications, streaks | Retention Lead | When building engagement features |
| Database schema, API design, caching | Technical Architect | Before technical decisions |
| Copy, positioning, CTAs | Growth Lead | When writing user-facing text |
| Multi-domain decisions (e.g., gamified UI) | 2+ personas | Use Consensus Protocol |

**How to consult:** Use the consultation prompt from the persona's profile file. Frame the specific decision, include context and constraints, and apply their recommendation.

> **After each major feature, tell the user:**
> "I've built [feature]. Here's what [Persona Name] influenced:
> - [Key decision and why the persona's perspective shaped it]
> - [Any conflicts resolved via consensus protocol, if applicable]
>
> Here's what it looks like: [screenshot/description]. Any changes?"

### Step 3.4 — Set Up Development Workflow `[AGENT]`

- Configure linting and formatting
- Set up branch naming conventions
- Create initial GitHub issues based on the build order

```
>>> GATE: Phase 3 → Phase 4
    REQUIRED:
      - All MVP features are functional
      - Personas were consulted for major decisions (documented in commit messages or comments)
      - User has reviewed and approved each major feature
    ASK: "All MVP features are built. Ready for the pre-launch checklist?"
    CANNOT SKIP: This gate.
```

---

## Phase 4: Pre-Launch

> Goal: Verify everything is ready to ship.

### Step 4.1 — Run Pre-Launch Checklist `[AGENT]`

Check each item. Report failures to the user:

- [ ] All MVP features functional and tested
- [ ] Auth flows work end-to-end (sign up, sign in, sign out, password reset)
- [ ] Database security policies in place (RLS if Supabase)
- [ ] Environment variables secured (not committed to repo)
- [ ] Error handling and loading states on all screens
- [ ] Mobile responsive (if web app)
- [ ] Basic analytics/tracking in place
- [ ] SEO meta tags configured (if web app)
- [ ] App store assets prepared (if mobile app)
- [ ] README in project repo has setup instructions

### Step 4.2 — Persona Final Review `[AGENT]`

Run a final consultation with each persona:

> For each persona, ask:
> "As [Name], [Title] at [Company] — reviewing this app before launch, what's the biggest risk or gap you see?"
>
> Document their concerns and present to the user.

### Step 4.3 — GTM Readiness `[ASK]`

**Consult the Growth/Marketing Lead persona** for launch strategy, then present:

> **Ask the user:**
> "[Growth Lead Name] recommends this launch approach:
> - [Key GTM recommendations]
>
> Do you want to implement any of these before launch, or ship now and iterate?"

```
>>> GATE: Phase 4 → Launch
    REQUIRED:
      - Pre-launch checklist passes (all items green)
      - User has reviewed persona final review concerns
      - GTM approach is decided
    ASK: "Everything checks out. Ready to launch?"
    CANNOT SKIP: This gate.
```

---

## Phase 5: Post-Launch Iteration

> Goal: Monitor real-world performance against persona-defined success metrics, iterate, and evolve the team.
> This phase begins immediately after launch and runs continuously.

### Step 5.1 — Activate Success Metrics `[AGENT]`

For each persona, pull their success metrics from their profile and create a tracking dashboard or checklist:

```markdown
## Post-Launch Scorecard

| Persona | Key Metric | Target | Actual | Status |
|---------|-----------|--------|--------|--------|
| [Retention Lead] | D7 retention | >30% | — | Pending data |
| [UX Lead] | Task completion rate | >90% | — | Pending data |
| [Product Lead] | Skill mastery rate | >70% | — | Pending data |
| [Growth Lead] | Organic download % | >60% | — | Pending data |
| [Tech Architect] | P95 latency | <100ms | — | Pending data |
```

Save as `docs/post-launch-scorecard.md` in the project repo.

### Step 5.2 — Weekly Persona Retro `[AGENT]` + `[ASK]`

At each weekly review cycle, run a brief consultation with each persona:

> For each persona, ask:
> "As [Name], [Title] at [Company] — looking at this week's data, what's working, what's broken, and what should we prioritize next?"
>
> Compile into a weekly retro document and present to the user:
>
> **Ask the user:**
> "Here's this week's persona retro:
> - [Retention Lead]: [Key observation + recommendation]
> - [UX Lead]: [Key observation + recommendation]
> - [Product Lead]: [Key observation + recommendation]
> - [Growth Lead]: [Key observation + recommendation]
> - [Tech Architect]: [Key observation + recommendation]
>
> Which of these should we act on this week?"

### Step 5.3 — Persona Team Evolution `[ASK]`

As the product matures, the team may need to change:

> **Trigger conditions for persona swap/addition:**
> - A persona's success metrics are consistently met → their voice can quiet down
> - A new challenge emerges (e.g., international expansion) → add a new persona
> - A persona's advice is consistently overridden → re-evaluate if they're the right model
> - The product pivots → re-run Phase 1 with the new direction

> **Ask the user:**
> "Based on [trigger], I recommend [adding/swapping/retiring] the [Role] persona. Here's why: [reason]. Should I proceed?"

### Step 5.4 — Decision Audit `[AGENT]`

Review the decision log from `docs/decisions/` (created during consensus resolutions). For each decision with a `revisit trigger`:

1. Check if the trigger condition has been met
2. If yes, flag it and recommend whether to reverse, modify, or reaffirm
3. Present findings to the user

```
>>> GATE: Phase 5 is ongoing — no terminal gate.
    RHYTHM: Run Steps 5.2-5.4 weekly (or at whatever cadence the user prefers).
    ASK: "How often do you want persona retros? Weekly, bi-weekly, or after each sprint?"
    NOTE: Phase 5 loops indefinitely. The product is never "done" — and neither is the team.
```

---

## Reference: Consensus Protocol

When multiple personas are consulted and disagree, follow the **Consensus & Dispute Resolution Protocol** in [CONSENSUS_PROTOCOL.md](./CONSENSUS_PROTOCOL.md).

**Quick rules:**
- **≥ 67% agreement** (2/3 majority) = consensus reached, proceed
- **Deadlock** = invoke CEO Tiebreaker (weighted evaluation on user impact, speed to learning, reversibility, risk, team alignment)
- **Persona confidence** weights their vote (High=1.0x, Medium=0.7x, Low=0.4x)
- **Phase authority** gives the current phase lead a 1.5x bonus on close calls
- **User always has final override** — the protocol reduces decisions reaching the user, not eliminates user control

See the full protocol for the evaluation framework, decision logging, and resolution flow.

---

## Reference: Action Markers

| Marker | Meaning |
|--------|---------|
| `[ASK]` | Agent MUST ask the user this question and wait for a response before continuing. Do not guess or assume. |
| `[AGENT]` | Agent handles this autonomously. No need to ask — just do it and report the result. |
| `>>> GATE` | Hard stop. Agent MUST verify all REQUIRED conditions are met and ASK the gate question before proceeding to the next phase. |
