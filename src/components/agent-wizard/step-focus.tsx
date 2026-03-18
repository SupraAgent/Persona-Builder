"use client";

import { Textarea } from "@/components/ui/textarea";
import type { AgentPersona } from "@/lib/agent-personas";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

export function StepFocus({ persona, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Focus Area</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What does this agent specifically optimize for? Be concrete.
        </p>
      </div>

      <Textarea
        value={persona.focusArea}
        onChange={(e) => onChange({ focusArea: e.target.value })}
        placeholder={`Examples:\n- Reduce time-to-first-deploy for new engineers\n- Maximize test coverage while minimizing flaky tests\n- Increase MRR through pricing experiments and churn reduction\n- Ship accessible, performant UI components`}
        className="min-h-[160px]"
      />

      <p className="text-xs text-muted-foreground">
        This becomes the core directive in the agent's system prompt. Specific is
        better than broad.
      </p>
    </div>
  );
}
