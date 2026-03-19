"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type DesignToShipDraft,
  ATMOSPHERE_PRESETS,
  PROJECT_TYPES,
} from "@/lib/design-to-ship";

type Props = {
  draft: DesignToShipDraft;
  onChange: (patch: Partial<DesignToShipDraft>) => void;
};

export function StepBrief({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Project Brief</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What are you building? This drives persona selection and design direction.
        </p>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Project Name</label>
        <Input
          value={draft.projectName}
          onChange={(e) => onChange({ projectName: e.target.value })}
          placeholder="e.g. Oakwood Furniture"
        />
      </div>

      {/* Project Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Project Type</label>
        <div className="grid grid-cols-2 gap-2">
          {PROJECT_TYPES.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => onChange({ projectType: pt.id })}
              className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                draft.projectType === pt.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-sm font-medium">{pt.label}</span>
              <span className="mt-0.5 block text-xs opacity-70">{pt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <Textarea
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe what you're building in 2-3 sentences..."
          className="min-h-[80px]"
        />
      </div>

      {/* Target User */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Target User</label>
        <Input
          value={draft.targetUser}
          onChange={(e) => onChange({ targetUser: e.target.value })}
          placeholder="e.g. Indie founders building their first SaaS product"
        />
      </div>

      {/* Atmosphere */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Design Atmosphere</label>
        <p className="text-xs text-muted-foreground">
          Sets the visual mood for your design system and screens.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ATMOSPHERE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ atmosphere: preset.id })}
              className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                draft.atmosphere === preset.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-sm font-medium">{preset.label}</span>
              <span className="mt-0.5 block text-xs opacity-70">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reference URL (optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Reference URL <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          value={draft.referenceUrl}
          onChange={(e) => onChange({ referenceUrl: e.target.value })}
          placeholder="https://example.com — a site whose design you admire"
        />
      </div>
    </div>
  );
}
