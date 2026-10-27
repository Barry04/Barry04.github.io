# 约定

- 新文章放进**当前年份**目录，并在 `README.md` 的完整索引里加一行
- **文章 front matter 契约**（首页"最近在写"靠它自动渲染）：
  - `date`（**必填**，`YYYY-MM-DD`）—— 首页按它倒序取最新两篇，不写就不会被正确排序
  - `tag`（建议）—— 卡片上的分类，如 `AI / 工程`
  - `summary`（建议）—— 卡片摘要，一句话
  - `image`（可选）—— 卡片配图，如 `/assets/<slug>-illustrations/01-x.png`；**不写则渲染为纯文字卡片**
  - `badge`（可选）—— 卡片角标，默认最新一篇自动显示"最新文章"
  - `reading_style: story`（可选）—— 连续图解式文章；用 `<section class="story-scene" data-scene="本幕观点" markdown="1">` 包正文章节，保留正常 h2 目录。图解用 `{% include story/diagram.html kind="lifecycle" %}`，也支持 `scope`、`feedback`；使用现有主题变量，代码、证据和引用不因图解化而删除。
- 旧 Hexo 链接用 `redirect_from`
- 不要提交 `_site/`
- 不要把密钥写进仓库
- 不要引入非 GitHub Pages 白名单插件
- 中文给读者看；路径和配置键保持英文
