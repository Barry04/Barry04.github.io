#!/usr/bin/env node
/**
 * 把本地 Agent-Interview-100 阅读器同步到本站 `/agent-interview/` 子路径。
 *
 * 用法：
 *   node tools/sync-agent-interview.mjs            # 直接用源仓库现成的 reader/ 产物
 *   node tools/sync-agent-interview.mjs --build    # 先跑源仓库的 npm run build:reader 再同步
 *
 * 为什么是「拷产物」而不是 submodule：
 *   reader/ 是完全自包含的静态站（相对路径 + 本地 mermaid），拷进来 GitHub Pages 直接托管，
 *   不需要在构建期跑 Node。代价是上游更新要重跑本脚本，所以把它固化成命令。
 */

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SITE_ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_ROOT = process.env.AGENT_INTERVIEW_SRC || "E:/Agent-Interview-100";
const TARGET = path.join(SITE_ROOT, "agent-interview");
const DO_BUILD = process.argv.includes("--build");

const log = (msg) => console.log(`[sync] ${msg}`);

/** 注入到 reader.js 末尾的桥接补丁：返回博客入口 + 文案纠偏 + 来源署名。 */
const JS_PATCH = `
/* ---- suncy.me 站点桥接补丁（由 tools/sync-agent-interview.mjs 注入，勿手改）---- */
(() => {
  const brand = document.querySelector(".sidebar-brand");
  if (brand) {
    const back = document.createElement("a");
    back.className = "back-to-blog";
    back.href = "/";
    back.textContent = "← 返回 suncy.me";
    brand.parentNode.insertBefore(back, brand);
  }
  const status = document.querySelector(".reading-status");
  if (status) status.innerHTML = '<span class="status-dot"></span>Agent Interview 100';
  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML =
      'Agent Interview 100 · 内容来自 ' +
      '<a href="https://github.com/BigKunLun/Agent-Interview-100" target="_blank" rel="noopener">BigKunLun/Agent-Interview-100</a>' +
      '（MIT）· 本站仅作阅读器托管';
  }
})();
`;

/** 桥接补丁需要的样式，追加在 reader.css 末尾。 */
const CSS_PATCH = `
/* ---- suncy.me 站点桥接样式（同步脚本注入）---- */
.back-to-blog{display:block;margin:0 8px 16px;padding:5px 9px;border:1px solid #30404e;border-radius:6px;color:#9fb3c2;font-size:12px;text-decoration:none;transition:color .15s,border-color .15s,background .15s}
.back-to-blog:hover{color:#fff;border-color:#38b2a3;background:#1d2a35}
.site-footer a{color:#8fb3ad;text-decoration:underline;text-underline-offset:2px}
`;

async function main() {
  if (!existsSync(SOURCE_ROOT)) {
    throw new Error(`源仓库不存在：${SOURCE_ROOT}（可用 AGENT_INTERVIEW_SRC 指定）`);
  }
  if (!existsSync(path.join(SOURCE_ROOT, "reader", "index.html"))) {
    throw new Error(`源仓库缺少 reader/ 产物，先执行 npm run build:reader：${SOURCE_ROOT}`);
  }

  if (DO_BUILD) {
    log("构建源仓库 reader/ ...");
    execFileSync("npm", ["run", "build:reader"], { cwd: SOURCE_ROOT, stdio: "inherit", shell: true });
  }

  log(`清空 ${path.relative(SITE_ROOT, TARGET)}/`);
  await fs.rm(TARGET, { recursive: true, force: true });
  await fs.cp(path.join(SOURCE_ROOT, "reader"), TARGET, { recursive: true });

  // reader/ 产物只带 reader-src 里的资源，README 引用的全景图要单独补
  const mapSrc = path.join(SOURCE_ROOT, "assets", "agent-stack-map.png");
  if (existsSync(mapSrc)) {
    await fs.copyFile(mapSrc, path.join(TARGET, "assets", "agent-stack-map.png"));
    log("补入 agent-stack-map.png");
  } else {
    console.warn("[sync] 警告：找不到 assets/agent-stack-map.png，首页全景图会 404");
  }

  await fs.appendFile(path.join(TARGET, "assets", "reader.js"), JS_PATCH, "utf8");
  await fs.appendFile(path.join(TARGET, "assets", "reader.css"), CSS_PATCH, "utf8");
  log("注入站点桥接补丁（返回博客 / 文案 / 署名）");

  const chapters = await fs.readdir(path.join(TARGET, "chapters"));
  log(`完成：${chapters.length} 个章节页 → ${path.relative(SITE_ROOT, TARGET)}/`);
}

await main();
