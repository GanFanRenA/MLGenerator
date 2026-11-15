const { execFile } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const { getEnvironmentStatus } = require("./environment-manager");

const REQUIREMENTS_FILENAME = "requirements.txt";

const LIBRARY_CATALOG = [
  {
    id: "scikit-learn",
    packageName: "scikit-learn",
    displayName: "scikit-learn",
    description: "Common machine learning algorithms and tools for model training and evaluation.",
    badge: "Modeling",
  },
  {
    id: "matplotlib",
    packageName: "matplotlib",
    displayName: "Matplotlib",
    description: "A foundational Python plotting package for line charts, scatter plots, and other visualizations.",
    badge: "Plotting",
  },
  {
    id: "pandas",
    packageName: "pandas",
    displayName: "Pandas",
    description: "Tools for reading, cleaning, and processing tabular data.",
    badge: "Data processing",
  },
  {
    id: "seaborn",
    packageName: "seaborn",
    displayName: "Seaborn",
    description: "A statistical charting library built on Matplotlib for exploring patterns in data.",
    badge: "Statistical charts",
  },
];

function runPython(pythonPath, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(
      pythonPath,
      args,
      {
        encoding: "utf8",
        maxBuffer: 4 * 1024 * 1024,
        timeout: 10 * 60 * 1000,
        windowsHide: true,
        ...options,
      },
      (error, stdout, stderr) => {
        if (error) {
          const detail = stderr.trim() || stdout.trim() || error.message;
          reject(new Error(detail));
          return;
        }

        resolve({ stdout, stderr });
      },
    );
  });
}

function summarizeProcessError(message) {
  const normalized = String(message || "").trim();

  if (normalized.length <= 1600) {
    return normalized;
  }

  return `...${normalized.slice(-1600)}`;
}

async function getActiveEnvironment() {
  const status = await getEnvironmentStatus();

  if (status.state !== "ready" || !status.environment?.pythonPath) {
    return null;
  }

  return {
    ...status.environment,
    projectRoot: status.projectRoot,
  };
}

function getRequirementsPath(projectRoot) {
  return path.join(projectRoot, REQUIREMENTS_FILENAME);
}

function getInstallCommand(environment) {
  const pythonCommand = environment.isWindows
    ? ".\\.venv\\Scripts\\python.exe"
    : "./.venv/bin/python";

  return `${pythonCommand} -m pip install -r ${REQUIREMENTS_FILENAME}`;
}

function parseRequirementsContent(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

async function inspectLibraries(environment) {
  const packageNames = LIBRARY_CATALOG.map((library) => library.packageName);
  const probeScript = [
    "import importlib.metadata as metadata",
    "import json",
    `packages = ${JSON.stringify(packageNames)}`,
    "versions = {}",
    "for package in packages:",
    "    try:",
    "        versions[package] = metadata.version(package)",
    "    except metadata.PackageNotFoundError:",
    "        pass",
    "print(json.dumps(versions))",
  ].join("\n");
  const { stdout } = await runPython(
    environment.pythonPath,
    ["-c", probeScript],
    { cwd: environment.projectRoot, timeout: 20_000 },
  );
  const lines = stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const versions = JSON.parse(lines.at(-1));

  return LIBRARY_CATALOG.map((library) => {
    const version = versions[library.packageName] || null;

    return {
      ...library,
      installed: Boolean(version),
      version,
    };
  });
}

async function inspectRequirementItems(environment, requirements) {
  if (requirements.length === 0) {
    return [];
  }

  const probeScript = [
    "import importlib.metadata as metadata",
    "import json",
    "import re",
    "try:",
    "    from packaging.requirements import Requirement",
    "except ImportError:",
    "    Requirement = None",
    `requirements = ${JSON.stringify(requirements)}`,
    "results = []",
    "for raw in requirements:",
    "    item = {",
    '        "requirement": raw,',
    '        "packageName": raw,',
    '        "installed": False,',
    '        "version": None,',
    '        "reason": None,',
    "    }",
    "    try:",
    "        if Requirement is None:",
    '            name = re.split(r"[<>=!~;\\s\\[]", raw, maxsplit=1)[0]',
    "            version = metadata.version(name)",
    "            item.update(packageName=name, installed=True, version=version)",
    "        else:",
    "            parsed = Requirement(raw)",
    "            name = parsed.name",
    "            version = metadata.version(name)",
    "            satisfies = not parsed.specifier or parsed.specifier.contains(",
    "                version, prereleases=True",
    "            )",
    "            item.update(",
    "                packageName=name,",
    "                installed=satisfies,",
    "                version=version,",
    '                reason=None if satisfies else "VERSION_MISMATCH",',
    "            )",
    "    except metadata.PackageNotFoundError:",
    '        item["reason"] = "NOT_INSTALLED"',
    "    except Exception:",
    '        item["reason"] = "INVALID_OR_UNCHECKABLE"',
    "    results.append(item)",
    "print(json.dumps(results, ensure_ascii=False))",
  ].join("\n");
  const { stdout } = await runPython(
    environment.pythonPath,
    ["-c", probeScript],
    { cwd: environment.projectRoot, timeout: 20_000 },
  );
  const lines = stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  return JSON.parse(lines.at(-1));
}

async function inspectRequirements(environment) {
  const requirementsPath = getRequirementsPath(environment.projectRoot);
  let content;

  try {
    content = await fs.readFile(requirementsPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        exists: false,
        path: REQUIREMENTS_FILENAME,
        requirements: [],
        allInstalled: false,
      };
    }

    throw new Error(`Unable to read ${REQUIREMENTS_FILENAME}: ${error.message}`);
  }

  const requirements = parseRequirementsContent(content);
  const items = await inspectRequirementItems(environment, requirements);

  return {
    exists: true,
    path: REQUIREMENTS_FILENAME,
    requirements: items,
    allInstalled:
      items.length > 0 && items.every((item) => item.installed),
  };
}

async function inspectPip(environment) {
  try {
    const { stdout } = await runPython(
      environment.pythonPath,
      ["-m", "pip", "--version"],
      { cwd: environment.projectRoot, timeout: 20_000 },
    );

    return stdout.trim();
  } catch {
    return null;
  }
}

async function getLibraryStatus() {
  const environment = await getActiveEnvironment();

  if (!environment) {
    return {
      state: "environment-required",
      libraries: [],
      requirements: null,
    };
  }

  const [pip, libraries, requirements] = await Promise.all([
    inspectPip(environment),
    inspectLibraries(environment),
    inspectRequirements(environment),
  ]);

  return {
    state: "ready",
    projectRoot: environment.projectRoot,
    pythonPath: environment.pythonPath,
    pipAvailable: Boolean(pip),
    installCommand: getInstallCommand(environment),
    libraries,
    requirements,
  };
}

async function createRequirements(requestedIds) {
  if (
    requestedIds !== undefined &&
    (!Array.isArray(requestedIds) || requestedIds.length === 0)
  ) {
    throw new Error("Select at least one Python package to add to the dependency manifest.");
  }

  const environment = await getActiveEnvironment();

  if (!environment) {
    throw new Error("Create and activate the project virtual environment first.");
  }

  let requirementLines;

  if (Array.isArray(requestedIds)) {
    const selectedLibraries = [];
    const uniqueIds = [...new Set(requestedIds)];

    for (const libraryId of uniqueIds) {
      const library = LIBRARY_CATALOG.find((item) => item.id === libraryId);

      if (!library) {
        throw new Error("The request contains an unsupported Python package.");
      }

      selectedLibraries.push(library);
    }

    requirementLines = selectedLibraries.map(
      (library) => library.packageName,
    );
  } else {
    const currentPath = getRequirementsPath(environment.projectRoot);

    try {
      const currentContent = await fs.readFile(currentPath, "utf8");
      requirementLines = parseRequirementsContent(currentContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(
          "The current project does not have a requirements.txt yet. Select Python packages and generate the manifest first.",
        );
      }

      throw new Error(`Unable to read the existing requirements.txt: ${error.message}`);
    }
  }

  if (requirementLines.length === 0) {
    throw new Error("requirements.txt does not contain any dependencies that can be saved.");
  }

  const containsNonAscii = requirementLines.some(
    (line) => !/^[\x20-\x7E]+$/.test(line),
  );

  if (containsNonAscii) {
    throw new Error(
      "requirements.txt contains non-ASCII content. Remove those dependency lines and try again.",
    );
  }

  const content = [
    "# Python dependencies for this project.",
    ...requirementLines,
    "",
  ].join("\n");
  const requirementsPath = getRequirementsPath(environment.projectRoot);

  try {
    await fs.writeFile(requirementsPath, content, "utf8");
  } catch (error) {
    throw new Error(
      `Unable to generate ${REQUIREMENTS_FILENAME}: ${summarizeProcessError(
        error.message,
      )}`,
    );
  }

  return {
    state: "created",
    path: REQUIREMENTS_FILENAME,
    absolutePath: requirementsPath,
  };
}

module.exports = {
  createRequirements,
  getLibraryStatus,
};
