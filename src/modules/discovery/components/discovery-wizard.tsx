"use client";

import { DiscoveryJsonView } from "./discovery-json-view";
import { ProgressIndicator } from "./progress-indicator";
import { QuestionField } from "./question-field";
import { WizardNavigation } from "./wizard-navigation";
import { useDiscoveryWizard } from "../state/discovery-wizard-context";

export function DiscoveryWizard() {
  const {
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
  } = useDiscoveryWizard();

  if (isComplete && normalizedDiscovery) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
        <DiscoveryJsonView data={normalizedDiscovery} onRestart={reset} />
      </div>
    );
  }

  if (!currentStep) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <div className="mb-10 space-y-3 animate-fade-up">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Discovery Engine
        </p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Project Discovery
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Answer each step to build a structured Discovery JSON for your
          software project.
        </p>
      </div>

      <div className="space-y-8 animate-fade-up-delayed">
        <ProgressIndicator
          stepIndex={stepIndex}
          totalSteps={steps.length}
          progress={progress}
          stepTitle={currentStep.title}
        />

        <section className="space-y-2">
          <h2 className="text-xl font-medium text-ink">{currentStep.title}</h2>
          <p className="text-sm leading-6 text-muted">{currentStep.description}</p>
        </section>

        <div className="space-y-8">
          {currentStep.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              error={errors[question.id]}
              onChange={(value) => setAnswer(question.id, value)}
            />
          ))}
        </div>

        {normalizationErrors.length > 0 ? (
          <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-medium">Normalization validation failed</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {normalizationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <WizardNavigation
          canGoPrevious={stepIndex > 0}
          isLastStep={stepIndex === steps.length - 1}
          onPrevious={goPrevious}
          onNext={() => {
            goNext();
          }}
        />
      </div>
    </div>
  );
}
