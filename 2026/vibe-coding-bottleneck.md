---
layout: default
title: 在存量项目中 Vibe Coding，如何更好让 Agent 写出优质代码
---

AI 会不会写代码，这题可以收了。它写得很快。快到我读完 diff 之前，下一轮已经又改完了。

新仓库还好说。目录干净，约定都在眼前，写砸了重来也不可惜。老项目不是这样。代码下面压着当年为什么这么写、哪段接口不能动、谁随手打的补丁、线上炸过一次所以谁都不敢删的分支。模型看见的通常只有「当前文件 + 当前需求」。能不能动，取决于那些没人写进注释的东西。

我怕的不是一个明显写错的 `if`。是那段读着挺顺的改动，把一条没人记下来的规矩弄断了。过两个月才在生产上冒出来，那时已经说不清是谁改的。

<ol class="flow flow-col">
  <li>历史代码</li>
  <li>业务规则</li>
  <li>没写下来的约定</li>
  <li>各种兼容</li>
  <li>没人敢删的代码</li>
  <li>线上修过的 Bug</li>
  <li>临时补丁</li>
  <li>继续往下做</li>
</ol>

模型这边：

<div class="flow-compare">
  <section>
    <h4>它看见的</h4>
    <ol class="flow flow-col">
      <li>当前代码</li>
      <li>当前需求</li>
    </ol>
  </section>
  <section>
    <h4>真正卡改动的</h4>
    <ol class="flow flow-col">
      <li>当前代码</li>
      <li>历史原因</li>
      <li>业务约束</li>
      <li>系统边界</li>
      <li>没写明的契约</li>
      <li>线上挨过的打</li>
    </ol>
  </section>
</div>

## 审的和写的是同一张嘴

以前好歹是人写、工具扫一眼、人再看。现在很容易变成：它写，它审，它测，它修，再审一遍，合进去。

<ol class="flow flow-row">
  <li>人写代码</li>
  <li>工具检查</li>
  <li>人 Review</li>
  <li>上线</li>
</ol>

变成：

<ol class="flow flow-row">
  <li>AI 写</li>
  <li>AI Review</li>
  <li>AI 测</li>
  <li>AI 修</li>
  <li>AI 再 Review</li>
  <li>上线</li>
</ol>

流程看着齐全。写的和审的如果吃同一份上下文，误会也会共享。

```java
if (user == null) {
    return;
}
```

写的说空指针处理好了。审的说对，确实判了 null。产品要的可能是抛异常，不是悄悄 return。两边都点头，检查全绿，线上用户没了。

这不是模型笨。是自己给自己盖章。

## 别指望人把 diff 读完

「人认真 Review 不就行了。」说着轻松。十分钟吐出来的东西，我可能要一小时才读明白。代码一多，逐行看就是安慰自己。十万行、百万行更别提。

与其事后盯每一行，不如先划它能写什么。意图和边界人来定。越界的改动机器直接挡回去。

## 我现在比较信的做法

<ol class="flow flow-col">
  <li>人把意图和边界说清楚</li>
  <li>AI 写</li>
  <li>自动化约束<span>测试、静态检查、策略</span></li>
  <li>分开的验证 Agent</li>
  <li>Sandbox / CI</li>
  <li>Merge</li>
  <li>Production</li>
</ol>

别让它自己证明自己对。

### 先把项目讲明白

别每次都让模型对着仓库猜。这个系统是干什么的、哪段动不得、哪些接口要兼容、库怎么改、异常怎么抛、日志怎么打、怎样才算测过，摊开写下来。

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

有 `AGENTS.md`、有分得开的文档、有按任务拆的 skill，场地就有围栏。不是空地里自由发挥。

### 质量得能说不

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
  <div class="ok">过了才能合</div>
  <div class="bad">不过就打回去</div>
</div>

测试挂了、规则破了、架构踩线了，不许合。真高风险再叫人来看。那种「建议你注意一下」的 AI Review，赶工的时候等于没有。

### 别让几个 Agent 重复说「写得不错」

再挂一个 Reviewer，用差不多的眼光看同一段代码，没多大用。拆开问：

<div class="flow-fan">
  <div class="flow-node">Coder</div>
  <div class="flow-fan-arms">
    <div class="flow-node">Test</div>
    <div class="flow-node">Security</div>
    <div class="flow-node">Architecture</div>
    <div class="flow-node">DB</div>
  </div>
  <div class="flow-node">证据</div>
  <div class="flow-node">决定</div>
</div>

测试只问需求有没有被测到。安全只问有没有新洞。架构只问有没有踩自己的规矩。库表只问变更能不能兼容。问得越死，越不容易一起瞎。

### 跑起来才算数

用代码解释代码，很多错发现不了。改计价别只盯着 `calculatePrice()`。拿一批历史订单回放，新旧结果对着看。我想要的不是「它觉得对」，是这批数据对得上。

<ol class="flow flow-row">
  <li>Code</li>
  <li>Run</li>
  <li>Observe</li>
  <li>Evidence</li>
</ol>

### 老项目里，顺序倒过来

需求来了先别写。看影响面，出计划和怎么验，测试先落下，再改代码，跑一遍，对结果，最后才提交。

<ol class="flow flow-col">
  <li>需求</li>
  <li>分析影响范围</li>
  <li>修改计划</li>
  <li>验证方案</li>
  <li>先写测试</li>
  <li>再改代码</li>
  <li>跑验证</li>
  <li>对比结果</li>
  <li>提交</li>
</ol>

Plan → Test → Code → Verify。不是先堆一版再请人（或另一个模型）看一眼。

人往上走：目标、约束、架构、风险。模型在框子里实现，还得拿出证据。证据过不了，就当它没做对。

## 收住

生成已经便宜了。读懂和验过，没有一起变便宜。老系统会很快堆出一堆说不清的债。

我不指望加人盯 diff。约束、自动验证、彼此不问同一句话的检查，再加上真危险才叫人。改代码就得给得出能核对的东西，别让我凭感觉信它。

<ol class="flow flow-row">
  <li>Vibe Coding</li>
  <li>AI Coding</li>
  <li>AI + Harness</li>
  <li>自动验证</li>
  <li>AI Software Engineering</li>
</ol>

谁写得快以后没那么值钱。谁能在几十万、几百万行的老代码里持续改、还不把系统改散，才算把这件事做成了工程。
