"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepRole } from "./step-role";
import { StepExpertise } from "./step-expertise";
import { StepMindset } from "./step-mindset";
import { StepOutput } from "./step-output";
import { EMPTY_DRAFT, draftToSupabasePayload, type PersonaDraft } from "@/lib/persona-builder";

const STEPS = [
  { label: "Role", component: StepRole },
  { label: "Expertise", component: StepExpertise },
  { label: "Mindset", component: StepMindset },
  { label: "Output", component: StepOutput },
];

export function WizardShell() {
  const [step, setStep] = React.useState(0);
  const [draft, setDraft] = React.useState<PersonaDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [direction, setDirection] = React.useState(1);

  function patchDraft(patch: Partial<PersonaDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }

  function goNext() {
    if (step < STEPS.length - 1) {
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
    setDraft(EMPTY_DRAFT);
    setStep(0);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = draftToSupabasePayload(draft);
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

  const canProceed =
    step === 0 ? Boolean(draft.name && draft.title) :
    step === 1 ? Boolean(draft.primaryDomain) :
    step === 2 ? Boolean(draft.coreBeliefs.length > 0 || draft.optimizeFor) :
    true;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Persona Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an expert persona for your AI agent team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/personas"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            My Personas
          </a>
          {(draft.name || step > 0) && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Start over
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                i === step
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : i < step
                    ? "bg-white/5 text-foreground border border-white/10"
                    : "bg-white/[0.02] text-muted-foreground border border-white/5"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </span>
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 ${i < step ? "bg-primary/30" : "bg-white/10"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ x: direction * 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -30, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && <StepRole draft={draft} onChange={patchDraft} />}
          {step === 1 && <StepExpertise draft={draft} onChange={patchDraft} />}
          {step === 2 && <StepMindset draft={draft} onChange={patchDraft} />}
          {step === 3 && (
            <StepOutput
              draft={draft}
              onChange={patchDraft}
              onSave={handleSave}
              saving={saving}
              saved={saved}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < 3 && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button onClick={goNext} disabled={!canProceed}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
