---
name: "Phase 2: Tech Stack & Infrastructure"
description: "Use when the persona team is assembled and you need to choose a tech stack and set up project infrastructure. Consult the Technical Architect persona for all decisions."
dependencies: ["phase-1-personas"]
outputs: ["GitHub repo", "deployed skeleton", "configured auth/database"]
---

# Phase 2: Tech Stack & Infrastructure

> Choose the tech stack and set up the project skeleton. Consult the Technical Architect persona.

## Steps

### 1. Recommend a Tech Stack `[ASK]`

Consult the Tech Architect persona. Present a table:

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | [Framework] | [reason] |
| Backend/API | [Service] | [reason] |
| Database | [Service] | [reason] |
| Auth | [Provider] | [reason] |
| Hosting | [Platform] | [reason] |
| Analytics | [Tool] | [reason] |

### 2. Create the Repository `[ASK]`

Ask: org/account, repo name, public or private. Then create and initialize.

### 3. Set Up Database & Auth `[AGENT]`

Configure database, auth providers, initial schema, environment variables.

### 4. Set Up Hosting & Deployment `[AGENT]`

Connect repo to hosting, configure env vars, set up preview deployments.

### 5. Create Project Structure `[AGENT]`

Scaffold the directory structure. Copy persona files into `docs/personas/`.

## Gate

```
>>> GATE: Phase 2 -> Phase 3
    REQUIRED: Repo exists, stack deployable, auth configured, database connected, personas in project
    ASK: "Infrastructure is set up. Ready to start building features?"
```
