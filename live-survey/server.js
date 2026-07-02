const http = require("http");
const os = require("os");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const QRCode = require("qrcode");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const characterIds = ["tico", "bobbi", "mugsy", "axel", "cherrylu", "nova", "marsha", "pip"];
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
const sessions = new Map();
const clientsBySession = new Map();

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function emptyVotes() {
  return Object.fromEntries(characterIds.map((id) => [id, 0]));
}

function createSession({ name, adminEmail, id } = {}) {
  const sessionId = id || crypto.randomBytes(4).toString("hex");
  const session = {
    id: sessionId,
    name: name && String(name).trim() ? String(name).trim() : `Session ${sessionId}`,
    adminEmail,
    createdAt: new Date().toISOString(),
    stoppedAt: null,
    votes: emptyVotes(),
  };
  sessions.set(session.id, session);
  clientsBySession.set(session.id, new Set());
  return session;
}

createSession({ id: "main", name: "Main session", adminEmail: "admin@yourwaylearning.com" });

function localAddress() {
  const candidates = [];
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries || []) {
      if (entry.family !== "IPv4" || entry.internal) continue;
      if (entry.address.startsWith("169.254.")) continue;
      candidates.push(entry.address);
    }
  }
  return candidates.find((address) => address.startsWith("192.168."))
    || candidates.find((address) => address.startsWith("10."))
    || candidates.find((address) => address.startsWith("172."))
    || candidates[0]
    || "localhost";
}

function publicBaseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  const host = req.headers.host || `localhost:${port}`;
  const hostname = host.split(":")[0];
  if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "0.0.0.0") {
    return `http://${host}`;
  }
  const [, hostPort = String(port)] = host.match(/:(\d+)$/) || [];
  return `http://${localAddress()}:${hostPort}`;
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function requireAdmin(req, res) {
  const email = String(req.headers["x-admin-email"] || "").trim().toLowerCase();
  if (!email.endsWith("@yourwaylearning.com")) {
    sendJson(res, 403, { error: "Admin email must use @yourwaylearning.com" });
    return null;
  }
  return email;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sessionSummary(session, req) {
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
    boardUrl: `${publicBaseUrl(req)}/s/${session.id}`,
    surveyUrl: `${publicBaseUrl(req)}/s/${session.id}?view=survey`,
  };
}

function broadcast(session) {
  const payload = `data: ${JSON.stringify({ votes: session.votes, isStopped: !!session.stoppedAt, stoppedAt: session.stoppedAt })}\n\n`;
  const clients = clientsBySession.get(session.id) || new Set();
  for (const res of clients) res.write(payload);
}

function getSessionFromMatch(match) {
  const session = match ? sessions.get(match[1]) : null;
  return session;
}

function serveFile(req, res, requestPath) {
  let pathName = requestPath || decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathName === "/") pathName = "/admin.html";
  const filePath = path.normalize(path.join(root, pathName));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

function serveBoard(res) {
  const filePath = path.join(root, "Live Survey.dc.html");
  fs.readFile(filePath, "utf8", (error, html) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(html.replace("<head>", '<head>\n<base href="/">'));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const sessionApiMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)(?:\/([^/]+))?$/);

  if (req.method === "GET" && url.pathname === "/api/config") {
    sendJson(res, 200, { publicBaseUrl: publicBaseUrl(req), defaultSessionId: "main" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/sessions") {
    if (!requireAdmin(req, res)) return;
    sendJson(res, 200, Array.from(sessions.values()).map((session) => sessionSummary(session, req)));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/sessions") {
    const adminEmail = requireAdmin(req, res);
    if (!adminEmail) return;
    try {
      const body = await readBody(req);
      const session = createSession({ name: body.name, adminEmail });
      sendJson(res, 201, sessionSummary(session, req));
    } catch (error) {
      sendJson(res, 400, { error: "Invalid request body" });
    }
    return;
  }

  const adminDeleteMatch = url.pathname.match(/^\/api\/admin\/sessions\/([^/]+)$/);
  if (req.method === "DELETE" && adminDeleteMatch) {
    if (!requireAdmin(req, res)) return;
    const session = sessions.get(adminDeleteMatch[1]);
    if (!session) {
      sendJson(res, 404, { error: "Session not found" });
      return;
    }
    if (sessions.size <= 1) {
      sendJson(res, 400, { error: "At least one session must remain" });
      return;
    }
    const clients = clientsBySession.get(session.id) || new Set();
    for (const client of clients) client.end();
    clientsBySession.delete(session.id);
    sessions.delete(session.id);
    sendJson(res, 200, { ok: true });
    return;
  }

  const adminStopMatch = url.pathname.match(/^\/api\/admin\/sessions\/([^/]+)\/stop$/);
  if (req.method === "POST" && adminStopMatch) {
    if (!requireAdmin(req, res)) return;
    const session = sessions.get(adminStopMatch[1]);
    if (!session) {
      sendJson(res, 404, { error: "Session not found" });
      return;
    }
    session.stoppedAt = session.stoppedAt || new Date().toISOString();
    broadcast(session);
    sendJson(res, 200, sessionSummary(session, req));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/qr.svg") {
    const data = url.searchParams.get("data") || `${publicBaseUrl(req)}/s/main?view=survey`;
    try {
      const svg = await QRCode.toString(data, {
        type: "svg",
        margin: 2,
        width: 320,
        color: {
          dark: "#4260E6",
          light: "#FFFFFF",
        },
      });
      res.writeHead(200, {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(svg);
    } catch (error) {
      res.writeHead(500);
      res.end("QR generation failed");
    }
    return;
  }

  if (sessionApiMatch) {
    const session = getSessionFromMatch(sessionApiMatch);
    const action = sessionApiMatch[2] || "summary";
    if (!session) {
      sendJson(res, 404, { error: "Session not found" });
      return;
    }

    if (req.method === "GET" && action === "config") {
      sendJson(res, 200, sessionSummary(session, req));
      return;
    }

    if (req.method === "GET" && action === "votes") {
      sendJson(res, 200, { votes: session.votes, isStopped: !!session.stoppedAt, stoppedAt: session.stoppedAt });
      return;
    }

    if (req.method === "GET" && action === "events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });
      const clients = clientsBySession.get(session.id) || new Set();
      clientsBySession.set(session.id, clients);
      clients.add(res);
      res.write(`data: ${JSON.stringify({ votes: session.votes, isStopped: !!session.stoppedAt, stoppedAt: session.stoppedAt })}\n\n`);
      req.on("close", () => clients.delete(res));
      return;
    }

    if (req.method === "POST" && action === "vote") {
      if (session.stoppedAt) {
        sendJson(res, 409, { error: "Session is stopped", votes: session.votes, isStopped: true, stoppedAt: session.stoppedAt });
        return;
      }
      try {
        const body = await readBody(req);
        if (!characterIds.includes(body.id)) {
          sendJson(res, 400, { error: "Unknown character id" });
          return;
        }
        session.votes = { ...session.votes, [body.id]: (session.votes[body.id] || 0) + 1 };
        broadcast(session);
        sendJson(res, 200, { votes: session.votes, isStopped: false, stoppedAt: null });
      } catch (error) {
        sendJson(res, 400, { error: "Invalid request body" });
      }
      return;
    }

    if (req.method === "POST" && action === "reset") {
      const adminEmail = requireAdmin(req, res);
      if (!adminEmail) return;
      session.votes = emptyVotes();
      broadcast(session);
      sendJson(res, 200, { votes: session.votes, isStopped: !!session.stoppedAt, stoppedAt: session.stoppedAt });
      return;
    }
  }

  if (req.method === "GET" && /^\/s\/[^/]+\/?$/.test(url.pathname)) {
    const id = url.pathname.split("/")[2];
    if (!sessions.has(id)) {
      res.writeHead(404);
      res.end("Session not found");
      return;
    }
    serveBoard(res);
    return;
  }

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/admin")) {
    serveFile(req, res, "/admin.html");
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveFile(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(port, "0.0.0.0", () => {
  const base = `http://${localAddress()}:${port}`;
  console.log(`Admin dashboard: ${base}/admin`);
  console.log(`Default board: ${base}/s/main`);
  console.log(`Default survey: ${base}/s/main?view=survey`);
});
