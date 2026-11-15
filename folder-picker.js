const { execFile } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const selectedMarker = "__MLGENERATOR_SELECTED__";
const cancelledMarker = "__MLGENERATOR_CANCELLED__";

const windowsPickerScript = `
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = "Select project folder"
$dialog.ShowNewFolderButton = $true

$initialFolder = $env:MLGENERATOR_INITIAL_FOLDER
if ($initialFolder -and (Test-Path -LiteralPath $initialFolder -PathType Container)) {
  $dialog.SelectedPath = (Resolve-Path -LiteralPath $initialFolder).Path
}

try {
  $result = $dialog.ShowDialog()
  if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
    [Console]::Out.WriteLine("${selectedMarker}" + $dialog.SelectedPath)
  } else {
    [Console]::Out.WriteLine("${cancelledMarker}")
  }
} finally {
  $dialog.Dispose()
}
`;

const macPickerScript = `
on run
  set initialFolder to system attribute "MLGENERATOR_INITIAL_FOLDER"

  try
    if initialFolder is not "" then
      set chosenFolder to choose folder with prompt "Select project folder" default location (POSIX file initialFolder)
    else
      set chosenFolder to choose folder with prompt "Select project folder"
    end if
  on error errorMessage number errorNumber
    if errorNumber is -128 then
      return "${cancelledMarker}"
    end if
    error errorMessage number errorNumber
  end try

  return "${selectedMarker}" & (POSIX path of chosenFolder)
end run
`;

let isPickerOpen = false;

function runFile(command, args, environment) {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      {
        encoding: "utf8",
        env: { ...process.env, ...environment },
        maxBuffer: 1024 * 1024,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error) {
          error.message = stderr.trim() || error.message;
          reject(error);
          return;
        }

        resolve(stdout.trim());
      },
    );
  });
}

async function pickWithWindows(initialDirectory, run = runFile) {
  const encodedScript = Buffer.from(windowsPickerScript, "utf16le").toString(
    "base64",
  );
  const output = await run(
    "powershell.exe",
    [
      "-NoLogo",
      "-NoProfile",
      "-STA",
      "-EncodedCommand",
      encodedScript,
    ],
    { MLGENERATOR_INITIAL_FOLDER: initialDirectory },
  );

  return output;
}

async function pickWithMacOS(initialDirectory, run = runFile) {
  return run(
    "osascript",
    ["-e", macPickerScript],
    { MLGENERATOR_INITIAL_FOLDER: initialDirectory },
  );
}

function parsePickerOutput(output) {
  if (!output || output === cancelledMarker) {
    return null;
  }

  if (!output.startsWith(selectedMarker)) {
    throw new Error("The system folder picker did not return a valid path.");
  }

  return output.slice(selectedMarker.length).trim();
}

async function validateDirectory(directory) {
  const resolvedPath = path.resolve(directory);
  const details = await fs.stat(resolvedPath);

  if (!details.isDirectory()) {
    throw new Error("The selected path is not a folder.");
  }

  return resolvedPath;
}

async function chooseProjectFolder(
  requestedInitialDirectory,
  {
    platform = process.platform,
    run = runFile,
  } = {},
) {
  if (isPickerOpen) {
    const error = new Error("The system folder picker is already open.");
    error.code = "FOLDER_PICKER_BUSY";
    throw error;
  }

  isPickerOpen = true;

  try {
    let initialDirectory = os.homedir();

    if (requestedInitialDirectory) {
      try {
        initialDirectory = await validateDirectory(requestedInitialDirectory);
      } catch {
        // Fall back to the home folder when the previous project is unavailable.
      }
    }

    let output;

    if (platform === "win32") {
      output = await pickWithWindows(initialDirectory, run);
    } else if (platform === "darwin") {
      output = await pickWithMacOS(initialDirectory, run);
    } else {
      const error = new Error("The native project folder picker is not supported on this system.");
      error.code = "FOLDER_PICKER_UNSUPPORTED";
      throw error;
    }

    const selectedPath = parsePickerOutput(output);
    return selectedPath ? validateDirectory(selectedPath) : null;
  } finally {
    isPickerOpen = false;
  }
}

module.exports = {
  chooseProjectFolder,
  parsePickerOutput,
};
