"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepBrief } from "./step-brief";
import { StepPersonas } from "./step-personas";
import { StepDesign } from "./step-design";
import { StepScreens } from "./step-screens";
import { StepShip } from "./step-ship";
import { EMPTY_DESIGN_TO_SHIP, type DesignToShipDraft } from "@/lib/design-to-ship";

const STEPS = [
  { label: "Brief" },
  { label: "Personas" },
  { label: "Design" },
  { label: "Screens" },
  { label: "Ship" },
];

export function DesignToShipShell() {
  const [step, setStep] = React.useState(0);
  const [draft, setDraft] = React.useState<DesignToShipDraft>(EMPTY_DESIGN_TO_SHIP);
  const [direction, setDirection] = React.useState(1);

  function patchDraft(patch: Partial<DesignToShipDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
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
    setDraft(EMPTY_DESIGN_TO_SHIP);
    setStep(0);
  }

  const canProceed =
    step === 0
      ? Boolean(draft.projectName && draft.projectType && draft.atmosphere)
      : step === 1
        ? draft.team.length > 0
        : step === 2
          ? draft.colors.length > 0
          : step === 3
            ? draft.screens.length > 0
            : true;

  const lastStep = STEPS.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Design-to-Ship Kit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Brief &rarr; Personas &rarr; Design System &rarr; Screens &rarr; Ship
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/launch-kit"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Launch Kit
          </a>
          {(draft.projectName || step > 0) && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Start over
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => {
                setDirection(i > step ? 1 : -1);
                setStep(i);
              }}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                i === step
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : i < step
                    ? "bg-white/5 text-foreground border border-white/10"
                    : "bg-white/[0.02] text-muted-foreground border border-white/5"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary/20 text-primary"
                      : "bg-white/5 text-muted-foreground"
                }`}
              >
                {i < step ? "\u2713" : i + 1}
              </span>
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 ${i < step ? "bg-primary/30" : "bg-white/10"}`}
              />
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
          {step === 0 && <StepBrief draft={draft} onChange={patchDraft} />}
          {step === 1 && <StepPersonas draft={draft} onChange={patchDraft} />}
          {step === 2 && <StepDesign draft={draft} onChange={patchDraft} />}
          {step === 3 && <StepScreens draft={draft} onChange={patchDraft} />}
          {step === 4 && <StepShip draft={draft} onChange={patchDraft} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < lastStep && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 0}>
            Back
          </Button>
          <Button onClick={goNext} disabled={!canProceed}>
            Next
          </Button>
        </div>
      )}
      {step === lastStep && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={goBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
