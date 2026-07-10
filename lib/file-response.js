import fs from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "live-survey");
const contentTypes = {
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

export async function fileResponse(relativePath, options = {}) {
  const filePath = path.normalize(path.join(root, relativePath));
  if (!filePath.startsWith(root)) return new Response("Forbidden", { status: 403 });
  const bytes = await fs.readFile(filePath);
  const type = options.contentType || contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  return new Response(bytes, {
    headers: {
      "Content-Type": type,
      "Cache-Control": options.cacheControl || "public, max-age=31536000, immutable",
    },
  });
}

export async function htmlResponse(relativePath, { injectBase = false } = {}) {
  let html = await fs.readFile(path.join(root, relativePath), "utf8");
  if (injectBase) {
    html = html.replace("<head>", '<head>\n<base href="/">');
    html = html.replaceAll('href="_ds/', 'href="/ds/');
    html = html.replaceAll('src="_ds/', 'src="/ds/');
  }
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
