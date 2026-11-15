const { execFile } = require("node:child_process");
const path = require("node:path");

const PROBE_SCRIPT = [
  "import json, platform, sys",
  "print(json.dumps({",
  '  "version": platform.python_version(),',
  '  "implementation": platform.python_implementation(),',
  '  "executable": sys.executable,',
  '  "architecture": platform.machine(),',
  '  "major": sys.version_info.major,',
  '  "minor": sys.version_info.minor',
  "}))",
].join("\n");

const DEFAULT_CANDIDATES = [
  { command: "py", prefixArgs: ["-3"], label: "py -3" },
  { command: "python", prefixArgs: [], label: "python" },
  { command: "python3", prefixArgs: [], label: "python3" },
  { command: "py", prefixArgs: [], label: "py" },
];

function runProbe(candidate) {
  return new Promise((resolve, reject) => {
    execFile(
      candidate.command,
      [...candidate.prefixArgs, "-c", PROBE_SCRIPT],
      {
        encoding: "utf8",
        timeout: 3500,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject({
            candidate: candidate.label,
            code: error.code || "PROBE_FAILED",
            message: stderr.trim() || error.message,
          });
          return;
        }

        try {
          const lines = stdout
            .trim()
            .split(/\r?\n/)
            .filter(Boolean);
          const details = JSON.parse(lines.at(-1));

          resolve({
            ...details,
            launcher: candidate.command,
            launcherArgs: candidate.prefixArgs,
            detectedBy: candidate.label,
            executable: path.normalize(details.executable),
          });
        } catch (parseError) {
          reject({
            candidate: candidate.label,
            code: "INVALID_OUTPUT",
            message: parseError.message,
          });
        }
      },
    );
  });
}

async function detectPython() {
  const override = process.env.MLGENERATOR_PYTHON;
  const candidates = override
    ? [
        {
          command: override,
          prefixArgs: [],
          label: "MLGENERATOR_PYTHON",
        },
        ...DEFAULT_CANDIDATES,
      ]
    : DEFAULT_CANDIDATES;

  const failures = [];

  for (const candidate of candidates) {
    try {
      const python = await runProbe(candidate);
      const checkedAt = new Date().toISOString();

      return {
        found: true,
        checkedAt,
        platform: process.platform,
        python,
      };
    } catch (failure) {
      failures.push(failure);
    }
  }

  return {
    found: false,
    checkedAt: new Date().toISOString(),
    platform: process.platform,
    reason: "NO_PYTHON_FOUND",
    checkedCommands: failures,
  };
}

module.exports = { detectPython };
