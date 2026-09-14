"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { EMAIL_PATTERN } from "@/lib/format";

const OBJECTIVES = [
  "Guest post backlinks",
  "Editorial / contextual links",
  "Niche edits",
  "Digital PR campaign",
  "Local backlinks & citations",
  "Competitor link gap closing",
  "Monthly link building",
  "Not sure yet",
];

const BUDGETS = [
  "Under €1,000 / month",
  "€1,000 – €3,000 / month",
  "€3,000 – €8,000 / month",
  "€8,000 – €20,000 / month",
  "€20,000+ / month",
];

type Fields = {
  name: string;
  email: string;
  company: string;
  website: string;
  objective: string;
  budget: string;
  message: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  company: "",
  website: "",
  objective: OBJECTIVES[0],
  budget: BUDGETS[1],
  message: "",
};

function fieldClasses(hasError: boolean) {
  return `h-11 w-full rounded-xl border px-3.5 text-[0.9rem] text-ink-900 transition-colors placeholder:text-ink-400 focus:border-brand-400 ${
    hasError ? "border-rose-accent bg-[#fdf4f5]" : "border-line bg-canvas hover:border-ink-200 focus:bg-white"
  }`;
}

export function LeadForm({ source = "contact" }: { source?: string }) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate() {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!EMAIL_PATTERN.test(fields.email.trim())) next.email = "Enter a valid work email address.";
    if (fields.message.trim().length > 0 && fields.message.trim().length < 10) {
      next.message = "Add at least 10 characters so we can prepare properly.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    if (!validate()) {
      setStatus("error");
      setNotice("Please correct the highlighted fields.");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, source }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        errors?: Partial<Record<keyof Fields, string>>;
      };
      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        setNotice(data.message ?? "Please review the form and try again.");
        return;
      }
      setStatus("success");
      setNotice(data.message ?? "Thanks — we will be in touch shortly.");
      setFields(EMPTY);
    } catch {
      setStatus("error");
      setNotice("Network error. Please try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
          <Icon name="check" size={22} />
        </span>
        <h3 className="mt-4 font-display text-[1.15rem] font-semibold text-ink-950">
          Request received
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-ink-600">{notice}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setNotice("");
          }}
          className="mt-5 text-[0.85rem] font-semibold text-brand-700 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink-700">
            Full name <span className="text-rose-accent">*</span>
          </span>
          <input
            value={fields.name}
            onChange={(event) => set("name", event.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={fieldClasses(Boolean(errors.name))}
            placeholder="Alex Moreau"
          />
          {errors.name && <span className="mt-1 block text-[0.74rem] text-rose-accent">{errors.name}</span>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink-700">
            Work email <span className="text-rose-accent">*</span>
          </span>
          <input
            type="email"
            value={fields.email}
            onChange={(event) => set("email", event.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={fieldClasses(Boolean(errors.email))}
            placeholder="alex@company.com"
          />
          {errors.email && <span className="mt-1 block text-[0.74rem] text-rose-accent">{errors.email}</span>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink-700">Company</span>
          <input
            value={fields.company}
            onChange={(event) => set("company", event.target.value)}
            autoComplete="organization"
            className={fieldClasses(false)}
            placeholder="Company name"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink-700">Website</span>
          <input
            value={fields.website}
            onChange={(event) => set("website", event.target.value)}
            autoComplete="url"
            className={fieldClasses(false)}
            placeholder="company.com"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink-700">Primary objective</span>
          <div className="relative">
            <select
              value={fields.objective}
              onChange={(event) => set("objective", event.target.value)}
              className={`${fieldClasses(false)} appearance-none pr-9`}
            >
              {OBJECTIVES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink-700">Monthly budget</span>
          <div className="relative">
            <select
              value={fields.budget}
              onChange={(event) => set("budget", event.target.value)}
              className={`${fieldClasses(false)} appearance-none pr-9`}
            >
              {BUDGETS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
          </div>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[0.78rem] font-semibold text-ink-700">
          What are you trying to achieve?
        </span>
        <textarea
          value={fields.message}
          onChange={(event) => set("message", event.target.value)}
          rows={4}
          aria-invalid={Boolean(errors.message)}
          className={`w-full rounded-xl border px-3.5 py-3 text-[0.9rem] text-ink-900 transition-colors placeholder:text-ink-400 focus:border-brand-400 ${
            errors.message ? "border-rose-accent bg-[#fdf4f5]" : "border-line bg-canvas hover:border-ink-200 focus:bg-white"
          }`}
          placeholder="Markets, target pages, timelines, anything that helps us prepare."
        />
        {errors.message && <span className="mt-1 block text-[0.74rem] text-rose-accent">{errors.message}</span>}
      </label>

      {notice && status === "error" && (
        <p role="alert" className="mt-4 rounded-xl bg-[#fdf4f5] px-4 py-3 text-[0.84rem] text-rose-accent">
          {notice}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.76rem] leading-relaxed text-ink-400">
          We reply within one business day. No sales sequences, no shared data.
        </p>
        <Button type="submit" size="lg" disabled={status === "loading"} icon="arrow-right">
          {status === "loading" ? "Sending…" : "Request a consultation"}
        </Button>
      </div>
    </form>
  );
}
