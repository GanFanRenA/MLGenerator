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
    throw new Error("选择的路径不是文件夹。");
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
    throw new Error("请输入文件夹名称。");
  }

  const folderName = requestedName.trim();

  if (!folderName) {
    throw new Error("文件夹名称不能为空。");
  }

  if (
    folderName === "." ||
    folderName === ".." ||
    /[<>:"/\\|?*\u0000-\u001f]/.test(folderName) ||
    /[. ]$/.test(folderName)
  ) {
    throw new Error("文件夹名称包含 Windows 不允许的字符。");
  }

  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i.test(folderName)) {
    throw new Error("这个名称是 Windows 保留名称，请换一个名称。");
  }

  if (typeof parentPath !== "string" || !parentPath) {
    throw new Error("请先打开一个文件夹。");
  }

  const resolvedParent = await validateDirectory(parentPath);
  const newPath = path.join(resolvedParent, folderName);

  try {
    await fs.mkdir(newPath);
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error("当前文件夹中已经存在同名文件夹。");
    }
    throw error;
  }

  return {
    created: true,
    path: newPath,
  };
}

module.exports = { createDirectory, listDirectories };
