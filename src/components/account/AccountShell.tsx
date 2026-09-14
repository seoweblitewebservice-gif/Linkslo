"use client";

import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { Icon, type GlyphName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { OrdersPanel } from "@/components/account/OrdersPanel";
import { AdminOrdersPanel } from "@/components/account/AdminOrdersPanel";

type Tab = "overview" | "orders" | "profile" | "admin";

const NAV: { id: Tab; label: string; icon: GlyphName }[] = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "orders", label: "Orders", icon: "document" },
  { id: "profile", label: "Profile", icon: "users" },
];

export function AccountShell({
  name,
  email,
  imageUrl,
  isAdmin,
}: {
  name: string;
  email: string;
  imageUrl: string | null;
  isAdmin: boolean;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const initials = (name || email || "U").slice(0, 1).toUpperCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-start">
      <aside className="rounded-2xl border border-line bg-white p-4 lg:sticky lg:top-24">
        <div className="flex items-center gap-3 rounded-xl bg-canvas p-3">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name} className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 text-[0.78rem] font-semibold text-white">
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[0.86rem] font-semibold text-ink-950">{name || "Your account"}</p>
            <p className="truncate text-[0.72rem] text-ink-400">{email}</p>
          </div>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.84rem] font-medium transition-colors ${
                tab === item.id ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-canvas"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setTab("admin")}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.84rem] font-medium transition-colors ${
                tab === "admin" ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-canvas"
              }`}
            >
              <Icon name="shield" size={16} />
              Admin · All orders
            </button>
          )}
        </nav>

        <div className="mt-4 border-t border-line pt-3">
          <SignOutButton redirectUrl="/">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.84rem] font-medium text-ink-500 transition-colors hover:bg-canvas hover:text-ink-800"
            >
              <Icon name="arrow-right" size={16} className="rotate-180" />
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      <div>
        {tab === "overview" && <OverviewPanel name={name} onBrowse={() => setTab("orders")} />}
        {tab === "orders" && <OrdersPanel />}
        {tab === "profile" && <ProfilePanel name={name} email={email} />}
        {tab === "admin" && isAdmin && <AdminOrdersPanel />}
      </div>
    </div>
  );
}

function OverviewPanel({ name, onBrowse }: { name: string; onBrowse: () => void }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">Welcome</p>
      <h2 className="mt-1 font-display text-[1.3rem] font-semibold text-ink-950">
        {name ? `Hey ${name.split(" ")[0]}, glad you're here.` : "Welcome back."}
      </h2>
      <p className="mt-2 max-w-lg text-[0.86rem] leading-relaxed text-ink-500">
        Track every order, see live delivery status and download completed reports the moment they land — all from
        this account.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={onBrowse} icon="arrow-right">
          View my orders
        </Button>
        <Button href="/marketplace" variant="outline">
          Browse packages
        </Button>
      </div>
    </div>
  );
}

function ProfilePanel({ name, email }: { name: string; email: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">Profile</p>
      <h2 className="mt-1 font-display text-[1.15rem] font-semibold text-ink-950">Account details</h2>
      <dl className="mt-4 space-y-3 text-[0.86rem]">
        <div className="flex justify-between border-b border-line pb-3">
          <dt className="text-ink-400">Name</dt>
          <dd className="font-medium text-ink-800">{name || "—"}</dd>
        </div>
        <div className="flex justify-between border-b border-line pb-3">
          <dt className="text-ink-400">Email</dt>
          <dd className="font-medium text-ink-800">{email}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[0.78rem] text-ink-400">
        Signed in with Google. To change your name or photo, update it in your Google account.
      </p>
    </div>
  );
}
