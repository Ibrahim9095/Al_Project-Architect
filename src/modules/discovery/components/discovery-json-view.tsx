"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { NormalizedDiscovery } from "@/engines/discovery";
import { writeNormalizedDiscoveryToStorage } from "@/modules/analysis";

interface DiscoveryJsonViewProps {
  data: NormalizedDiscovery;
  onRestart: () => void;
}

export function DiscoveryJsonView({ data, onRestart }: DiscoveryJsonViewProps) {
  useEffect(() => {
    writeNormalizedDiscoveryToStorage(data);
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Discovery Normalized
        </p>
        <h2 className="font-display text-3xl text-ink">
          Normalized Discovery Schema
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Official contract for future engines. Schema version{" "}
          <span className="font-medium text-ink">{data.schemaVersion}</span>.
          This object is generated locally and is not sent anywhere.
        </p>
      </div>

      <pre className="overflow-x-auto border border-border bg-ink px-5 py-5 text-sm leading-7 text-sand">
        {JSON.stringify(data, null, 2)}
      </pre>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/analysis"
          className="bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
        >
          Run Analysis
        </Link>
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
