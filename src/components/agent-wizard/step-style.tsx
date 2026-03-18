"use client";

import { COMMUNICATION_STYLES, type AgentPersona } from "@/lib/agent-personas";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

export function StepStyle({ persona, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Communication Style
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How does this agent think and communicate?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {COMMUNICATION_STYLES.map((style) => {
          const isSelected = persona.communicationStyle?.id === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange({ communicationStyle: style })}
              className={`rounded-xl border p-4 text-left transition cursor-pointer ${
                isSelected
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <div className="text-sm font-medium text-foreground">
                {style.label}
              </div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {style.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
