"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card } from "@/components/ui/primitives";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[0.86rem] text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white";
  const labelClass = "mb-1.5 block text-[0.76rem] font-semibold text-ink-700";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setMessage("");
    setLoading(true);
    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok: boolean;
        errors?: Record<string, string>;
        message?: string;
      };
      if (data.ok) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }
      if (data.errors) setErrors(data.errors);
      if (data.message) setMessage(data.message);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setErrors({});
              setMessage("");
            }}
            className={`h-10 rounded-lg text-[0.82rem] font-semibold transition-colors ${
              mode === m ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {mode === "signup" && (
          <label className="block">
            <span className={labelClass}>Full name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Cooper"
              autoComplete="name"
              className={inputClass}
            />
            {errors.name && <span className="mt-1 block text-[0.76rem] text-rose-accent">{errors.name}</span>}
          </label>
        )}
        <label className="block">
          <span className={labelClass}>Email address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className={inputClass}
          />
          {errors.email && <span className="mt-1 block text-[0.76rem] text-rose-accent">{errors.email}</span>}
        </label>
        <label className="block">
          <span className={labelClass}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className={inputClass}
          />
          {errors.password && (
            <span className="mt-1 block text-[0.76rem] text-rose-accent">{errors.password}</span>
          )}
        </label>

        {message && (
          <p role="alert" className="rounded-xl bg-[#fdf4f5] px-4 py-3 text-[0.8rem] text-rose-accent">
            {message}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" icon="arrow-right" disabled={loading}>
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-[0.76rem] leading-5 text-ink-500">
        {mode === "signin"
          ? "New here? Switch to “Create account” above — it takes less than a minute."
          : "Creating an account lets you see every order you place in one dashboard."}
      </p>
    </Card>
  );
}
