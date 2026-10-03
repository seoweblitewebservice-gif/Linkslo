import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/user-auth";

export const metadata: Metadata = {
  title: "Sign in to Linkslo",
  description:
    "Sign in to your Linkslo account to see all your orders, track progress and download delivery files in one dashboard.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <PageHero
        eyebrow="Your account"
        eyebrowIcon="users"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sign in" }]}
        title="Sign in to Linkslo"
        description="One account for every order. Sign in to see statuses, delivery files and order history in your personal dashboard."
      />
      <section className="bg-canvas py-10 sm:py-14">
        <div className="container-x">
          <div className="mx-auto max-w-md">
            <Suspense>
              <AuthForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
