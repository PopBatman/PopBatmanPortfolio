import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const exportDirectory = resolve("out");
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".txt": "text/plain; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith(basePath + "/")) {
      response.writeHead(404).end();
      return;
    }

    const relativePath = pathname.slice(basePath.length + 1);
    const file = resolve(
      exportDirectory,
      pathname.endsWith("/") ? relativePath + "index.html" : relativePath,
    );
    if (!file.startsWith(exportDirectory + sep)) {
      response.writeHead(404).end();
      return;
    }

    const contents = await readFile(file);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
    });
    response.end(contents);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4173, "127.0.0.1");
