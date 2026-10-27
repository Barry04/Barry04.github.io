# 图解文章与写作 Skill 实施计划

> 执行方式：本会话直接实现；使用 executing-plans，完成后独立审阅写作 Skill。

**目标：** 将《Skill 生命周期》改为连续图解式文章，提炼 `visual-story-writing`，上传 Barry04/ai-skill-repository 并安装本地。

**已确认设计：** PPT 式分幕与观点标题、连续滚动、保留长文信息；参照 youbeat.cn 的工程网格、多色节点和动态流线。2026-10-27 用户已授权实施、创建 Skill、上传和本地安装。

**架构：** 现有 Jekyll + Liquid + 独立 SCSS + 原生 JS。以 `reading_style: story` 按篇启用。Skill 独立保存在第二仓库，不形成博客运行时依赖。

## 范围与证据

- `E:/Barry04.github.io`：`_layouts/default.html` 管理文章正文、目录和脚本；`2026/skill-lifecycle.md` 为目标文章；新样式只对图解文章启用。
- `E:/evolving-skill`：远程为 Barry04/ai-skill-repository；`skill/` 存正式 Skill，AGENTS.md、README.md、README.en.md、UPGRADE.md 共同维护索引。
- 两仓库均在 master，工作树除博客已有 `__debug_rev.md` 外干净；保留现有文件。
- 本地安装：仅安装新 Skill 到 Codex 目录，不覆盖其他 Skill。

## 验收重点

- 原文案例、代码、引用保留，旧文章不加载新脚本或样式。
- 手机图解按纵向排列，深浅色文字清楚；无 JS 时完整可读。
- 进入视野播放、离开暂停，后台暂停；可手动暂停，系统减少动态效果时静态显示。
- 动画只表达信息方向和当前阶段，不将流程循环误表示为一次真实业务执行。
- Skill 指导写作结构、图解和动效选择，适配现有博客，而非强制迁移框架；不自动授权发布。

## 实施任务

1. [x] 添加浏览器行为验证，先在原站构建中确认缺失图解能力，再实现。
2. [x] 增加 `assets/css/story.scss`、`assets/js/story.js`、`_includes/story/diagram.html`，在默认布局中按篇加载。
3. [x] 给目标文章分幕，加入彩色图解，保留原文细节并以原生 details 收纳复杂图示。
4. [x] Jekyll 构建，浏览器验证桌面/手机、深浅色、暂停、减少动态、无 JS 和普通文章回归。
5. [x] 创建 Skill 与必要写作/视觉参考及验收场景，同步第二仓库四处索引。
6. [x] 结构校验、独立行为试用、安装内容核对；Skill 已提交推送，博客在本记录提交时一并提交推送。
7. [x] 用 skill-installer 从推送后的确切提交安装，验证与仓库内容一致，报告位置和调用方式。

## 验证与交付记录

- `bundle exec jekyll build --destination .tmp-preview/story-baseline`：成功。
- `bundle exec ruby tools/check-story-content.rb <改版前提交>`：原文 309 行非空内容、全部代码块与原有 10 个 h2/h3 锚点保留。
- `node tools/test-story.cjs`：桌面、375px、320px，深浅色、阶段切换、暂停/恢复、离屏/后台、减少动态、无 JS、打印、普通文章资源隔离均通过。需要环境可解析 Playwright，且有 Chrome；不为运行该检查添加站点前端依赖。
- Skill `quick_validate.py` 与四处索引检查通过，独立试用保持假设案例口吻；独立审阅发现的闭合 details 打印隐藏已修复并加入浏览器验证。
- Skill 远程提交 `832b410`，本地安装位置 `C:/Users/12897/.codex/skills/visual-story-writing`。普通文章不受新样式影响。
