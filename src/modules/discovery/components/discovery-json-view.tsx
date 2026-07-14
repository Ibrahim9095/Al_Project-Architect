"use client";

import type { DiscoveryJson } from "@/engines/discovery";

interface DiscoveryJsonViewProps {
  data: DiscoveryJson;
  onRestart: () => void;
}

export function DiscoveryJsonView({ data, onRestart }: DiscoveryJsonViewProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Discovery Complete
        </p>
        <h2 className="font-display text-3xl text-ink">Discovery JSON</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          This object is generated locally by the Discovery Engine and is not
          sent anywhere.
        </p>
      </div>

      <pre className="overflow-x-auto border border-border bg-ink px-5 py-5 text-sm leading-7 text-sand">
        {JSON.stringify(data, null, 2)}
      </pre>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
        >
          Start Another Discovery
        </button>
      </div>
    </div>
  );
}
