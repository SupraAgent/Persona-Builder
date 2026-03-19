"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { generateTeamMd, generateTeamJson, generateMemberMarkdown, type PersonaTeamDraft } from "@/lib/persona-builder-v2";
import { generateSystemPrompt, inferCapabilities, inferIcon } from "@/lib/persona-builder";

type Props = {
  draft: PersonaTeamDraft;
};

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StepReview({ draft }: Props) {
  const [copied, setCopied] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(0);
  const [saveDone, setSaveDone] = React.useState(false);
  const teamMd = generateTeamMd(draft);

  function handleCopy() {
    navigator.clipboard.writeText(teamMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([teamMd], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.teamName?.replace(/\s+/g, "-").toLowerCase() || "team"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadJson() {
    const json = generateTeamJson(draft);
    const filename = `${draft.teamName?.replace(/\s+/g, "-").toLowerCase() || "team"}-team.json`;
    downloadFile(json, filename, "application/json");
  }

  function handleDownloadMember(memberIndex: number) {
    const member = draft.members[memberIndex];
    const md = generateMemberMarkdown(member, draft.teamName);
    const filename = `${member.draft.name?.replace(/\s+/g, "-").toLowerCase() || "member"}.md`;
    downloadFile(md, filename, "text/markdown");
  }

  async function saveAll() {
    setSaving(true);
    setSaved(0);
    setSaveDone(false);

    let count = 0;
    for (const member of draft.members) {
      const name = member.draft.name || member.agentRole?.title || "Team Member";
      const roleTitle = member.agentRole?.title || member.draft.title || "";
      const role = roleTitle + (member.draft.company ? ` (modeled after ${member.draft.company})` : "");
      const systemPrompt = generateSystemPrompt(member.draft);
      const capabilities = inferCapabilities(systemPrompt, roleTitle, member.draft.primaryDomain) || member.skills || ["scoring"];
      const icon = inferIcon(roleTitle, member.draft.title);

      try {
        const res = await fetch("/api/personas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            role,
            system_prompt: systemPrompt,
            capabilities,
            output_format: "structured_report",
            review_focus: ["general"],
            icon,
          }),
        });
        if (res.ok) {
          count++;
          setSaved(count);
        }
      } catch {
        // continue
      }
    }
    setSaveDone(true);
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team Review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your generated team.md — copy it into your project.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            Download
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadJson}>
            Download JSON
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="text-2xl font-bold text-foreground">{draft.members.length}</div>
          <div className="text-xs text-muted-foreground">Team Members</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="text-2xl font-bold text-foreground">
            {Math.round(draft.dynamics.consensusThreshold * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Consensus Threshold</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="text-2xl font-bold text-foreground">
            {draft.dynamics.expectedConflicts.length}
          </div>
          <div className="text-xs text-muted-foreground">Expected Conflicts</div>
        </div>
      </div>

      {/* Download Individual Members */}
      {draft.members.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Download Individual</span>
          </div>
          <div className="p-4 space-y-2">
            {draft.members.map((member, i) => (
              <div key={member.id} className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {member.draft.name || member.agentRole?.title || `Member ${i + 1}`}
                  {member.agentRole?.title && member.draft.name ? (
                    <span className="text-muted-foreground ml-2 text-xs">({member.agentRole.title})</span>
                  ) : null}
                </span>
                <Button variant="secondary" size="sm" onClick={() => handleDownloadMember(i)}>
                  Download .md
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save to Library */}
      <div className="flex items-center gap-3">
        <Button
          onClick={saveAll}
          disabled={saving || draft.members.length === 0}
        >
          {saving
            ? `Saving ${saved}/${draft.members.length}...`
            : saveDone
              ? `Saved ${saved} member${saved !== 1 ? "s" : ""}!`
              : "Save to Library"}
        </Button>
        {saveDone && saved > 0 && (
          <a
            href="/personas"
            className="text-xs text-primary underline hover:text-foreground transition"
          >
            View in My Personas
          </a>
        )}
      </div>

      {/* Markdown preview */}
      <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">team.md</span>
        </div>
        <pre className="p-4 text-xs text-muted-foreground overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre-wrap">
          {teamMd}
        </pre>
      </div>
    </div>
  );
}
