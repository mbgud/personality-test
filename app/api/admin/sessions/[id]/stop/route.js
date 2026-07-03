import { broadcast, getSession, requireAdmin, sessionSummary } from "../../../../../../lib/sessions";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Admin email must use @yourwaylearning.com" }, { status: 403 });
  }
  const { id } = await params;
  const session = getSession(id);
  if (!session) return Response.json({ error: "Session not found" }, { status: 404 });
  session.stoppedAt = session.stoppedAt || new Date().toISOString();
  broadcast(session);
  return Response.json(sessionSummary(session, request));
}
