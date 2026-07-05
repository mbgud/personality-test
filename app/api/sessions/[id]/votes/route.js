import { ensureSession, votePayload } from "../../../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  const session = await ensureSession(id);
  return Response.json(votePayload(session));
}
