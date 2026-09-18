import { createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: string; password?: string };
    const email = payload.email ?? "";
    const password = payload.password ?? "";
    if (!verifyAdminCredentials(email, password)) {
      return Response.json({ ok: false, message: "Invalid admin email or password." }, { status: 401 });
    }
    await createAdminSession();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("admin login failed", error);
    return Response.json({ ok: false, message: "Admin login is not configured yet." }, { status: 500 });
  }
}
