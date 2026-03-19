"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { generateVibeCodeClaudeMd, generateScaffoldCommand, type VibeCodeDraft } from "@/lib/vibecode";

type Props = {
  draft: VibeCodeDraft;
};

export function StepOutput({ draft }: Props) {
  const [copiedMd, setCopiedMd] = React.useState(false);
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  const claudeMd = generateVibeCodeClaudeMd(draft);
  const scaffoldCmd = generateScaffoldCommand(draft);

  function copyMd() {
    navigator.clipboard.writeText(claudeMd);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  }

  function copyCmd() {
    navigator.clipboard.writeText(scaffoldCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  }

  function downloadMd() {
    const blob = new Blob([claudeMd], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CLAUDE.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">VibeCode Output</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your scaffold command and CLAUDE.md are ready.
        </p>
      </div>

      {/* Scaffold command */}
      {scaffoldCmd && (
        <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Scaffold Command</span>
            <Button variant="ghost" size="sm" onClick={copyCmd} className="text-xs h-7 px-2">
              {copiedCmd ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="p-4 text-sm text-primary font-mono overflow-x-auto">
            {scaffoldCmd}
          </pre>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="text-sm font-bold text-foreground">{draft.framework?.label || "—"}</div>
          <div className="text-xs text-muted-foreground">Framework</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="text-sm font-bold text-foreground">{draft.style?.label || "—"}</div>
          <div className="text-xs text-muted-foreground">Vibe</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="text-2xl font-bold text-foreground">{draft.features.length}</div>
          <div className="text-xs text-muted-foreground">Features</div>
        </div>
      </div>

      {/* CLAUDE.md preview */}
      <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary/60" />
            <span className="text-xs font-medium text-muted-foreground">CLAUDE.md</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyMd} className="text-xs h-7 px-2">
              {copiedMd ? "Copied!" : "Copy"}
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadMd} className="text-xs h-7 px-2">
              Download
            </Button>
          </div>
        </div>
        <pre className="p-4 text-xs text-muted-foreground overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre-wrap">
          {claudeMd}
        </pre>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Next Steps</h3>
        <ol className="space-y-1.5 text-xs text-muted-foreground">
          <li>1. Run the scaffold command above to create your project</li>
          <li>2. Drop the CLAUDE.md file into your project root</li>
          <li>3. Open Claude Code and start building with your vibe</li>
          {draft.usePersonaTeam && (
            <li>4. Your persona team is embedded — Claude will consult them at every decision</li>
          )}
        </ol>
      </div>
    </div>
  );
}
