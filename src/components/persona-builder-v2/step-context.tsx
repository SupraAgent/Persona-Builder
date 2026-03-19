"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PersonaTeamDraft } from "@/lib/persona-builder-v2";

type Props = {
  draft: PersonaTeamDraft;
  onChange: (patch: Partial<PersonaTeamDraft>) => void;
};

export function StepContext({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Team Context</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Name your persona team and describe the project they will guide.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Team Name
          </label>
          <Input
            value={draft.teamName}
            onChange={(e) => onChange({ teamName: e.target.value })}
            placeholder="e.g. SupraVibe Core Team"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Project Context
          </label>
          <Textarea
            value={draft.projectContext}
            onChange={(e) => onChange({ projectContext: e.target.value })}
            placeholder="What are you building? Who is it for? 2-3 sentences describing the project so personas can give relevant guidance."
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
}
