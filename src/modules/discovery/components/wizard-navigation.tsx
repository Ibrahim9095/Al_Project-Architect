"use client";

interface WizardNavigationProps {
  canGoPrevious: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function WizardNavigation({
  canGoPrevious,
  isLastStep,
  onPrevious,
  onNext,
}: WizardNavigationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="border border-border px-5 py-2.5 text-sm font-medium text-ink transition enabled:hover:border-accent enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        className="bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong"
      >
        {isLastStep ? "Normalize Discovery" : "Next"}
      </button>
    </div>
  );
}
