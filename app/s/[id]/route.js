import { htmlResponse } from "../../../lib/file-response";
import { ensureSession } from "../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  await ensureSession(id);
  return htmlResponse("Live Survey.dc.html", { injectBase: true });
}
