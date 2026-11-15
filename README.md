# ML Generator 开发说明

当前版本是一个本地 Web 界面加 Node.js 后端的学习助手。课程内容仍写在 `index.html` 中，后端负责检测 Python、选择项目目录、创建虚拟环境、安装 Python 库等系统操作。

目前只有第一门课程：**设置基础环境**。

## 启动测试

测试必须从普通终端启动。不要直接双击 `index.html`，也不要使用受限沙箱启动，否则页面无法访问后端接口，Python 也可能被误判为未安装。

### Windows

终端一：

```powershell
cd C:\Users\samzh\Desktop\MLGenerator
node preview-server.js
```

终端二：

```powershell
Start-Process msedge.exe -ArgumentList "--app=http://127.0.0.1:8765"
```

也可以直接用浏览器打开 <http://127.0.0.1:8765>。

### macOS

终端一：

```bash
cd "/path/to/MLGenerator"
node preview-server.js
```

终端二：

```bash
open http://127.0.0.1:8765
```

关闭测试时，在运行服务的终端按 `Ctrl+C`。

## 文件职责

| 文件 | 职责 |
| --- | --- |
| `index.html` | 顶栏、课程边栏、当前课程和步骤结构 |
| `styles.css` | 页面、固定顶栏、边栏、折叠步骤和卡片样式 |
| `app.js` | 页面状态、按钮交互、调用后端接口 |
| `preview-server.js` | 本地 HTTP 服务和 API 路由 |
| `python-detector.js` | 检测 Windows/macOS 上的 Python 和版本 |
| `project-state.js` | 保存当前项目根目录与激活的虚拟环境 |
| `folder-browser.js` | 浏览目录和创建新文件夹 |
| `environment-manager.js` | 创建、验证和激活 `.venv` |
| `library-manager.js` | Python 库目录、安装和版本检测 |
| `app-state.json` | 运行时状态文件，不应手写为课程数据 |

主要 API：

| 接口 | 说明 |
| --- | --- |
| `GET /api/python` | 检测 Python |
| `GET/POST /api/project` | 读取或设置项目根目录 |
| `GET/POST /api/folders` | 浏览目录或创建文件夹 |
| `GET/POST /api/environment` | 查询、创建并激活虚拟环境 |
| `GET /api/libraries` | 查询库及安装状态 |
| `POST /api/libraries/install` | 在项目 venv 中安装选中的库 |

## 增加一个步骤

当前步骤顺序：

1. 检测 Python
2. 创建并激活虚拟环境
3. 选择并安装 Python 库

增加新步骤时，原来的当前步骤要变成折叠完成项，新步骤作为当前卡片显示。

### 1. 添加完成项

在 `index.html` 中使用统一的折叠结构：

```html
<details class="completed-group" id="new-step-complete" hidden>
  <summary class="completed-summary">
    <span class="completed-marker" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="m6.5 12.5 3.5 3.5 7.5-8"></path>
      </svg>
    </span>
    <span class="completed-copy">
      <span>已完成</span>
      <strong>新步骤已完成</strong>
      <small>结果摘要</small>
    </span>
    <span class="completed-action">
      查看
      <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
    </span>
  </summary>

  <div class="completed-details">
    在这里放可展开查看的路径、版本或执行结果。
  </div>
</details>
```

完成项默认保持 `details.open = false`，用户点击摘要后重新展开。

### 2. 添加当前步骤

可复用现有 `venv-card` 或 `library-card` 的结构，在主内容区增加一个默认隐藏的当前步骤卡片：

```html
<section class="library-card" id="new-step-card" hidden>
  <div class="card-heading">
    <div class="library-icon" aria-hidden="true"><!-- 图标 --></div>
    <div class="heading-copy">
      <span class="state-label">正在做</span>
      <h2>新步骤名称</h2>
    </div>
    <span class="step-count">第 4 步</span>
  </div>

  <p class="state-description">告诉学员这一步要完成什么。</p>
  <button id="new-step-button" type="button">开始</button>
</section>
```

### 3. 接入页面状态

在 `app.js` 中：

1. 获取新步骤的 DOM 元素。
2. 在 `setCheckingState()` 等状态切换处隐藏新步骤。
3. 上一步成功后显示新步骤。
4. 新步骤成功后隐藏当前卡片、显示对应 `completed-group`。

案例库功能可参考：

- `renderEnvironmentReady()`：虚拟环境完成后显示库选择。
- `loadLibraryStatus()`：加载后端状态。
- `renderLibraryComplete()`：全部安装后切换为折叠完成项。

### 4. 添加后端能力

系统操作不要直接写在 HTML/浏览器中。新增独立模块，例如 `lesson-manager.js`，然后在 `preview-server.js` 中增加 API 路由，由 `app.js` 调用。

跨平台路径应通过 Node 的 `path` 模块处理，不要写死 Windows 路径。执行 Python 时始终优先使用：

```text
Windows: 项目目录/.venv/Scripts/python.exe
macOS:   项目目录/.venv/bin/python
```

## 增加一门课程

当前页面只有一门课程，还没有完整的课程路由。增加第二门课程时，建议先改成“一个 `main` 中包含多个课程页”的结构。

### 1. 边栏增加课程

在 `index.html` 的课程 `nav` 中增加：

```html
<a class="course-option" href="#course-regression" data-course="regression">
  <span class="course-number" aria-hidden="true">02</span>
  <span class="course-option-copy">
    <strong>线性回归</strong>
    <small>第二课程</small>
  </span>
</a>
```

### 2. 增加课程内容区

保留唯一的 `main`，把不同课程写成 `section`：

```html
<main class="stage">
  <section class="course-page" data-course-page="setup">
    <!-- 设置基础环境内容 -->
  </section>

  <section class="course-page" data-course-page="regression" hidden>
    <!-- 线性回归内容 -->
  </section>
</main>
```

### 3. 增加课程切换

在 `app.js` 中根据 `data-course` 隐藏其他课程页、显示目标课程页，并同步：

- `.course-option.is-active`
- `aria-current="page"`
- 课程标题和步骤状态

课程切换只改变内容区，顶栏和课程边栏应始终保留。

## 增加一个 Python 库

在 `library-manager.js` 的 `LIBRARY_CATALOG` 中增加一项：

```js
{
  id: "numpy",
  packageName: "numpy",
  displayName: "NumPy",
  description: "用于数值计算和多维数组。",
  badge: "数值计算"
}
```

前端会自动生成介绍、复选框、安装状态和版本信息。实际安装时会调用当前项目 venv 的 pip，不需要修改安装页面。

## 状态和重置

`app-state.json` 保存：

- 当前项目根目录
- 当前激活的虚拟环境路径
- venv 中的 Python 路径
- 激活时间和 Python 版本

需要重新走一遍文件夹和环境选择时，可以删除 `app-state.json`。删除状态文件不会删除项目中的 `.venv` 或已安装的库。
