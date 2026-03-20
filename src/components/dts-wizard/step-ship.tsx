"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  generateDesignSystem,
  generateScreenSpecs,
  generateImplementationDocs,
  slugify,
  type DesignToShipDraft,
} from "@/lib/design-to-ship";

type Props = {
  draft: DesignToShipDraft;
};

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StepShip({ draft }: Props) {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const slug = slugify(draft.projectName);
  const designSystem = draft.designSystem || generateDesignSystem(draft);
  const screenSpecs = generateScreenSpecs(draft);
  const implDocs = generateImplementationDocs(draft);

  const artifacts = [
    { label: "Design System", filename: `${slug}-design-system.md`, content: designSystem },
    { label: "Screen Specs", filename: `${slug}-screens.md`, content: screenSpecs },
    { label: "Implementation Guide", filename: `${slug}-implementation.md`, content: implDocs },
  ];

  function copyToClipboard(content: string, index: number) {
    navigator.clipboard.writeText(content);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function downloadAll() {
    artifacts.forEach((a) => download(a.content, a.filename));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Ship</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Export your design artifacts and implementation guides.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">{draft.personas.length}</div>
            <div className="text-xs text-muted-foreground">Personas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{draft.screens.length}</div>
            <div className="text-xs text-muted-foreground">Screens</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{artifacts.length}</div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </div>
        </div>
      </div>

      {/* Artifact Cards */}
      <div className="space-y-3">
        {artifacts.map((artifact, i) => (
          <div
            key={artifact.label}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground text-sm">{artifact.label}</div>
                <div className="text-xs text-muted-foreground">{artifact.filename}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(artifact.content, i)}
                >
                  {copiedIdx === i ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => download(artifact.content, artifact.filename)}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Download All */}
      <Button onClick={downloadAll}>Download All Artifacts</Button>
    </div>
  );
}
