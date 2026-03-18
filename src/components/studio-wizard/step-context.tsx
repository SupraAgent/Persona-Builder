"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { StudioDraft } from "@/lib/studio";

type Props = {
  draft: StudioDraft;
  onChange: (patch: Partial<StudioDraft>) => void;
};

export function StepContext({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Project Context</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Just enough context to generate useful advisor prompts. Keep it short.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Project Name
          </label>
          <Input
            value={draft.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            placeholder="e.g. SupraVibe"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            What does it do?
          </label>
          <Textarea
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="One sentence. e.g. A marketplace for AI-generated art."
            rows={2}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Who is it for?
          </label>
          <Input
            value={draft.targetUser}
            onChange={(e) => onChange({ targetUser: e.target.value })}
            placeholder="e.g. Indie game developers who need concept art fast"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            What problem does it solve?
          </label>
          <Textarea
            value={draft.problem}
            onChange={(e) => onChange({ problem: e.target.value })}
            placeholder="e.g. Concept art takes weeks and costs thousands — most indie devs can't afford it."
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
