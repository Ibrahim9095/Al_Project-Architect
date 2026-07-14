"use client";

interface ProgressIndicatorProps {
  stepIndex: number;
  totalSteps: number;
  progress: number;
  stepTitle: string;
}

export function ProgressIndicator({
  stepIndex,
  totalSteps,
  progress,
  stepTitle,
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Step {Math.min(stepIndex + 1, totalSteps)} of {totalSteps}
          </p>
          <p className="mt-1 text-sm text-ink">{stepTitle}</p>
        </div>
        <p className="text-sm font-medium text-accent">{progress}%</p>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden bg-border/80"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
