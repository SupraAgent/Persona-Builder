"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  VIBECODE_FRAMEWORKS,
  VIBECODE_STYLES,
  type VibeCodeDraft,
  type VibeCodeFramework,
  type VibeCodeStyle,
} from "@/lib/vibecode";

type Props = {
  draft: VibeCodeDraft;
  onChange: (patch: Partial<VibeCodeDraft>) => void;
};

export function StepSetup({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Project Setup</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a framework and coding vibe for your project.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Project Name</label>
          <Input
            value={draft.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            placeholder="e.g. my-awesome-app"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
          <Textarea
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="What are you building? One-liner is fine."
            className="min-h-[60px]"
          />
        </div>

        {/* Framework */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Framework</label>
          <div className="grid grid-cols-2 gap-2">
            {VIBECODE_FRAMEWORKS.map((fw) => (
              <button
                key={fw.id}
                type="button"
                onClick={() => onChange({ framework: fw })}
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  draft.framework?.id === fw.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="text-sm font-medium text-foreground">{fw.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{fw.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Coding Vibe</label>
          <div className="grid grid-cols-2 gap-2">
            {VIBECODE_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ style })}
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  draft.style?.id === style.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="text-sm font-medium text-foreground">{style.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{style.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
