---
layout: default
title: Skill 也会腐化：Vibe Coding 的第二个治理问题
---

上一篇写的是存量项目里 Agent 怎么改代码。[上下文、验证、Harness](./vibe-coding-bottleneck.md) 解决的是「这一次别改散」。

还有第二个问题，我觉得更烦：

> **代码会腐化，Skill 也会腐化。**

项目让 AI 连续写几个月，`skills/` 很容易长成这样：

```text
skills/
├── fix-login.md
├── fix-login-v2.md
├── login-bug.md
├── login-debug.md
├── redis-login.md
├── redis-login-final.md
├── add-api.md
├── add-api-new.md
├── add-api-真正版本.md
└── ...
```

不是没有 Skill。是 Skill 太多了，连模型自己都挑不准该读哪份。

我开始觉得：Skill 不能当普通文件堆着管。它得按 **知识资产** 来管——能进、能出、能合并、能被验证。

<div class="diagram">
<svg viewBox="0 0 600 280" role="img" aria-label="Skill 从有用经验变成无法选择的文件堆">
  <text class="d-cap" x="0" y="14">图 1 · 经验堆成文件之后</text>

  <rect x="0" y="48" width="170" height="90" rx="8" class="d-box"/>
  <text x="85" y="78" text-anchor="middle" dominant-baseline="central">一次修好了</text>
  <text class="d-sub" x="85" y="104" text-anchor="middle" dominant-baseline="central">写成一个 Skill</text>

  <rect x="215" y="48" width="170" height="90" rx="8" class="d-box"/>
  <text x="300" y="78" text-anchor="middle" dominant-baseline="central">又修了一次</text>
  <text class="d-sub" x="300" y="104" text-anchor="middle" dominant-baseline="central">再写一个 v2</text>

  <rect x="430" y="48" width="170" height="90" rx="8" fill="none" stroke="var(--signal)" stroke-width="1.4"/>
  <text x="515" y="78" text-anchor="middle" dominant-baseline="central">目录越来越满</text>
  <text class="d-sub" x="515" y="104" text-anchor="middle" dominant-baseline="central">谁也不知道用哪个</text>

  <path class="d-link" d="M170 93L215 93" marker-end="url(#dArrow1)"/>
  <path class="d-link" d="M385 93L430 93" marker-end="url(#dArrow1)"/>

  <text class="d-sub" x="300" y="180" text-anchor="middle">产生成本极低，选择成本极高</text>
  <text class="d-sub" x="300" y="208" text-anchor="middle">Skill 越多，并不等于 Agent 越懂项目</text>
  <text class="d-sub" x="300" y="244" text-anchor="middle">正式 Skill 必须有限、可检索、可验证、有生命周期</text>

  <defs>
    <marker id="dArrow1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--signal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

## 先说结论：业界走到哪了

现在已经有几套值得认真看的 Skill 管理思路。但先别把它们说得太满：

> **我暂时没找到一个成熟产品，已经把「Vibe Coding → 自动留下经验 → 评估 → 合并 → 淘汰」整条链做完。**

Claude Code、Codex 和开放标准已经把 **Skill Runtime** 做得很清楚：怎么定义、发现、加载、复用和分发。

但 Skill 的重复、冲突、过时和低质量，还是要项目自己收拾。我把这部分叫 **Skill Lifecycle**。

| 参考对象 | 最值得抄 |
| --- | --- |
| [Anthropic Claude Code](https://claude.com/blog/lessons-from-building-claude-code-how-we-use-skills) | 分类、渐进式披露、Verification Skill |
| [OpenAI Codex](https://developers.openai.com/codex/skills) | Repo / User / System 多级 Scope、项目内 Skill、上下文预算 |
| [Agent Skills 开放标准](https://github.com/agentskills/agentskills) | `SKILL.md` 格式、跨 Agent 兼容 |
| [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/agents/skills) | 可移植、可审计、同样走 progressive disclosure |

做 Project Harness 时，我会直接借前三套的 Runtime，再补上 Lifecycle。

## 第一参考：Anthropic

Anthropic 专门写过一篇 [《Lessons from building Claude Code: How we use skills》](https://claude.com/blog/lessons-from-building-claude-code-how-we-use-skills)。文中说，他们内部已有数百个 Skill 在使用。

这和「Skill 越来越多怎么办」是同一题。

### 渐进式披露

不是把所有 Skill 全文塞进上下文，而是：

```text
启动
 ↓
Skill name + description
 ↓
发现可能相关的
 ↓
选中 2~3 个
 ↓
再读完整 SKILL.md
 ↓
执行
```

行业里叫 **Progressive Disclosure（渐进式披露）**。[Agent Skills 开放标准](https://github.com/agentskills/agentskills) 也是这个设计：启动只加载 `name` / `description`，匹配任务后再加载正文。

<div class="diagram">
<svg viewBox="0 0 600 260" role="img" aria-label="渐进式披露：先目录后全文">
  <text class="d-cap" x="0" y="14">图 2 · Progressive Disclosure</text>

  <rect x="0" y="48" width="140" height="70" rx="8" class="d-box"/>
  <text x="70" y="72" text-anchor="middle" dominant-baseline="central">目录</text>
  <text class="d-sub" x="70" y="96" text-anchor="middle" dominant-baseline="central">name + desc</text>

  <rect x="180" y="48" width="140" height="70" rx="8" class="d-box"/>
  <text x="250" y="72" text-anchor="middle" dominant-baseline="central">挑 Top-K</text>
  <text class="d-sub" x="250" y="96" text-anchor="middle" dominant-baseline="central">通常 2~3 个</text>

  <rect x="360" y="48" width="240" height="70" rx="8" fill="var(--accent)"/>
  <text x="480" y="72" text-anchor="middle" dominant-baseline="central" class="d-on-accent">读完整 Skill</text>
  <text class="d-sub" x="480" y="96" text-anchor="middle" dominant-baseline="central">scripts / references 按需</text>

  <path class="d-link" d="M140 83L180 83"/>
  <path class="d-link" d="M320 83L360 83"/>

  <text class="d-sub" x="300" y="160" text-anchor="middle">不是 100 个 Skill 全塞上下文</text>
  <text class="d-sub" x="300" y="188" text-anchor="middle">而是先给目录，再只加载选中的那几个</text>
  <text class="d-sub" x="300" y="228" text-anchor="middle">Skill 管理首先是 Context Management，其次才是文件管理</text>
</svg>
</div>

### 更值得抄的是分类

Anthropic 把内部数百个 Skill 收成 **9 类**。最好的 Skill 干净落在一类里；想干太多事的，反而会把 Agent 搞糊涂。

其中一类特别值得盯：

### Product Verification

他们的原话很直接：在内部实践里，Verification Skill 对输出质量的提升最容易量化；值得让工程师花一周把这类 Skill 做好。

这和「AI 写完 → 再让 AI Review 一眼」不是一路。

他们更倾向：

```text
AI 写
 ↓
执行真实流程
 ↓
程序化断言
 ↓
核对结果
```

例子像：

```text
signup-flow-driver
checkout-verifier
tmux-cli-driver
```

这些已经不是提示词，而是 **可执行的验证能力**。上一篇里我说的「别让它自己证明自己对」，这里被做成了 Skill。

## 第二参考：Codex

Codex 把 Skill 放在：

```text
.agents/skills/
```

并且有多级 Scope：Repo / User / Admin / System。Repo Skill 可以直接跟着仓库走。

```text
repo/
├── .agents/
│   └── skills/
│       ├── api-design/
│       ├── database/
│       └── testing/
```

这对 Project Harness 特别合适：Skill 变成项目工程资产，可以 Git、PR、Code Review。不再是某个人本机上的私货 Prompt。

还有一个细节：Skill 太多时，Codex 会限制初始 Skill 列表占用的上下文预算——官方文档写过，大概是上下文窗口的 **2%**（窗口未知时约 8000 字符）。超了就先压缩描述，再多甚至省略部分 Skill。

所以自己做 Skill Manager，千万别做成「扫描 `skills/` → 全部读取」。

应该是：

```text
Skill Registry
  → Metadata
  → Retriever / Router
  → Top-K Skills
  → 加载完整内容
```

## 第三参考：开放标准，别自己发明格式

[Agent Skills](https://github.com/agentskills/agentskills) 已经有开放规范。核心结构就是：

```text
skill/
├── SKILL.md
├── scripts/
├── references/
├── assets/
└── ...
```

`SKILL.md` 至少要有：

```yaml
name:
description:
```

其他资源按需加载。价值在于：不必把系统绑死在 Claude Code 或 Codex 上。Microsoft Agent Framework 也在走同一套：instructions + scripts + resources，同样 progressive disclosure，目标是复用、审计、版本化、跨 Agent。

所以项目级 Skill，我建议：

```text
格式直接兼容 Agent Skills Standard
```

不要再发明 `MY-SKILL.yaml` / `MY-PROMPT.json`。

## 但它们都没完全解决腐化

Claude / Codex / Agent Skills 主要解决的是：

```text
如何定义
如何发现
如何加载
如何复用
如何分发
```

也就是 **Skill Runtime**。

你真正头疼的是：

```text
Vibe Coding
 ↓
大量 Skill 自动产生
 ↓
重复 / 冲突 / 过时 / 低质量
 ↓
Skill 本身也腐化
```

这才是 Skill Lifecycle。现有的运行时方案帮你「找到并读到」Skill，不会替你判断「这份经验还该不该留」。

<div class="diagram">
<svg viewBox="0 0 600 220" role="img" aria-label="Skill Runtime 与 Skill Lifecycle 的分界">
  <text class="d-cap" x="0" y="14">图 3 · Runtime 有了，Lifecycle 还空着</text>

  <rect x="0" y="48" width="280" height="120" rx="8" class="d-box"/>
  <text x="140" y="78" text-anchor="middle" dominant-baseline="central">Skill Runtime</text>
  <text class="d-sub" x="140" y="108" text-anchor="middle" dominant-baseline="central">定义 · 发现 · 加载</text>
  <text class="d-sub" x="140" y="132" text-anchor="middle" dominant-baseline="central">复用 · 分发</text>

  <rect x="320" y="48" width="280" height="120" rx="8" fill="none" stroke="var(--signal)" stroke-width="1.4"/>
  <text x="460" y="78" text-anchor="middle" dominant-baseline="central">Skill Lifecycle</text>
  <text class="d-sub" x="460" y="108" text-anchor="middle" dominant-baseline="central">评估 · 合并 · 淘汰</text>
  <text class="d-sub" x="460" y="132" text-anchor="middle" dominant-baseline="central">还缺现成平台</text>

  <text class="d-sub" x="300" y="200" text-anchor="middle">左边解决调用；右边处理经验的进出</text>
</svg>
</div>

## 先分成三类

回到项目里。这是我现在最坚持的一步。混着放，后面全乱。

### A. 稳定型

项目长期都需要的工程能力：

```text
java-api/
database-migration/
redis-operation/
error-handling/
testing/
```

变少、复用多，值得留着。

### B. 项目知识型

某个项目特有的东西：

```text
shterm-alarm/
    alarm-rule/
    alarm-suppress/
    cluster-deployment/
    multi-site/
```

名字叫 Skill，其实更像：

> **项目领域知识 + 操作方法。**

### C. 临时型

Vibe Coding 最爱造这些：

```text
fix-xxx-bug
investigate-xxx
migration-xxx
temporary-debug
experiment-xxx
```

可能只用一次。这种东西直接进正式库，后面就得收拾烂摊子。

<div class="diagram">
<svg viewBox="0 0 600 220" role="img" aria-label="三类 Skill：稳定、项目知识、临时">
  <text class="d-cap" x="0" y="14">图 4 · 三类不同的东西</text>

  <rect x="0" y="48" width="180" height="110" rx="8" fill="var(--accent)"/>
  <text x="90" y="82" text-anchor="middle" dominant-baseline="central" class="d-on-accent">稳定型</text>
  <text class="d-sub" x="90" y="112" text-anchor="middle" dominant-baseline="central">长期能力</text>
  <text class="d-sub" x="90" y="134" text-anchor="middle" dominant-baseline="central">该进 Active</text>

  <rect x="210" y="48" width="180" height="110" rx="8" class="d-box"/>
  <text x="300" y="82" text-anchor="middle" dominant-baseline="central">项目知识型</text>
  <text class="d-sub" x="300" y="112" text-anchor="middle" dominant-baseline="central">领域 + 方法</text>
  <text class="d-sub" x="300" y="134" text-anchor="middle" dominant-baseline="central">按项目留下</text>

  <rect x="420" y="48" width="180" height="110" rx="8" class="d-box-lite"/>
  <text x="510" y="82" text-anchor="middle" dominant-baseline="central">临时型</text>
  <text class="d-sub" x="510" y="112" text-anchor="middle" dominant-baseline="central">可能只用一次</text>
  <text class="d-sub" x="510" y="134" text-anchor="middle" dominant-baseline="central">先别进正式库</text>

  <text class="d-sub" x="300" y="196" text-anchor="middle">混在一起放，目录会胀，路由会失灵</text>
</svg>
</div>

Anthropic 的 9 类是横切功能视角；我这三类是生命周期视角。可以叠着用：先问「该不该正式留下」，再问「它属于哪类工程能力」。

## Skill 要有生命周期

我比较认这个模型：

```text
Generated → Candidate → 使用 / 验证 / 观察
                              ↓
                    Promote ←──┴──→ Reject
                       ↓
                    Stable
                       ↓
                  Deprecated
                       ↓
                   Archived
```

最要紧的一句：

> **AI 生成 Skill ≠ Skill 正式进入项目。**

别让模型每次都直接往 `skills/` 根目录写。可以先分成：

```text
skills/
├── active/
├── candidate/
└── archive/
```

过程中摸到一个通用方法，先丢进 `candidate/`。用了几次、结果还稳，再 promote 到 `active/`。长期不用、被替代的，进 `archive/`。

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 420" role="img" aria-label="Skill 从临时生成到候选、验证、晋级或拒绝，再到稳定与归档">
  <text class="sd-cap" x="32" y="34">图 5 · Skill 生命周期</text>

  <rect x="32" y="90" width="150" height="58" rx="10" class="sd-node"/>
  <text class="sd-label" x="107" y="114" text-anchor="middle" dominant-baseline="central">Generated</text>
  <text class="sd-small" x="107" y="133" text-anchor="middle" dominant-baseline="central">临时产生</text>

  <rect x="230" y="90" width="150" height="58" rx="10" class="sd-node-agent"/>
  <text class="sd-label" x="305" y="114" text-anchor="middle" dominant-baseline="central">Candidate</text>
  <text class="sd-small" x="305" y="133" text-anchor="middle" dominant-baseline="central">观察区</text>

  <rect x="428" y="90" width="170" height="58" rx="10" class="sd-node"/>
  <text class="sd-label" x="513" y="114" text-anchor="middle" dominant-baseline="central">使用 / 验证</text>
  <text class="sd-small" x="513" y="133" text-anchor="middle" dominant-baseline="central">留下成败证据</text>

  <path class="sd-arrow" d="M182 119H222" marker-end="url(#sdArrow5)"/>
  <path class="sd-arrow" d="M380 119H420" marker-end="url(#sdArrow5)"/>

  <path class="sd-arrow" d="M513 148V200" marker-end="url(#sdArrow5)"/>

  <rect x="320" y="214" width="150" height="58" rx="10" class="sd-node-pass"/>
  <text class="sd-on-fill" x="395" y="243" text-anchor="middle" dominant-baseline="central">Promote</text>

  <rect x="556" y="214" width="150" height="58" rx="10" class="sd-node-risk"/>
  <text class="sd-on-fill" x="631" y="243" text-anchor="middle" dominant-baseline="central">Reject</text>

  <path class="sd-arrow" d="M470 243H548" marker-end="url(#sdArrow5)"/>
  <path class="sd-arrow" d="M395 272V318" marker-end="url(#sdArrow5)"/>

  <rect x="320" y="326" width="150" height="58" rx="10" class="sd-node"/>
  <text class="sd-label" x="395" y="350" text-anchor="middle" dominant-baseline="central">Stable</text>
  <text class="sd-small" x="395" y="369" text-anchor="middle" dominant-baseline="central">再往下可归档</text>

  <text class="sd-small" x="32" y="400">产生不等于入场；入场不等于有效；多次成功 + 证据，才晋级。</text>

  <defs>
    <marker id="sdArrow5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

成熟度不必复杂：

```text
draft → candidate → verified → stable → deprecated
```

元信息放在 Skill 自己里面就够：

```yaml
name: elasticsearch-timeout
version: 1.2.0
status: active
maturity: verified
usage_count: 17
last_used: 2026-09-14
owner: project
tags: [elasticsearch, timeout, troubleshooting]
```

Router 一看就明白：`stable` 优先于 `candidate`。

## 不要无限增长

软件工程早就有 dedupe。Skill 一样该做。

```text
redis-debug
redis-troubleshooting
redis-connection-debug
redis-connection-problem
```

拆开看，多半是同一件事：

```text
Redis Connection Troubleshooting
```

那就该：

```text
4 Skill → 1 Skill
```

定期做 **Skill Consolidation**：合并，而不是不断新增。我自己用的 evolving-skill 也是这句——重叠就合并，不重复建目录。

也不建议全部平铺。可以按职责分层：

```text
skills/
├── core/          # coding / testing / git / review
├── domain/        # alarm / cluster / deployment
├── technology/    # redis / mysql / elasticsearch
└── candidate/
```

然后：

```text
任务 → Workspace Router → 领域 → 技术 → Skill
```

逐层缩小。再叠上 progressive disclosure：先 metadata，再 Top-K 全文。

<div class="diagram">
<svg viewBox="0 0 600 260" role="img" aria-label="从任务逐层缩小到具体 Skill">
  <text class="d-cap" x="0" y="14">图 6 · 逐层缩小，而不是全量挑选</text>

  <rect x="200" y="40" width="200" height="32" rx="6" class="d-box"/>
  <text class="d-sub" x="300" y="56" text-anchor="middle" dominant-baseline="central">任务</text>

  <rect x="170" y="88" width="260" height="32" rx="6" class="d-box"/>
  <text class="d-sub" x="300" y="104" text-anchor="middle" dominant-baseline="central">Workspace Router</text>

  <rect x="140" y="136" width="320" height="32" rx="6" class="d-box"/>
  <text class="d-sub" x="300" y="152" text-anchor="middle" dominant-baseline="central">领域 / 技术</text>

  <rect x="110" y="184" width="380" height="36" rx="6" fill="var(--accent)"/>
  <text x="300" y="202" text-anchor="middle" dominant-baseline="central" class="d-on-accent">读少数几个 Skill</text>

  <path class="d-link" d="M300 72L300 88"/>
  <path class="d-link" d="M300 120L300 136"/>
  <path class="d-link" d="M300 168L300 184"/>

  <text class="d-sub" x="300" y="244" text-anchor="middle">匹配优先于堆上下文</text>
</svg>
</div>

## Skill 会冲突

这个坑我见过，也容易被忽略。

```text
Skill A：Redis 修改必须使用事务
Skill B：Redis 修改禁止事务
```

模型读到两份都「有道理」的规矩，会怎么做？猜。

所以最好有优先级和范围：

```yaml
priority: 80
scope:
  service: alarm
conflicts:
  - redis-old
```

或者更简单，按层级盖过去：

```text
Global → Project → Module → Task
```

**越具体，优先级越高。** Scope 只能帮忙缩小发现范围；冲突规则仍要由项目明说，不能指望 Agent 自己猜覆盖关系。

## Skill 应该是可验证知识

很多所谓 Skill 其实只是提示词：

```markdown
# Redis Skill

使用 Redis 时注意线程安全。
操作前先检查 key。
不要删除生产数据。
```

读完之后还是不知道具体怎么做。价值有限。

真正有用的 Skill，至少要能回答这些：

| 部分 | 作用 |
| --- | --- |
| when | 什么时候用 |
| context | 需要什么上下文 |
| procedure | 怎么做 |
| constraints | 限制是什么 |
| examples | 示例 |
| validation | 如何验证 |
| evidence | 为什么相信它 |

例如：

```yaml
name: db-migration

when:
  - 修改数据库表结构

constraints:
  - 禁止直接 DROP COLUMN
  - 必须兼容旧版本

procedure:
  - inspect current schema
  - create migration
  - run compatibility test

validation:
  - migration test
  - rollback test
  - old-client compatibility
```

再往前一步，直接做 Anthropic 那种 Verification Skill：不是「请认真检查」，而是跑真实流程、写程序化断言。这时候它才是 Agent 的工程知识。

## 先别上数据库

有人一上来就想搞 Skill DB。我觉得现在还早。

我更想继续走：

```text
AGENTS.md + workspace.yaml + docs/harness + skills
```

格式兼容开放标准，目录先轻一点：

```text
project/
├── AGENTS.md
├── workspace.yaml
├── docs/harness/
└── skills/
    ├── active/
    ├── candidate/
    └── archive/
```

`workspace.yaml` 只负责指路：

```yaml
skills:
  root: ./skills
  active: ./skills/active
  candidate: ./skills/candidate
  archive: ./skills/archive
```

真正的元信息放在 Skill 自己里面。再往前，可以有一个 **Skill Registry**。不一定是库，一个 `skills/index.yaml` 就够：

```yaml
skills:
  - name: api-design
    path: core/api-design
    status: stable
    priority: 90

  - name: alarm-debug
    path: domain/alarm-debug
    status: verified
    priority: 80

  - name: es-timeout
    path: candidate/es-timeout
    status: candidate
    priority: 30
```

Agent 每次先看 Registry，再读少数几个 Skill。

## Project Harness 该长成什么样

如果现在做，我会借 Runtime，再补 Lifecycle。要紧的是 Evidence 要回写到 Registry：不然「评估」只是一次聊天里的感想，下一次任务完全接不上。

```text
              Project Harness
                    │
        ┌───────────┴───────────┐
        ↓                       ↓
   Skill Registry          Project Context
        │
        ├── active
        ├── candidate
        ├── deprecated
        └── archived
        │
        ↓
    Skill Router
        ↓
 Progressive Disclosure
        ↓
    Selected Skills
        ↓
      Agent
        ↓
   Verification
        ↓
      Evidence
        ↓
   Skill Evaluator
        │
    ┌───┴────┐
    ↓        ↓
 Promote   Reject
```

这就比单纯一个 `skills/` 目录高一层。

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 500" role="img" aria-label="Project Harness 中 Registry、Router、验证与评估晋级">
  <text class="sd-cap" x="32" y="34">图 7 · 借 Runtime，补 Lifecycle</text>

  <rect x="360" y="60" width="240" height="50" rx="10" class="sd-node"/>
  <text class="sd-label" x="480" y="85" text-anchor="middle" dominant-baseline="central">Project Harness</text>

  <path class="sd-arrow" d="M480 110V140" marker-end="url(#sdArrow7)"/>

  <rect x="200" y="148" width="180" height="50" rx="10" class="sd-node-agent"/>
  <text class="sd-label" x="290" y="173" text-anchor="middle" dominant-baseline="central">Skill Registry</text>

  <rect x="580" y="148" width="180" height="50" rx="10" class="sd-node"/>
  <text class="sd-label" x="670" y="173" text-anchor="middle" dominant-baseline="central">Project Context</text>

  <path class="sd-arrow" d="M420 173H572" marker-end="url(#sdArrow7)"/>
  <path class="sd-arrow" d="M290 198V230" marker-end="url(#sdArrow7)"/>

  <rect x="200" y="238" width="180" height="50" rx="10" class="sd-node"/>
  <text class="sd-label" x="290" y="263" text-anchor="middle" dominant-baseline="central">Router + PD</text>

  <path class="sd-arrow" d="M290 288V318" marker-end="url(#sdArrow7)"/>

  <rect x="200" y="326" width="180" height="50" rx="10" class="sd-node-agent"/>
  <text class="sd-label" x="290" y="351" text-anchor="middle" dominant-baseline="central">Agent 执行</text>

  <path class="sd-arrow" d="M380 351H500" marker-end="url(#sdArrow7)"/>

  <rect x="508" y="326" width="180" height="50" rx="10" class="sd-node"/>
  <text class="sd-label" x="598" y="351" text-anchor="middle" dominant-baseline="central">Verification</text>

  <path class="sd-arrow" d="M598 376V406" marker-end="url(#sdArrow7)"/>

  <rect x="420" y="414" width="160" height="50" rx="10" class="sd-node-pass"/>
  <text class="sd-on-fill" x="500" y="439" text-anchor="middle" dominant-baseline="central">Promote</text>

  <rect x="620" y="414" width="160" height="50" rx="10" class="sd-node-risk"/>
  <text class="sd-on-fill" x="700" y="439" text-anchor="middle" dominant-baseline="central">Reject</text>

  <path class="sd-arrow" d="M500 414V396H290V288" marker-end="url(#sdArrow7)"/>
  <path class="sd-arrow" d="M598 376V439H612" marker-end="url(#sdArrow7)"/>

  <defs>
    <marker id="sdArrow7" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

下一步不急着再堆几十个 Skill。先把这套想清楚：

> **Skill Registry + Candidate → Verified → Stable + 自动去重/合并 + 使用数据**

这会比单纯增加 `skills/` 更有价值。它也可能是 `project-to-harness-skill` 真正有意思的升级方向。

## 收住

真正需要的不是更多 Skill，而是一套进出规则：

```text
Vibe Coding
  → 完成任务
  → 发现新经验
  → 生成 Candidate
  → 实际使用并记录成败
  → 评估
  → Promote / Reject
  → Stable
  → 定期 Consolidation
  → 删除 / 合并 / 更新
```

这已经不是简单的 Skill Management。

更准确地说，是 **Skill Lifecycle Management**。再往前，就是 **Evolving Skill System**：重点不是给 Agent 准备很多 Skill，而是让项目在持续 Vibe Coding 时，经验能留下、被验证、被升级、被合并、被淘汰。

## 一条能落地的原则

> **AI 可以无限产生 Skill，但正式 Skill 必须有限、可检索、可验证、有生命周期。**

再压成几句项目规矩：

```text
产生 ≠ 进入 Active
使用 ≠ 有效
多次成功 + 有验证证据 = Promote
长期不用 / 被替代 = Archive
重复 / 冲突 = Consolidate
```

上一篇里的 Project Harness，管的是 Agent 的上下文和边界。这篇再往前一步：管的是 Agent 在项目里不断攒下来的工程经验。可复用经验应该提示后再保存，不能让 Agent 静默地往正式库里塞东西。

前者让它这次别改散。后者让它几个月后还知道该信哪一份经验。

Runtime 已经有很好的参考。Lifecycle 还得自己动手。
