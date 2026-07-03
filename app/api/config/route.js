import { publicBaseUrl } from "../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(request) {
  return Response.json({ publicBaseUrl: publicBaseUrl(request), defaultSessionId: "main" });
}
