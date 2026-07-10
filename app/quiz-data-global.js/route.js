import { fileResponse } from "../../lib/file-response";

export const runtime = "nodejs";

export async function GET() {
  return fileResponse("quiz-data-global.js", { cacheControl: "no-store" });
}
