const fs = require("node:fs");
const path = require("node:path");
const { app, BrowserWindow, Menu, dialog, shell } = require("electron");

const APP_NAME = "ML Generator";
const WINDOW_BACKGROUND = "#f8faf8";
const isSmokeTest = process.argv.includes("--smoke-test");

let localServer = null;
let localUrl = null;
let mainWindow = null;
let applicationReady = false;

app.setName(APP_NAME);

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) {
      return;
    }

    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(startApplication).catch(showStartupError);
}

function configureApplicationState() {
  const userDataDirectory = app.getPath("userData");
  fs.mkdirSync(userDataDirectory, { recursive: true });
  process.env.MLGENERATOR_STATE_FILE = path.join(
    userDataDirectory,
    "app-state.json",
  );
}

async function startApplication() {
  configureApplicationState();

  if (process.platform !== "darwin") {
    Menu.setApplicationMenu(null);
  }

  const { startPreviewServer } = require("./preview-server");
  const startedServer = await startPreviewServer({ port: 0 });
  localServer = startedServer.server;
  localUrl = startedServer.url;
  applicationReady = true;

  createMainWindow();

  app.on("activate", () => {
    if (applicationReady && BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 960,
    minHeight: 680,
    show: false,
    title: APP_NAME,
    backgroundColor: WINDOW_BACKGROUND,
    icon: path.join(__dirname, "build", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow = window;

  window.once("ready-to-show", () => {
    if (!isSmokeTest && !window.isDestroyed()) {
      window.show();
    }
  });

  window.webContents.once("did-fail-load", (_event, errorCode, errorMessage) => {
    if (isSmokeTest) {
      console.error(`Smoke test failed to load: ${errorCode} ${errorMessage}`);
      app.exit(1);
    }
  });

  window.webContents.once("did-finish-load", async () => {
    if (!isSmokeTest) {
      return;
    }

    try {
      const result = await window.webContents.executeJavaScript(`
        (async () => {
          const response = await fetch("/api/project");
          return {
            apiStatus: response.status,
            hasAppShell: Boolean(document.querySelector("#select-folder-button")),
            title: document.title,
          };
        })()
      `);

      const passed =
        result.apiStatus === 200 &&
        result.hasAppShell &&
        result.title.startsWith("ML Generator");

      if (passed) {
        console.log("Desktop smoke test passed.");
      } else {
        console.error("Desktop smoke test failed:", result);
      }

      app.exit(passed ? 0 : 1);
    } catch (error) {
      console.error("Desktop smoke test failed:", error);
      app.exit(1);
    }
  });

  window.on("closed", () => {
    if (mainWindow === window) {
      mainWindow = null;
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    const currentOrigin = new URL(localUrl).origin;

    if (new URL(url).origin !== currentOrigin) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  window.loadURL(localUrl);
}

function showStartupError(error) {
  const message =
    error instanceof Error ? error.message : "The application could not start.";

  dialog.showErrorBox(
    `${APP_NAME} could not start`,
    `${message}\n\nClose any other copy of ${APP_NAME} and try again.`,
  );
  app.quit();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (localServer) {
    localServer.close();
    localServer = null;
  }
});
