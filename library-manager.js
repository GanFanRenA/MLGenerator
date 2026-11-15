const { execFile } = require("node:child_process");
const { getEnvironmentStatus } = require("./environment-manager");

const LIBRARY_CATALOG = [
  {
    id: "scikit-learn",
    packageName: "scikit-learn",
    displayName: "scikit-learn",
    description: "常用机器学习算法、模型训练与评估工具。",
    badge: "模型核心",
  },
  {
    id: "matplotlib",
    packageName: "matplotlib",
    displayName: "Matplotlib",
    description: "Python 基础绘图库，用于折线图、散点图等可视化。",
    badge: "基础绘图",
  },
  {
    id: "pandas",
    packageName: "pandas",
    displayName: "Pandas",
    description: "读取、清洗和处理表格数据的常用工具。",
    badge: "数据处理",
  },
  {
    id: "seaborn",
    packageName: "seaborn",
    displayName: "Seaborn",
    description: "基于 Matplotlib 的统计图表库，适合探索数据规律。",
    badge: "统计可视化",
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
    };
  }

  return {
    state: "ready",
    projectRoot: environment.projectRoot,
    pythonPath: environment.pythonPath,
    pipAvailable: Boolean(await inspectPip(environment)),
    libraries: await inspectLibraries(environment),
  };
}

async function installLibraries(requestedIds) {
  if (!Array.isArray(requestedIds) || requestedIds.length === 0) {
    throw new Error("请至少选择一个要安装的 Python 库。");
  }

  const environment = await getActiveEnvironment();

  if (!environment) {
    throw new Error("请先创建并激活项目虚拟环境。");
  }

  const selectedLibraries = [];
  const uniqueIds = [...new Set(requestedIds)];

  for (const libraryId of uniqueIds) {
    const library = LIBRARY_CATALOG.find((item) => item.id === libraryId);

    if (!library) {
      throw new Error("包含不受支持的 Python 库。");
    }

    selectedLibraries.push(library);
  }

  const packageNames = selectedLibraries.map((library) => library.packageName);

  try {
    const { stdout, stderr } = await runPython(
      environment.pythonPath,
      [
        "-m",
        "pip",
        "install",
        "--disable-pip-version-check",
        "--no-input",
        ...packageNames,
      ],
      {
        cwd: environment.projectRoot,
        timeout: 10 * 60 * 1000,
      },
    );

    return {
      state: "installed",
      installedIds: selectedLibraries.map((library) => library.id),
      libraries: await inspectLibraries(environment),
      output: `${stdout}\n${stderr}`.trim(),
    };
  } catch (error) {
    throw new Error(`安装 Python 库失败：${summarizeProcessError(error.message)}`);
  }
}

module.exports = {
  getLibraryStatus,
  installLibraries,
};
