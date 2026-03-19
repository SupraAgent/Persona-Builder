"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { generateClaudeMd, type LaunchKitV2Draft } from "@/lib/launch-kit-v2";

type Props = {
  draft: LaunchKitV2Draft;
  onChange: (patch: Partial<LaunchKitV2Draft>) => void;
};

export function StepClaudeMd({ draft, onChange }: Props) {
  const [copied, setCopied] = React.useState(false);
  const claudeMd = generateClaudeMd(draft);

  React.useEffect(() => {
    onChange({ claudeMdTemplate: claudeMd });
  }, [claudeMd]);

  function handleCopy() {
    navigator.clipboard.writeText(claudeMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">CLAUDE.md</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated agent instructions for your project. Drop this into your repo root.
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

      {/* Preview */}
      <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary/60" />
          <span className="text-xs font-medium text-muted-foreground">CLAUDE.md</span>
        </div>
        <pre className="p-4 text-xs text-muted-foreground overflow-x-auto max-h-[450px] overflow-y-auto whitespace-pre-wrap">
          {claudeMd}
        </pre>
      </div>

      {/* VibeCode ready toggle */}
      <button
        type="button"
        onClick={() => onChange({ vibeCodeReady: !draft.vibeCodeReady })}
        className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 transition cursor-pointer hover:border-white/20"
      >
        <div className="text-left">
          <div className="text-sm font-medium text-foreground">VibeCode Ready</div>
          <div className="text-xs text-muted-foreground">
            Mark this project as ready for VibeCode scaffold generation
          </div>
        </div>
        <div
          className={`h-5 w-9 rounded-full transition-colors ${
            draft.vibeCodeReady ? "bg-primary" : "bg-white/10"
          } relative`}
        >
          <div
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              draft.vibeCodeReady ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
