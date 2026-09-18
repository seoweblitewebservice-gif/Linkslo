"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DeliveryFile = { name: string; url: string };
type Order = {
  id: number;
  reference: string;
  serviceName: string;
  packageName: string;
  price: number;
  website: string;
  targetUrl: string;
  customerName: string;
  customerEmail: string;
  status: string;
  deliveryNote: string;
  deliveryFiles: DeliveryFile[];
  createdAt: string;
};

export function AdminOrdersClient() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (response.status === 403) {
        router.push("/admin/login");
        return;
      }
      const data = (await response.json()) as { ok?: boolean; orders?: Order[] };
      if (!response.ok || !data.ok) throw new Error("Could not load orders.");
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) =>
      [order.reference, order.customerName, order.customerEmail, order.serviceName, order.website]
        .some((value) => value.toLowerCase().includes(q)),
    );
  }, [orders, query]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (loading) return <p className="py-16 text-center text-sm text-ink-500">Loading orders…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search order, customer, email, website…"
          className="h-11 w-full max-w-xl rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus:border-brand-400"
        />
        <button onClick={logout} className="h-11 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink-700 hover:bg-ink-50">Logout</button>
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-10 text-center text-sm text-ink-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => <OrderCard key={order.id} order={order} onSaved={load} />)}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, onSaved }: { order: Order; onSaved: () => Promise<void> }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.deliveryNote || "");
  const [files, setFiles] = useState<DeliveryFile[]>(order.deliveryFiles?.length ? order.deliveryFiles : [{ name: "", url: "" }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateFile(index: number, key: keyof DeliveryFile, value: string) {
    setFiles((current) => current.map((file, i) => i === index ? { ...file, [key]: value } : file));
  }

  async function save(deliver = false) {
    setSaving(true);
    setMessage("");
    try {
      const payloadStatus = deliver ? "delivered" : status;
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: payloadStatus,
          deliveryNote: note,
          deliveryFiles: files.filter((file) => file.url.trim()),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Could not update order.");
      setStatus(payloadStatus);
      setMessage(deliver ? "Delivery published to the client tracking page." : "Order saved.");
      await onSaved();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not update order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-brand-700">{order.reference}</span>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700">{status.replaceAll("_", " ")}</span>
          </div>
          <h2 className="mt-2 font-display text-lg font-semibold text-ink-950">{order.serviceName}</h2>
          <p className="mt-1 text-sm text-ink-500">{order.packageName} · ${order.price}</p>
          <div className="mt-3 space-y-1 text-sm text-ink-600">
            <p><strong>Client:</strong> {order.customerName} · {order.customerEmail}</p>
            <p><strong>Website:</strong> {order.website}</p>
            <p className="break-all"><strong>Target:</strong> {order.targetUrl}</p>
            <p><strong>Ordered:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <label className="block min-w-48">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-400">Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm">
            <option value="pending_review">Pending review</option>
            <option value="in_progress">In progress</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Delivery note</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="Explain what was completed, placement notes, next steps…" className="w-full rounded-xl border border-line px-3.5 py-3 text-sm outline-none focus:border-brand-400" />
        </label>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-700">Delivery files / links</span>
            <button type="button" onClick={() => setFiles((current) => [...current, { name: "", url: "" }])} className="text-sm font-semibold text-brand-700">+ Add link</button>
          </div>
          {files.map((file, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[0.7fr_1.3fr_auto]">
              <input value={file.name} onChange={(event) => updateFile(index, "name", event.target.value)} placeholder="Google Sheet / Report / ZIP" className="h-10 rounded-xl border border-line px-3 text-sm" />
              <input value={file.url} onChange={(event) => updateFile(index, "url", event.target.value)} placeholder="https://drive.google.com/..." className="h-10 rounded-xl border border-line px-3 text-sm" />
              <button type="button" onClick={() => setFiles((current) => current.filter((_, i) => i !== index))} className="h-10 rounded-xl border border-line px-3 text-sm text-ink-500">Remove</button>
            </div>
          ))}
        </div>

        {message && <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">{message}</p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={saving} onClick={() => save(false)} className="h-10 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink-700 hover:bg-ink-50 disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
          <button disabled={saving} onClick={() => save(true)} className="h-10 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">Deliver to client</button>
        </div>
      </div>
    </article>
  );
}
