"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepRole } from "./step-role";
import { StepVisibility } from "./step-visibility";
import { StepFocus } from "./step-focus";
import { StepInspirations } from "./step-inspirations";
import { StepStyle } from "./step-style";
import { StepPrinciples } from "./step-principles";
import { StepSkills } from "./step-skills";
import { StepModel } from "./step-model";
import { StepReview } from "./step-review";
import {
  BUILDER_STEPS,
  createEmptyPersona,
  agentPersonaToSupabase,
  type AgentPersona,
} from "@/lib/agent-personas";

export function AgentShell() {
  const [step, setStep] = React.useState(0);
  const [persona, setPersona] = React.useState<AgentPersona>(
    createEmptyPersona()
  );
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [direction, setDirection] = React.useState(1);

  function patchPersona(patch: Partial<AgentPersona>) {
    setPersona((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }

  function goNext() {
    if (step < BUILDER_STEPS.length - 1) {
      setDirection(1);
      setStep(step + 1);
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }

  function reset() {
    setPersona(createEmptyPersona());
    setStep(0);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = agentPersonaToSupabase(persona);
      const res = await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  // Validation per step
  const canProceed =
    step === 0
      ? Boolean(persona.role || persona.customRole)
      : step === 1
        ? Boolean(persona.visibility)
        : step === 2
          ? Boolean(persona.focusArea)
          : step === 3
            ? true // inspirations optional
            : step === 4
              ? Boolean(persona.communicationStyle)
              : step === 5
                ? persona.principles.some((p) => p.trim())
                : step === 6
                  ? persona.skills.length > 0
                  : step === 7
                    ? Boolean(persona.llmProvider && persona.llmModel)
                    : true;

  const isLastStep = step === BUILDER_STEPS.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an AI agent persona for your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/personas"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            My Personas
          </a>
          {(persona.role || persona.customRole || step > 0) && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Start over
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-1">
        {BUILDER_STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => {
                setDirection(i > step ? 1 : -1);
                setStep(i);
              }}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                i === step
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : i < step
                    ? "bg-white/5 text-foreground border border-white/10"
                    : "bg-white/[0.02] text-muted-foreground border border-white/5"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary/20 text-primary"
                      : "bg-white/5 text-muted-foreground"
                }`}
              >
                {i < step ? "\u2713" : i + 1}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
            {i < BUILDER_STEPS.length - 1 && (
              <div
                className={`h-px flex-1 min-w-[4px] ${
                  i < step ? "bg-primary/30" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ x: direction * 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -30, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <StepRole persona={persona} onChange={patchPersona} />
          )}
          {step === 1 && (
            <StepVisibility persona={persona} onChange={patchPersona} />
          )}
          {step === 2 && (
            <StepFocus persona={persona} onChange={patchPersona} />
          )}
          {step === 3 && (
            <StepInspirations persona={persona} onChange={patchPersona} />
          )}
          {step === 4 && (
            <StepStyle persona={persona} onChange={patchPersona} />
          )}
          {step === 5 && (
            <StepPrinciples persona={persona} onChange={patchPersona} />
          )}
          {step === 6 && (
            <StepSkills persona={persona} onChange={patchPersona} />
          )}
          {step === 7 && (
            <StepModel persona={persona} onChange={patchPersona} />
          )}
          {step === 8 && (
            <StepReview
              persona={persona}
              onChange={patchPersona}
              onSave={handleSave}
              saving={saving}
              saved={saved}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!isLastStep && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 0}>
            Back
          </Button>
          <Button onClick={goNext} disabled={!canProceed}>
            Next
          </Button>
        </div>
      )}
      {isLastStep && (
        <div className="mt-8 flex items-center justify-start">
          <Button variant="ghost" onClick={goBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
