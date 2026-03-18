# Persona Pre-Flight Checklist

> Run this checklist before leaving Phase 1 (Assemble the Persona Team).
> Every item must pass before proceeding to Phase 2 (Tech Stack & Infrastructure).

---

## 1. Role Coverage

Check that every required role has a persona assigned:

- [ ] **Product Lead** — persona file exists in `docs/personas/`
- [ ] **Technical Architect** — persona file exists in `docs/personas/`
- [ ] **UI/UX Lead** — persona file exists in `docs/personas/`
- [ ] **[Additional Role 1]** — persona file exists (role depends on project type)
- [ ] **[Additional Role 2]** — persona file exists (role depends on project type)

**If any role is missing:** STOP. Ask the user whether to create a new persona or pull one from SupraVibe.

---

## 2. Profile Completeness

For EACH persona file, verify all sections are filled in (not placeholder text):

- [ ] **Core Identity** — Name, Title, Company, Years of Experience, Background Summary
- [ ] **Expertise & Skills** — Primary Domain, Secondary Skills, Signature Methodology, Tools & Frameworks
- [ ] **Strategic Mindset** — Core Beliefs (3-5), What They Optimize For, What They Push Back On, Decision-Making Style
- [ ] **Perspective on This Project** — How They'd Approach This Build, Key Questions (5), Red Flags (3+), Success Metrics (3+)
- [ ] **Consultation Prompt** — Ready-to-use prompt block at the bottom of the file

**If any section has placeholder text (e.g., "[Skill 1]"):** Fill it in before proceeding.

---

## 3. Team Manifest

- [ ] `team.md` exists in the project root
- [ ] Roster table includes ALL personas with links to profile files
- [ ] Quick reference guide maps decision types to personas
- [ ] Team dynamics section describes key tension pairs and resolution guidance
- [ ] Phase-based priority is documented (who leads in which phase)

---

## 4. User Approval

- [ ] User has reviewed and approved each individual persona
- [ ] User has confirmed the full team roster

---

## Result

| Status | Action |
|--------|--------|
| All items pass | Proceed to Phase 2 (Tech Stack & Infrastructure) |
| Any item fails | Fix the issue, then re-run this checklist |
| Role is missing | Ask the user: create new persona or pull from SupraVibe? |
| Profile is incomplete | Fill in missing sections before proceeding |
| User hasn't approved | Present the team and get explicit approval |
