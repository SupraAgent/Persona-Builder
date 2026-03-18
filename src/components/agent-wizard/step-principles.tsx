"use client";

import { DynamicList } from "@/components/ui/dynamic-list";
import type { AgentPersona } from "@/lib/agent-personas";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

export function StepPrinciples({ persona, onChange }: Props) {
  // Ensure at least one empty item so the list is never blank
  const items =
    persona.principles.length > 0 ? persona.principles : [""];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Core Principles
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What beliefs guide this agent's decisions? Aim for 3-5.
        </p>
      </div>

      <DynamicList
        value={items}
        onChange={(v) => onChange({ principles: v })}
        placeholder="e.g. Ship fast, fix forward"
        addLabel="Add principle"
      />

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          Examples
        </p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>Simplicity over completeness</li>
          <li>Measure everything, assume nothing</li>
          <li>User value trumps technical elegance</li>
          <li>Document decisions, not just outcomes</li>
          <li>Small PRs, fast feedback loops</li>
        </ul>
      </div>
    </div>
  );
}
