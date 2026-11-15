const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const hiddenWindowsFolders = new Set([
  "$Recycle.Bin",
  "System Volume Information",
]);

async function listWindowsRoots() {
  if (process.platform !== "win32") {
    return [];
  }

  const roots = [];

  for (let code = 65; code <= 90; code += 1) {
    const root = `${String.fromCharCode(code)}:\\`;

    try {
      const details = await fs.stat(root);
      if (details.isDirectory()) {
        roots.push(root);
      }
    } catch {
      // Unavailable drives are omitted.
    }
  }

  return roots;
}

async function validateDirectory(directory) {
  const resolvedPath = path.resolve(directory);
  const details = await fs.stat(resolvedPath);

  if (!details.isDirectory()) {
    throw new Error("The selected path is not a folder.");
  }

  return resolvedPath;
}

async function listDirectories(requestedPath) {
  const resolvedPath = await validateDirectory(requestedPath || os.homedir());

  const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
  const directories = entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !hiddenWindowsFolders.has(entry.name),
    )
    .map((entry) => ({
      name: entry.name,
      path: path.join(resolvedPath, entry.name),
    }))
    .sort((left, right) =>
      left.name.localeCompare(right.name, "zh-CN", {
        numeric: true,
        sensitivity: "base",
      }),
    );

  const parentPath = path.dirname(resolvedPath);

  return {
    path: resolvedPath,
    parent: parentPath === resolvedPath ? null : parentPath,
    roots: await listWindowsRoots(),
    directories,
  };
}

async function createDirectory(parentPath, requestedName) {
  if (typeof requestedName !== "string") {
    throw new Error("Enter a folder name.");
  }

  const folderName = requestedName.trim();

  if (!folderName) {
    throw new Error("The folder name cannot be empty.");
  }

  if (
    folderName === "." ||
    folderName === ".." ||
    /[<>:"/\\|?*\u0000-\u001f]/.test(folderName) ||
    /[. ]$/.test(folderName)
  ) {
    throw new Error("The folder name contains characters that Windows does not allow.");
  }

  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i.test(folderName)) {
    throw new Error("This name is reserved by Windows. Choose another name.");
  }

  if (typeof parentPath !== "string" || !parentPath) {
    throw new Error("Open a folder first.");
  }

  const resolvedParent = await validateDirectory(parentPath);
  const newPath = path.join(resolvedParent, folderName);

  try {
    await fs.mkdir(newPath);
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error("A folder with this name already exists in the current folder.");
    }
    throw error;
  }

  return {
    created: true,
    path: newPath,
  };
}

module.exports = { createDirectory, listDirectories };
