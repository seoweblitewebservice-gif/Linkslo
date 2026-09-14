"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_STYLE, isOrderStatus, type DeliveryFile } from "@/lib/orders";

type AdminOrder = {
  id: number;
  reference: string;
  serviceName: string;
  packageName: string;
  price: number;
  status: string;
  customerName: string;
  customerEmail: string;
  website: string;
  targetUrl: string;
  paypalOrderId: string;
  deliveryNote: string;
  deliveryFiles: DeliveryFile[];
  createdAt: string;
};

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data?.orders ?? []))
      .catch(() => setOrders([]));
  };

  useEffect(load, []);

  if (orders === null) return <div className="rounded-2xl border border-line bg-white p-6 text-[0.84rem] text-ink-400">Loading…</div>;

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">Admin</p>
      <h2 className="mt-1 font-display text-[1.3rem] font-semibold text-ink-950">All orders ({orders.length})</h2>
      <p className="mt-1 text-[0.8rem] text-ink-400">Update status and attach delivery files/reports for any order.</p>

      <ul className="mt-5 space-y-3">
        {orders.map((order) => (
          <li key={order.id} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.86rem] font-semibold text-ink-900">{order.serviceName}</p>
                <p className="mt-0.5 text-[0.72rem] text-ink-400">
                  {order.reference} · {order.customerName} ({order.customerEmail}) · {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[0.84rem] font-semibold text-ink-800">{formatCurrency(order.price, "USD")}</span>
                <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${ORDER_STATUS_STYLE[isOrderStatus(order.status) ? order.status : "pending_review"]}`}>
                  {ORDER_STATUS_LABELS[isOrderStatus(order.status) ? order.status : "pending_review"]}
                </span>
                <Button variant="outline" size="sm" onClick={() => setEditingId(editingId === order.id ? null : order.id)}>
                  {editingId === order.id ? "Close" : "Manage"}
                </Button>
              </div>
            </div>
            {editingId === order.id && <EditOrder order={order} onSaved={load} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EditOrder({ order, onSaved }: { order: AdminOrder; onSaved: () => void }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.deliveryNote);
  const [files, setFiles] = useState<DeliveryFile[]>(order.deliveryFiles.length ? order.deliveryFiles : [{ name: "", url: "" }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const cleanFiles = files.filter((f) => f.url.trim());
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, deliveryNote: note, deliveryFiles: cleanFiles }),
    });
    setSaving(false);
    setSaved(true);
    onSaved();
  }

  return (
    <div className="mt-4 space-y-4 border-t border-line pt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[0.66rem] uppercase tracking-wide text-ink-400">Target page</p>
          <p className="truncate text-[0.82rem] text-ink-700">{order.targetUrl || order.website || "—"}</p>
        </div>
        <div>
          <p className="text-[0.66rem] uppercase tracking-wide text-ink-400">PayPal order ID</p>
          <p className="truncate text-[0.82rem] text-ink-700">{order.paypalOrderId || "Not yet paid"}</p>
        </div>
      </div>

      <div>
        <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-500">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[0.84rem]"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-500">Delivery note / report text</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="e.g. Live URL: https://... — published 14 Sep, indexed and dofollow as agreed."
          className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[0.84rem]"
        />
      </div>

      <div>
        <label className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-500">Delivery files (paste a link — Google Drive, PDF, live URL, etc.)</label>
        <div className="mt-1 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={file.name}
                onChange={(e) => setFiles(files.map((f, i) => (i === index ? { ...f, name: e.target.value } : f)))}
                placeholder="File name (e.g. Delivery report.pdf)"
                className="w-1/3 rounded-lg border border-line px-3 py-2 text-[0.8rem]"
              />
              <input
                value={file.url}
                onChange={(e) => setFiles(files.map((f, i) => (i === index ? { ...f, url: e.target.value } : f)))}
                placeholder="https://..."
                className="flex-1 rounded-lg border border-line px-3 py-2 text-[0.8rem]"
              />
              <button
                type="button"
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                aria-label="Remove file"
                className="shrink-0 rounded-lg border border-line px-2 text-ink-400 hover:text-rose-accent"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFiles([...files, { name: "", url: "" }])}
            className="text-[0.78rem] font-medium text-brand-700 hover:underline"
          >
            + Add another file
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving} icon="check">
          {saving ? "Saving…" : "Save & notify"}
        </Button>
        {saved && <span className="text-[0.78rem] text-brand-700">Saved ✓</span>}
      </div>
    </div>
  );
}
