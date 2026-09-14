/** The one true, exhaustive lifecycle every order moves through. */
export const ORDER_STATUSES = [
  "pending_review",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_review: "Pending review",
  in_progress: "In progress",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  pending_review: "bg-ink-100 text-ink-600",
  in_progress: "bg-amber-100 text-amber-700",
  delivered: "bg-brand-50 text-brand-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export type DeliveryFile = {
  name: string;
  url: string;
};

/** The email address treated as the store owner/admin for order management and notifications. */
export const ADMIN_EMAIL = "seoweblitewebservice@gmail.com";
