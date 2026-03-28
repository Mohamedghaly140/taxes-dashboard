"use client";

import { testDatabaseConnection } from "@/src/actions/test.actions";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    setStatus(null);
    try {
      const result = await testDatabaseConnection();
      console.log("DB connection result:", result);
      setStatus(`Connected! User count: ${result.userCount}`);
    } catch (err) {
      console.error("DB connection failed:", err);
      setStatus("Connection failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-zinc-950">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Taxes Dashboard — DB Test
      </h1>
      <button
        onClick={handleTest}
        disabled={loading}
        className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {loading ? "Testing..." : "Test Database Connection"}
      </button>
      {status && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{status}</p>
      )}
    </main>
  );
}
