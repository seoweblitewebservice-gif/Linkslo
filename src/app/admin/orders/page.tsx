import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";
import { isAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "Manage Linkslo customer orders and deliveries.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdminSession())) redirect("/admin/login");

  return (
    <section className="bg-canvas py-10 sm:py-14">
      <div className="container-x">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-950">Orders & deliveries</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            Review paid orders, update progress, add delivery notes and publish Google Sheet, Drive or report links for clients.
          </p>
        </div>
        <AdminOrdersClient />
      </div>
    </section>
  );
}
