import crypto from "node:crypto";

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

export function requireAdmin(request) {
  const email = String(request.headers.get("x-admin-email") || "").trim().toLowerCase();
  if (!email.endsWith("@yourwaylearning.com")) return null;
  return email;
}

export function createSession({ name, adminEmail } = {}) {
  const id = crypto.randomBytes(4).toString("hex");
  const session = {
    id,
    name: name && String(name).trim() ? String(name).trim() : `Session ${id}`,
    adminEmail,
    createdAt: new Date().toISOString(),
    stoppedAt: null,
    votes: emptyVotes(),
  };
  const store = state();
  store.sessions.set(id, session);
  store.listeners.set(id, new Set());
  return session;
}

export function listSessions() {
  return Array.from(state().sessions.values());
}

export function getSession(id) {
  return state().sessions.get(id);
}

export function deleteSession(id) {
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

export function resetSession(session) {
  session.votes = emptyVotes();
  broadcast(session);
}
