/** Persona Builder v2 — Team-oriented persona creation with orchestration */

import type { PersonaDraft } from "./persona-builder";
import { EMPTY_DRAFT, generateSystemPrompt, inferIcon } from "./persona-builder";
import type { AgentRole, CommunicationStyle, AgentSkill } from "./agent-personas";
import { AGENT_ROLES, COMMUNICATION_STYLES, AGENT_SKILLS, LLM_PROVIDERS } from "./agent-personas";

export type TeamMember = {
  id: string;
  draft: PersonaDraft;
  agentRole: AgentRole | null;
  communicationStyle: CommunicationStyle | null;
  skills: string[];
  llmProvider: string;
  llmModel: string;
  phaseAuthority: number[]; // which phases (0-5) this persona leads
  conflictsWithIds: string[]; // IDs of team members they commonly disagree with
};

export type TeamDynamics = {
  expectedConflicts: { betweenIds: [string, string]; topic: string }[];
  consensusThreshold: number; // default 0.67
  ceoTiebreakerId: string | null;
};

export type PersonaTeamDraft = {
  teamName: string;
  projectContext: string;
  members: TeamMember[];
  dynamics: TeamDynamics;
};

export const EMPTY_TEAM_DRAFT: PersonaTeamDraft = {
  teamName: "",
  projectContext: "",
  members: [],
  dynamics: {
    expectedConflicts: [],
    consensusThreshold: 0.67,
    ceoTiebreakerId: null,
  },
};

let memberCounter = 0;
export function createTeamMember(): TeamMember {
  memberCounter++;
  return {
    id: `member-${Date.now()}-${memberCounter}`,
    draft: { ...EMPTY_DRAFT },
    agentRole: null,
    communicationStyle: null,
    skills: [],
    llmProvider: "anthropic",
    llmModel: "claude-sonnet-4-6",
    phaseAuthority: [],
    conflictsWithIds: [],
  };
}

export const PHASE_LABELS = [
  "Phase 0: Project Brief",
  "Phase 1: Personas",
  "Phase 2: Tech Stack",
  "Phase 3: Development",
  "Phase 4: Pre-Launch",
  "Phase 5: Post-Launch",
];

export const SUGGESTED_TEAM_SIZES: { id: string; label: string; description: string; roles: string[] }[] = [
  {
    id: "starter",
    label: "Starter (3)",
    description: "Product Lead, Tech Architect, UI/UX Lead",
    roles: ["cpo", "cto", "cdo"],
  },
  {
    id: "growth",
    label: "Growth (5)",
    description: "Add Retention Lead + Growth Lead",
    roles: ["cpo", "cto", "cdo", "retention", "growth_lead"],
  },
  {
    id: "full",
    label: "Full Team (7)",
    description: "Add Revenue Lead + QA Lead",
    roles: ["ceo", "cpo", "cto", "cdo", "retention", "growth_lead", "cro"],
  },
];

export function generateTeamMd(team: PersonaTeamDraft): string {
  const lines: string[] = [];
  lines.push(`# Team: ${team.teamName || "Untitled Team"}`);
  lines.push("");
  if (team.projectContext) {
    lines.push(`> ${team.projectContext}`);
    lines.push("");
  }

  lines.push("## Roster\n");
  lines.push("| # | Role | Name | Company | Style | LLM |");
  lines.push("|---|------|------|---------|-------|-----|");
  team.members.forEach((m, i) => {
    const role = m.agentRole?.title || m.draft.title || "—";
    const name = m.draft.name || "—";
    const company = m.draft.company || "—";
    const style = m.communicationStyle?.label || "—";
    const llm = m.llmModel || "—";
    lines.push(`| ${i + 1} | ${role} | ${name} | ${company} | ${style} | ${llm} |`);
  });
  lines.push("");

  // Phase authority
  lines.push("## Phase Authority\n");
  lines.push("| Phase | Lead |");
  lines.push("|-------|------|");
  PHASE_LABELS.forEach((label, pi) => {
    const lead = team.members.find((m) => m.phaseAuthority.includes(pi));
    lines.push(`| ${label} | ${lead ? (lead.draft.name || lead.agentRole?.title || "—") : "Unassigned"} |`);
  });
  lines.push("");

  // Dynamics
  if (team.dynamics.expectedConflicts.length > 0) {
    lines.push("## Expected Conflicts\n");
    team.dynamics.expectedConflicts.forEach((c) => {
      const a = team.members.find((m) => m.id === c.betweenIds[0]);
      const b = team.members.find((m) => m.id === c.betweenIds[1]);
      lines.push(`- **${a?.draft.name || "?"}** vs **${b?.draft.name || "?"}**: ${c.topic}`);
    });
    lines.push("");
  }

  // Tiebreaker
  const ceo = team.members.find((m) => m.id === team.dynamics.ceoTiebreakerId);
  if (ceo) {
    lines.push(`## CEO Tiebreaker: ${ceo.draft.name || ceo.agentRole?.title || "—"}\n`);
  }

  lines.push(`## Consensus Threshold: ${Math.round(team.dynamics.consensusThreshold * 100)}%\n`);

  // Individual persona prompts
  lines.push("---\n");
  lines.push("## Persona Consultation Prompts\n");
  team.members.forEach((m) => {
    const role = m.agentRole?.title || m.draft.title || "Agent";
    lines.push(`### ${m.draft.name || role}`);
    lines.push("```");
    lines.push(generateSystemPrompt(m.draft));
    lines.push("```");
    lines.push("");
  });

  return lines.join("\n");
}

export { AGENT_ROLES, COMMUNICATION_STYLES, AGENT_SKILLS, LLM_PROVIDERS };
