"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("seoweblitewebservice@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || "Login failed.");
        return;
      }
      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-soft">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink-700">Admin email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          className="h-11 w-full rounded-xl border border-line px-3.5 text-sm outline-none focus:border-brand-400"
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink-700">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="h-11 w-full rounded-xl border border-line px-3.5 text-sm outline-none focus:border-brand-400"
          required
        />
      </label>
      {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in to admin"}
      </button>
    </form>
  );
}
