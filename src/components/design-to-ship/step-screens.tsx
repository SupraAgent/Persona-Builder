"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type DesignToShipDraft,
  type StitchScreen,
  SCREEN_TEMPLATES,
  generateScreenPrompt,
} from "@/lib/design-to-ship";

type Props = {
  draft: DesignToShipDraft;
  onChange: (patch: Partial<DesignToShipDraft>) => void;
};

export function StepScreens({ draft, onChange }: Props) {
  const [expandedPrompt, setExpandedPrompt] = React.useState<string | null>(null);

  function addScreen(template: typeof SCREEN_TEMPLATES[number]) {
    const screen: StitchScreen = {
      id: `screen-${Date.now()}`,
      name: template.label,
      prompt: template.prompt,
      status: "pending",
      personaReviewed: false,
    };
    onChange({ screens: [...draft.screens, screen] });
  }

  function addCustomScreen() {
    const screen: StitchScreen = {
      id: `screen-${Date.now()}`,
      name: "Custom Screen",
      prompt: "",
      status: "pending",
      personaReviewed: false,
    };
    onChange({ screens: [...draft.screens, screen] });
  }

  function updateScreen(id: string, patch: Partial<StitchScreen>) {
    onChange({
      screens: draft.screens.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    });
  }

  function removeScreen(id: string) {
    onChange({ screens: draft.screens.filter((s) => s.id !== id) });
  }

  function toggleApproved(id: string) {
    const screen = draft.screens.find((s) => s.id === id);
    if (screen) {
      updateScreen(id, {
        personaReviewed: !screen.personaReviewed,
        status: !screen.personaReviewed ? "approved" : "pending",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Screen Designs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose screens to generate. Each prompt is enhanced with your DESIGN.md context for consistency.
        </p>
      </div>

      {/* Template Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Add from Templates</label>
        <div className="grid grid-cols-2 gap-2">
          {SCREEN_TEMPLATES.map((tmpl) => {
            const alreadyAdded = draft.screens.some((s) => s.name === tmpl.label);
            return (
              <button
                key={tmpl.id}
                type="button"
                disabled={alreadyAdded}
                onClick={() => addScreen(tmpl)}
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  alreadyAdded
                    ? "border-primary/30 bg-primary/5 text-primary opacity-60"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
                }`}
              >
                <span className="text-sm font-medium">{tmpl.label}</span>
                {alreadyAdded && <span className="ml-1 text-xs">(added)</span>}
              </button>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={addCustomScreen} className="text-xs">
          + Custom screen
        </Button>
      </div>

      {/* Screen List */}
      {draft.screens.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Your Screens ({draft.screens.length})
          </label>
          {draft.screens.map((screen) => (
            <div
              key={screen.id}
              className={`rounded-xl border p-4 transition ${
                screen.personaReviewed
                  ? "border-green-500/20 bg-green-500/[0.03]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {/* Screen Header */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    value={screen.name}
                    onChange={(e) => updateScreen(screen.id, { name: e.target.value })}
                    className="bg-transparent text-sm font-medium text-foreground outline-none w-full"
                    placeholder="Screen name..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleApproved(screen.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                      screen.personaReviewed
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    {screen.personaReviewed ? "\u2713 Approved" : "Mark Approved"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeScreen(screen.id)}
                    className="text-xs text-muted-foreground hover:text-red-400 cursor-pointer"
                  >
                    remove
                  </button>
                </div>
              </div>

              {/* Prompt */}
              <div className="mt-3">
                <Textarea
                  value={screen.prompt}
                  onChange={(e) =>
                    updateScreen(screen.id, { prompt: e.target.value })
                  }
                  placeholder="Describe what this screen should look like..."
                  className="min-h-[60px]"
                />
              </div>

              {/* Enhanced Prompt Preview */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedPrompt(
                      expandedPrompt === screen.id ? null : screen.id
                    )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {expandedPrompt === screen.id ? "\u25BC" : "\u25B6"} View enhanced
                  prompt (with DESIGN.md context)
                </button>
                {expandedPrompt === screen.id && (
                  <pre className="mt-2 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-muted-foreground whitespace-pre-wrap max-h-40 overflow-auto">
                    {generateScreenPrompt(screen, draft)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pipeline Info */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
        <p className="text-sm font-medium text-foreground">Stitch Pipeline</p>
        <p className="text-xs text-muted-foreground">
          When connected to Stitch via MCP, these prompts are automatically enhanced
          with your DESIGN.md context and sent to Gemini for generation. Without Stitch,
          you can copy the enhanced prompts and use them manually.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Persona Guidance</span>
          <span className="text-primary">&rarr;</span>
          <span>Enhanced Prompt</span>
          <span className="text-primary">&rarr;</span>
          <span>Stitch Screen</span>
          <span className="text-primary">&rarr;</span>
          <span>Code Export</span>
        </div>
      </div>
    </div>
  );
}
