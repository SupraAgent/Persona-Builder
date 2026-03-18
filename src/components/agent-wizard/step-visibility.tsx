"use client";

import {
  VISIBILITY_OPTIONS,
  type AgentPersona,
  type AgentVisibility,
} from "@/lib/agent-personas";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

export function StepVisibility({ persona, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Who can see and use this agent persona?
        </p>
      </div>

      <div className="grid gap-3">
        {VISIBILITY_OPTIONS.map((opt) => {
          const isSelected = persona.visibility === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ visibility: opt.id as AgentVisibility })}
              className={`rounded-xl border p-5 text-left transition cursor-pointer ${
                isSelected
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {opt.id === "personal" ? "\uD83D\uDD12" : "\uD83C\uDFE2"}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {opt.label}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {opt.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
