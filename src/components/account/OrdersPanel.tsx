"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLE, isOrderStatus, type DeliveryFile } from "@/lib/orders";

type Order = {
  id: number;
  reference: string;
  serviceName: string;
  packageName: string;
  price: number;
  status: string;
  gigSlug: string;
  targetUrl: string;
  website: string;
  paypalOrderId: string;
  deliveryNote: string;
  deliveryFiles: DeliveryFile[];
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

function StatusBadge({ status }: { status: string }) {
  const key = isOrderStatus(status) ? status : "pending_review";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${ORDER_STATUS_STYLE[key]}`}>
      {ORDER_STATUS_LABELS[key]}
    </span>
  );
}

export function OrdersPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/orders")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setOrders(data?.orders ?? []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (selected) {
    return <OrderDetail order={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">My account</p>
      <h2 className="mt-1 font-display text-[1.3rem] font-semibold text-ink-950">All orders</h2>

      {orders === null && <p className="mt-6 text-[0.84rem] text-ink-400">Loading your orders…</p>}

      {orders !== null && orders.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center">
          <p className="font-serif text-[1.05rem] font-semibold text-ink-900">No orders yet</p>
          <p className="mt-1 text-[0.84rem] text-ink-400">Your orders will appear here once you check out.</p>
          <Button href="/marketplace" className="mt-5" icon="arrow-right">
            Browse packages
          </Button>
        </div>
      )}

      {orders !== null && orders.length > 0 && (
        <>
          <p className="mt-1 text-[0.8rem] text-ink-400">{orders.length} order{orders.length === 1 ? "" : "s"} total. Click any order for live status and your report.</p>
          <ul className="mt-5 divide-y divide-line">
            {orders.map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => setSelected(order)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-canvas"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.88rem] font-semibold text-ink-900">{order.serviceName}</p>
                    <p className="mt-0.5 text-[0.72rem] text-ink-400">
                      {order.reference} · {order.packageName} · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[0.86rem] font-semibold text-ink-800">{formatCurrency(order.price, "USD")}</span>
                    <StatusBadge status={order.status} />
                    <Icon name="arrow-right" size={14} className="text-ink-300" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-[0.8rem] font-medium text-ink-500 hover:text-ink-800">
        <Icon name="arrow-right" size={13} className="rotate-180" />
        Back to all orders
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">{order.reference}</p>
          <h2 className="mt-1 font-display text-[1.2rem] font-semibold text-ink-950">{order.serviceName}</h2>
          <p className="mt-1 text-[0.82rem] text-ink-500">{order.packageName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <InfoRow label="Order date" value={new Date(order.createdAt).toLocaleString()} />
        <InfoRow label="Amount paid" value={formatCurrency(order.price, "USD")} />
        <InfoRow label="Website" value={order.website || "—"} />
        <InfoRow label="Target page" value={order.targetUrl || "—"} />
        <InfoRow label="Payment reference" value={order.paypalOrderId ? `PayPal · ${order.paypalOrderId}` : "Pending"} />
        <InfoRow label="Delivered" value={order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : "Not yet"} />
      </div>

      <div className="mt-6 rounded-xl border border-line bg-canvas p-4">
        <p className="text-[0.8rem] font-semibold text-ink-800">Delivery</p>
        {order.status !== "delivered" && order.status !== "completed" && (
          <p className="mt-2 text-[0.82rem] text-ink-500">
            Your order is currently <strong>{ORDER_STATUS_LABELS[isOrderStatus(order.status) ? order.status : "pending_review"]}</strong>. Files and
            the delivery report will appear here as soon as work is delivered.
          </p>
        )}
        {(order.status === "delivered" || order.status === "completed") && (
          <>
            {order.deliveryNote && (
              <p className="mt-2 whitespace-pre-wrap text-[0.84rem] leading-relaxed text-ink-700">{order.deliveryNote}</p>
            )}
            {order.deliveryFiles.length === 0 && !order.deliveryNote && (
              <p className="mt-2 text-[0.82rem] text-ink-500">Marked delivered — files will be attached shortly.</p>
            )}
            {order.deliveryFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {order.deliveryFiles.map((file, index) => (
                  <li key={index}>
                    <Link
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[0.82rem] font-medium text-brand-700 hover:border-brand-300"
                    >
                      <Icon name="document" size={14} />
                      {file.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-canvas px-3 py-2.5">
      <p className="text-[0.66rem] uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 truncate text-[0.84rem] font-medium text-ink-800">{value}</p>
    </div>
  );
}
