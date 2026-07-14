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
  buildDiscoverySteps,
  normalizeDiscoveryAnswers,
  validateDiscoveryStep,
  validateNormalizedDiscovery,
  type DiscoveryAnswers,
  type DiscoveryStepDefinition,
  type NormalizedDiscovery,
} from "@/engines/discovery";

interface DiscoveryWizardState {
  answers: DiscoveryAnswers;
  stepIndex: number;
  errors: Record<string, string>;
  normalizedDiscovery: NormalizedDiscovery | null;
  normalizationErrors: string[];
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
  const [normalizedDiscovery, setNormalizedDiscovery] =
    useState<NormalizedDiscovery | null>(null);
  const [normalizationErrors, setNormalizationErrors] = useState<string[]>([]);

  const steps = useMemo(() => buildDiscoverySteps(answers), [answers]);
  const currentStep = steps[stepIndex] ?? null;
  const isComplete = normalizedDiscovery !== null;
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
      const normalized = normalizeDiscoveryAnswers(answers);
      const normalization = validateNormalizedDiscovery(normalized);

      if (!normalization.valid) {
        setNormalizationErrors(normalization.errors);
        return false;
      }

      setNormalizationErrors([]);
      setNormalizedDiscovery(normalized);
      return true;
    }

    setStepIndex((index) => Math.min(index + 1, refreshedSteps.length - 1));
    return true;
  }, [answers, stepIndex]);

  const goPrevious = useCallback(() => {
    setErrors({});
    setNormalizationErrors([]);
    if (normalizedDiscovery) {
      setNormalizedDiscovery(null);
      return;
    }
    setStepIndex((index) => Math.max(index - 1, 0));
  }, [normalizedDiscovery]);

  const reset = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    setErrors({});
    setNormalizedDiscovery(null);
    setNormalizationErrors([]);
  }, []);

  const value = useMemo(
    () => ({
      answers,
      stepIndex,
      errors,
      normalizedDiscovery,
      normalizationErrors,
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
      normalizedDiscovery,
      normalizationErrors,
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
