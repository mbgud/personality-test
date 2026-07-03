import { htmlResponse } from "../../lib/file-response";

export const runtime = "nodejs";

export async function GET() {
  return htmlResponse("admin.html");
}
