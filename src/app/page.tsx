import { PLATFORM_ENGINES } from "@/config/platform";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Foundation Ready
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          AI Project Architect
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Application foundation initialized with Next.js 15, TypeScript,
          Tailwind CSS, and the App Router. Engineering engines are scaffolded
          and ready for implementation approval.
        </p>
      </header>

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted">
          Platform Engines
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {PLATFORM_ENGINES.map((engine) => (
            <li
              key={engine.id}
              className="border border-border bg-white/60 px-4 py-3 text-sm text-foreground"
            >
              {engine.name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
