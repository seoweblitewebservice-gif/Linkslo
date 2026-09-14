import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { LogoMark } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Linkslo workspace to manage projects, campaigns and reporting.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-7">
            <LogoMark size={44} />
            <h1 className="mt-5 font-display text-[2rem] font-semibold leading-tight text-ink-950">
              Sign in to your workspace
            </h1>
            <p className="mt-2 text-[0.95rem] text-ink-500">
              Pick up campaigns, approvals and reporting where you left off.
            </p>
          </div>
          <SignIn
            path="/login"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-soft border border-line rounded-2xl w-full p-0",
                footer: "hidden",
              },
            }}
          />
        </div>

        <aside className="hidden lg:block">
          <div className="rounded-3xl border border-line bg-white p-8 shadow-soft">
            <Stars rating={5} size={16} />
            <blockquote className="mt-4 font-display text-[1.15rem] font-medium leading-relaxed text-ink-900">
              “We replaced three spreadsheets and a shared inbox with one workspace. Our monthly
              client review now takes twenty minutes instead of an afternoon.”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-[0.78rem] font-semibold text-white">
                RA
              </span>
              <span>
                <span className="block text-[0.88rem] font-semibold text-ink-950">Rachel Aiken</span>
                <span className="block text-[0.78rem] text-ink-400">Founder, Sandbar Studio</span>
              </span>
            </figcaption>
            <ul className="mt-7 space-y-3 border-t border-line pt-6">
              {[
                "Unlimited client workspaces on Agency plans",
                "White-labelled PDF and CSV reporting",
                "Role-based permissions for freelancers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.88rem] text-ink-600">
                  <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
