import { broadcast, characterIds, getSession, votePayload } from "../../../../../lib/sessions";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { id } = await params;
  const session = getSession(id);
  if (!session) return Response.json({ error: "Session not found" }, { status: 404 });
  if (session.stoppedAt) {
    return Response.json({ error: "Session is stopped", ...votePayload(session) }, { status: 409 });
  }
  const body = await request.json().catch(() => ({}));
  if (!characterIds.includes(body.id)) {
    return Response.json({ error: "Unknown character id" }, { status: 400 });
  }
  session.votes = { ...session.votes, [body.id]: (session.votes[body.id] || 0) + 1 };
  broadcast(session);
  return Response.json(votePayload(session));
}
