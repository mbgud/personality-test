import { characterIds, getSession, recordVote, votePayload } from "../../../../../lib/sessions";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { id } = await params;
  const session = await getSession(id);
  if (!session) return Response.json({ error: "Session not found" }, { status: 404 });
  if (session.stoppedAt) {
    return Response.json({ error: "Session is stopped", ...votePayload(session) }, { status: 409 });
  }
  const body = await request.json().catch(() => ({}));
  if (!characterIds.includes(body.id)) {
    return Response.json({ error: "Unknown character id" }, { status: 400 });
  }
  const updated = await recordVote(session, body);
  return Response.json(votePayload(updated));
}
