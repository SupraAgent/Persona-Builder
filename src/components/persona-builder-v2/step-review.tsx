"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { generateTeamMd, type PersonaTeamDraft } from "@/lib/persona-builder-v2";

type Props = {
  draft: PersonaTeamDraft;
};

export function StepReview({ draft }: Props) {
  const [copied, setCopied] = React.useState(false);
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
