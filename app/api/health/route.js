import { listSessions } from "../../../lib/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessions = await listSessions();
    return Response.json({
      ok: true,
      storage: process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "memory",
      publicBaseUrl: process.env.PUBLIC_BASE_URL || null,
      sessionCount: sessions.length,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        storage: process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "memory",
        publicBaseUrl: process.env.PUBLIC_BASE_URL || null,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
