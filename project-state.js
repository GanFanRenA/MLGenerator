const fs = require("node:fs/promises");
const path = require("node:path");

const stateFile =
  process.env.MLGENERATOR_STATE_FILE ||
  path.join(__dirname, "app-state.json");

let projectRoot = null;
let environment = null;
let stateLoaded = false;

async function loadState() {
  if (stateLoaded) {
    return projectRoot;
  }

  stateLoaded = true;

  try {
    const content = await fs.readFile(stateFile, "utf8");
    const state = JSON.parse(content);

    if (typeof state.projectRoot === "string") {
      projectRoot = await validateDirectory(state.projectRoot);
    }

    if (state.environment && typeof state.environment === "object") {
      environment = state.environment;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Unable to load project state:", error.message);
    }
    projectRoot = null;
  }

  return projectRoot;
}

async function validateDirectory(directory) {
  const resolvedPath = path.resolve(directory);
  const details = await fs.stat(resolvedPath);

  if (!details.isDirectory()) {
    throw new Error("The selected path is not a folder.");
  }

  return resolvedPath;
}

async function getProjectRoot() {
  await loadState();

  if (!projectRoot) {
    return null;
  }

  try {
    return await validateDirectory(projectRoot);
  } catch {
    projectRoot = null;
    return null;
  }
}

async function setProjectRoot(directory) {
  const resolvedPath = await validateDirectory(directory);
  const projectChanged = projectRoot !== resolvedPath;

  projectRoot = resolvedPath;
  stateLoaded = true;

  if (projectChanged) {
    environment = null;
  }

  await writeState();

  return resolvedPath;
}

async function getEnvironment() {
  await loadState();
  return environment;
}

async function setEnvironment(nextEnvironment) {
  await loadState();
  environment = nextEnvironment;
  await writeState();
  return environment;
}

async function writeState() {
  await fs.writeFile(
    stateFile,
    `${JSON.stringify({ projectRoot, environment }, null, 2)}\n`,
    "utf8",
  );
}

module.exports = {
  getEnvironment,
  getProjectRoot,
  setEnvironment,
  setProjectRoot,
};
