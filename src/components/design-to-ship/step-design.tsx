"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DynamicList } from "@/components/ui/dynamic-list";
import {
  type DesignToShipDraft,
  type DesignToken,
  DEFAULT_COLOR_PALETTES,
  generateDesignMd,
} from "@/lib/design-to-ship";

type Props = {
  draft: DesignToShipDraft;
  onChange: (patch: Partial<DesignToShipDraft>) => void;
};

export function StepDesign({ draft, onChange }: Props) {
  const [showPreview, setShowPreview] = React.useState(false);

  // Auto-populate colors from atmosphere preset if empty
  React.useEffect(() => {
    if (draft.atmosphere && draft.colors.length === 0) {
      const palette = DEFAULT_COLOR_PALETTES[draft.atmosphere];
      if (palette) {
        onChange({ colors: [...palette] });
      }
    }
    // Only run when atmosphere changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.atmosphere]);

  function updateColor(index: number, patch: Partial<DesignToken>) {
    const next = [...draft.colors];
    next[index] = { ...next[index], ...patch };
    onChange({ colors: next });
  }

  function addColor() {
    onChange({
      colors: [...draft.colors, { role: "", name: "", hex: "#000000", usage: "" }],
    });
  }

  function removeColor(index: number) {
    onChange({ colors: draft.colors.filter((_, i) => i !== index) });
  }

  function updateTypography(index: number, description: string) {
    const next = [...draft.typography];
    next[index] = { ...next[index], description };
    onChange({ typography: next });
  }

  function updateComponent(index: number, description: string) {
    const next = [...draft.components];
    next[index] = { ...next[index], description };
    onChange({ components: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Design System</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define your visual language. This generates a DESIGN.md that guides all UI generation.
        </p>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Color Palette</label>
          {draft.atmosphere && (
            <span className="text-xs text-muted-foreground">
              Pre-filled from {draft.atmosphere} preset
            </span>
          )}
        </div>

        <div className="space-y-2">
          {draft.colors.map((color, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
            >
              <div className="flex items-start gap-3">
                {/* Color swatch */}
                <div className="shrink-0 pt-1">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(i, { hex: e.target.value })}
                    className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
                  />
                </div>

                <div className="flex-1 grid grid-cols-3 gap-2">
                  <Input
                    value={color.role}
                    onChange={(e) => updateColor(i, { role: e.target.value })}
                    placeholder="Role (e.g. Primary)"
                  />
                  <Input
                    value={color.name}
                    onChange={(e) => updateColor(i, { name: e.target.value })}
                    placeholder="Name (e.g. Ocean Blue)"
                  />
                  <div className="flex gap-1">
                    <Input
                      value={color.hex}
                      onChange={(e) => updateColor(i, { hex: e.target.value })}
                      placeholder="#000000"
                      className="w-24"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="text-xs text-muted-foreground hover:text-red-400 px-1 cursor-pointer shrink-0"
                    >
                      x
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2 ml-11">
                <Input
                  value={color.usage}
                  onChange={(e) => updateColor(i, { usage: e.target.value })}
                  placeholder="Usage (e.g. Primary action buttons and active states)"
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={addColor} className="text-xs">
          + Add color
        </Button>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Typography Rules</label>
        <p className="text-xs text-muted-foreground">
          Describe each level semantically (e.g. &quot;Clean geometric sans-serif at 2.5rem, bold weight for commanding attention&quot;)
        </p>
        <div className="space-y-2">
          {draft.typography.map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs text-muted-foreground w-28 shrink-0 pt-3 text-right">
                {t.level}
              </span>
              <Input
                value={t.description}
                onChange={(e) => updateTypography(i, e.target.value)}
                placeholder={`Describe ${t.level.toLowerCase()} style...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Component Patterns */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Component Patterns</label>
        <p className="text-xs text-muted-foreground">
          Describe shape, color, and behavior for each element type.
        </p>
        <div className="space-y-2">
          {draft.components.map((c, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs text-muted-foreground">{c.element}</label>
              <Textarea
                value={c.description}
                onChange={(e) => updateComponent(i, e.target.value)}
                placeholder={`e.g. Pill-shaped with subtle shadow, primary color fill, hover brightness increase...`}
                className="min-h-[60px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Layout Principles */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Layout Principles</label>
        <Textarea
          value={draft.layoutPrinciples}
          onChange={(e) => onChange({ layoutPrinciples: e.target.value })}
          placeholder="e.g. 12-column grid, max-width 1280px, comfortable 24px padding, generous white space between sections..."
          className="min-h-[80px]"
        />
      </div>

      {/* Design Principles */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Persona Design Principles</label>
        <p className="text-xs text-muted-foreground">
          Rules from your UI/UX persona that constrain design decisions.
        </p>
        <DynamicList
          value={draft.designPrinciples}
          onChange={(v) => onChange({ designPrinciples: v })}
          placeholder="e.g. Subtract, then subtract again — every element must earn its place"
          addLabel="Add principle"
        />
      </div>

      {/* Anti-Patterns */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Anti-Patterns</label>
        <p className="text-xs text-muted-foreground">
          Things the UI/UX persona explicitly rejects.
        </p>
        <DynamicList
          value={draft.antiPatterns}
          onChange={(v) => onChange({ antiPatterns: v })}
          placeholder="e.g. Never use more than 3 colors on a single screen"
          addLabel="Add anti-pattern"
        />
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer"
        >
          {showPreview ? "\u25BC" : "\u25B6"} DESIGN.md Preview
        </button>
        {showPreview && (
          <pre className="mt-3 text-xs text-muted-foreground overflow-auto max-h-80 whitespace-pre-wrap">
            {generateDesignMd(draft)}
          </pre>
        )}
      </div>
    </div>
  );
}
