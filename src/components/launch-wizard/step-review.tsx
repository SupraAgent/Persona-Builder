"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  PROJECT_TYPES,
  TECH_CATEGORIES,
  generateBriefMarkdown,
  generateTeamMarkdown,
  type LaunchKitDraft,
} from "@/lib/launch-kit";

type Props = {
  draft: LaunchKitDraft;
};

export function StepReview({ draft }: Props) {
  const [creatingPersonas, setCreatingPersonas] = React.useState(false);
  const [personasCreated, setPersonasCreated] = React.useState(0);
  const [personasDone, setPersonasDone] = React.useState(false);

  const projectType = PROJECT_TYPES.find((p) => p.id === draft.projectType);

  async function exportAll() {
    const brief = generateBriefMarkdown(draft);
    const team = generateTeamMarkdown(draft);
    // Download as individual files since zip requires a library
    download(brief, `${slugify(draft.projectName)}-brief.md`, "text/markdown");
    setTimeout(() => {
      download(team, `${slugify(draft.projectName)}-team.md`, "text/markdown");
    }, 200);
  }

  async function createPersonas() {
    setCreatingPersonas(true);
    setPersonasCreated(0);
    setPersonasDone(false);

    let count = 0;
    for (const member of draft.team) {
      if (!member.role) continue;

      const systemPrompt = buildTeamMemberPrompt(member, draft);
      try {
        const res = await fetch("/api/personas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: member.role,
            role: member.company
              ? `${member.role} (modeled after ${member.company})`
              : member.role,
            system_prompt: systemPrompt,
            capabilities: ["scoring"],
            output_format: "structured_report",
            review_focus: ["general"],
            icon: inferRoleIcon(member.role),
          }),
        });
        if (res.ok) {
          count++;
          setPersonasCreated(count);
        }
      } catch {
        // continue with next
      }
    }
    setPersonasDone(true);
    setCreatingPersonas(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Review</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your project brief, team, stack, and roadmap.
        </p>
      </div>

      {/* Project Brief */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          {draft.projectName || "Untitled Project"}
        </h3>
        {projectType && (
          <span className="inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
            {projectType.label}
          </span>
        )}
        {draft.description && (
          <p className="text-sm text-muted-foreground">{draft.description}</p>
        )}
        {draft.targetUser && (
          <p className="text-xs text-muted-foreground">
            Target: {draft.targetUser}
          </p>
        )}
        {draft.platforms.length > 0 && (
          <div className="flex gap-1.5">
            {draft.platforms.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Team */}
      {draft.team.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Team</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Company
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Focus
                  </th>
                </tr>
              </thead>
              <tbody>
                {draft.team.map((t, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-2 text-foreground">{t.role}</td>
                    <td className="py-2 text-muted-foreground">
                      {t.company || "---"}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {t.focus || "---"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {draft.techChoices.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Tech Stack
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Choice
                  </th>
                </tr>
              </thead>
              <tbody>
                {draft.techChoices.map((tc) => {
                  const cat = TECH_CATEGORIES.find(
                    (c) => c.id === tc.category
                  );
                  return (
                    <tr key={tc.category} className="border-b border-white/5">
                      <td className="py-2 text-muted-foreground">
                        {cat?.label || tc.category}
                      </td>
                      <td className="py-2 text-foreground">{tc.choice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roadmap */}
      {draft.buildPhases.some((p) => p.features.length > 0) && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Build Roadmap
          </h3>
          <div className="space-y-3">
            {draft.buildPhases.map((phase, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {phase.phase}
                  </span>
                </div>
                {phase.features.length > 0 ? (
                  <ul className="ml-7 space-y-0.5">
                    {phase.features.map((f, fi) => (
                      <li
                        key={fi}
                        className="text-xs text-muted-foreground"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-7 text-xs text-muted-foreground italic">
                    No features defined
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* North Star */}
      {draft.northStar && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
          <h3 className="text-sm font-medium text-foreground">North Star</h3>
          <p className="text-sm text-muted-foreground">{draft.northStar}</p>
        </div>
      )}

      {/* Whitepaper */}
      {draft.whitepaper && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Whitepaper</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const blob = new Blob([draft.whitepaper], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${slugify(draft.projectName)}-whitepaper.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download .md
            </Button>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-4">
            {draft.whitepaper.slice(0, 300)}...
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            {draft.whitepaper.split("\n").length} lines
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={exportAll} variant="secondary">
          Export All
        </Button>

        <Button
          onClick={createPersonas}
          disabled={creatingPersonas || draft.team.length === 0}
        >
          {creatingPersonas
            ? `Creating... (${personasCreated}/${draft.team.length})`
            : personasDone
              ? `Created ${personasCreated} personas`
              : "Create Personas in SupraVibe"}
        </Button>
      </div>

      {personasDone && personasCreated > 0 && (
        <p className="text-xs text-primary">
          {personasCreated} persona{personasCreated !== 1 ? "s" : ""} saved.{" "}
          <a href="/personas" className="underline hover:text-foreground">
            View in My Personas
          </a>
        </p>
      )}
    </div>
  );
}

function buildTeamMemberPrompt(
  member: { role: string; company: string; focus: string },
  draft: LaunchKitDraft
): string {
  const parts: string[] = [];

  parts.push(`You are a ${member.role}.`);
  if (member.company) {
    parts.push(
      `Your approach is modeled after how ${member.company} operates.`
    );
  }
  if (member.focus) {
    parts.push(`Your primary focus: ${member.focus}`);
  }

  if (draft.projectName) {
    parts.push(`\nProject: ${draft.projectName}`);
  }
  if (draft.description) {
    parts.push(draft.description);
  }
  if (draft.targetUser) {
    parts.push(`Target user: ${draft.targetUser}`);
  }
  if (draft.problem) {
    parts.push(`Problem: ${draft.problem}`);
  }

  if (draft.techChoices.length > 0) {
    parts.push(
      `\nTech stack: ${draft.techChoices.map((tc) => tc.choice).join(", ")}`
    );
  }

  return parts.join("\n");
}

function inferRoleIcon(role: string): string {
  const r = role.toLowerCase();
  if (/product/.test(r)) return "\uD83D\uDCCB";
  if (/design|ux|ui/.test(r)) return "\uD83C\uDFA8";
  if (/architect|tech|engineer/.test(r)) return "\uD83D\uDD27";
  if (/growth/.test(r)) return "\uD83D\uDE80";
  if (/revenue|sales/.test(r)) return "\uD83D\uDCC8";
  if (/qa|quality|test/.test(r)) return "\uD83E\uDDEA";
  if (/content/.test(r)) return "\uD83D\uDD8A\uFE0F";
  if (/community/.test(r)) return "\uD83D\uDC65";
  if (/retention/.test(r)) return "\uD83D\uDD04";
  if (/trust|safety|security/.test(r)) return "\uD83D\uDD12";
  if (/devrel/.test(r)) return "\uD83D\uDCE3";
  if (/customer|success/.test(r)) return "\uD83E\uDD1D";
  if (/conversion/.test(r)) return "\uD83C\uDFAF";
  return "\uD83E\uDD16";
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "project"
  );
}

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
