# 其余技术文章图解式改写

用户已确认采用 visual-story-writing，沿用上一篇的多色图解与动效。范围为 2026 年另外四篇 AI/工程文章；《重新开工》和历史归档不做技术图解改写。

## 内容设计

- `vibe-coding-bottleneck`：隐藏规则 → 同源自审的盲点 → 边界和门禁 → 真实样本验收 → 实施顺序。
- `agent-skill-memory-governance`：维护责任 → 方法/事实/任务记录的区别 → 候选与验证 → 授权 → 使用反馈 → 复核、引用、检索退出。
- `agent-unreleased-code-compatibility`：字段改名 → 进度/事实分离 → 自动关联记录 → 同需求继续修复 → 入口与 Skill → 真实依赖判断。
- `jev-model-thinking`：判断路径 → 控制点层次 → 不同失败方式 → 决策状态 → 能力与上下文 → 稳定结构与灵活选择 → 未知与生命周期。

## 实施与验收

1. 先增加四篇文章的浏览器检查并确认原版缺少 story 能力。
2. 增加数据驱动的通用图解 include，支持顺序、并列对照、分层、条件分支；图解数据进入 `_data/story_diagrams.yml`。
3. 修改正文与观点标题，保留旧 h2/h3 ID、全部代码块、引用、原有插图；复杂旧 SVG 以可展开详图保留，核心结论直接可见。
4. JEV 保持个人理解与待验证的范围，不把概念比喻写成量化公式或重放一致性保证。
5. Jekyll 构建；核对原代码、链接与锚点；浏览器验证四篇桌面/320/375px、深浅色、动画暂停、无 JS 和打印。回归上一篇和普通文章。
6. 在既有发布授权下提交并推送，确认 Pages 成功和线上内容更新。

不修改已安装 Skill 或其他仓库；本次验证得到的新经验仅用于本任务，不另存记忆。

## 验证记录

- 原版浏览器检查先因缺少 story 布局失败，改写后四篇检查通过。
- 四篇共 35 幕、12 张定制图解，分别使用分层、并列、顺序和条件分支；并列和分支不显示顺序连接线。
- `bundle exec jekyll build --destination .tmp-preview/story-baseline` 构建成功。
- `bundle exec ruby tools/check-story-rewrites.rb` 核对原有代码块、链接、h2/h3 锚点及唯一 ID；四篇通过。
- `node tools/test-story-rewrites.cjs` 检查桌面、375/320px、深浅色、动画控制、目录、无 JS 和打印；四篇通过。
- `node tools/test-story.cjs` 与 `bundle exec ruby tools/check-story-content.rb 2d512fe` 回归上一篇图解文章和普通文章隔离，通过。
