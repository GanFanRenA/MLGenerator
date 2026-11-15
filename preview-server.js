const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const {
  createAndActivateEnvironment,
  getEnvironmentStatus,
} = require("./environment-manager");
const { createDirectory, listDirectories } = require("./folder-browser");
const { chooseProjectFolder } = require("./folder-picker");
const {
  createRequirements,
  getLibraryStatus,
} = require("./library-manager");
const { detectPython } = require("./python-detector");
const { getProjectRoot, setProjectRoot } = require("./project-state");

const root = __dirname;
const defaultPort = Number(process.env.PORT || 8765);
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
        reject(new Error("The request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("The request body is not valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function createPreviewServer() {
  return http.createServer((request, response) => {
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

    if (requestUrl.pathname === "/api/project/choose") {
      if (request.method !== "POST") {
        response.writeHead(405, { Allow: "POST" });
        response.end();
        return;
      }

      getProjectRoot()
        .then((projectRoot) => chooseProjectFolder(projectRoot))
        .then((selectedPath) =>
          selectedPath
            ? setProjectRoot(selectedPath).then((projectRoot) => ({
                selected: true,
                path: projectRoot,
              }))
            : { selected: false },
        )
        .then((result) => {
          response.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(JSON.stringify(result));
        })
        .catch((error) => {
          const status =
            error.code === "FOLDER_PICKER_BUSY"
              ? 409
              : error.code === "FOLDER_PICKER_UNSUPPORTED"
                ? 501
                : 500;
          response.writeHead(status, {
            "Cache-Control": "no-store",
            "Content-Type": "application/json; charset=utf-8",
          });
          response.end(
            JSON.stringify({
              message: error.message || "Unable to open the system folder picker.",
            }),
          );
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
              message: error.message || "Unable to read the folder.",
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
              message: error.message || "Unable to create the virtual environment.",
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

    if (requestUrl.pathname === "/api/libraries/requirements") {
      if (request.method !== "POST") {
        response.writeHead(405, { Allow: "POST" });
        response.end();
        return;
      }

      readJsonBody(request)
        .then((payload) => createRequirements(payload.libraries))
        .then((result) => {
          response.writeHead(201, {
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
              message: error.message || "Unable to generate requirements.txt.",
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
  });
}

function startPreviewServer({ port = defaultPort, host = "127.0.0.1" } = {}) {
  return new Promise((resolve, reject) => {
    const server = createPreviewServer();

    function handleStartupError(error) {
      server.close();
      reject(error);
    }

    server.once("error", handleStartupError);
    server.listen(port, host, () => {
      server.off("error", handleStartupError);
      const address = server.address();
      const actualPort =
        address && typeof address === "object" ? address.port : port;

      resolve({
        server,
        url: `http://${host}:${actualPort}`,
      });
    });
  });
}

if (require.main === module) {
  startPreviewServer()
    .then(({ url }) => {
      console.log(`Preview: ${url}`);
    })
    .catch((error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${defaultPort} is already in use. The local preview service may already be running.`,
        );
        console.error(`Open http://127.0.0.1:${defaultPort}`);
        console.error(
          "To restart, press Ctrl+C in the terminal running the existing service first.",
        );
      } else {
        console.error(error);
      }

      process.exitCode = 1;
    });
}

module.exports = {
  createPreviewServer,
  startPreviewServer,
};
