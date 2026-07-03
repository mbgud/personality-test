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
  return {
    id: row.id,
    name: row.name,
    adminEmail: row.admin_email,
    createdAt: row.created_at,
    stoppedAt: row.stopped_at,
    votes: normalizeVotes(row.votes),
  };
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
    if (error) throw error;
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
    if (error) throw error;
    return data.map(normalizeSession);
  }
  return Array.from(state().sessions.values());
}

export async function getSession(id) {
  if (hasSupabaseConfig()) {
    await ensureMainSession();
    const { data, error } = await supabase().from("survey_sessions").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? normalizeSession(data) : null;
  }
  return state().sessions.get(id);
}

export async function deleteSession(id) {
  if (hasSupabaseConfig()) {
    await ensureMainSession();
    const { count, error: countError } = await supabase().from("survey_sessions").select("id", { count: "exact", head: true });
    if (countError) throw countError;
    if ((count || 0) <= 1) return false;

    const { error } = await supabase().from("survey_sessions").delete().eq("id", id);
    if (error) throw error;

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
    if (error) throw error;

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
      p_role: typeof vote === "object" ? vote.role || null : null,
      p_scores: typeof vote === "object" ? vote.scores || null : null,
      p_answers: typeof vote === "object" ? vote.answers || null : null,
    });
    if (error) throw error;

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
    if (error) throw error;

    const { error: responseError } = await supabase().from("survey_responses").delete().eq("session_id", session.id);
    if (responseError) throw responseError;

    const updated = normalizeSession(data);
    broadcast(updated);
    return updated;
  }

  session.votes = emptyVotes();
  broadcast(session);
  return session;
}
