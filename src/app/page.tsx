import { JobBoard } from "@/components/JobBoard";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Job Aggregator
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Fresh software engineering listings from RemoteOK, LinkedIn and
          Threads. No login, no tracking — filter by source, remote type,
          seniority and tech stack.
        </p>
      </header>
      <JobBoard />
    </div>
  );
}
