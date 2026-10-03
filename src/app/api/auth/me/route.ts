import { getCurrentUser } from "@/lib/user-auth";

export const dynamic = "force-dynamic";

/** Current buyer session for client components (header auth state). */
export async function GET() {
  const user = await getCurrentUser();
  return Response.json({ ok: true, user });
}
