import { fileResponse } from "../../lib/file-response";

export const runtime = "nodejs";

export async function GET() {
  return fileResponse("quiz-data.js", { cacheControl: "no-store" });
}
