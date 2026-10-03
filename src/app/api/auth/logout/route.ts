import { destroyUserSession } from "@/lib/user-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await destroyUserSession();
  return Response.json({ ok: true });
}
