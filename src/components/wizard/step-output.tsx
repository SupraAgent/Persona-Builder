"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { DynamicList } from "@/components/ui/dynamic-list";
import { Button } from "@/components/ui/button";
import { PromptPreview } from "@/components/wizard/prompt-preview";
import {
  OUTPUT_FORMATS,
  generateSystemPrompt,
  draftToExportJson,
  draftToMarkdown,
  type PersonaDraft,
  type PersonaOutputFormat,
} from "@/lib/persona-builder";

type Props = {
  draft: PersonaDraft;
  onChange: (patch: Partial<PersonaDraft>) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
};

export function StepOutput({ draft, onChange, onSave, saving, saved }: Props) {
  const [exportOpen, setExportOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const prompt = generateSystemPrompt(draft);

  function downloadJson() {
    const json = JSON.stringify(draftToExportJson(draft), null, 2);
    download(json, `${slugify(draft.name)}.json`, "application/json");
    setExportOpen(false);
  }

  function downloadMarkdown() {
    const md = draftToMarkdown(draft);
    download(md, `${slugify(draft.name)}.md`, "text/markdown");
    setExportOpen(false);
  }

  function copyPrompt() {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setExportOpen(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Project Perspective & Output</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How would this persona approach your project? Review the generated system prompt below.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">How They&apos;d Approach This Build</label>
          <Textarea
            value={draft.approach}
            onChange={(e) => onChange({ approach: e.target.value })}
            placeholder="What would they prioritize first? How would they structure the work?"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Key Questions They&apos;d Ask</label>
          <DynamicList
            value={draft.keyQuestions.length > 0 ? draft.keyQuestions : [""]}
            onChange={(keyQuestions) => onChange({ keyQuestions: keyQuestions.filter(Boolean) })}
            placeholder="e.g. What's the target audience's current behavior?"
            addLabel="Add question"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Red Flags to Watch For</label>
          <DynamicList
            value={draft.redFlags.length > 0 ? draft.redFlags : [""]}
            onChange={(redFlags) => onChange({ redFlags: redFlags.filter(Boolean) })}
            placeholder="e.g. Building without user research"
            addLabel="Add red flag"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Success Metrics</label>
          <DynamicList
            value={draft.successMetrics.length > 0 ? draft.successMetrics : [""]}
            onChange={(successMetrics) => onChange({ successMetrics: successMetrics.filter(Boolean) })}
            placeholder="e.g. Week 1 retention > 60%"
            addLabel="Add metric"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Output Format</label>
          <div className="grid grid-cols-2 gap-2">
            {OUTPUT_FORMATS.map((fmt) => (
              <button
                key={fmt.value}
                type="button"
                onClick={() => onChange({ outputFormat: fmt.value as PersonaOutputFormat })}
                className={`rounded-lg border p-3 text-left transition cursor-pointer ${
                  draft.outputFormat === fmt.value
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="text-sm font-medium text-foreground">{fmt.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{fmt.description}</div>
              </button>
            ))}
          </div>
        </div>

        <PromptPreview prompt={prompt} />

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={onSave} disabled={saving || !draft.name}>
            {saving ? "Saving..." : saved ? "Saved!" : "Save to SupraVibe"}
          </Button>

          <div className="relative">
            <Button variant="secondary" onClick={() => setExportOpen(!exportOpen)}>
              Export
            </Button>
            {exportOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg border border-white/10 bg-card p-1 shadow-lg">
                <button
                  onClick={downloadJson}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-white/5 cursor-pointer"
                >
                  Download JSON
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-white/5 cursor-pointer"
                >
                  Download Markdown
                </button>
                <button
                  onClick={copyPrompt}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-white/5 cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy System Prompt"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "persona";
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
