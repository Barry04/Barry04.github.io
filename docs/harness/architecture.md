# 架构

- `_config.yml`：站点名 Barry、域 https://suncy.me、白名单插件
- `_layouts/default.html`：顶栏、正文、文章页 utterances
- `_includes/home.html`：首页首屏图解、精选文章、作者和开源项目；完整索引仍来自 `README.md`
- `assets/css/home.scss`：只在首页加载的科技风样式，适配深浅色与移动端；含首页动态背景（`.home-backdrop` 网格/极光层）样式
- `assets/js/home-bg.js`：只在首页加载的 Canvas 粒子星座背景。颜色读 CSS 变量跟随深浅色；`prefers-reduced-motion` 下只画静态一帧；标签页隐藏时暂停
- `assets/css/style.scss`、`assets/js/theme.js`：深浅色
- 注意：`.home-intro` / `.home-actions` / `.home-button` / `.home-eyebrow` 等首页类名由 `home.scss` 独占，`style.scss` 里不要重复定义（旧版首页曾用 `.home-intro` 做描述段落，已移除，否则 `max-width` 会压窄首屏网格）
- `README.md`：首页时间轴
- `YYYY/*.md`：文章；`resources/`：关于、归档、头像
- `CNAME`：`suncy.me`

插件只准：`jekyll-optional-front-matter`、`jekyll-readme-index`、`jekyll-titles-from-headings`、`jekyll-redirect-from`。
