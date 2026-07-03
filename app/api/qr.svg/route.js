import QRCode from "qrcode";
import { publicBaseUrl } from "../../../lib/sessions";

export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const data = url.searchParams.get("data") || `${publicBaseUrl(request)}/s/main?view=survey`;
  const svg = await QRCode.toString(data, {
    type: "svg",
    margin: 2,
    width: 320,
    color: {
      dark: "#4260E6",
      light: "#FFFFFF",
    },
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
