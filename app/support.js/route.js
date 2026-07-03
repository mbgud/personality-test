import { fileResponse } from "../../lib/file-response";

export const runtime = "nodejs";

export async function GET() {
  return fileResponse("support.js", { cacheControl: "no-store" });
}
