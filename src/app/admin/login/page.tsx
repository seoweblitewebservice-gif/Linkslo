import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { LogoMark } from "@/components/brand/Logo";
import { isAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Linkslo order administration login.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/admin/orders");

  return (
    <div className="relative overflow-hidden bg-canvas">
      <div className="aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative flex min-h-[72vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="flex justify-center"><LogoMark size={46} /></div>
            <h1 className="mt-5 font-display text-3xl font-semibold text-ink-950">Linkslo Admin</h1>
            <p className="mt-2 text-sm text-ink-500">Manage customer orders and deliveries.</p>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
