import { requireAdmin, sessionSummary, stopSession } from "../../../../../../lib/sessions";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Admin email must use @yourwaylearning.com" }, { status: 403 });
  }
  const { id } = await params;
  const session = await stopSession(id);
  if (!session) return Response.json({ error: "Session not found" }, { status: 404 });
  return Response.json(sessionSummary(session, request));
}
