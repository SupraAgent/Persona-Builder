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

export type GrillQuestion = {
  memberId: string;
  question: string;
  response: string;
  status: "unanswered" | "answered" | "acknowledged";
};

export type PersonaTeamDraft = {
  teamName: string;
  projectContext: string;
  members: TeamMember[];
  dynamics: TeamDynamics;
  grillQuestions: GrillQuestion[];
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
  grillQuestions: [],
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

export function generateTeamJson(draft: PersonaTeamDraft): string {
  const data = {
    format: "persona-builder-team",
    version: "2.0",
    teamName: draft.teamName || "Untitled Team",
    projectContext: draft.projectContext || "",
    members: draft.members.map((m) => ({
      name: m.draft.name || "",
      role: m.agentRole?.title || m.draft.title || "",
      company: m.draft.company || "",
      communicationStyle: m.communicationStyle?.label || "",
      skills: m.skills,
      llmProvider: m.llmProvider,
      llmModel: m.llmModel,
      phaseAuthority: m.phaseAuthority,
      systemPrompt: generateSystemPrompt(m.draft),
    })),
    dynamics: {
      consensusThreshold: draft.dynamics.consensusThreshold,
      ceoTiebreakerId: draft.dynamics.ceoTiebreakerId,
      expectedConflicts: draft.dynamics.expectedConflicts.map((c) => {
        const a = draft.members.find((m) => m.id === c.betweenIds[0]);
        const b = draft.members.find((m) => m.id === c.betweenIds[1]);
        return {
          between: [a?.draft.name || "?", b?.draft.name || "?"],
          topic: c.topic,
        };
      }),
    },
    generated: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function generateMemberMarkdown(member: TeamMember, teamName: string): string {
  const name = member.draft.name || "Unnamed";
  const role = member.agentRole?.title || member.draft.title || "Agent";
  const company = member.draft.company || "—";
  const style = member.communicationStyle?.label || "—";
  const provider = member.llmProvider || "—";
  const model = member.llmModel || "—";
  const generated = new Date().toISOString();

  const lines: string[] = [];

  lines.push("---");
  lines.push(`name: ${name}`);
  lines.push(`role: ${role}`);
  lines.push(`company: ${company}`);
  lines.push(`team: ${teamName || "Untitled Team"}`);
  lines.push(`generated: ${generated}`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${name} — ${role}`);
  lines.push("");
  lines.push("## Identity");
  lines.push(`- **Company:** ${company}`);
  lines.push(`- **Communication Style:** ${style}`);
  lines.push(`- **LLM:** ${provider} / ${model}`);
  lines.push("");
  lines.push("## Skills");
  if (member.skills.length > 0) {
    member.skills.forEach((s) => lines.push(`- ${s}`));
  } else {
    lines.push("- (none specified)");
  }
  lines.push("");
  lines.push("## Phase Authority");
  if (member.phaseAuthority.length > 0) {
    member.phaseAuthority.forEach((p) => {
      lines.push(`- ${PHASE_LABELS[p] || `Phase ${p}`}`);
    });
  } else {
    lines.push("- (none assigned)");
  }
  lines.push("");
  lines.push("## System Prompt");
  lines.push("");
  lines.push("```");
  lines.push(generateSystemPrompt(member.draft));
  lines.push("```");

  return lines.join("\n");
}

export { AGENT_ROLES, COMMUNICATION_STYLES, AGENT_SKILLS, LLM_PROVIDERS };
