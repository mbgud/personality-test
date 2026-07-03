import { deleteSession, getSession, requireAdmin } from "../../../../../lib/sessions";

export const runtime = "nodejs";

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Admin email must use @yourwaylearning.com" }, { status: 403 });
  }
  const { id } = await params;
  if (!getSession(id)) return Response.json({ error: "Session not found" }, { status: 404 });
  if (!deleteSession(id)) return Response.json({ error: "At least one session must remain" }, { status: 400 });
  return Response.json({ ok: true });
}
