import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const characterIds = ["tico", "bobbi", "mugsy", "axel", "cherrylu", "nova", "marsha", "pip"];

const characterNames = {
  tico: "Tico",
  bobbi: "Bobbi",
  mugsy: "Mugsy",
  axel: "Axel",
  cherrylu: "CherryLu",
  nova: "Nova",
  marsha: "Marsha",
  pip: "Pip",
};

function emptyVotes() {
  return Object.fromEntries(characterIds.map((id) => [id, 0]));
}

function normalizeVotes(votes = {}) {
  return { ...emptyVotes(), ...votes };
}

function state() {
  if (!globalThis.__yourwaySurveyState) {
    const sessions = new Map();
    const listeners = new Map();
    const session = {
      id: "main",
      name: "Main session",
      adminEmail: "admin@yourwaylearning.com",
      createdAt: new Date().toISOString(),
      stoppedAt: null,
      votes: emptyVotes(),
    };
    sessions.set(session.id, session);
    listeners.set(session.id, new Set());
    globalThis.__yourwaySurveyState = { sessions, listeners };
  }
  return globalThis.__yourwaySurveyState;
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function supabase() {
  if (!hasSupabaseConfig()) return null;
  if (!globalThis.__yourwaySupabase) {
    globalThis.__yourwaySupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }
  return globalThis.__yourwaySupabase;
}

function normalizeSession(row) {
  if (Array.isArray(row)) return normalizeSession(row[0]);
  if (!row) throw new Error("Database query returned no session data. Confirm the Supabase schema has been applied.");
  return {
    id: row.id,
    name: row.name,
    adminEmail: row.admin_email,
    createdAt: row.created_at,
    stoppedAt: row.stopped_at,
    votes: normalizeVotes(row.votes),
  };
}

function sessionNameForId(id) {
  return id === "main" ? "Main session" : `Session ${id}`;
}

async function ensureMainSession() {
  if (!hasSupabaseConfig()) return;
  const client = supabase();
  const { data, error } = await client.from("survey_sessions").select("id").eq("id", "main").maybeSingle();
  if (error) throw error;
  if (data) return;

  const { error: insertError } = await client.from("survey_sessions").insert({
    id: "main",
    name: "Main session",
    admin_email: "admin@yourwaylearning.com",
    votes: emptyVotes(),
  });
  if (insertError && insertError.code !== "23505") throw insertError;
}

function throwDatabaseError(error, fallbackMessage) {
  const message = error?.message || fallbackMessage || "Database query failed";
  throw new Error(`Database query failed: ${message}`);
}

export async function ensureSession(id, options = {}) {
  const sessionId = String(id || "main").trim() || "main";
  const name = options.name || sessionNameForId(sessionId);
  const adminEmail = options.adminEmail || "admin@yourwaylearning.com";

  if (hasSupabaseConfig()) {
    if (sessionId === "main") {
      await ensureMainSession();
    } else {
      const { error } = await supabase().from("survey_sessions").insert({
        id: sessionId,
        name,
        admin_email: adminEmail,
        votes: emptyVotes(),
      });
      if (error && error.code !== "23505") throwDatabaseError(error, "Could not create missing survey session");
    }
    return getSession(sessionId);
  }

  const store = state();
  let session = store.sessions.get(sessionId);
  if (!session) {
    session = {
      id: sessionId,
      name,
      adminEmail,
      createdAt: new Date().toISOString(),
      stoppedAt: null,
      votes: emptyVotes(),
    };
    store.sessions.set(sessionId, session);
    store.listeners.set(sessionId, new Set());
  }
  return session;
}

export function requireAdmin(request) {
  const email = String(request.headers.get("x-admin-email") || "").trim().toLowerCase();
  if (!email.endsWith("@yourwaylearning.com")) return null;
  return email;
}

export async function createSession({ name, adminEmail } = {}) {
  const id = crypto.randomBytes(4).toString("hex");
  const session = {
    id,
    name: name && String(name).trim() ? String(name).trim() : `Session ${id}`,
    adminEmail,
    createdAt: new Date().toISOString(),
    stoppedAt: null,
    votes: emptyVotes(),
  };

  if (hasSupabaseConfig()) {
    await ensureMainSession();
    const { data, error } = await supabase()
      .from("survey_sessions")
      .insert({
        id: session.id,
        name: session.name,
        admin_email: session.adminEmail,
        votes: session.votes,
      })
      .select("*")
      .single();
    if (error) throwDatabaseError(error, "Could not create survey session");
    return normalizeSession(data);
  }

  const store = state();
  store.sessions.set(id, session);
  store.listeners.set(id, new Set());
  return session;
}

export async function listSessions() {
  if (hasSupabaseConfig()) {
    await ensureMainSession();
    const { data, error } = await supabase().from("survey_sessions").select("*").order("created_at", { ascending: false });
    if (error) throwDatabaseError(error, "Could not list survey sessions");
    if (!Array.isArray(data)) throwDatabaseError(null, "Expected survey_sessions query to return an array. Confirm the table exists and the service role key is valid.");
    return data.map(normalizeSession);
  }
  return Array.from(state().sessions.values());
}

export async function getSession(id) {
  if (hasSupabaseConfig()) {
    await ensureMainSession();
    const { data, error } = await supabase().from("survey_sessions").select("*").eq("id", id).maybeSingle();
    if (error) throwDatabaseError(error, "Could not read survey session");
    return data ? normalizeSession(data) : null;
  }
  return state().sessions.get(id);
}

export async function deleteSession(id) {
  if (hasSupabaseConfig()) {
    await ensureMainSession();
    const { count, error: countError } = await supabase().from("survey_sessions").select("id", { count: "exact", head: true });
    if (countError) throwDatabaseError(countError, "Could not count survey sessions");
    if ((count || 0) <= 1) return false;

    const { error } = await supabase().from("survey_sessions").delete().eq("id", id);
    if (error) throwDatabaseError(error, "Could not delete survey session");

    const listeners = state().listeners.get(id) || new Set();
    for (const listener of listeners) listener.close();
    state().listeners.delete(id);
    return true;
  }

  const store = state();
  if (store.sessions.size <= 1) return false;
  const deleted = store.sessions.delete(id);
  const listeners = store.listeners.get(id) || new Set();
  for (const listener of listeners) listener.close();
  store.listeners.delete(id);
  return deleted;
}

export async function listResponses(sessionId) {
  if (!hasSupabaseConfig()) return [];
  const { data, error } = await supabase()
    .from("survey_responses")
    .select("id, session_id, respondent_name, respondent_email, school, organization, created_at, answers, primary_id, secondary_id")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });
  if (error) throwDatabaseError(error, "Could not list survey responses");
  if (!Array.isArray(data)) throwDatabaseError(null, "Expected survey_responses query to return an array.");
  return data.map((row) => ({
    id: row.id,
    surveySession: row.session_id,
    name: row.respondent_name,
    email: row.respondent_email,
    school: row.school || row.organization,
    date: row.created_at,
    answers: row.answers || [],
    mainCharacter: row.primary_id,
    backedByCharacter: row.secondary_id,
  }));
}

export function publicBaseUrl(request) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}

export function sessionSummary(session, request) {
  const total = characterIds.reduce((sum, id) => sum + (session.votes[id] || 0), 0);
  const leaderId = characterIds.reduce((leader, id) => {
    return (session.votes[id] || 0) > (session.votes[leader] || 0) ? id : leader;
  }, characterIds[0]);
  return {
    id: session.id,
    name: session.name,
    adminEmail: session.adminEmail,
    createdAt: session.createdAt,
    stoppedAt: session.stoppedAt,
    isStopped: !!session.stoppedAt,
    votes: session.votes,
    total,
    leaderId: total ? leaderId : null,
    leaderName: total ? characterNames[leaderId] : null,
    boardUrl: `${publicBaseUrl(request)}/s/${session.id}`,
    surveyUrl: `${publicBaseUrl(request)}/s/${session.id}?view=survey`,
  };
}

export function votePayload(session) {
  return {
    votes: session.votes,
    isStopped: !!session.stoppedAt,
    stoppedAt: session.stoppedAt,
  };
}

export function broadcast(session) {
  const listeners = state().listeners.get(session.id) || new Set();
  const payload = votePayload(session);
  for (const listener of listeners) listener.send(payload);
}

export function addListener(sessionId, listener) {
  const store = state();
  const listeners = store.listeners.get(sessionId) || new Set();
  listeners.add(listener);
  store.listeners.set(sessionId, listeners);
  return () => listeners.delete(listener);
}

export async function stopSession(id) {
  if (hasSupabaseConfig()) {
    const existing = await getSession(id);
    if (!existing) return null;
    if (existing.stoppedAt) return existing;

    const { data, error } = await supabase()
      .from("survey_sessions")
      .update({ stopped_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throwDatabaseError(error, "Could not stop survey session");

    const session = normalizeSession(data);
    broadcast(session);
    return session;
  }

  const session = await getSession(id);
  if (!session) return null;
  session.stoppedAt = session.stoppedAt || new Date().toISOString();
  broadcast(session);
  return session;
}

export async function recordVote(session, vote) {
  const characterId = typeof vote === "string" ? vote : vote.id;
  if (session.stoppedAt) return session;
  const votes = { ...normalizeVotes(session.votes), [characterId]: (session.votes[characterId] || 0) + 1 };

  if (hasSupabaseConfig()) {
    const { data, error } = await supabase().rpc("record_survey_vote", {
      p_session_id: session.id,
      p_primary_id: characterId,
      p_secondary_id: typeof vote === "object" ? vote.secondaryId || null : null,
      p_respondent_name: typeof vote === "object" ? vote.name || null : null,
      p_respondent_email: typeof vote === "object" ? vote.email || null : null,
      p_school: typeof vote === "object" ? vote.school || vote.organization || null : null,
      p_organization: typeof vote === "object" ? vote.organization || null : null,
      p_role: typeof vote === "object" ? vote.role || null : null,
      p_scores: typeof vote === "object" ? vote.scores || null : null,
      p_answers: typeof vote === "object" ? vote.answers || null : null,
    });
    if (error) throwDatabaseError(error, "Could not record survey vote. Confirm record_survey_vote exists in Supabase.");

    const updated = normalizeSession(data);
    broadcast(updated);
    return updated;
  }

  session.votes = votes;
  broadcast(session);
  return session;
}

export async function resetSession(session) {
  if (hasSupabaseConfig()) {
    const { data, error } = await supabase()
      .from("survey_sessions")
      .update({ votes: emptyVotes() })
      .eq("id", session.id)
      .select("*")
      .single();
    if (error) throwDatabaseError(error, "Could not reset survey session");

    const { error: responseError } = await supabase().from("survey_responses").delete().eq("session_id", session.id);
    if (responseError) throwDatabaseError(responseError, "Could not clear survey responses");

    const updated = normalizeSession(data);
    broadcast(updated);
    return updated;
  }

  session.votes = emptyVotes();
  broadcast(session);
  return session;
}
