import { createSession, listSessions, requireAdmin, sessionSummary } from "../../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Admin email must use @yourwaylearning.com" }, { status: 403 });
  }
  const sessions = await listSessions();
  return Response.json(sessions.map((session) => sessionSummary(session, request)));
}

export async function POST(request) {
  const adminEmail = requireAdmin(request);
  if (!adminEmail) {
    return Response.json({ error: "Admin email must use @yourwaylearning.com" }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const session = await createSession({ name: body.name, adminEmail });
  return Response.json(sessionSummary(session, request), { status: 201 });
}
