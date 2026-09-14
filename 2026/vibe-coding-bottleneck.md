---
layout: default
title: Vibe Coding 卡住的不是写，是验
---

问题已经不是 AI 会不会写代码。它写得太快，快过了人理解、审核和维护的速度。存量项目里，这件事比新项目严重得多。

## 为什么存量项目特别容易失控

新项目还好扛。空白仓库，上下文相对干净，写错了重来成本低。

存量项目通常叠成这样：

<ol class="flow flow-col">
  <li>历史代码</li>
  <li>业务规则</li>
  <li>没写下来的约定</li>
  <li>各种兼容</li>
  <li>没人敢删的代码</li>
  <li>线上修过的 Bug</li>
  <li>临时补丁</li>
  <li>继续迭代</li>
</ol>

模型看见的往往只是当前代码加当前需求。真正决定能不能改的，要厚得多：

<div class="flow-compare">
  <section>
    <h4>模型看见的</h4>
    <ol class="flow flow-col">
      <li>当前代码</li>
      <li>当前需求</li>
    </ol>
  </section>
  <section>
    <h4>真正决定能不能改</h4>
    <ol class="flow flow-col">
      <li>当前代码</li>
      <li>历史原因</li>
      <li>业务约束</li>
      <li>系统边界</li>
      <li>隐式契约</li>
      <li>线上经验</li>
    </ol>
  </section>
</div>

所以最危险的不是一个明显写错的 `if`。是一段看起来很合理的代码，把原来谁也没记录的规矩弄断了。

## 谁来审 AI

传统大致是人写、工具查、人再看一眼：

<ol class="flow flow-row">
  <li>人写代码</li>
  <li>工具检查</li>
  <li>人 Review</li>
  <li>上线</li>
</ol>

Vibe Coding 之后很容易滑成自己写、自己审、自己修：

<ol class="flow flow-row">
  <li>AI 写</li>
  <li>AI Review</li>
  <li>AI 测</li>
  <li>AI 修</li>
  <li>AI 再 Review</li>
  <li>上线</li>
</ol>

看起来很完整。但有个硬伤：写的和审的如果吃的是同一份上下文，它们会共享同一种误会。

比如：

```java
if (user == null) {
    return;
}
```

写的那个说：空指针已经处理，没问题。审的那个说：确实处理了 null，代码安全。产品真正要的可能是：`user == null` 应该抛异常，而不是静默返回。

于是写错、审核通过、整条链路都绿。这不是模型笨，是自己证明自己。认知闭环。

## 加人盯代码，规模化不了

有人说：那人认真 Review 不就行了。

这个方案看起来负责，规模化能力其实很差。十分钟生成一千行，人可能要一小时才读明白。瓶颈重新回到人。到十万行、百万行、千万行，逐行看是幻觉。

该改的不是「审得更勤」，而是：从「审核 AI 写出的代码」，变成「限制 AI 可以写出什么代码」。人去定意图和边界。机器去拒绝越界的改动。

## 比较靠谱的五层

可以把它想成：

<ol class="flow flow-col">
  <li>人：定义意图 / 边界</li>
  <li>AI Coding</li>
  <li>自动化约束层<span>Test / Static / Policy</span></li>
  <li>独立验证 Agent</li>
  <li>Sandbox / CI</li>
  <li>Merge</li>
  <li>Production</li>
</ol>

核心就一句：不要让 AI 自己证明自己正确。

### 第一层：先给它项目认知

存量项目不能每次都让模型读代码、猜架构、猜规范、再动手。要把项目知识摊开。

```text
AGENTS.md

docs/
├── architecture/
├── business/
├── conventions/
├── database/
├── deployment/
└── risks/

skills/
├── add-api/
├── modify-db/
├── modify-cache/
├── add-component/
└── bug-fix/
```

让它先知道：这是什么系统、哪些地方不能动、哪些是核心路径、哪些接口要兼容、数据库怎么变更、缓存怎么用、异常和日志怎么写、测试过什么算过。

这样才不是对着代码自由发挥，而是在一块带围栏的场地里编程。`AGENTS.md`、文档、按任务拆开的 skill，本质上就是这块场地。

### 第二层：质量从建议变成门禁

<ol class="flow flow-row">
  <li>改代码</li>
  <li>编译</li>
  <li>单测</li>
  <li>集成</li>
  <li>静态分析</li>
  <li>架构规则</li>
  <li>安全扫描</li>
  <li>Diff 风险</li>
</ol>

<div class="flow-split">
  <div class="ok">通过 → Merge</div>
  <div class="bad">失败 → 打回去修</div>
</div>

最关键的是：机器必须能说不。

违反规则、测试失败、架构违规，不允许合。高风险修改才拉人进来。AI Review 如果只是「建议」，在合入压力面前等于没有。

### 第三层：别让几个 Agent 重复评价「写得好不好」

不要再挂一个 Reviewer，用差不多的眼光看同一段代码。拆开，让它们回答不同的具体问题：

<div class="flow-fan">
  <div class="flow-node">Coder</div>
  <div class="flow-fan-arms">
    <div class="flow-node">Test</div>
    <div class="flow-node">Security</div>
    <div class="flow-node">Architecture</div>
    <div class="flow-node">DB</div>
  </div>
  <div class="flow-node">Evidence</div>
  <div class="flow-node">Decision</div>
</div>

- Test：需求有没有被测试证明？
- Security：有没有引入安全风险？
- Architecture：有没有违反项目自己的架构规则？
- DB：数据库变更有没有兼容问题？

问题越具体，越不容易一起瞎。

### 第四层：必须引入外部事实

AI Review 最大的问题是：它很容易用代码解释代码。很多错只有跑起来才知道。所以要有：

<ol class="flow flow-row">
  <li>Code</li>
  <li>Run</li>
  <li>Observe</li>
  <li>Evidence</li>
</ol>

改计价，不要只盯着 `calculatePrice()`。拿一千个历史订单回放，新旧结果对着看。这时不再是「模型觉得对」，而是「这批数据上结果对得上」。

### 第五层：存量项目里，顺序该倒过来

不是需求来了就直接写。

<ol class="flow flow-col">
  <li>需求</li>
  <li>分析影响范围</li>
  <li>生成修改计划</li>
  <li>生成验证方案</li>
  <li>先写测试</li>
  <li>再改代码</li>
  <li>执行验证</li>
  <li>对比结果</li>
  <li>提交变更</li>
</ol>

也就是 **Plan → Test → Code → Verify**，不是 **Code → Review**。

人的角色会往上走：定目标、定约束、定架构和风险边界。模型在边界里实现，并且拿出证据。证据过不了，就不能当它做对了。

未来更成熟的 Coding Agent，也不该只是「帮我写代码」。它该带着项目上下文出变更计划，再编码，再验证，再过策略引擎，高风险才进人工门。人不再负责写每一行，也不再负责读每一行。

## 收住

Vibe Coding 真正稀缺的不是生成，是验证。生成成本掉下去了，理解和验证的成本没有一起掉，存量系统就会迅速堆债。

破局不是加人盯 diff，而是工程约束、自动验证、彼此独立的检查，再加上高风险才进人工。让模型改代码必须提供可验证的证据，而不是让人去相信它。

路径大概是：

<ol class="flow flow-row">
  <li>Vibe Coding</li>
  <li>AI Coding</li>
  <li>AI + Harness</li>
  <li>自动验证</li>
  <li>AI Software Engineering</li>
</ol>

真正有竞争力的，不会是谁的模型写得最快。会逐渐变成：谁能让模型在几十万、几百万行的老系统里持续改，还不失控。这才是接下来 AI Coding 最大的工程机会。
