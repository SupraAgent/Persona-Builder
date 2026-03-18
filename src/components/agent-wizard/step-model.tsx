"use client";

import { Badge } from "@/components/ui/badge";
import { LLM_PROVIDERS, type AgentPersona } from "@/lib/agent-personas";
import * as React from "react";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

export function StepModel({ persona, onChange }: Props) {
  const selectedProvider = LLM_PROVIDERS.find(
    (p) => p.id === persona.llmProvider
  );

  function selectProvider(providerId: string) {
    const provider = LLM_PROVIDERS.find((p) => p.id === providerId);
    if (provider) {
      onChange({
        llmProvider: providerId,
        llmModel: provider.models[0]?.id ?? "",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">LLM Provider</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Which model powers this agent?
        </p>
      </div>

      {/* Provider grid */}
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          Provider
        </p>
        <div className="grid grid-cols-3 gap-2">
          {LLM_PROVIDERS.map((provider) => {
            const isSelected = persona.llmProvider === provider.id;
            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => selectProvider(provider.id)}
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/15"
                }`}
              >
                <div className="text-sm font-medium text-foreground">
                  {provider.label}
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">
                  {provider.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model selection */}
      {selectedProvider && (
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            Model
          </p>
          <div className="grid gap-2">
            {selectedProvider.models.map((model) => {
              const isSelected = persona.llmModel === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onChange({ llmModel: model.id })}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition cursor-pointer ${
                    isSelected
                      ? "border-primary/60 bg-primary/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/15"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">
                    {model.label}
                  </span>
                  <Badge>{model.context} context</Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
