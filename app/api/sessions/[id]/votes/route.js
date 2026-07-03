import { getSession, votePayload } from "../../../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  const session = getSession(id);
  if (!session) return Response.json({ error: "Session not found" }, { status: 404 });
  return Response.json(votePayload(session));
}
