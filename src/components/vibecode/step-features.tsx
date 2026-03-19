"use client";

import { Textarea } from "@/components/ui/textarea";
import { DynamicList } from "@/components/ui/dynamic-list";
import type { VibeCodeDraft } from "@/lib/vibecode";

type Props = {
  draft: VibeCodeDraft;
  onChange: (patch: Partial<VibeCodeDraft>) => void;
};

export function StepFeatures({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Features & Instructions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          List what the agent should build and any extra instructions.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Features to Build</label>
          <DynamicList
            value={draft.features.length > 0 ? draft.features : [""]}
            onChange={(features) => onChange({ features: features.filter(Boolean) })}
            placeholder="e.g. User auth with email/password"
            addLabel="Add feature"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Extra Instructions
          </label>
          <Textarea
            value={draft.extraInstructions}
            onChange={(e) => onChange({ extraInstructions: e.target.value })}
            placeholder="Any additional rules, constraints, or preferences for the agent..."
            className="min-h-[100px]"
          />
        </div>

        {/* Persona team toggle */}
        <button
          type="button"
          onClick={() => onChange({ usePersonaTeam: !draft.usePersonaTeam })}
          className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 transition cursor-pointer hover:border-white/20"
        >
          <div className="text-left">
            <div className="text-sm font-medium text-foreground">Include Persona Team</div>
            <div className="text-xs text-muted-foreground">
              Embed your team.md personas into the CLAUDE.md
            </div>
          </div>
          <div
            className={`h-5 w-9 rounded-full transition-colors ${
              draft.usePersonaTeam ? "bg-primary" : "bg-white/10"
            } relative`}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                draft.usePersonaTeam ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>

        {draft.usePersonaTeam && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Paste team.md content
            </label>
            <Textarea
              value={draft.personaTeamMd}
              onChange={(e) => onChange({ personaTeamMd: e.target.value })}
              placeholder="Paste your team.md content here (generated from Persona Builder 2)..."
              className="min-h-[120px] font-mono text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}
