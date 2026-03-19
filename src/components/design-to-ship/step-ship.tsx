"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  type DesignToShipDraft,
  EXPORT_FORMATS,
  DEPLOY_OPTIONS,
  TECH_CATEGORIES,
  generateDesignMd,
  generateExportBundle,
} from "@/lib/design-to-ship";

type Props = {
  draft: DesignToShipDraft;
  onChange: (patch: Partial<DesignToShipDraft>) => void;
};

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StepShip({ draft, onChange }: Props) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const approvedScreens = draft.screens.filter((s) => s.personaReviewed).length;
  const totalScreens = draft.screens.length;

  function copyToClipboard(key: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function downloadAll() {
    const bundle = generateExportBundle(draft);
    const entries = Object.entries(bundle);
    entries.forEach(([filename, content], i) => {
      setTimeout(() => download(filename, content), i * 200);
    });
  }

  const designMd = generateDesignMd(draft);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Ship</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Export your design system, screens, and project config. Ready to code.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Project Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Project:</span>{" "}
            <span className="text-foreground">{draft.projectName || "Untitled"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Personas:</span>{" "}
            <span className="text-foreground">{draft.team.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Colors:</span>{" "}
            <span className="text-foreground">{draft.colors.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Screens:</span>{" "}
            <span className="text-foreground">
              {approvedScreens}/{totalScreens} approved
            </span>
          </div>
        </div>

        {/* Color swatches */}
        {draft.colors.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {draft.colors.map((c, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-md border border-white/10"
                style={{ backgroundColor: c.hex }}
                title={`${c.name} (${c.hex})`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Export Format */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Export Format</label>
        <div className="grid grid-cols-3 gap-2">
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() =>
                onChange({
                  shipConfig: { ...draft.shipConfig, exportFormat: fmt.id },
                })
              }
              className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                draft.shipConfig.exportFormat === fmt.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
              }`}
            >
              <span className="text-sm font-medium">{fmt.label}</span>
              <span className="mt-0.5 block text-xs opacity-70">{fmt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Deploy Target */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Deploy Target</label>
        <div className="grid grid-cols-2 gap-2">
          {DEPLOY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onChange({
                  shipConfig: { ...draft.shipConfig, deployTarget: opt.id },
                })
              }
              className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                draft.shipConfig.deployTarget === opt.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
              }`}
            >
              <span className="text-sm font-medium">{opt.label}</span>
              <span className="mt-0.5 block text-xs opacity-70">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Include Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Include in Export</label>
        <div className="space-y-2">
          {[
            { key: "includeDesignMd" as const, label: "DESIGN.md", desc: "Agent-readable design system" },
            { key: "includeClaudeMd" as const, label: "CLAUDE.md", desc: "Agent instructions with persona rules" },
            { key: "includePersonas" as const, label: "Persona team", desc: "Team manifest and consultation triggers" },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.shipConfig[opt.key]}
                onChange={(e) =>
                  onChange({
                    shipConfig: { ...draft.shipConfig, [opt.key]: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-primary"
              />
              <div>
                <span className="text-sm text-foreground">{opt.label}</span>
                <span className="ml-2 text-xs text-muted-foreground">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tech Stack</label>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <table className="w-full text-sm">
            <tbody>
              {draft.techChoices.map((tc) => {
                const cat = TECH_CATEGORIES.find((c) => c.id === tc.category);
                return (
                  <tr key={tc.category} className="border-b border-white/5 last:border-0">
                    <td className="py-1.5 text-muted-foreground">{cat?.label || tc.category}</td>
                    <td className="py-1.5 text-foreground text-right">{tc.choice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <Button onClick={() => download("DESIGN.md", designMd)} variant="secondary">
            Download DESIGN.md
          </Button>
          <Button
            onClick={() => copyToClipboard("design", designMd)}
            variant="ghost"
          >
            {copied === "design" ? "\u2713 Copied" : "Copy DESIGN.md"}
          </Button>
        </div>
        <Button onClick={downloadAll} className="w-full">
          Export All Files
        </Button>
      </div>

      {/* DESIGN.md Preview */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">DESIGN.md Preview</h3>
        <pre className="text-xs text-muted-foreground overflow-auto max-h-64 whitespace-pre-wrap">
          {designMd}
        </pre>
      </div>
    </div>
  );
}
