"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  generateAgentNorthStar,
  agentPersonaToSupabase,
  AGENT_SKILLS,
  LLM_PROVIDERS,
  type AgentPersona,
} from "@/lib/agent-personas";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
};

export function StepReview({ persona, onChange, onSave, saving, saved }: Props) {
  const roleName = persona.role?.title ?? persona.customRole ?? "No role selected";
  const provider = LLM_PROVIDERS.find((p) => p.id === persona.llmProvider);
  const model = provider?.models.find((m) => m.id === persona.llmModel);
  const selectedSkills = AGENT_SKILLS.filter((s) =>
    persona.skills.includes(s.id)
  );
  const payload = agentPersonaToSupabase(persona);

  function handleGenerateNorthStar() {
    const ns = generateAgentNorthStar(persona);
    onChange({ northStar: ns });
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(persona.displayName || roleName).toLowerCase().replace(/\s+/g, "-")}-persona.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Review & Finalize
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your agent persona, generate the North Star, and save.
        </p>
      </div>

      {/* Display name */}
      <div>
        <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted-foreground">
          Display Name
        </label>
        <Input
          value={persona.displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
          placeholder={roleName}
        />
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Summary
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Role: </span>
            <span className="text-foreground">{roleName}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Visibility: </span>
            <span className="text-foreground capitalize">
              {persona.visibility}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Style: </span>
            <span className="text-foreground">
              {persona.communicationStyle?.label ?? "Not set"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Model: </span>
            <span className="text-foreground">
              {model?.label ?? "Not set"}
            </span>
          </div>
        </div>

        {persona.focusArea && (
          <div className="text-sm">
            <span className="text-muted-foreground">Focus: </span>
            <span className="text-foreground">{persona.focusArea}</span>
          </div>
        )}

        {persona.inspirations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {persona.inspirations.map((ins) => (
              <Badge key={ins}>{ins}</Badge>
            ))}
          </div>
        )}

        {persona.principles.filter(Boolean).length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Principles:</p>
            <ul className="space-y-0.5">
              {persona.principles.filter(Boolean).map((p, i) => (
                <li key={i} className="text-xs text-foreground">
                  {i + 1}. {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedSkills.map((skill) => (
              <Badge key={skill.id}>{skill.label}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* North Star */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
            North Star
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateNorthStar}
            className="text-xs"
          >
            Generate
          </Button>
        </div>
        <Textarea
          value={persona.northStar}
          onChange={(e) => onChange({ northStar: e.target.value })}
          placeholder="Click Generate to create a North Star directive, or write your own..."
          className="min-h-[80px]"
        />
      </div>

      {/* System prompt preview */}
      <div>
        <p className="mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
          System Prompt Preview
        </p>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <pre className="whitespace-pre-wrap text-xs text-muted-foreground font-mono leading-relaxed">
            {payload.system_prompt || "Complete the steps above to generate a system prompt."}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={saving || saved}>
          {saving ? "Saving..." : saved ? "Saved" : "Save Persona"}
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          Export JSON
        </Button>
      </div>
    </div>
  );
}
