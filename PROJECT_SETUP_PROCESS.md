# Project Setup Process

> A step-by-step agent-readable guide for bootstrapping a new application or website from zero to development-ready.

---

## Phase 1: Project Definition

Before touching any code, define the project scope.

### 1.1 — Define the Project Brief
- **What** are we building? (e.g., iOS learning app, SaaS dashboard, marketplace)
- **Who** is the target user?
- **What problem** does it solve?
- **What platforms** does it need to run on? (web, iOS, Android, desktop)
- **What is the MVP scope?** List the 3-5 core features.

### 1.2 — Identify Comparable Products
- List 3-5 existing products in the same space.
- For each, note what they do well and what they do poorly.
- These will inform persona selection in Phase 2.

### 1.3 — Choose the Tech Stack
Document decisions for each layer:

| Layer | Options to Consider |
|-------|-------------------|
| Frontend | Next.js, React Native, Swift, Flutter |
| Backend/API | Supabase, Firebase, custom Node/Python |
| Auth | Supabase Auth, Clerk, Auth0, NextAuth |
| Database | Supabase (Postgres), PlanetScale, MongoDB |
| Hosting | Vercel, Netlify, AWS, Fly.io |
| Payments | Stripe, RevenueCat (mobile) |
| Analytics | PostHog, Mixpanel, Amplitude |

---

## Phase 2: Assemble the Persona Team

> See [PERSONA_BUILDER_GUIDE.md](./PERSONA_BUILDER_GUIDE.md) for full details.

### 2.1 — Decide: Use Existing Templates or Build New Personas
- **Option A:** Pull personas from your SupraVibe dashboard at [supravibe.xyz](https://supravibe.xyz). Use this when you have pre-built personas that fit the project.
- **Option B:** Create new personas tailored to this specific project. Use this when the project requires specialized expertise not covered by existing templates.
- **Option C:** Mix both — pull some from templates, create others fresh.

### 2.2 — Assign Roles to the Team
Every project team should cover these core functions (at minimum):

| Role | Responsibility | Example Persona Source |
|------|---------------|----------------------|
| Product Lead | Vision, feature prioritization, user stories | CPO of a comparable product |
| Technical Architect | Stack decisions, system design, scalability | CTO/VP Eng of a relevant company |
| UI/UX Lead | Design system, user flows, accessibility | Head of Design at a company with great UX |
| Growth/Marketing Lead | GTM strategy, positioning, acquisition | CMO/VP Growth of a successful competitor |
| Retention/Engagement Lead | Onboarding, hooks, habit loops | Chief Retention Officer or Head of Product at an engagement-focused app |
| QA/Quality Lead | Testing strategy, edge cases, standards | QA Director from a reliability-focused company |

### 2.3 — Document the Team
Create a `team.md` in the project root listing each persona, their role, and why they were chosen.

---

## Phase 3: Infrastructure Setup

### 3.1 — Create the GitHub Repository
```bash
# Create repo (if not already created)
gh repo create <org>/<project-name> --private --clone
cd <project-name>

# Initialize with framework
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
# OR for React Native:
npx create-expo-app . --template tabs
# OR your preferred scaffolding tool
```

### 3.2 — Set Up Supabase (if applicable)
1. Create a new project at [supabase.com](https://supabase.com)
2. Save the project URL and anon key
3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Install the client:
   ```bash
   npm install @supabase/supabase-js
   ```
5. Set up initial database schema based on project requirements.

### 3.3 — Set Up Authentication
1. Enable auth providers in Supabase dashboard (or your chosen auth provider).
2. Configure OAuth providers if needed (Google, GitHub, Apple, etc.).
3. Create auth helper utilities.
4. Build sign-up / sign-in / sign-out flows.
5. Set up Row Level Security (RLS) policies.

### 3.4 — Set Up Hosting & Deployment
```bash
# Vercel (for Next.js)
vercel link
vercel env pull .env.local

# OR connect GitHub repo to Vercel dashboard for auto-deploy
```
- Configure environment variables in the hosting platform.
- Set up preview deployments for PRs.
- Configure custom domain if available.

### 3.5 — Set Up Project Structure
Create the base directory structure:
```
src/
  app/                # Routes / pages
  components/         # Reusable UI components
    ui/               # Base design system components
  lib/                # Utilities, helpers, API clients
  hooks/              # Custom React hooks
  types/              # TypeScript type definitions
  styles/             # Global styles
public/               # Static assets
supabase/
  migrations/         # Database migrations
  seed.sql            # Seed data
docs/                 # Project documentation
  personas/           # Persona profile files
```

---

## Phase 4: Development Kickoff

### 4.1 — Create the CLAUDE.md
Write a `CLAUDE.md` at the project root with:
- Project description and goals
- Tech stack and key dependencies
- Coding conventions and patterns to follow
- Persona team reference (link to `team.md`)
- Any project-specific rules or constraints

### 4.2 — Set Up the Development Workflow
- Configure linting and formatting (ESLint, Prettier)
- Set up pre-commit hooks if needed
- Create initial GitHub issues or project board
- Define branch naming conventions (e.g., `feature/`, `fix/`, `chore/`)

### 4.3 — Build the Foundation (in order)
1. **Database schema** — Design and migrate core tables
2. **Auth flows** — Sign up, sign in, protected routes
3. **Layout & navigation** — App shell, sidebar/header, routing
4. **Core feature #1** — The primary user-facing feature
5. **Core feature #2-3** — Secondary features
6. **Polish** — Loading states, error handling, responsive design

### 4.4 — Consult Personas During Development
At each major decision point, reference the relevant persona:
- **UI decision?** Consult the UI/UX Lead persona.
- **Feature prioritization?** Consult the Product Lead persona.
- **Onboarding flow?** Consult the Retention Lead persona.
- **Architecture question?** Consult the Technical Architect persona.

Use the format: *"As [Persona Name], [Role] at [Company], how would you approach [decision]?"*

---

## Phase 5: Pre-Launch Checklist

- [ ] All MVP features functional
- [ ] Auth flows tested (sign up, sign in, password reset, OAuth)
- [ ] Database RLS policies in place
- [ ] Environment variables secured (not in repo)
- [ ] Error handling and loading states
- [ ] Mobile responsive (if web)
- [ ] Basic analytics/tracking in place
- [ ] SEO meta tags (if web)
- [ ] App store assets prepared (if mobile)
- [ ] GTM strategy documented (consult Marketing persona)
- [ ] README updated with setup instructions

---

## Quick Reference: Agent Instructions

When an agent receives a new project request, follow this order:

```
1. READ this file and PERSONA_BUILDER_GUIDE.md
2. DEFINE the project (Phase 1)
3. ASSEMBLE the persona team (Phase 2)
4. SET UP infrastructure (Phase 3)
5. KICK OFF development (Phase 4)
6. At every decision point, CONSULT the relevant persona
7. Before launch, RUN the Phase 5 checklist
```
