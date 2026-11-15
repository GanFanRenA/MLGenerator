const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const {
  createAndActivateEnvironment,
  getEnvironmentStatus,
} = require("./environment-manager");
const { createDirectory, listDirectories } = require("./folder-browser");
const {
  getLibraryStatus,
  installLibraries,
} = require("./library-manager");
const { detectPython } = require("./python-detector");
const { getProjectRoot, setProjectRoot } = require("./project-state");

const root = __dirname;
const port = Number(process.env.PORT || 8765);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 16_384) {
        reject(new Error("请求内容过大。"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("请求内容不是有效的 JSON。"));
      }
    });
    request.on("error", reject);
  });
}

http
  .createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://127.0.0.1");

    if (requestUrl.pathname === "/api/python") {
      if (request.method !== "GET") {
        response.writeHead(405, { Allow: "GET" });
        response.end();
        return;
      }

      detectPython()
        .then((result) => {
          response.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify(result));
        })
        .catch((error) => {
          response.writeHead(500, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(
            JSON.stringify({
              found: false,
              checkedAt: new Date().toISOString(),
              reason: "DETECTION_FAILED",
              message: error.message,
            }),
          );
        });
      return;
    }

    if (requestUrl.pathname === "/api/project") {
      const operation =
        request.method === "GET"
          ? getProjectRoot().then((projectRoot) => ({
              selected: Boolean(projectRoot),
              path: projectRoot,
            }))
          : request.method === "POST"
            ? readJsonBody(request)
                .then((payload) => setProjectRoot(payload.path))
                .then(async (projectRoot) => ({
                  selected: true,
                  path: projectRoot,
                }))
            : null;

      if (!operation) {
        response.writeHead(405, { Allow: "GET, POST" });
        response.end();
        return;
      }

      operation
        .then((projectRoot) => {
          response.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify(projectRoot));
        })
        .catch((error) => {
          response.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify({ message: error.message }));
        });
      return;
    }

    if (requestUrl.pathname === "/api/folders") {
      const operation =
        request.method === "GET"
          ? getProjectRoot().then((projectRoot) =>
              listDirectories(
                requestUrl.searchParams.get("path") || projectRoot,
              ),
            )
          : request.method === "POST"
            ? readJsonBody(request).then((payload) =>
                createDirectory(payload.parentPath, payload.name),
              )
            : null;

      if (!operation) {
        response.writeHead(405, { Allow: "GET, POST" });
        response.end();
        return;
      }

      operation
        .then((result) => {
          response.writeHead(request.method === "POST" ? 201 : 200, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify(result));
        })
        .catch((error) => {
          response.writeHead(400, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(
            JSON.stringify({
              message: error.message || "无法读取文件夹。",
            }),
          );
        });
      return;
    }

    if (requestUrl.pathname === "/api/environment") {
      const operation =
        request.method === "GET"
          ? getEnvironmentStatus()
          : request.method === "POST"
            ? createAndActivateEnvironment()
            : null;

      if (!operation) {
        response.writeHead(405, { Allow: "GET, POST" });
        response.end();
        return;
      }

      operation
        .then((result) => {
          response.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify(result));
        })
        .catch((error) => {
          const status = error.code === "ENVIRONMENT_BUSY" ? 409 : 400;
          response.writeHead(status, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(
            JSON.stringify({
              state: "error",
              message: error.message || "无法创建虚拟环境。",
            }),
          );
        });
      return;
    }

    if (requestUrl.pathname === "/api/libraries") {
      if (request.method !== "GET") {
        response.writeHead(405, { Allow: "GET" });
        response.end();
        return;
      }

      getLibraryStatus()
        .then((result) => {
          response.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify(result));
        })
        .catch((error) => {
          response.writeHead(400, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify({ message: error.message }));
        });
      return;
    }

    if (requestUrl.pathname === "/api/libraries/install") {
      if (request.method !== "POST") {
        response.writeHead(405, { Allow: "POST" });
        response.end();
        return;
      }

      readJsonBody(request)
        .then((payload) => installLibraries(payload.libraries))
        .then((result) => {
          response.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify(result));
        })
        .catch((error) => {
          response.writeHead(400, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(
            JSON.stringify({
              state: "error",
              message: error.message || "无法安装 Python 库。",
            }),
          );
        });
      return;
    }

    const requestPath = request.url === "/" ? "/index.html" : request.url;
    const filePath = path.resolve(root, `.${requestPath.split("?")[0]}`);

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      });
      response.end(content);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Preview: http://127.0.0.1:${port}`);
  });
