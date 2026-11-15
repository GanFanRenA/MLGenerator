const card = document.querySelector("#detection-card");
const pythonComplete = document.querySelector("#python-complete");
const headerStatus = document.querySelector("#header-status");
const headerStatusText = document.querySelector("#header-status-text");
const pageTitle = document.querySelector("#page-title");
const introDescription = document.querySelector(".intro p");
const stateLabel = document.querySelector("#state-label");
const stateTitle = document.querySelector("#state-title");
const stateDescription = document.querySelector("#state-description");
const redetectButton = document.querySelector("#redetect-button");
const redetectCompleteButton = document.querySelector("#redetect-complete");
const redetectLabel = document.querySelector("#redetect-label");
const checkedTime = document.querySelector("#checked-time");
const venvCard = document.querySelector("#venv-card");
const venvComplete = document.querySelector("#venv-complete");
const venvCompleteSummary = document.querySelector("#venv-complete-summary");
const venvCompletePath = document.querySelector("#venv-complete-path");
const venvCompletePython = document.querySelector("#venv-complete-python");
const venvCompleteActivation = document.querySelector(
  "#venv-complete-activation",
);
const venvStateLabel = document.querySelector("#venv-state-label");
const venvTitle = document.querySelector("#venv-title");
const venvDescription = document.querySelector("#venv-description");
const venvProjectPath = document.querySelector("#venv-project-path");
const venvWorking = document.querySelector("#venv-working");
const venvReady = document.querySelector("#venv-ready");
const venvPath = document.querySelector("#venv-path");
const venvPython = document.querySelector("#venv-python");
const activationLabel = document.querySelector("#activation-label");
const activationCommandValue = document.querySelector(
  "#activation-command-value",
);
const venvFeedback = document.querySelector("#venv-feedback");
const venvHint = document.querySelector("#venv-hint");
const createVenvButton = document.querySelector("#create-venv-button");
const createVenvLabel = document.querySelector("#create-venv-label");
const libraryCard = document.querySelector("#library-card");
const libraryComplete = document.querySelector("#library-complete");
const installedLibraryList = document.querySelector("#installed-library-list");
const libraryStateLabel = document.querySelector("#library-state-label");
const libraryTitle = document.querySelector("#library-title");
const libraryList = document.querySelector("#library-list");
const libraryWorking = document.querySelector("#library-working");
const libraryFeedback = document.querySelector("#library-feedback");
const selectAllLibrariesButton = document.querySelector(
  "#select-all-libraries",
);
const selectedLibraryCount = document.querySelector(
  "#selected-library-count",
);
const installLibrariesButton = document.querySelector(
  "#install-libraries-button",
);
const installLibrariesLabel = document.querySelector(
  "#install-libraries-label",
);
const selectFolderButton = document.querySelector("#select-folder-button");
const selectFolderLabel = document.querySelector("#select-folder-label");
const topbarFolderName = document.querySelector("#topbar-folder-name");
const topbarFolderPath = document.querySelector("#topbar-folder-path");
const folderDialog = document.querySelector("#folder-dialog");
const closeFolderDialogButton = document.querySelector("#close-folder-dialog");
const cancelFolderDialogButton = document.querySelector("#cancel-folder-dialog");
const folderUpButton = document.querySelector("#folder-up-button");
const showNewFolderButton = document.querySelector("#show-new-folder-button");
const newFolderForm = document.querySelector("#new-folder-form");
const newFolderName = document.querySelector("#new-folder-name");
const createFolderButton = document.querySelector("#create-folder-button");
const cancelNewFolderButton = document.querySelector(
  "#cancel-new-folder-button",
);
const newFolderError = document.querySelector("#new-folder-error");
const currentFolderPath = document.querySelector("#current-folder-path");
const driveList = document.querySelector("#drive-list");
const folderList = document.querySelector("#folder-list");
const folderError = document.querySelector("#folder-error");
const confirmFolderButton = document.querySelector("#confirm-folder-button");

const views = {
  checking: document.querySelector("#checking-view"),
  found: document.querySelector("#found-view"),
  missing: document.querySelector("#missing-view"),
  error: document.querySelector("#error-view"),
};

let isChecking = false;
let isSelectingFolder = false;
let isCreatingEnvironment = false;
let isInstallingLibraries = false;
let selectedProjectPath = null;
let currentFolderPathValue = null;
let currentFolderParent = null;
let folderRequestId = 0;
let isCreatingFolder = false;
let libraryCatalog = [];
let libraryPipAvailable = false;
const selectedLibraries = new Set();

function setState(state) {
  card.dataset.state = state;
  headerStatus.dataset.state = state;

  for (const [viewState, view] of Object.entries(views)) {
    view.hidden = viewState !== state;
  }
}

function setHeaderStatus(state, text) {
  headerStatus.dataset.state = state;
  headerStatus.setAttribute("aria-label", text);
  headerStatusText.textContent = text;
}

function setCheckingState() {
  card.hidden = false;
  pythonComplete.hidden = true;
  venvCard.hidden = true;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  libraryComplete.hidden = true;
  setState("checking");
  setHeaderStatus("checking", "正在检测");
  pageTitle.textContent = "先确认你的 Python 环境。";
  introDescription.textContent =
    "我们会检查电脑是否已经安装 Python，并显示当前版本。";
  stateLabel.textContent = "正在检测";
  stateTitle.textContent = "正在检查 Python...";
  stateDescription.textContent =
    "请稍候，我们正在查找电脑上可用的 Python。";
  redetectButton.disabled = true;
  redetectLabel.textContent = "检测中";
  checkedTime.textContent = "";
}

function renderFound(result) {
  const python = result.python;

  setState("found");
  setHeaderStatus("found", "环境已就绪");
  pageTitle.textContent = "Python 环境已经准备好。";
  introDescription.textContent =
    "可以从顶栏选择项目文件夹，后续内容都会保存在这个目录中。";
  stateLabel.textContent = "已完成";
  stateTitle.textContent = "Python 环境已就绪";
  stateDescription.textContent =
    "已找到可用的 Python，接下来可以使用它创建学习环境。";

  document.querySelector("#python-version").textContent = python.version;
  document.querySelector("#python-implementation").textContent =
    python.implementation;
  document.querySelector("#python-architecture").textContent =
    python.architecture || "未知架构";
  document.querySelector("#python-path").textContent = python.executable;
  document.querySelector("#python-command").textContent = python.detectedBy;

  document.querySelector("#complete-version").textContent =
    `Python ${python.version}`;
  document.querySelector("#complete-architecture").textContent =
    python.architecture || "未知架构";
  document.querySelector("#complete-python-path").textContent =
    python.executable;
  document.querySelector("#complete-python-command").textContent =
    python.detectedBy;

  card.hidden = true;
  pythonComplete.hidden = false;
  pythonComplete.open = false;
  venvCard.hidden = false;
  refreshEnvironmentStatus().catch(showEnvironmentError);
}

function renderMissing() {
  card.hidden = false;
  pythonComplete.hidden = true;
  venvCard.hidden = true;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  libraryComplete.hidden = true;
  setState("missing");
  setHeaderStatus("missing", "未找到 Python");
  pageTitle.textContent = "先确认你的 Python 环境。";
  introDescription.textContent =
    "我们会检查电脑是否已经安装 Python，并显示当前版本。";
  stateLabel.textContent = "需要处理";
  stateTitle.textContent = "未检测到 Python";
  stateDescription.textContent =
    "这台电脑上还没有可用的 Python。按照下面的步骤安装后，再重新检测。";
}

function renderError(message) {
  card.hidden = false;
  pythonComplete.hidden = true;
  venvCard.hidden = true;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  libraryComplete.hidden = true;
  setState("error");
  setHeaderStatus("error", "检测失败");
  pageTitle.textContent = "先确认你的 Python 环境。";
  introDescription.textContent =
    "我们会检查电脑是否已经安装 Python，并显示当前版本。";
  stateLabel.textContent = "检测出错";
  stateTitle.textContent = "暂时无法完成检测";
  stateDescription.textContent =
    "本地检测服务没有正常返回结果，请检查运行状态后重试。";
  document.querySelector("#error-message").textContent =
    message || "请稍后点击“重新检测”。";
}

function renderCheckedTime(checkedAt) {
  const date = checkedAt ? new Date(checkedAt) : new Date();
  checkedTime.textContent = `检测时间 ${new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)}`;
}

function getFolderName(directory) {
  const normalized = directory.replace(/[\\/]+$/, "");
  return normalized.split(/[\\/]/).filter(Boolean).at(-1) || directory;
}

function renderProjectSelection(directory) {
  selectedProjectPath = directory;
  topbarFolderName.textContent = getFolderName(directory);
  topbarFolderPath.textContent = directory;
  selectFolderButton.title = `当前项目：${directory}。点击更换文件夹。`;
  selectFolderLabel.textContent = "更换";
  venvProjectPath.textContent = directory;

  if (!venvCard.hidden) {
    refreshEnvironmentStatus().catch(showEnvironmentError);
  }
}

function renderProjectIdle() {
  selectedProjectPath = null;
  topbarFolderName.textContent = "选择项目文件夹";
  topbarFolderPath.textContent = "点击选择一个项目根目录";
  selectFolderButton.title = "选择项目根文件夹";
  selectFolderLabel.textContent = "选择";
  venvProjectPath.textContent = "尚未选择";

  if (!venvCard.hidden) {
    refreshEnvironmentStatus().catch(showEnvironmentError);
  }
}

function setEnvironmentVisibility({ working = false, ready = false }) {
  venvWorking.hidden = !working;
  venvReady.hidden = !ready;
}

function setEnvironmentButton(enabled, label) {
  createVenvButton.disabled = !enabled;
  createVenvLabel.textContent = label;
}

function updateEnvironmentIntro(state) {
  if (pythonComplete.hidden) {
    return;
  }

  if (state === "no-project") {
    pageTitle.textContent = "先选择一个项目文件夹。";
    introDescription.textContent =
      "从顶栏选择项目文件夹后，就可以创建独立的 Python 虚拟环境。";
  } else if (state === "ready") {
    pageTitle.textContent = "选择需要的 Python 库。";
    introDescription.textContent =
      "项目虚拟环境已就绪。勾选课程中会用到的库，软件会把它们安装到项目中。";
  } else {
    pageTitle.textContent = "创建项目虚拟环境。";
    introDescription.textContent =
      "在项目文件夹中创建并激活独立的 .venv，不会影响全局 Python。";
  }
}

function renderEnvironmentReady(result) {
  const environment = result.environment || result;

  venvCard.dataset.state = "ready";
  venvStateLabel.textContent = "已完成";
  venvTitle.textContent = "虚拟环境已激活";
  venvDescription.textContent =
    "项目已经拥有独立的 Python 环境，可以继续安装学习依赖。";
  venvProjectPath.textContent = result.projectRoot || selectedProjectPath || "--";
  venvPath.textContent = environment.venvPath || "--";
  venvPython.textContent = environment.pythonPath || "--";
  activationLabel.textContent = `${
    environment.activationShell || "终端"
  }命令行激活`;
  activationCommandValue.textContent =
    environment.activationCommand || "--";
  venvFeedback.textContent = "";
  venvHint.textContent = "后续 Python 操作将使用这个项目环境";
  setEnvironmentButton(false, "已激活");
  setEnvironmentVisibility({ ready: true });
  venvCard.hidden = true;
  venvComplete.hidden = false;
  venvComplete.open = false;
  venvCompleteSummary.textContent = `Python ${
    environment.version || "--"
  } · 已激活`;
  venvCompletePath.textContent = environment.venvPath || "--";
  venvCompletePython.textContent = environment.pythonPath || "--";
  venvCompleteActivation.textContent =
    environment.activationCommand || "--";
  updateEnvironmentIntro("ready");
  libraryCard.hidden = false;
  libraryComplete.hidden = true;
  loadLibraryStatus().catch(showLibraryError);
}

function renderEnvironmentMissing(result) {
  const isExisting = result.state === "existing";

  venvCard.dataset.state = result.state || "missing";
  venvStateLabel.textContent = "正在做";
  venvTitle.textContent = isExisting
    ? "激活现有虚拟环境"
    : "创建虚拟环境";
  venvDescription.textContent = isExisting
    ? "项目中已经存在 .venv。验证后可以将其设为当前学习环境。"
    : "应用会创建 .venv，并使用项目内的 Python 执行后续课程代码。";
  venvProjectPath.textContent = result.projectRoot || selectedProjectPath || "--";
  venvFeedback.textContent = "";
  venvHint.textContent = isExisting
    ? "检测到可用的现有环境"
    : "不会修改电脑上的全局 Python";
  setEnvironmentButton(
    Boolean(result.projectRoot),
    isExisting ? "激活现有环境" : "创建并激活",
  );
  setEnvironmentVisibility({});
  updateEnvironmentIntro(result.state || "missing");
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  libraryComplete.hidden = true;
}

function renderEnvironmentNoProject(result) {
  venvCard.dataset.state = "no-project";
  venvStateLabel.textContent = "等待";
  venvTitle.textContent = "创建虚拟环境";
  venvDescription.textContent =
    "请在顶栏选择项目文件夹，我们会在这里创建独立的 Python 环境。";
  venvProjectPath.textContent = "尚未选择";
  venvFeedback.textContent = "";
  venvHint.textContent = "先在顶栏选择项目文件夹";
  setEnvironmentButton(false, "选择文件夹后创建");
  setEnvironmentVisibility({});
  updateEnvironmentIntro("no-project");
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  libraryComplete.hidden = true;
}

function showEnvironmentError(error) {
  if (venvCard.hidden) {
    return;
  }

  venvCard.dataset.state = "error";
  venvStateLabel.textContent = "需要处理";
  venvTitle.textContent = "虚拟环境创建失败";
  venvDescription.textContent =
    "没有完成环境创建。请根据错误信息处理后重试。";
  venvFeedback.textContent =
    error.message || "无法读取虚拟环境状态，请稍后重试。";
  setEnvironmentButton(
    Boolean(selectedProjectPath) && !isCreatingEnvironment,
    selectedProjectPath ? "重试创建" : "选择文件夹后创建",
  );
  setEnvironmentVisibility({});
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  libraryComplete.hidden = true;
}

async function refreshEnvironmentStatus() {
  if (isCreatingEnvironment) {
    return;
  }

  const response = await fetch("/api/environment", {
    method: "GET",
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "无法读取虚拟环境状态。");
  }

  if (result.state === "ready") {
    renderEnvironmentReady(result);
  } else if (result.state === "no-project") {
    renderEnvironmentNoProject(result);
  } else {
    renderEnvironmentMissing(result);
  }
}

async function createEnvironment() {
  if (isCreatingEnvironment || !selectedProjectPath) {
    return;
  }

  isCreatingEnvironment = true;
  venvCard.dataset.state = "creating";
  venvStateLabel.textContent = "正在做";
  venvTitle.textContent = "正在创建虚拟环境";
  venvDescription.textContent =
    "正在创建 .venv 并验证其中的 Python，首次执行可能需要一些时间。";
  venvFeedback.textContent = "";
  venvHint.textContent = "请保持软件运行";
  setEnvironmentButton(false, "正在创建...");
  setEnvironmentVisibility({ working: true });
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  libraryComplete.hidden = true;
  selectFolderButton.disabled = true;

  try {
    const response = await fetch("/api/environment", {
      method: "POST",
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "创建虚拟环境失败。");
    }

    renderEnvironmentReady(result);
  } catch (error) {
    showEnvironmentError(error);
  } finally {
    isCreatingEnvironment = false;
    selectFolderButton.disabled = false;
  }
}

function getInstallableLibraries() {
  return libraryCatalog.filter((library) => !library.installed);
}

function updateLibraryControls() {
  const installableLibraries = getInstallableLibraries();
  const selectedCount = installableLibraries.filter((library) =>
    selectedLibraries.has(library.id),
  ).length;
  const allSelected =
    installableLibraries.length > 0 &&
    selectedCount === installableLibraries.length;

  selectedLibraryCount.textContent =
    selectedCount > 0 ? `已选择 ${selectedCount} 个` : "尚未选择";
  selectAllLibrariesButton.textContent = allSelected ? "清除" : "全选";
  selectAllLibrariesButton.disabled =
    isInstallingLibraries || installableLibraries.length === 0;
  installLibrariesButton.disabled =
    isInstallingLibraries ||
    selectedCount === 0 ||
    !libraryPipAvailable;
  installLibrariesLabel.textContent =
    selectedCount > 0 ? `安装选中库 (${selectedCount})` : "安装选中库";
}

function renderLibraryList(libraries) {
  libraryCatalog = libraries;
  libraryList.replaceChildren();

  for (const library of libraries) {
    const option = document.createElement("label");
    option.className = "library-option";
    option.classList.toggle("is-installed", library.installed);
    option.dataset.libraryId = library.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = library.id;
    checkbox.checked = library.installed || selectedLibraries.has(library.id);
    checkbox.disabled = library.installed || isInstallingLibraries;
    checkbox.setAttribute("aria-label", `选择 ${library.displayName}`);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedLibraries.add(library.id);
      } else {
        selectedLibraries.delete(library.id);
      }
      updateLibraryControls();
    });

    const copy = document.createElement("span");
    copy.className = "library-option-copy";

    const nameLine = document.createElement("span");
    nameLine.className = "library-name-line";
    const name = document.createElement("strong");
    name.textContent = library.displayName;
    const badge = document.createElement("span");
    badge.className = "library-badge";
    badge.textContent = library.badge;
    nameLine.append(name, badge);

    const description = document.createElement("p");
    description.textContent = library.description;
    copy.append(nameLine, description);

    const status = document.createElement("span");
    status.className = "library-status";
    status.textContent = library.installed
      ? `v${library.version}`
      : "未安装";

    option.append(checkbox, copy, status);
    libraryList.append(option);
  }

  updateLibraryControls();
}

function renderLibraryComplete(libraries) {
  installedLibraryList.replaceChildren();

  for (const library of libraries) {
    const item = document.createElement("span");
    item.className = "installed-library-item";
    item.textContent = library.displayName;

    const version = document.createElement("span");
    version.textContent = library.version ? `v${library.version}` : "已安装";
    item.append(version);
    installedLibraryList.append(item);
  }

  libraryComplete.open = false;
}

function showLibraryError(error) {
  if (libraryCard.hidden) {
    return;
  }

  libraryCard.dataset.state = "error";
  libraryStateLabel.textContent = "需要处理";
  libraryTitle.textContent = "无法读取 Python 库";
  libraryFeedback.dataset.kind = "error";
  libraryFeedback.textContent =
    error.message || "无法读取 Python 库状态，请稍后重试。";
  libraryWorking.hidden = true;
  installLibrariesButton.disabled = true;
}

async function loadLibraryStatus() {
  if (libraryCard.hidden || isInstallingLibraries) {
    return;
  }

  libraryCard.dataset.state = "loading";
  libraryStateLabel.textContent = "正在做";
  libraryTitle.textContent = "导入 Python 库";
  libraryFeedback.textContent = "";
  libraryFeedback.dataset.kind = "";
  libraryList.innerHTML =
    '<p class="library-loading">正在读取已安装的 Python 库...</p>';

  const response = await fetch("/api/libraries", {
    method: "GET",
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "无法读取 Python 库状态。");
  }

  if (result.state !== "ready") {
    libraryCard.hidden = true;
    return;
  }

  libraryPipAvailable = Boolean(result.pipAvailable);

  if (result.libraries.every((library) => library.installed)) {
    renderLibraryComplete(result.libraries);
    libraryCard.hidden = true;
    libraryComplete.hidden = false;
    pageTitle.textContent = "第一课的基础环境已准备完成。";
    introDescription.textContent =
      "Python、项目虚拟环境和课程库都已就绪，可以继续学习。";
    return;
  }

  libraryComplete.hidden = true;
  libraryCard.hidden = false;
  renderLibraryList(result.libraries);

  if (!libraryPipAvailable) {
    libraryFeedback.dataset.kind = "error";
    libraryFeedback.textContent =
      "当前虚拟环境中没有可用的 pip，请重新创建虚拟环境。";
  }
}

function toggleAllLibraries() {
  const installableLibraries = getInstallableLibraries();

  if (installableLibraries.length === 0 || isInstallingLibraries) {
    return;
  }

  const allSelected = installableLibraries.every((library) =>
    selectedLibraries.has(library.id),
  );

  for (const library of installableLibraries) {
    if (allSelected) {
      selectedLibraries.delete(library.id);
    } else {
      selectedLibraries.add(library.id);
    }
  }

  for (const checkbox of libraryList.querySelectorAll("input:not(:disabled)")) {
    checkbox.checked = selectedLibraries.has(checkbox.value);
  }

  updateLibraryControls();
}

async function installSelectedLibraries() {
  const installableIds = new Set(
    getInstallableLibraries().map((library) => library.id),
  );
  const libraries = [...selectedLibraries].filter((id) =>
    installableIds.has(id),
  );

  if (libraries.length === 0 || isInstallingLibraries) {
    return;
  }

  isInstallingLibraries = true;
  let installErrorMessage = null;
  libraryCard.dataset.state = "installing";
  libraryStateLabel.textContent = "正在做";
  libraryTitle.textContent = "正在安装 Python 库";
  libraryFeedback.textContent = "";
  libraryFeedback.dataset.kind = "";
  libraryWorking.hidden = false;
  installLibrariesButton.disabled = true;
  selectAllLibrariesButton.disabled = true;

  for (const checkbox of libraryList.querySelectorAll("input")) {
    checkbox.disabled = true;
  }

  try {
    const response = await fetch("/api/libraries/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libraries }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Python 库安装失败。");
    }

    selectedLibraries.clear();
    libraryWorking.hidden = true;
    libraryCard.dataset.state = "ready";
    libraryStateLabel.textContent = "已完成";
    libraryFeedback.dataset.kind = "success";
    libraryFeedback.textContent = "选中的 Python 库已安装完成。";
    renderLibraryList(result.libraries);

    const allInstalled = result.libraries.every(
      (library) => library.installed,
    );

    if (allInstalled) {
      libraryTitle.textContent = "Python 库已准备好";
      pageTitle.textContent = "第一课的基础环境已准备完成。";
      introDescription.textContent =
        "Python、项目虚拟环境和课程库都已就绪，可以继续学习。";
      renderLibraryComplete(result.libraries);
      libraryCard.hidden = true;
      libraryComplete.hidden = false;
    }
  } catch (error) {
    installErrorMessage =
      error.message || "安装失败，请检查网络后重试。";
  } finally {
    isInstallingLibraries = false;
    libraryWorking.hidden = true;

    if (installErrorMessage) {
      try {
        await loadLibraryStatus();
      } catch (refreshError) {
        console.error("Unable to refresh library status:", refreshError);
      }

      libraryCard.dataset.state = "error";
      libraryStateLabel.textContent = "需要处理";
      libraryTitle.textContent = "Python 库安装失败";
      libraryFeedback.dataset.kind = "error";
      libraryFeedback.textContent = installErrorMessage;
    }

    updateLibraryControls();
  }
}

async function requestPythonDetection() {
  if (window.pywebview?.api?.detect_python) {
    return window.pywebview.api.detect_python();
  }

  const response = await fetch("/api/python", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`本地检测服务返回 ${response.status}`);
  }

  return response.json();
}

async function loadProject() {
  const response = await fetch("/api/project", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`读取项目状态失败：${response.status}`);
  }

  const result = await response.json();

  if (result.selected && result.path) {
    renderProjectSelection(result.path);
  } else {
    renderProjectIdle();
  }
}

async function loadFolderDirectory(directory) {
  const requestId = ++folderRequestId;
  const query = directory
    ? `?path=${encodeURIComponent(directory)}`
    : "";

  folderError.textContent = "";
  resetNewFolderForm();
  currentFolderPath.textContent = "正在读取...";
  folderList.replaceChildren();
  confirmFolderButton.disabled = true;
  showNewFolderButton.disabled = true;

  const response = await fetch(`/api/folders${query}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `无法读取文件夹：${response.status}`);
  }

  const result = await response.json();

  if (requestId !== folderRequestId) {
    return;
  }

  currentFolderPathValue = result.path;
  currentFolderParent = result.parent;
  currentFolderPath.textContent = result.path;
  currentFolderPath.title = result.path;
  folderUpButton.disabled = !result.parent;
  confirmFolderButton.disabled = false;
  showNewFolderButton.disabled = false;

  driveList.replaceChildren();

  for (const root of result.roots) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "drive-button";
    button.textContent = root;
    button.classList.toggle(
      "is-current",
      result.path.toLocaleLowerCase().startsWith(root.toLocaleLowerCase()),
    );
    button.addEventListener("click", () => {
      loadFolderDirectory(root).catch(showFolderError);
    });
    driveList.append(button);
  }

  folderList.replaceChildren();

  if (result.directories.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "folder-empty";
    emptyMessage.textContent = "这个文件夹中没有子文件夹，可以直接选择它。";
    folderList.append(emptyMessage);
    return;
  }

  for (const directoryEntry of result.directories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "folder-entry";
    button.title = directoryEntry.path;

    button.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 6.5h6l2 2h9v10h-17v-12Z"></path>
        <path d="M3.5 9h17"></path>
      </svg>
      <span></span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    `;
    button.querySelector("span").textContent = directoryEntry.name;
    button.addEventListener("click", () => {
      loadFolderDirectory(directoryEntry.path).catch(showFolderError);
    });
    folderList.append(button);
  }
}

function showFolderError(error) {
  folderError.textContent =
    error.message || "无法读取这个文件夹，请返回上一级重试。";
  currentFolderPath.textContent = currentFolderPathValue || "读取失败";
  confirmFolderButton.disabled = !currentFolderPathValue;
  showNewFolderButton.disabled = true;
}

function resetNewFolderForm() {
  newFolderForm.hidden = true;
  newFolderName.value = "";
  newFolderError.textContent = "";
  createFolderButton.disabled = false;
  createFolderButton.textContent = "创建";
}

function openNewFolderForm() {
  if (!currentFolderPathValue || isCreatingFolder) {
    return;
  }

  newFolderForm.hidden = false;
  newFolderError.textContent = "";
  newFolderName.value = "";
  newFolderName.focus();
}

async function createProjectFolder(event) {
  event.preventDefault();

  if (!currentFolderPathValue || isCreatingFolder) {
    return;
  }

  const folderName = newFolderName.value.trim();

  if (!folderName) {
    newFolderError.textContent = "请输入文件夹名称。";
    newFolderName.focus();
    return;
  }

  isCreatingFolder = true;
  createFolderButton.disabled = true;
  createFolderButton.textContent = "创建中...";
  newFolderError.textContent = "";

  try {
    const response = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentPath: currentFolderPathValue,
        name: folderName,
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || `创建文件夹失败：${response.status}`);
    }

    newFolderForm.hidden = true;
    await loadFolderDirectory(result.path);
  } catch (error) {
    const message = error.message || "无法创建文件夹，请检查名称后重试。";

    if (newFolderForm.hidden) {
      folderError.textContent = message;
    } else {
      newFolderError.textContent = message;
    }
  } finally {
    isCreatingFolder = false;
    createFolderButton.disabled = false;
    createFolderButton.textContent = "创建";
  }
}

function closeFolderDialog() {
  resetNewFolderForm();
  folderDialog.close();
}

async function saveProjectFolder() {
  if (!currentFolderPathValue || isSelectingFolder) {
    return;
  }

  isSelectingFolder = true;
  confirmFolderButton.disabled = true;
  confirmFolderButton.textContent = "正在保存...";
  folderError.textContent = "";

  try {
    const response = await fetch("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: currentFolderPathValue }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || `保存文件夹失败：${response.status}`);
    }

    renderProjectSelection(result.path);
    folderDialog.close();
  } catch (error) {
    folderError.textContent = error.message || "无法保存项目文件夹。";
    console.error("Project folder selection failed:", error);
  } finally {
    isSelectingFolder = false;
    confirmFolderButton.disabled = false;
    confirmFolderButton.textContent = "选择此文件夹";
  }
}

function openProjectFolderDialog() {
  if (folderDialog.open) {
    return;
  }

  resetNewFolderForm();
  folderDialog.showModal();
  loadFolderDirectory(selectedProjectPath).catch(showFolderError);
}

async function detectPython() {
  if (isChecking) {
    return;
  }

  isChecking = true;
  setCheckingState();

  try {
    const result = await requestPythonDetection();

    if (result.found) {
      renderFound(result);
    } else if (result.reason === "NO_PYTHON_FOUND") {
      renderMissing();
    } else {
      renderError(result.message || "检测服务返回了未知结果。");
    }

    renderCheckedTime(result.checkedAt);
  } catch (error) {
    renderError("无法连接本地检测服务，请确认软件正在运行。");
    console.error("Python detection failed:", error);
  } finally {
    isChecking = false;
    redetectButton.disabled = false;
    redetectLabel.textContent = "重新检测";
  }
}

redetectButton.addEventListener("click", detectPython);
redetectCompleteButton.addEventListener("click", detectPython);
selectFolderButton.addEventListener("click", openProjectFolderDialog);
closeFolderDialogButton.addEventListener("click", closeFolderDialog);
cancelFolderDialogButton.addEventListener("click", closeFolderDialog);
folderUpButton.addEventListener("click", () => {
  if (currentFolderParent) {
    loadFolderDirectory(currentFolderParent).catch(showFolderError);
  }
});
showNewFolderButton.addEventListener("click", openNewFolderForm);
cancelNewFolderButton.addEventListener("click", resetNewFolderForm);
newFolderForm.addEventListener("submit", createProjectFolder);
confirmFolderButton.addEventListener("click", saveProjectFolder);
createVenvButton.addEventListener("click", createEnvironment);
selectAllLibrariesButton.addEventListener("click", toggleAllLibraries);
installLibrariesButton.addEventListener("click", installSelectedLibraries);
folderDialog.addEventListener("click", (event) => {
  if (event.target === folderDialog) {
    closeFolderDialog();
  }
});
detectPython();
loadProject().catch((error) => {
  console.error("Unable to load project state:", error);
});
