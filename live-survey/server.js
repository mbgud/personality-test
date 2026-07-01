const http = require("http");
const os = require("os");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const characterIds = ["tico", "bobbi", "mugsy", "axel", "cherrylu", "nova", "marsha", "pip"];
let votes = Object.fromEntries(characterIds.map((id) => [id, 0]));
const clients = new Set();

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

function broadcast() {
  const payload = `data: ${JSON.stringify(votes)}\n\n`;
  for (const res of clients) res.write(payload);
}

function serveFile(req, res) {
  let requestPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (requestPath === "/") requestPath = "/Live Survey.dc.html";
  const filePath = path.normalize(path.join(root, requestPath));
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/config") {
    sendJson(res, 200, { publicBaseUrl: publicBaseUrl(req) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/qr.svg") {
    const data = url.searchParams.get("data") || `${publicBaseUrl(req)}/?view=survey`;
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

  if (req.method === "GET" && url.pathname === "/api/votes") {
    sendJson(res, 200, votes);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    clients.add(res);
    res.write(`data: ${JSON.stringify(votes)}\n\n`);
    req.on("close", () => clients.delete(res));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/vote") {
    try {
      const body = await readBody(req);
      if (!characterIds.includes(body.id)) {
        sendJson(res, 400, { error: "Unknown character id" });
        return;
      }
      votes = { ...votes, [body.id]: (votes[body.id] || 0) + 1 };
      broadcast();
      sendJson(res, 200, votes);
    } catch (error) {
      sendJson(res, 400, { error: "Invalid request body" });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/reset") {
    votes = Object.fromEntries(characterIds.map((id) => [id, 0]));
    broadcast();
    sendJson(res, 200, votes);
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
  console.log(`Live survey board: ${base}/`);
  console.log(`Participant survey: ${base}/?view=survey`);
});
