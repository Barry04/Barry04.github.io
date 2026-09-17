# Modern Blog Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Barry04.github.io 首页改造成现代、克制、具有个人辨识度的科技 Bento 首页，并完成深浅色、响应式和可访问性验收。

**Architecture:** 保留 Jekyll 根目录构建和 `default` 布局，不引入插件或前端框架。`README.md` 提供首页语义内容，`_layouts/default.html` 提供首页 Hero 与全站壳层，`assets/css/style.scss` 负责 Bento 布局、主题 token 和响应式行为。

**Tech Stack:** Jekyll、Liquid、Kramdown、SCSS、原生 HTML、现有主题 JavaScript

**Spec:** `docs/superpowers/specs/2026-09-17-modern-homepage-design.md`

## Global Constraints

- 保留首页、归档、关于和全部现有文章入口。
- GitHub Pages 继续从 `master` 根目录构建。
- 不增加 JavaScript 框架、Jekyll 插件、订阅表单、统计服务或内容数据库。
- 默认继续尊重系统主题与现有 `barry-theme` 设置。
- 移动端最小正文 16px，交互目标至少 44px，375px 宽度不得横向滚动。
- 所有卡片使用真实链接，支持键盘焦点，不依赖 hover 才能理解内容。
- 尊重 `prefers-reduced-motion`。

---

### Task 1: 重构首页语义内容

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: 现有文章路径、标题、日期和标签。
- Produces: `.home-bento`、`.home-card`、`.home-index` 等首页样式钩子。

- [ ] **Step 1: 记录当前首页链接基线**

Run:

```powershell
rg -o "\]\([^)]+\)" README.md
```

Expected: 输出 8 个文章链接，包含 2026、2022、2021 年现有文章。

- [ ] **Step 2: 写入语义化 Bento 内容**

将“现在”的 Markdown 表格改为：

```html
<section class="home-bento" aria-labelledby="latest-writing">
  <h2 id="latest-writing" class="section-label">最新写作</h2>
  <div class="bento-grid">
    <a class="home-card home-card--featured" href="./2026/skill-lifecycle.md">
      <span class="card-kicker">LATEST · 09/17 · AI / 工程</span>
      <h3>Skill 生命周期：Vibe Coding 下的管理与演进</h3>
      <p>当 Agent 开始积累经验，怎么避免 Skill 越来越多、越来越乱。</p>
      <span class="card-action">阅读文章 <span aria-hidden="true">→</span></span>
    </a>
    <!-- 次新文章、归档与关于卡片使用同样语义结构 -->
  </div>
</section>
```

在 Bento 后使用 `<section class="home-index">` 保留全部文章，并继续区分“现在”和“学生时代”。

- [ ] **Step 3: 检查现有链接没有丢失**

Run:

```powershell
rg "\./(2026|2022|2021)/" README.md
```

Expected: 原有 8 个文章路径全部存在。

- [ ] **Step 4: 构建验证语义内容**

Run:

```powershell
bundle exec jekyll build
```

Expected: exit 0，生成 `_site/index.html`。

- [ ] **Step 5: Commit**

```powershell
git add README.md
git commit -m "feat: restructure homepage content"
```

### Task 2: 实现科技 Bento 首屏与全站导航适配

**Files:**
- Modify: `_layouts/default.html`

**Interfaces:**
- Consumes: `page_is_home`、`brand`、`motto`、现有导航和主题切换。
- Produces: `.home-hero`、`.home-eyebrow`、`.home-title`、`.home-intro`、`.home-actions`、`.home-status`。

- [ ] **Step 1: 调整首页 Hero 结构**

把现有首页 `.hero` 替换为：

```html
<section class="home-hero" aria-labelledby="home-title">
  <div class="home-hero__copy">
    <p class="home-eyebrow">PERSONAL LOG / AI ENGINEERING</p>
    <h1 id="home-title" class="home-title">构建、验证，<br>然后写下来。</h1>
    <p class="home-intro">记录存量系统、Agent 工程，以及那些值得长期留下的实践。</p>
    <p class="home-actions">
      <a class="home-button home-button--primary" href="#latest-writing">查看最新文章</a>
      <a class="home-button" href="https://github.com/Barry04">GitHub</a>
    </p>
  </div>
  <dl class="home-status" aria-label="站点信息">
    <div><dt>DOMAIN</dt><dd>suncy.me</dd></div>
    <div><dt>WRITING</dt><dd>2018—2026</dd></div>
    <div><dt>FOCUS</dt><dd>AI · ENGINEERING</dd></div>
  </dl>
</section>
```

- [ ] **Step 2: 保持非首页结构不变**

确认 `article-head`、评论区和资源页分支不移动，只让新的 Hero 位于 `{% if page_is_home %}` 内。

- [ ] **Step 3: 检查 Liquid 分支完整**

Run:

```powershell
bundle exec jekyll build
```

Expected: exit 0；首页、文章页和资源页均生成。

- [ ] **Step 4: Commit**

```powershell
git add _layouts/default.html
git commit -m "feat: add modern homepage hero"
```

### Task 3: 建立首页视觉系统与响应式布局

**Files:**
- Modify: `assets/css/style.scss`

**Interfaces:**
- Consumes: Task 1、Task 2 产生的首页 class。
- Produces: 完整深浅色、Bento 网格、文章索引和移动端表现。

- [ ] **Step 1: 扩展语义主题 token**

在 `:root` 和 `[data-theme="dark"]` 增加：

```scss
--surface-strong: #ffffff;
--surface-soft: #edf2ef;
--accent-soft: rgba(30, 107, 82, 0.12);
--signal-warm: #d96c37;
--shadow-card: 0 18px 50px rgba(18, 35, 30, 0.08);
```

深色主题提供独立值，保证正文与卡片文字对比度。

- [ ] **Step 2: 实现 Hero 与按钮**

使用 12 列网格：

```scss
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(14rem, 0.6fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: end;
  min-height: min(34rem, calc(100dvh - var(--nav-h)));
  padding: clamp(4rem, 10vw, 8rem) 0 4rem;
}
```

按钮高度至少 44px，并提供 hover、active、focus-visible 状态。

- [ ] **Step 3: 实现 Bento 卡片**

```scss
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

.home-card--featured { grid-column: span 8; min-height: 22rem; }
.home-card--secondary { grid-column: span 4; }
.home-card--compact { grid-column: span 3; }
```

卡片整体为链接；动效只使用 `transform`、`border-color` 和 `background-color`，时长 180–240ms。

- [ ] **Step 4: 实现完整文章索引**

为 `.home-index__row` 使用日期、标题、标签三列；在窄屏改为两列并让标签换行到标题下方。学生时代使用低一层表面和虚线分隔，不降低正文到不可读的透明度。

- [ ] **Step 5: 添加响应式与 reduced-motion**

```scss
@media (max-width: 1023px) {
  .home-card--featured { grid-column: span 12; }
  .home-card--secondary,
  .home-card--compact { grid-column: span 6; }
}

@media (max-width: 767px) {
  .home-hero { grid-template-columns: 1fr; min-height: auto; }
  .home-card--secondary,
  .home-card--compact { grid-column: span 12; }
}

@media (prefers-reduced-motion: reduce) {
  .home-card,
  .home-button { transition: none; transform: none; }
}
```

- [ ] **Step 6: 构建 CSS**

Run:

```powershell
bundle exec jekyll build
```

Expected: exit 0，`_site/assets/css/style.css` 包含 `.home-bento` 和 `.home-card--featured`。

- [ ] **Step 7: Commit**

```powershell
git add assets/css/style.scss
git commit -m "feat: style responsive bento homepage"
```

### Task 4: 浏览器验收与修复

**Files:**
- Modify: `README.md`
- Modify: `_layouts/default.html`
- Modify: `assets/css/style.scss`

**Interfaces:**
- Consumes: 构建后的完整首页。
- Produces: 桌面、移动、深色、浅色和键盘验收证据。

- [ ] **Step 1: 启动本地站点**

Run:

```powershell
bundle exec jekyll serve --host 127.0.0.1
```

Expected: `http://127.0.0.1:4000` 可访问。

- [ ] **Step 2: 验收桌面深色与浅色**

在约 1440×900 视口检查：

- Hero 不超过首屏可理解范围；
- Bento 层级清楚；
- 所有文章标题可读；
- 导航、卡片、按钮有 hover 与 focus；
- 深浅色都无低对比文字。

- [ ] **Step 3: 验收 375px 移动端**

检查：

- 无横向滚动；
- 导航可操作且不遮挡内容；
- 卡片按“最新、次新、归档、关于”顺序单列；
- 长标题自然换行；
- 交互目标至少 44px。

- [ ] **Step 4: 验收键盘与 reduced-motion**

使用 Tab 依次访问跳转链接、导航、主题按钮、Hero 按钮、文章卡片和文章索引；焦点始终可见。模拟 `prefers-reduced-motion: reduce`，确认无位移动画。

- [ ] **Step 5: 回归文章页**

打开 `2026/skill-lifecycle.html`，确认文章宽度、正文图、代码块和评论区未被首页样式影响。

- [ ] **Step 6: 修复发现的问题并重新构建**

每个问题先记录视口、主题、元素选择器、实际表现和预期表现；只调整对应的 HTML 或 SCSS 规则。修复后在原视口复测，再运行：

Run:

```powershell
bundle exec jekyll build
git diff --check
```

Expected: 两条命令 exit 0。

- [ ] **Step 7: Commit**

```powershell
git add README.md _layouts/default.html assets/css/style.scss
git commit -m "fix: polish homepage responsive behavior"
```
