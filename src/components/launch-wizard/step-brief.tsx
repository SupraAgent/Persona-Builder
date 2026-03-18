"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DynamicList } from "@/components/ui/dynamic-list";
import { Button } from "@/components/ui/button";
import {
  PROJECT_TYPES,
  PLATFORM_OPTIONS,
  type LaunchKitDraft,
  type ProjectType,
} from "@/lib/launch-kit";

type Props = {
  draft: LaunchKitDraft;
  onChange: (patch: Partial<LaunchKitDraft>) => void;
};

export function StepBrief({ draft, onChange }: Props) {
  function togglePlatform(platform: string) {
    const next = draft.platforms.includes(platform)
      ? draft.platforms.filter((p) => p !== platform)
      : [...draft.platforms, platform];
    onChange({ platforms: next });
  }

  function addComparable() {
    onChange({
      comparables: [...draft.comparables, { name: "", strength: "" }],
    });
  }

  function updateComparable(
    index: number,
    field: "name" | "strength",
    value: string
  ) {
    const next = [...draft.comparables];
    next[index] = { ...next[index], [field]: value };
    onChange({ comparables: next });
  }

  function removeComparable(index: number) {
    onChange({
      comparables: draft.comparables.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Project Brief</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define what you are building and who it is for.
        </p>
      </div>

      <div className="space-y-5">
        {/* Project Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Project Name
          </label>
          <Input
            value={draft.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            placeholder="e.g. SupraVibe"
          />
        </div>

        {/* Project Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Project Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PROJECT_TYPES.map((pt) => (
              <button
                key={pt.id}
                type="button"
                onClick={() =>
                  onChange({
                    projectType: pt.id as ProjectType,
                  })
                }
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  draft.projectType === pt.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="text-sm font-medium text-foreground">
                  {pt.label}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {pt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="What does this product do? 2-3 sentences."
            className="min-h-[80px]"
          />
        </div>

        {/* Target User */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Target User
          </label>
          <Input
            value={draft.targetUser}
            onChange={(e) => onChange({ targetUser: e.target.value })}
            placeholder="e.g. Engineering teams building AI-native products"
          />
        </div>

        {/* Problem */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Problem
          </label>
          <Textarea
            value={draft.problem}
            onChange={(e) => onChange({ problem: e.target.value })}
            placeholder="What pain point does this solve?"
            className="min-h-[80px]"
          />
        </div>

        {/* Platforms */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((platform) => {
              const active = draft.platforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition cursor-pointer ${
                    active
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        {/* MVP Features */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            MVP Features
          </label>
          <DynamicList
            value={draft.mvpFeatures.length > 0 ? draft.mvpFeatures : [""]}
            onChange={(mvpFeatures) =>
              onChange({ mvpFeatures: mvpFeatures.filter(Boolean) })
            }
            placeholder="e.g. User authentication, dashboard, real-time updates"
            addLabel="Add feature"
          />
        </div>

        {/* Comparable Products */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Comparable Products
          </label>
          <div className="space-y-2">
            {draft.comparables.map((comp, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    value={comp.name}
                    onChange={(e) =>
                      updateComparable(i, "name", e.target.value)
                    }
                    placeholder="Product name"
                    className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition hover:border-white/15 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  />
                  <input
                    value={comp.strength}
                    onChange={(e) =>
                      updateComparable(i, "strength", e.target.value)
                    }
                    placeholder="What they do well"
                    className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition hover:border-white/15 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeComparable(i)}
                  className="mt-2 text-muted-foreground hover:text-red-400 text-xs px-1 cursor-pointer"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addComparable}
            className="mt-2 text-xs"
          >
            + Add comparable
          </Button>
        </div>
      </div>
    </div>
  );
}
