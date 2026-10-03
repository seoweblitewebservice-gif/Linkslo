import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { desc, eq, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { serviceOrders } from "@/db/schema";
import { PageHero } from "@/components/site/PageHero";
import { Button, Card } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser } from "@/lib/user-auth";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLE, isOrderStatus } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Your dashboard",
  description: "See all your Linkslo orders, track their progress and download delivery files.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function safeFiles(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function statusLabel(status: string): string {
  return isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : status;
}

function statusStyle(status: string): string {
  return isOrderStatus(status) ? ORDER_STATUS_STYLE[status] : "bg-ink-100 text-ink-600";
}

function formatDate(value: Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/dashboard");

  const emailLower = user.email.toLowerCase();
  const orders = await db
    .select()
    .from(serviceOrders)
    .where(or(eq(serviceOrders.userId, user.id), sql`lower(${serviceOrders.customerEmail}) = ${emailLower}`))
    .orderBy(desc(serviceOrders.createdAt));

  const inProgress = orders.filter((o) => o.status === "in_progress" || o.status === "pending_review").length;
  const delivered = orders.filter((o) => o.status === "delivered" || o.status === "completed").length;
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase() || "?";

  return (
    <>
      <PageHero
        eyebrow="Your dashboard"
        eyebrowIcon="users"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        title={`Welcome back, ${user.name.split(" ")[0] || "there"}`}
        description="Track every order in one place — statuses, delivery files and order history."
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-[1rem] font-bold text-white">
            {initial}
          </span>
          <div className="mr-2">
            <p className="text-[0.88rem] font-semibold text-ink-900">{user.name}</p>
            <p className="text-[0.78rem] text-ink-500">{user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </PageHero>

      <section className="bg-canvas py-10 sm:py-14">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total orders", value: orders.length, icon: "layers" as const },
              { label: "In progress", value: inProgress, icon: "clock" as const },
              { label: "Delivered", value: delivered, icon: "check" as const },
            ].map((stat) => (
              <Card key={stat.label} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink-500">{stat.label}</p>
                  <Icon name={stat.icon} size={17} className="text-brand-700" />
                </div>
                <p className="mt-2 font-display text-[1.9rem] font-semibold text-ink-950">{stat.value}</p>
              </Card>
            ))}
          </div>

          {orders.length === 0 ? (
            <Card className="mt-8 p-8 text-center sm:p-12">
              <p className="font-display text-[1.3rem] font-semibold text-ink-950">No orders yet</p>
              <p className="mx-auto mt-2 max-w-md text-[0.86rem] leading-6 text-ink-500">
                When you place an order it will show up here with live status updates and delivery files.
              </p>
              <div className="mt-6 flex justify-center">
                <Button href="/marketplace" icon="arrow-right">
                  Browse the marketplace
                </Button>
              </div>
            </Card>
          ) : (
            <div className="mt-8 space-y-5">
              {orders.map((order) => {
                const files = safeFiles(order.deliveryFiles);
                return (
                  <Card key={order.id} className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[0.78rem] font-semibold text-ink-500">{order.reference}</p>
                        <h2 className="mt-1 font-display text-[1.15rem] font-semibold text-ink-950">
                          {order.serviceName} — {order.packageName}
                        </h2>
                        <p className="mt-1 text-[0.8rem] text-ink-500">
                          Ordered {formatDate(order.createdAt)} · ${order.price}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1.5 text-[0.72rem] font-semibold ${statusStyle(order.status)}`}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </div>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">Website</dt>
                        <dd className="mt-1 text-[0.82rem] font-medium text-ink-800">{order.website}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">Market</dt>
                        <dd className="mt-1 text-[0.82rem] font-medium text-ink-800">{order.market}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[0.68rem] uppercase tracking-wide text-ink-400">Target URL</dt>
                        <dd className="mt-1 break-all text-[0.82rem] font-medium text-ink-800">{order.targetUrl}</dd>
                      </div>
                    </dl>

                    {(order.deliveryNote || files.length > 0) && (
                      <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50/60 p-4">
                        <p className="text-[0.78rem] font-semibold text-brand-900">Delivery</p>
                        {order.deliveryNote && (
                          <p className="mt-2 text-[0.8rem] leading-6 text-brand-900/80">{order.deliveryNote}</p>
                        )}
                        {files.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {files.map((file) => (
                              <li key={file}>
                                <a
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-brand-800 hover:underline"
                                >
                                  <Icon name="arrow-up-right" size={13} />
                                  Open delivery file
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
