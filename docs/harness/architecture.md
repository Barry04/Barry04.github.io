# 架构

- `_config.yml`：站点名 Barry、域 https://suncy.me、白名单插件
- `_layouts/default.html`：顶栏、正文、文章页 utterances
- `_includes/home.html`：首页首屏图解、精选文章、作者和开源项目；完整索引仍来自 `README.md`
- `assets/css/home.scss`：只在首页加载的科技风样式，适配深浅色与移动端
- `assets/css/style.scss`、`assets/js/theme.js`：深浅色
- `README.md`：首页时间轴
- `YYYY/*.md`：文章；`resources/`：关于、归档、头像
- `CNAME`：`suncy.me`

插件只准：`jekyll-optional-front-matter`、`jekyll-readme-index`、`jekyll-titles-from-headings`、`jekyll-redirect-from`。
