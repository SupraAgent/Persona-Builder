"use client";

import {
  ORCHESTRATOR_MODELS,
  type LaunchKitV2Draft,
  type AgentOrchestratorConfig,
} from "@/lib/launch-kit-v2";

type Props = {
  draft: LaunchKitV2Draft;
  onChange: (patch: Partial<LaunchKitV2Draft>) => void;
};

export function StepOrchestrator({ draft, onChange }: Props) {
  function patchOrch(patch: Partial<AgentOrchestratorConfig>) {
    onChange({ orchestrator: { ...draft.orchestrator, ...patch } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Agent Orchestration</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure how your AI agent team coordinates during development.
        </p>
      </div>

      <div className="space-y-5">
        {/* Orchestrator Model */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Orchestrator Model
          </label>
          <div className="space-y-2">
            {ORCHESTRATOR_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => patchOrch({ orchestratorModel: model.id })}
                className={`w-full rounded-xl border p-3 text-left transition cursor-pointer ${
                  draft.orchestrator.orchestratorModel === model.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="text-sm font-medium text-foreground">{model.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{model.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Max Concurrent */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Max Concurrent Agents
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={6}
              value={draft.orchestrator.maxConcurrentAgents}
              onChange={(e) => patchOrch({ maxConcurrentAgents: Number(e.target.value) })}
              className="flex-1 accent-primary"
            />
            <span className="text-sm font-medium text-foreground w-8 text-right">
              {draft.orchestrator.maxConcurrentAgents}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            How many persona agents can be consulted in parallel.
          </p>
        </div>

        {/* Toggle switches */}
        <div className="space-y-3">
          {[
            { key: "consensusRequired" as const, label: "Require Consensus", desc: "Multi-persona decisions need 2/3 majority" },
            { key: "autoConsultOnPR" as const, label: "Auto-consult on PR", desc: "Automatically consult relevant personas on pull requests" },
            { key: "autoConsultOnDeploy" as const, label: "Auto-consult on Deploy", desc: "Consult personas before each deployment" },
            { key: "weeklyRetroEnabled" as const, label: "Weekly Retros", desc: "Enable Phase 5 weekly persona retro cycle" },
          ].map(({ key, label, desc }) => (
            <button
              key={key}
              type="button"
              onClick={() => patchOrch({ [key]: !draft.orchestrator[key] })}
              className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 transition cursor-pointer hover:border-white/20"
            >
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <div
                className={`h-5 w-9 rounded-full transition-colors ${
                  draft.orchestrator[key] ? "bg-primary" : "bg-white/10"
                } relative`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    draft.orchestrator[key] ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
