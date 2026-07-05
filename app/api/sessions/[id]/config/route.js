import { ensureSession, sessionSummary } from "../../../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { id } = await params;
  const session = await ensureSession(id);
  return Response.json(sessionSummary(session, request));
}
