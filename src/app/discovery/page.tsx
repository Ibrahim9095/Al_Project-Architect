import Link from "next/link";
import { DiscoveryWizard, DiscoveryWizardProvider } from "@/modules/discovery";

export default function DiscoveryPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/80 bg-white/50">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-medium tracking-wide text-accent">
            AI Project Architect
          </Link>
          <span className="text-xs uppercase tracking-[0.16em] text-muted">
            Discovery
          </span>
        </div>
      </div>

      <DiscoveryWizardProvider>
        <DiscoveryWizard />
      </DiscoveryWizardProvider>
    </main>
  );
}
