"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  analysisEngine,
  type EngineeringModel,
} from "@/engines/analysis";
import { EngineeringModelView } from "./engineering-model-view";
import {
  readNormalizedDiscoveryFromStorage,
  writeEngineeringModelToStorage,
} from "../storage";

type AnalysisUiState =
  | { status: "idle" }
  | { status: "missing" }
  | { status: "blocked"; errors: string[] }
  | { status: "complete"; model: EngineeringModel };

export function AnalysisWorkspace() {
  const [state, setState] = useState<AnalysisUiState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      void (async () => {
        const discovery = readNormalizedDiscoveryFromStorage();
        if (!discovery) {
          setState({ status: "missing" });
          return;
        }

        const result = await analysisEngine.run(
          { action: "analyze", discovery },
          {
            projectId:
              typeof discovery === "object" &&
              discovery !== null &&
              "project" in discovery &&
              typeof (discovery as { project?: { id?: unknown } }).project
                ?.id === "string"
                ? ((discovery as { project: { id: string } }).project.id)
                : "unknown-project",
            requestId: `analysis-${Date.now()}`,
          },
        );

        if (result.status === "complete" && result.data) {
          writeEngineeringModelToStorage(result.data);
          setState({ status: "complete", model: result.data });
          return;
        }

        setState({
          status: "blocked",
          errors: result.missingInformation ?? [
            result.message ?? "Analysis failed.",
          ],
        });
      })();
    });
  }, []);

  if (state.status === "idle" || isPending) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
        <p className="text-sm text-muted">Running Analysis Engine…</p>
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-12 sm:py-16">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Analysis Engine
          </p>
          <h1 className="font-display text-4xl text-ink">Input required</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            No Normalized Discovery Schema was found in this browser session.
            Complete Discovery first, then run Analysis.
          </p>
        </div>
        <Link
          href="/discovery"
          className="inline-flex bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
        >
          Open Discovery
        </Link>
      </div>
    );
  }

  if (state.status === "blocked") {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-12 sm:py-16">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Analysis Engine
          </p>
          <h1 className="font-display text-4xl text-ink">Validation blocked</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            The Normalized Discovery Schema failed validation.
          </p>
        </div>
        <ul className="list-disc space-y-1 border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-800 pl-8">
          {state.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
        <Link
          href="/discovery"
          className="inline-flex border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
        >
          Return to Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <EngineeringModelView model={state.model} />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/discovery"
          className="border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
        >
          Back to Discovery
        </Link>
      </div>
    </div>
  );
}
