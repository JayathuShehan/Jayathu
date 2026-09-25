export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-100">
      <div className="max-w-md w-full text-center space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-sm">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
          <span className="text-xl">✨</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Project Cleaned & Ready</h1>
        <p className="text-sm text-zinc-400">
          The workspace has been reset to a fresh baseline. Provide your prompt or requirements whenever you are ready!
        </p>
      </div>
    </main>
  );
}
