import { htmlResponse } from "../../../lib/file-response";
import { getSession } from "../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!getSession(id)) return new Response("Session not found", { status: 404 });
  return htmlResponse("Live Survey.dc.html", { injectBase: true });
}
