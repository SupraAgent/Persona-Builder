"use client";

import * as React from "react";

type Agent = {
  id: string;
  name: string;
  role: string;
  company: string;
  description: string;
  heartbeatMinutes: number;
  monthlyBudgetUsd: number;
  reportsTo: string | null;
  triggers: string[];
  sourceFile: string;
};

export function AgentMapPanel() {
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    fetch("/api/paperclip")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setAgents(data.agents || []);
          setSelected(new Set((data.agents || []).map((a: Agent) => a.id)));
        }
      })
      .catch(() => setError("Failed to load agents"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === agents.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(agents.map((a) => a.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        Loading personas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 text-center">
        <p className="text-muted-foreground text-sm">
          No personas found in <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">docs/personas/</code>
        </p>
        <p className="text-muted-foreground text-xs mt-2">
          Create personas first using the Persona Builder, then come back to map them as Paperclip agents.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {selected.size} of {agents.length} personas selected as agents
        </p>
        <button
          onClick={toggleAll}
          className="text-xs text-primary hover:text-primary/80 transition cursor-pointer"
        >
          {selected.size === agents.length ? "Deselect all" : "Select all"}
        </button>
      </div>

      {agents.map((agent) => (
        <div
          key={agent.id}
          onClick={() => toggle(agent.id)}
          className={`rounded-lg border p-4 transition cursor-pointer ${
            selected.has(agent.id)
              ? "border-primary/30 bg-primary/5"
              : "border-white/10 bg-white/[0.02] opacity-60"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    selected.has(agent.id) ? "bg-primary" : "bg-white/20"
                  }`}
                />
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {agent.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {agent.role}
                {agent.company ? ` @ ${agent.company}` : ""}
              </p>
              {agent.triggers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {agent.triggers.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-white/5 text-muted-foreground px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right shrink-0 space-y-1">
              <div className="text-[10px] text-muted-foreground">
                Heartbeat
              </div>
              <div className="text-xs text-foreground font-medium">
                {agent.heartbeatMinutes}m
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Budget
              </div>
              <div className="text-xs text-foreground font-medium">
                ${agent.monthlyBudgetUsd}/mo
              </div>
            </div>
          </div>
          {agent.reportsTo && (
            <p className="text-[10px] text-muted-foreground mt-2">
              Reports to: {agent.reportsTo}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
