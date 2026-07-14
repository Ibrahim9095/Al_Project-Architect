"use client";

import type { EngineeringModel } from "@/engines/analysis";

interface EngineeringModelViewProps {
  model: EngineeringModel;
}

/**
 * Displays the internal Engineering Model as structured data only.
 * Does not generate Markdown documentation.
 */
export function EngineeringModelView({ model }: EngineeringModelViewProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Analysis Engine
        </p>
        <h2 className="font-display text-3xl text-ink">Engineering Model</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Internal analysis output only. Schema version{" "}
          <span className="font-medium text-ink">{model.schemaVersion}</span>.
          Complexity{" "}
          <span className="font-medium text-ink">{model.complexityLevel}</span>
          . Confidence{" "}
          <span className="font-medium text-ink">
            {model.metadata.analysisConfidence}
          </span>
          . No Markdown, repository, or source code was generated.
        </p>
      </div>

      <pre className="overflow-x-auto border border-border bg-ink px-5 py-5 text-sm leading-7 text-sand">
        {JSON.stringify(model, null, 2)}
      </pre>
    </div>
  );
}
