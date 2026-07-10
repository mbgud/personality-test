import { listResponses, requireAdmin } from "../../../../../../lib/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Admin email must use @yourwaylearning.com" }, { status: 403 });
  }
  const { id } = await params;
  const responses = await listResponses(id);
  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    return new Response(responsesToCsv(responses), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="survey-${id}-answers.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return Response.json(responses);
}

function responsesToCsv(responses) {
  const maxAnswers = Math.max(0, ...responses.map((response) => response.answers.length));
  const headers = ["Name", "Email", "School", "Date", "Main character", "Backed by character", "Survey session"];
  for (let i = 1; i <= maxAnswers; i += 1) {
    headers.push(`Question ${i}`, `Answer ${i}`, `Answer ${i} character`);
  }
  const rows = responses.map((response) => {
    const row = [
      response.name,
      response.email,
      response.school,
      response.date,
      response.mainCharacter,
      response.backedByCharacter,
      response.surveySession,
    ];
    for (let i = 0; i < maxAnswers; i += 1) {
      const answer = response.answers[i] || {};
      row.push(answer.question || "", answer.answer || answer.label || "", answer.character || answer.char || "");
    }
    return row;
  });
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
