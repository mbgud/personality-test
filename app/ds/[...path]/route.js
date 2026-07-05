import { fileResponse } from "../../../lib/file-response";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { path } = await params;
  return fileResponse(`_ds/${path.join("/")}`, { cacheControl: "no-store" });
}
