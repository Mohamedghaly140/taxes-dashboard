import { prisma } from "@/lib/prisma";

export default async function Home() {
  let userCount: number | null = null;
  let error: string | null = null;

  try {
    userCount = await prisma.user.count();
  } catch (err) {
    error = err instanceof Error ? err.message : "Connection failed";
  }

  const connected = error === null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Taxes Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {connected ? "Database connected" : "Database unreachable"}
          </span>
        </div>

        {connected ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Users in database:{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {userCount}
            </span>
          </p>
        ) : (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
