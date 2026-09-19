import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, normalize, extname } from "node:path";
import { pathToFileURL } from "node:url";

const PORT = 8081;
const ROOT = "D:\\structural_design_en\\Structural_Design_EN";
const FUNC = join(ROOT, ".vercel", "output", "functions", "__server.func", "index.mjs");
const STATIC = join(ROOT, ".vercel", "output", "static");

const { default: vercelHandler } = await import(pathToFileURL(FUNC).href);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
};

function tryStatic(pathname) {
  const rel = normalize(decodeURIComponent(pathname)).replace(/^[\\/]+/, "");
  if (!rel || rel.includes("..")) return null;
  const file = join(STATIC, rel);
  if (!existsSync(file)) return null;
  return file;
}

const server = createServer(async (req, res) => {
  try {
    const pathOnly = (req.url ?? "/").split("?", 1)[0];
    const staticFile = tryStatic(pathOnly);
    if (staticFile) {
      const body = readFileSync(staticFile);
      res.writeHead(200, { "content-type": MIME[extname(staticFile).toLowerCase()] ?? "application/octet-stream" });
      res.end(body);
      return;
    }

    const reqInit = { method: req.method, headers: req.headers };
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length) reqInit.body = Buffer.concat(chunks);

    const request = new Request("http://127.0.0.1:" + PORT + (req.url ?? "/"), reqInit);
    request.headers.set("x-forwarded-host", req.headers.host ?? `127.0.0.1:${PORT}`);
    request.headers.set("x-forwarded-proto", "http");

    const response = await vercelHandler.fetch(request, {});
    const respBody = await response.arrayBuffer();
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    res.end(Buffer.from(respBody));
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(String(err?.stack || err));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[served-vercel-build] http://127.0.0.1:${PORT}/`);
});