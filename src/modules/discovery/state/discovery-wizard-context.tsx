"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildDiscoveryJson,
  buildDiscoverySteps,
  validateDiscoveryStep,
  type DiscoveryAnswers,
  type DiscoveryJson,
  type DiscoveryStepDefinition,
} from "@/engines/discovery";

interface DiscoveryWizardState {
  answers: DiscoveryAnswers;
  stepIndex: number;
  errors: Record<string, string>;
  completedJson: DiscoveryJson | null;
  steps: DiscoveryStepDefinition[];
  currentStep: DiscoveryStepDefinition | null;
  isComplete: boolean;
  progress: number;
  setAnswer: (questionId: string, value: string | string[]) => void;
  goNext: () => boolean;
  goPrevious: () => void;
  reset: () => void;
}

const DiscoveryWizardContext = createContext<DiscoveryWizardState | null>(null);

export function DiscoveryWizardProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<DiscoveryAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedJson, setCompletedJson] = useState<DiscoveryJson | null>(
    null,
  );

  const steps = useMemo(() => buildDiscoverySteps(answers), [answers]);
  const currentStep = steps[stepIndex] ?? null;
  const isComplete = completedJson !== null;
  const progress = isComplete
    ? 100
    : steps.length === 0
      ? 0
      : Math.round(((stepIndex + 1) / steps.length) * 100);

  useEffect(() => {
    if (steps.length === 0) {
      return;
    }
    if (stepIndex > steps.length - 1) {
      setStepIndex(steps.length - 1);
    }
  }, [stepIndex, steps.length]);

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers((previous) => {
      const next = {
        ...previous,
        [questionId]: value,
      };

      if (questionId === "projectType") {
        const previousType = previous.projectType;
        if (previousType !== value) {
          delete next.roles;
          delete next.modules;
          delete next.features;
          delete next.integrations;
        }
      }

      return next;
    });
    setErrors((previous) => {
      if (!previous[questionId]) {
        return previous;
      }
      const next = { ...previous };
      delete next[questionId];
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    const activeSteps = buildDiscoverySteps(answers);
    const step = activeSteps[stepIndex];

    if (!step) {
      return false;
    }

    const validation = validateDiscoveryStep(step, answers);
    if (!validation.valid) {
      setErrors(validation.errors);
      return false;
    }

    setErrors({});

    const refreshedSteps = buildDiscoverySteps(answers);
    const isLastStep = stepIndex >= refreshedSteps.length - 1;

    if (isLastStep) {
      setCompletedJson(buildDiscoveryJson(answers));
      return true;
    }

    setStepIndex((index) => Math.min(index + 1, refreshedSteps.length - 1));
    return true;
  }, [answers, stepIndex]);

  const goPrevious = useCallback(() => {
    setErrors({});
    if (completedJson) {
      setCompletedJson(null);
      return;
    }
    setStepIndex((index) => Math.max(index - 1, 0));
  }, [completedJson]);

  const reset = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    setErrors({});
    setCompletedJson(null);
  }, []);

  const value = useMemo(
    () => ({
      answers,
      stepIndex,
      errors,
      completedJson,
      steps,
      currentStep,
      isComplete,
      progress,
      setAnswer,
      goNext,
      goPrevious,
      reset,
    }),
    [
      answers,
      stepIndex,
      errors,
      completedJson,
      steps,
      currentStep,
      isComplete,
      progress,
      setAnswer,
      goNext,
      goPrevious,
      reset,
    ],
  );

  return (
    <DiscoveryWizardContext.Provider value={value}>
      {children}
    </DiscoveryWizardContext.Provider>
  );
}

export function useDiscoveryWizard() {
  const context = useContext(DiscoveryWizardContext);
  if (!context) {
    throw new Error(
      "useDiscoveryWizard must be used within DiscoveryWizardProvider.",
    );
  }
  return context;
}
