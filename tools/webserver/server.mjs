import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(process.cwd());
const DEFAULT_PORT = Number(process.env.PORT || 8080);
const HOST = "127.0.0.1";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function getContentType(pathName) {
  const extension = extname(pathName).toLowerCase();
  return MIME_TYPES[extension] || "application/octet-stream";
}

function safeResolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = normalize(decoded).replace(/^([/\\])+/, "");
  const requested = normalized || "tools/configurator/index.html";
  const candidate = resolve(ROOT, requested);
  if (!candidate.startsWith(ROOT)) {
    return null;
  }

  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    const indexPath = join(candidate, "index.html");
    if (existsSync(indexPath)) {
      return indexPath;
    }
  }

  return candidate;
}

function send404(response, urlPath) {
  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  response.end(`<!doctype html><html><body><h1>404</h1><p>File not found: ${urlPath}</p></body></html>`);
}

const server = createServer((request, response) => {
  const urlPath = request.url || "/";
  const absolutePath = safeResolvePath(urlPath === "/" ? "/tools/configurator/index.html" : urlPath);

  if (!absolutePath || !existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    send404(response, urlPath);
    return;
  }

  response.writeHead(200, {
    "Content-Type": getContentType(absolutePath),
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0"
  });

  createReadStream(absolutePath).pipe(response);
});

function startServer() {
  server.listen(DEFAULT_PORT, HOST, () => {
    const url = `http://${HOST}:${DEFAULT_PORT}/tools/configurator/index.html`;
    console.log(`Configurator dev server running at ${url}`);
    console.log("Use this localhost URL for reliable folder picker behavior.");
  });
}

const isMain = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  startServer();
}

export { getContentType, safeResolvePath, startServer };
