"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      setMessage("Enter a valid work email address.");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message ?? "Something went wrong.");
      setStatus("success");
      setMessage(data.message ?? "You are on the list.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  const invalid = status === "error";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="block text-[0.82rem] font-medium text-ink-200">
        Monthly SEO research digest
      </label>
      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Icon
            name="mail"
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            aria-invalid={invalid}
            aria-describedby="newsletter-status"
            placeholder="you@company.com"
            className={`h-11 w-full rounded-xl border bg-white/5 pl-10 pr-3 text-[0.9rem] text-white placeholder:text-ink-400 transition-colors focus:bg-white/10 ${
              invalid ? "border-rose-accent" : "border-white/15 hover:border-white/30"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-[0.88rem] font-semibold text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Subscribe"}
          {status !== "loading" && <Icon name="arrow-right" size={16} />}
        </button>
      </div>
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-[1.1rem] text-[0.78rem] ${
          status === "error" ? "text-rose-accent" : status === "success" ? "text-brand-300" : "text-ink-400"
        }`}
      >
        {message || "One email per month. Research, teardowns and product notes. Unsubscribe any time."}
      </p>
    </form>
  );
}
