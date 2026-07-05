import { characterIds, ensureSession, recordVote, votePayload } from "../../../../../lib/sessions";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { id } = await params;
  const session = await ensureSession(id);
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
