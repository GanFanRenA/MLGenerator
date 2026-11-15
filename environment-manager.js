const { execFile } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const { detectPython } = require("./python-detector");
const {
  getEnvironment,
  getProjectRoot,
  setEnvironment,
} = require("./project-state");

const VENV_PROBE_SCRIPT = [
  "import json, platform, sys",
  "print(json.dumps({",
  '  "version": platform.python_version(),',
  '  "prefix": sys.prefix,',
  '  "basePrefix": sys.base_prefix,',
  '  "executable": sys.executable',
  "}))",
].join("\n");

let operationInProgress = false;

function runFile(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      {
        encoding: "utf8",
        maxBuffer: 2 * 1024 * 1024,
        timeout: 180_000,
        windowsHide: true,
        ...options,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              stderr.trim() ||
                stdout.trim() ||
                error.message ||
                "The Python command failed.",
            ),
          );
          return;
        }

        resolve({ stdout, stderr });
      },
    );
  });
}

function getPlatformDetails(projectRoot) {
  const isWindows = process.platform === "win32";
  const venvPath = path.join(projectRoot, ".venv");
  const pythonPath = isWindows
    ? path.join(venvPath, "Scripts", "python.exe")
    : path.join(venvPath, "bin", "python");

  return {
    isWindows,
    platform: process.platform,
    venvPath,
    pythonPath,
    activationCommand: isWindows
      ? ".\\.venv\\Scripts\\Activate.ps1"
      : "source .venv/bin/activate",
    activationShell: isWindows ? "PowerShell" : "macOS Terminal",
  };
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function inspectEnvironment(projectRoot, pythonPath) {
  const { stdout } = await runFile(
    pythonPath,
    ["-c", VENV_PROBE_SCRIPT],
    {
      cwd: projectRoot,
      timeout: 15_000,
    },
  );
  const lines = stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const details = JSON.parse(lines.at(-1));

  if (path.resolve(details.prefix) === path.resolve(details.basePrefix)) {
    throw new Error("The newly created Python still uses the global environment.");
  }

  return details;
}

function serializeReadyEnvironment(projectRoot, details) {
  const paths = getPlatformDetails(projectRoot);

  return {
    ...paths,
    activatedAt: details.activatedAt,
    version: details.version,
    prefix: details.prefix,
    active: true,
  };
}

async function getEnvironmentStatus() {
  const projectRoot = await getProjectRoot();

  if (!projectRoot) {
    return {
      state: "no-project",
      platform: process.platform,
      projectRoot: null,
      environment: null,
    };
  }

  const paths = getPlatformDetails(projectRoot);
  const savedEnvironment = await getEnvironment();
  const pythonExists = await pathExists(paths.pythonPath);

  if (
    savedEnvironment?.active &&
    savedEnvironment.venvPath === paths.venvPath &&
    pythonExists
  ) {
    return {
      state: "ready",
      projectRoot,
      environment: {
        ...savedEnvironment,
        ...paths,
        active: true,
      },
    };
  }

  return {
    state: pythonExists ? "existing" : "missing",
    projectRoot,
    ...paths,
    environment: null,
  };
}

async function activateExistingEnvironment(projectRoot) {
  const paths = getPlatformDetails(projectRoot);

  if (!(await pathExists(paths.pythonPath))) {
    return null;
  }

  const details = await inspectEnvironment(projectRoot, paths.pythonPath);
  const activatedAt = new Date().toISOString();
  const environment = {
    ...paths,
    active: true,
    activatedAt,
    version: details.version,
    prefix: details.prefix,
  };

  await setEnvironment(environment);
  return serializeReadyEnvironment(projectRoot, environment);
}

async function createAndActivateEnvironment() {
  if (operationInProgress) {
    const error = new Error("A virtual environment is being created. Please wait.");
    error.code = "ENVIRONMENT_BUSY";
    throw error;
  }

  operationInProgress = true;

  try {
    const projectRoot = await getProjectRoot();

    if (!projectRoot) {
    const error = new Error("Select a project folder in the top bar first.");
      error.code = "PROJECT_NOT_SELECTED";
      throw error;
    }

    const paths = getPlatformDetails(projectRoot);
    const existingEnvironment = await activateExistingEnvironment(projectRoot);

    if (existingEnvironment) {
      return {
        created: false,
        state: "ready",
        ...existingEnvironment,
      };
    }

    if (await pathExists(paths.venvPath)) {
      throw new Error(
        "The project directory already contains .venv, but it is not a usable virtual environment. Inspect or move that folder, then try again.",
      );
    }

    const pythonResult = await detectPython();

    if (!pythonResult.found) {
      throw new Error("No Python installation is available to create the virtual environment.");
    }

    try {
      await runFile(
        pythonResult.python.executable,
        ["-m", "venv", paths.venvPath],
        {
          cwd: projectRoot,
          env: {
            ...process.env,
            PYTHONUTF8: "1",
          },
        },
      );
    } catch (error) {
      throw new Error(`Virtual environment creation failed: ${error.message}`);
    }

    if (!(await pathExists(paths.pythonPath))) {
      throw new Error(
        `The virtual environment was created, but its Python executable was not found: ${paths.pythonPath}`,
      );
    }

    const details = await inspectEnvironment(projectRoot, paths.pythonPath);
    const activatedAt = new Date().toISOString();
    const environment = {
      ...paths,
      active: true,
      activatedAt,
      version: details.version,
      prefix: details.prefix,
    };

    await setEnvironment(environment);

    return {
      created: true,
      state: "ready",
      ...serializeReadyEnvironment(projectRoot, environment),
    };
  } finally {
    operationInProgress = false;
  }
}

module.exports = {
  createAndActivateEnvironment,
  getEnvironmentStatus,
};
