import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden hero-shell">
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--hero-glow),transparent_70%)] opacity-70 animate-drift" />
      <div className="pointer-events-none absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,#cfe3dc,transparent_70%)] opacity-80 animate-drift" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl space-y-8">
          <p className="animate-fade-up text-sm font-medium uppercase tracking-[0.22em] text-accent">
            AI Project Architect
          </p>

          <h1 className="animate-fade-up-delayed font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Understand the project
            <span className="block text-accent">before you build it.</span>
          </h1>

          <p className="animate-fade-up-delayed max-w-xl text-lg leading-8 text-muted">
            Run structured discovery, capture roles and capabilities, and produce
            a clean Discovery JSON ready for engineering.
          </p>

          <div className="animate-fade-up-delayed flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/discovery"
              className="bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-accent-strong"
            >
              Start New Project
            </Link>
            <p className="text-sm text-muted">
              Discovery Engine only — no AI generation in this phase.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
