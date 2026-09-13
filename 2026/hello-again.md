---
layout: default
title: 重新开工
---

旧站是 2022 年停更的 Hexo 产物，源码不在仓库里。现在换成 Jekyll：仓库即源码，GitHub Pages 从 `master` 根目录构建。

## 这里写什么

技术和乱七八糟的想法都会放。旧文只迁了几篇还值得留的笔记，作业贴和空壳不再上首页。

## 怎么发一篇

1. 按**当前年份**新建 `YYYY/slug.md`（现在是 `2026/`）。
2. 需要旧链接时，在 front matter 里写 `redirect_from`。
3. 在根目录 `README.md` 对应年份表格加一行。

本地预览：

```bash
bundle exec jekyll serve
```
