---
layout: default
title: 在存量项目中 Vibe Coding，如何更好让 Agent 写出优质代码
---

AI 会不会写代码，这题可以收了。它写得很快。快到我读完 diff 之前，下一轮已经又改完了。

新仓库还好说。目录干净，约定都在眼前，写砸了重来也不可惜。老项目不是这样。代码下面压着当年为什么这么写、哪段接口不能动、谁随手打的补丁、线上炸过一次所以谁都不敢删的分支。模型看见的通常只有「当前文件 + 当前需求」。能不能动，取决于那些没人写进注释的东西。

我怕的不是一个明显写错的 `if`。是那段读着挺顺的改动，把一条没人记下来的规矩弄断了。过两个月才在生产上冒出来，那时已经说不清是谁改的。

<div class="diagram">
<svg viewBox="0 0 600 340" role="img" aria-label="存量项目里层层叠加的隐性约束">
  <text class="d-cap" x="0" y="14">图 1 · 老项目的显性代码之下</text>

  <g fill="none" stroke-width="1">
    <rect x="60" y="44" width="480" height="23" rx="5" stroke="var(--line)"/>
    <rect x="60" y="67" width="480" height="23" rx="5" stroke="var(--line)"/>
    <rect x="60" y="90" width="480" height="23" rx="5" stroke="var(--line)"/>
    <rect x="60" y="113" width="480" height="23" rx="5" stroke="var(--line)"/>
    <rect x="60" y="136" width="480" height="23" rx="5" stroke="var(--line)"/>
    <rect x="60" y="159" width="480" height="23" rx="5" stroke="var(--line)"/>
    <rect x="60" y="182" width="480" height="23" rx="5" stroke="var(--line)"/>
  </g>

  <text class="d-sub" x="72" y="56" dominant-baseline="central">业务规则</text>
  <text class="d-sub" x="72" y="79" dominant-baseline="central">没写下来的约定</text>
  <text class="d-sub" x="72" y="102" dominant-baseline="central">各种兼容</text>
  <text class="d-sub" x="72" y="125" dominant-baseline="central">没人敢删的代码</text>
  <text class="d-sub" x="72" y="148" dominant-baseline="central">线上修过的 Bug</text>
  <text class="d-sub" x="72" y="171" dominant-baseline="central">临时补丁</text>
  <text class="d-sub" x="72" y="194" dominant-baseline="central">历史代码</text>

  <text class="d-sub" x="528" y="56" text-anchor="end" dominant-baseline="central">写在文档里</text>
  <text class="d-sub" x="528" y="79" text-anchor="end" dominant-baseline="central">靠口口相传</text>
  <text class="d-sub" x="528" y="102" text-anchor="end" dominant-baseline="central">读代码看不出来</text>
  <text class="d-sub" x="528" y="125" text-anchor="end" dominant-baseline="central">删除风险未知</text>
  <text class="d-sub" x="528" y="148" text-anchor="end" dominant-baseline="central">没有回归覆盖</text>
  <text class="d-sub" x="528" y="171" text-anchor="end" dominant-baseline="central">没说什么时候能拆</text>
  <text class="d-sub" x="528" y="194" text-anchor="end" dominant-baseline="central">看得见，能搜到</text>

  <line class="d-dash" x1="40" y1="44" x2="40" y2="205"/>
  <text class="d-sub" x="30" y="124" text-anchor="middle" transform="rotate(-90 30 124)" dominant-baseline="central">越往下越难还原</text>

  <rect x="60" y="220" width="480" height="30" rx="6" fill="var(--accent)"/>
  <text x="300" y="236" text-anchor="middle" dominant-baseline="central" class="d-on-accent">继续往下做</text>

  <path class="d-link d-link-accent" d="M490 205L490 220" marker-end="url(#dArrow)"/>
  <path class="d-trace" d="M470 205L470 220" marker-end="url(#dArrow)"/>

  <text class="d-sub" x="300" y="272" text-anchor="middle">模型默认只踩在最上面一层</text>
  <text class="d-sub" x="300" y="296" text-anchor="middle">改动能不能动，取决于下面几层没人写下来的东西</text>

  <defs>
    <marker id="dArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--signal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

模型这边：

<div class="diagram">
<svg viewBox="0 0 600 400" role="img" aria-label="模型看见的上下文与真正决定改动的因素对比">
  <text class="d-cap" x="0" y="14">图 2 · 上下文缺口</text>

  <text class="d-num" x="0" y="42" dominant-baseline="central">A · 它看见的</text>

  <rect x="0" y="56" width="180" height="42" rx="8" class="d-box"/>
  <text x="90" y="71" text-anchor="middle" dominant-baseline="central">当前代码</text>
  <text class="d-sub" x="90" y="87" text-anchor="middle" dominant-baseline="central">正在改的这个文件</text>

  <rect x="0" y="108" width="180" height="42" rx="8" class="d-box"/>
  <text x="90" y="123" text-anchor="middle" dominant-baseline="central">当前需求</text>
  <text class="d-sub" x="90" y="139" text-anchor="middle" dominant-baseline="central">这次要做什么</text>

  <path class="d-dash" d="M0 168L600 168"/>

  <text class="d-num" x="0" y="190" dominant-baseline="central">B · 真正卡改动的</text>

  <rect x="0" y="206" width="180" height="46" rx="8" fill="none" stroke="var(--signal)" stroke-width="1.4"/>
  <text x="90" y="222" text-anchor="middle" dominant-baseline="central">当前代码</text>
  <text class="d-sub" x="90" y="239" text-anchor="middle" dominant-baseline="central">同样在里面</text>

  <rect x="210" y="206" width="180" height="46" rx="8" class="d-box-lite"/>
  <text class="d-sub" x="300" y="229" text-anchor="middle" dominant-baseline="central">历史原因</text>

  <rect x="410" y="206" width="180" height="46" rx="8" class="d-box-lite"/>
  <text class="d-sub" x="500" y="229" text-anchor="middle" dominant-baseline="central">业务约束</text>

  <rect x="210" y="262" width="180" height="46" rx="8" class="d-box-lite"/>
  <text class="d-sub" x="300" y="285" text-anchor="middle" dominant-baseline="central">系统边界</text>

  <rect x="410" y="262" width="180" height="46" rx="8" class="d-box-lite"/>
  <text class="d-sub" x="500" y="285" text-anchor="middle" dominant-baseline="central">没写明的契约</text>

  <rect x="210" y="318" width="180" height="46" rx="8" class="d-box-lite"/>
  <text class="d-sub" x="300" y="341" text-anchor="middle" dominant-baseline="central">线上挨过的打</text>

  <g>
    <rect x="404" y="318" width="192" height="46" rx="8" fill="var(--accent)"/>
    <text x="500" y="335" text-anchor="middle" dominant-baseline="central" class="d-on-accent">模型看不到</text>
    <text class="d-sub" x="500" y="352" text-anchor="middle" dominant-baseline="central">却被这些卡着</text>
  </g>

  <text class="d-sub" x="0" y="384" dominant-baseline="central">A 只有两块，B 有六块；差的那四块，决定了改动能不能动</text>
</svg>
</div>

## 审的和写的是同一张嘴

以前好歹是人写、工具扫一眼、人再看。现在很容易变成：它写，它审，它测，它修，再审一遍，合进去。

<div class="diagram">
<svg viewBox="0 0 600 320" role="img" aria-label="从人机分工到自写自审的对比">
  <text class="d-cap" x="0" y="14">图 3 · 谁在把关</text>

  <text class="d-num" x="0" y="42" dominant-baseline="central">以前 · 三个角色互相牵制</text>

  <g>
    <rect x="0" y="58" width="132" height="40" rx="8" class="d-box"/>
    <text x="66" y="78" text-anchor="middle" dominant-baseline="central">人写代码</text>

    <rect x="166" y="58" width="132" height="40" rx="8" class="d-box"/>
    <text x="232" y="78" text-anchor="middle" dominant-baseline="central">工具检查</text>

    <rect x="332" y="58" width="132" height="40" rx="8" class="d-box"/>
    <text x="398" y="78" text-anchor="middle" dominant-baseline="central">人 Review</text>

    <rect x="498" y="58" width="102" height="40" rx="8" fill="var(--accent)"/>
    <text x="549" y="78" text-anchor="middle" dominant-baseline="central" class="d-on-accent">上线</text>
  </g>

  <path class="d-link" d="M132 78L160 78" marker-end="url(#dArrow2)"/>
  <path class="d-link" d="M298 78L326 78" marker-end="url(#dArrow2)"/>
  <path class="d-link" d="M464 78L492 78" marker-end="url(#dArrow2)"/>

  <text class="d-sub" x="232" y="118" text-anchor="middle">写的人、扫的工具、看的人，是三个立场</text>

  <path class="d-dash" d="M0 144L600 144"/>

  <text class="d-num" x="0" y="166" dominant-baseline="central">现在 · 同一张嘴，自己给自己盖章</text>

  <rect x="8" y="196" width="188" height="76" rx="10" fill="none" stroke="var(--signal)" stroke-width="1.2" stroke-dasharray="3 5"/>

  <text x="60" y="216" text-anchor="middle" dominant-baseline="central">AI 写</text>
  <text x="60" y="250" text-anchor="middle" dominant-baseline="central">AI 审</text>

  <path class="d-flow" d="M126 212a22 22 0 0 1 0 42" fill="none"/>

  <text class="d-sub" x="102" y="286" text-anchor="middle" dominant-baseline="central">写、审、测、修用同一份上下文</text>

  <path class="d-link" d="M208 234L296 234" marker-end="url(#dArrow2)"/>
  <text class="d-sub" x="252" y="222" text-anchor="middle" dominant-baseline="central">全绿</text>

  <rect x="304" y="210" width="140" height="48" rx="8" fill="var(--accent)"/>
  <text x="374" y="228" text-anchor="middle" dominant-baseline="central" class="d-on-accent">上线</text>
  <text class="d-sub" x="374" y="246" text-anchor="middle" dominant-baseline="central">没人独立点头</text>

  <path class="d-trace" d="M452 234L500 234" marker-end="url(#dArrow2)"/>
  <text class="d-sub" x="470" y="220" text-anchor="middle" dominant-baseline="central">到线上</text>

  <text class="d-sub" x="0" y="308" dominant-baseline="central">立场没有分开，检查再全，也是自己同意自己</text>

  <defs>
    <marker id="dArrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

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

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 540" role="img" aria-label="人定意图和边界后，依次经过 AI 写、自动化约束、分开的验证 Agent、Sandbox 或 CI、Merge，最后进入 Production">
  <text class="sd-cap" x="32" y="34">图 4 · 验证必须站在写的对面</text>

  <g>
    <rect x="32" y="82" width="176" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="120" y="106" text-anchor="middle" dominant-baseline="central">人定意图和边界</text>
    <text class="sd-small" x="120" y="125" text-anchor="middle" dominant-baseline="central">目标 · 约束 · 风险</text>

    <rect x="248" y="82" width="124" height="58" rx="10" class="sd-node-agent"/>
    <text class="sd-label" x="310" y="111" text-anchor="middle" dominant-baseline="central">AI 写</text>

    <rect x="412" y="82" width="170" height="58" rx="10" class="sd-node-agent"/>
    <text class="sd-label" x="497" y="106" text-anchor="middle" dominant-baseline="central">自动化约束</text>
    <text class="sd-small" x="497" y="125" text-anchor="middle" dominant-baseline="central">测试 · 静态检查 · 策略</text>

    <rect x="622" y="82" width="190" height="58" rx="10" class="sd-node-agent"/>
    <text class="sd-label" x="717" y="106" text-anchor="middle" dominant-baseline="central">分开的验证 Agent</text>
    <text class="sd-small" x="717" y="125" text-anchor="middle" dominant-baseline="central">测试 / 安全 / 架构 / 库表</text>
  </g>

  <path class="sd-arrow" d="M208 111H240" marker-end="url(#sdArrow4)"/>
  <path class="sd-arrow" d="M372 111H404" marker-end="url(#sdArrow4)"/>
  <path class="sd-arrow" d="M582 111H614" marker-end="url(#sdArrow4)"/>
  <path class="sd-arrow" d="M717 140V220" marker-end="url(#sdArrow4)"/>

  <rect x="622" y="228" width="190" height="58" rx="10" class="sd-node"/>
  <text class="sd-label" x="717" y="252" text-anchor="middle" dominant-baseline="central">Sandbox / CI</text>
  <text class="sd-small" x="717" y="271" text-anchor="middle" dominant-baseline="central">隔离运行 · 收集证据</text>

  <path class="sd-arrow" d="M717 286V350H497V382" marker-end="url(#sdArrow4)"/>

  <rect x="412" y="390" width="170" height="58" rx="10" class="sd-node"/>
  <text class="sd-label" x="497" y="419" text-anchor="middle" dominant-baseline="central">Merge</text>

  <path class="sd-arrow" d="M412 419H310" marker-end="url(#sdArrow4)"/>

  <rect x="180" y="390" width="180" height="58" rx="10" class="sd-node-pass"/>
  <text class="sd-on-fill" x="270" y="419" text-anchor="middle" dominant-baseline="central">Production</text>

  <text class="sd-small" x="32" y="490">写的一方负责实现，验证的一方负责让它拿证据。</text>

  <line class="sd-divider" x1="32" y1="510" x2="928" y2="510"/>
  <line class="sd-legend-line sd-legend-flow" x1="42" y1="526" x2="72" y2="526"/>
  <text class="sd-legend-label" x="82" y="526" dominant-baseline="central">橙色箭头：主流程</text>
  <line class="sd-legend-line sd-legend-agent" x1="230" y1="526" x2="260" y2="526"/>
  <text class="sd-legend-label" x="270" y="526" dominant-baseline="central">青蓝节点：Agent / 工具</text>
  <rect x="476" y="519" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="500" y="526" dominant-baseline="central">实心节点：可继续推进</text>

  <defs>
    <marker id="sdArrow4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

别让它自己证明自己对。

### 先把项目讲明白

别每次都让模型对着仓库猜。这个系统是干什么的、哪段动不得、哪些接口要兼容、库怎么改、异常怎么抛、日志怎么打、怎样才算测过，摊开写下来。

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 540" role="img" aria-label="AGENTS.md 作为总入口，把项目约束分到 docs 文档和按任务拆分的 skills，供 Agent 在边界内执行">
  <text class="sd-cap" x="32" y="34">图 4A · 先把项目讲明白</text>

  <rect x="32" y="200" width="190" height="74" rx="12" class="sd-node"/>
  <text class="sd-label" x="127" y="229" text-anchor="middle" dominant-baseline="central">AGENTS.md</text>
  <text class="sd-small" x="127" y="251" text-anchor="middle" dominant-baseline="central">项目总入口 · 先讲规矩</text>

  <path class="sd-arrow" d="M222 237H286V145H342" marker-end="url(#sdArrow4a)"/>
  <path class="sd-arrow" d="M222 237H286V329H342" marker-end="url(#sdArrow4a)"/>

  <rect x="350" y="72" width="270" height="148" rx="12" class="sd-node"/>
  <text class="sd-label" x="485" y="98" text-anchor="middle" dominant-baseline="central">docs/</text>
  <text class="sd-small" x="380" y="126">architecture/</text>
  <text class="sd-small" x="380" y="146">business/</text>
  <text class="sd-small" x="380" y="166">conventions/</text>
  <text class="sd-small" x="510" y="126">database/</text>
  <text class="sd-small" x="510" y="146">deployment/</text>
  <text class="sd-small" x="510" y="166">risks/</text>
  <text class="sd-small" x="485" y="199" text-anchor="middle">系统背景、约束和风险</text>

  <rect x="350" y="256" width="270" height="148" rx="12" class="sd-node-agent"/>
  <text class="sd-label" x="485" y="282" text-anchor="middle" dominant-baseline="central">skills/</text>
  <text class="sd-small" x="380" y="310">add-api/</text>
  <text class="sd-small" x="380" y="330">modify-db/</text>
  <text class="sd-small" x="380" y="350">modify-cache/</text>
  <text class="sd-small" x="510" y="310">add-component/</text>
  <text class="sd-small" x="510" y="330">bug-fix/</text>
  <text class="sd-small" x="485" y="383" text-anchor="middle">按任务拆开的执行边界</text>

  <path class="sd-arrow" d="M620 146H704V237H760" marker-end="url(#sdArrow4a)"/>
  <path class="sd-arrow sd-arrow-agent" d="M620 330H704V237H760" marker-end="url(#sdArrow4a)"/>

  <rect x="768" y="200" width="160" height="74" rx="12" class="sd-node-pass"/>
  <text class="sd-on-fill" x="848" y="229" text-anchor="middle" dominant-baseline="central">Agent 执行</text>
  <text class="sd-on-fill" x="848" y="251" text-anchor="middle" dominant-baseline="central" font-size="11">不在空地里自由发挥</text>

  <text class="sd-small" x="32" y="454">文档说清楚为什么不能动，skill 说清楚这次怎么动。</text>

  <line class="sd-divider" x1="32" y1="480" x2="928" y2="480"/>
  <line class="sd-legend-line sd-legend-flow" x1="42" y1="502" x2="72" y2="502"/>
  <text class="sd-legend-label" x="82" y="502" dominant-baseline="central">橙色箭头：约束汇入执行</text>
  <rect x="330" y="495" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="354" y="502" dominant-baseline="central">青蓝节点：任务 skill</text>
  <rect x="540" y="495" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="564" y="502" dominant-baseline="central">实心节点：执行出口</text>

  <defs>
    <marker id="sdArrow4a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

有 `AGENTS.md`、有分得开的文档、有按任务拆的 skill，场地就有围栏。不是空地里自由发挥。

### 质量得能说不

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 540" role="img" aria-label="改代码依次经过编译、单测、集成、静态分析、架构规则、安全扫描和 Diff 风险，全部通过才能合并，否则退回">
  <text class="sd-cap" x="32" y="34">图 5 · 能说不的门禁</text>

  <text class="sd-small" x="32" y="70">每一道门都可以把改动挡回去</text>

  <g>
    <rect x="32" y="106" width="150" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="107" y="130" text-anchor="middle" dominant-baseline="central">改代码</text>
    <text class="sd-small" x="107" y="149" text-anchor="middle" dominant-baseline="central">产生候选改动</text>

    <rect x="220" y="106" width="150" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="295" y="130" text-anchor="middle" dominant-baseline="central">编译</text>
    <text class="sd-small" x="295" y="149" text-anchor="middle" dominant-baseline="central">先确认能构建</text>

    <rect x="408" y="106" width="150" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="483" y="130" text-anchor="middle" dominant-baseline="central">单测</text>
    <text class="sd-small" x="483" y="149" text-anchor="middle" dominant-baseline="central">先问局部行为</text>

    <rect x="596" y="106" width="150" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="671" y="130" text-anchor="middle" dominant-baseline="central">集成</text>
    <text class="sd-small" x="671" y="149" text-anchor="middle" dominant-baseline="central">再看系统协作</text>
  </g>

  <path class="sd-arrow" d="M182 135H212" marker-end="url(#sdArrow5)"/>
  <path class="sd-arrow" d="M370 135H400" marker-end="url(#sdArrow5)"/>
  <path class="sd-arrow" d="M558 135H588" marker-end="url(#sdArrow5)"/>
  <path class="sd-arrow" d="M671 164V224H671" marker-end="url(#sdArrow5)"/>

  <g>
    <rect x="596" y="232" width="150" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="671" y="256" text-anchor="middle" dominant-baseline="central">静态分析</text>
    <text class="sd-small" x="671" y="275" text-anchor="middle" dominant-baseline="central">检查明显坏味道</text>

    <rect x="408" y="232" width="150" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="483" y="256" text-anchor="middle" dominant-baseline="central">架构规则</text>
    <text class="sd-small" x="483" y="275" text-anchor="middle" dominant-baseline="central">守住系统边界</text>

    <rect x="220" y="232" width="150" height="58" rx="10" class="sd-node-risk"/>
    <text class="sd-label" x="295" y="256" text-anchor="middle" dominant-baseline="central">安全扫描</text>
    <text class="sd-small" x="295" y="275" text-anchor="middle" dominant-baseline="central">寻找新增风险</text>

    <rect x="32" y="232" width="150" height="58" rx="10" class="sd-node-risk"/>
    <text class="sd-label" x="107" y="256" text-anchor="middle" dominant-baseline="central">Diff 风险</text>
    <text class="sd-small" x="107" y="275" text-anchor="middle" dominant-baseline="central">判断改动大小</text>
  </g>

  <path class="sd-arrow" d="M596 261H566" marker-end="url(#sdArrow5)"/>
  <path class="sd-arrow" d="M408 261H378" marker-end="url(#sdArrow5)"/>
  <path class="sd-arrow" d="M220 261H190" marker-end="url(#sdArrow5)"/>

  <path class="sd-arrow sd-arrow-agent" d="M107 290V338H360V387" marker-end="url(#sdArrow5)"/>
  <rect x="376" y="358" width="208" height="58" rx="10" class="sd-node-pass"/>
  <text class="sd-on-fill" x="480" y="382" text-anchor="middle" dominant-baseline="central">过了才能合</text>
  <text x="480" y="401" text-anchor="middle" dominant-baseline="central" class="sd-on-fill" font-size="11">高风险再叫人看</text>

  <path class="sd-arrow sd-arrow-agent" d="M107 290V438H760" marker-end="url(#sdArrow5)"/>
  <rect x="376" y="426" width="208" height="58" rx="10" class="sd-node-return"/>
  <text class="sd-label" x="480" y="450" text-anchor="middle" dominant-baseline="central">不过就打回去</text>
  <text class="sd-small" x="480" y="469" text-anchor="middle" dominant-baseline="central">补证据，再走一遍</text>

  <line class="sd-divider" x1="32" y1="500" x2="928" y2="500"/>
  <line class="sd-legend-line sd-legend-flow" x1="42" y1="516" x2="72" y2="516"/>
  <text class="sd-legend-label" x="82" y="516" dominant-baseline="central">橙色箭头：检查顺序</text>
  <rect x="260" y="509" width="14" height="14" rx="3" fill="var(--diagram-risk)"/>
  <text class="sd-legend-label" x="284" y="516" dominant-baseline="central">红橙节点：风险门</text>
  <rect x="450" y="509" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="474" y="516" dominant-baseline="central">青蓝出口：允许继续</text>

  <defs>
    <marker id="sdArrow5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

测试挂了、规则破了、架构踩线了，不许合。真高风险再叫人来看。那种「建议你注意一下」的 AI Review，赶工的时候等于没有。

### 别让几个 Agent 重复说「写得不错」

再挂一个 Reviewer，用差不多的眼光看同一段代码，没多大用。拆开问：

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 540" role="img" aria-label="Coder 把改动分别交给 Test、Security、Architecture 和 DB，汇总为证据后再做决定">
  <text class="sd-cap" x="32" y="34">图 6 · 拆开问，别一起点头</text>

  <rect x="32" y="206" width="160" height="70" rx="12" class="sd-node-agent"/>
  <text class="sd-label" x="112" y="232" text-anchor="middle" dominant-baseline="central">Coder</text>
  <text class="sd-small" x="112" y="253" text-anchor="middle" dominant-baseline="central">写的一版改动</text>

  <g>
    <rect x="296" y="64" width="190" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="391" y="87" text-anchor="middle" dominant-baseline="central">Test</text>
    <text class="sd-small" x="391" y="106" text-anchor="middle" dominant-baseline="central">需求测到了吗</text>

    <rect x="296" y="150" width="190" height="58" rx="10" class="sd-node-risk"/>
    <text class="sd-label" x="391" y="173" text-anchor="middle" dominant-baseline="central">Security</text>
    <text class="sd-small" x="391" y="192" text-anchor="middle" dominant-baseline="central">有没有新洞</text>

    <rect x="296" y="236" width="190" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="391" y="259" text-anchor="middle" dominant-baseline="central">Architecture</text>
    <text class="sd-small" x="391" y="278" text-anchor="middle" dominant-baseline="central">踩自己规矩了吗</text>

    <rect x="296" y="322" width="190" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="391" y="345" text-anchor="middle" dominant-baseline="central">DB</text>
    <text class="sd-small" x="391" y="364" text-anchor="middle" dominant-baseline="central">变更兼容吗</text>
  </g>

  <path class="sd-arrow sd-arrow-agent" d="M192 241H238V93H288" marker-end="url(#sdArrow6)"/>
  <path class="sd-arrow sd-arrow-agent" d="M192 241H288" marker-end="url(#sdArrow6)"/>
  <path class="sd-arrow sd-arrow-agent" d="M192 241H238V265H288" marker-end="url(#sdArrow6)"/>
  <path class="sd-arrow sd-arrow-agent" d="M192 241H238V351H288" marker-end="url(#sdArrow6)"/>

  <path class="sd-arrow" d="M486 93H570V250H640" marker-end="url(#sdArrow6)"/>
  <path class="sd-arrow" d="M486 179H570V250H640" marker-end="url(#sdArrow6)"/>
  <path class="sd-arrow" d="M486 265H640" marker-end="url(#sdArrow6)"/>
  <path class="sd-arrow" d="M486 351H570V250H640" marker-end="url(#sdArrow6)"/>

  <rect x="640" y="218" width="150" height="64" rx="12" class="sd-node"/>
  <text class="sd-label" x="715" y="242" text-anchor="middle" dominant-baseline="central">证据</text>
  <text class="sd-small" x="715" y="262" text-anchor="middle" dominant-baseline="central">各问各的答案</text>

  <path class="sd-arrow sd-arrow-agent" d="M790 250H840" marker-end="url(#sdArrow6)"/>

  <rect x="846" y="218" width="92" height="64" rx="12" class="sd-node-pass"/>
  <text class="sd-on-fill" x="892" y="250" text-anchor="middle" dominant-baseline="central">决定</text>

  <text class="sd-small" x="32" y="438">问得越死，越不容易一起瞎。</text>

  <line class="sd-divider" x1="32" y1="470" x2="928" y2="470"/>
  <line class="sd-legend-line sd-legend-agent" x1="42" y1="492" x2="72" y2="492"/>
  <text class="sd-legend-label" x="82" y="492" dominant-baseline="central">青蓝箭头：分发给独立角色</text>
  <line class="sd-legend-line sd-legend-flow" x1="300" y1="492" x2="330" y2="492"/>
  <text class="sd-legend-label" x="340" y="492" dominant-baseline="central">橙色箭头：汇总证据</text>
  <rect x="540" y="485" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="564" y="492" dominant-baseline="central">实心节点：最后决定</text>

  <defs>
    <marker id="sdArrow6" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

测试只问需求有没有被测到。安全只问有没有新洞。架构只问有没有踩自己的规矩。库表只问变更能不能兼容。问得越死，越不容易一起瞎。

### 跑起来才算数

用代码解释代码，很多错发现不了。改计价别只盯着 `calculatePrice()`。拿一批历史订单回放，新旧结果对着看。我想要的不是「它觉得对」，是这批数据对得上。

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 540" role="img" aria-label="Code 经过 Run 和 Observe，得到 Evidence，用运行结果代替解释">
  <text class="sd-cap" x="32" y="34">图 7 · 拿运行结果说话</text>

  <rect x="76" y="178" width="166" height="72" rx="12" class="sd-node"/>
  <text class="sd-label" x="159" y="208" text-anchor="middle" dominant-baseline="central">Code</text>
  <text class="sd-small" x="159" y="230" text-anchor="middle" dominant-baseline="central">改动本身</text>

  <path class="sd-arrow" d="M242 214H330" marker-end="url(#sdArrow7)"/>

  <rect x="338" y="178" width="166" height="72" rx="12" class="sd-node"/>
  <text class="sd-label" x="421" y="208" text-anchor="middle" dominant-baseline="central">Run</text>
  <text class="sd-small" x="421" y="230" text-anchor="middle" dominant-baseline="central">让它真的跑起来</text>

  <path class="sd-arrow" d="M504 214H592" marker-end="url(#sdArrow7)"/>

  <rect x="600" y="178" width="166" height="72" rx="12" class="sd-node-agent"/>
  <text class="sd-label" x="683" y="208" text-anchor="middle" dominant-baseline="central">Observe</text>
  <text class="sd-small" x="683" y="230" text-anchor="middle" dominant-baseline="central">记录真实表现</text>

  <path class="sd-arrow" d="M766 214H854" marker-end="url(#sdArrow7)"/>

  <rect x="862" y="178" width="86" height="72" rx="12" class="sd-node-pass"/>
  <text class="sd-on-fill" x="905" y="208" text-anchor="middle" dominant-baseline="central">Evidence</text>
  <text class="sd-on-fill" x="905" y="230" text-anchor="middle" dominant-baseline="central" font-size="10">可核对</text>

  <text class="sd-small" x="76" y="332">改计价时，不只盯着 calculatePrice()。</text>
  <text class="sd-small" x="76" y="354">拿历史订单回放，新旧结果对着看。</text>

  <line class="sd-divider" x1="32" y1="430" x2="928" y2="430"/>
  <line class="sd-legend-line sd-legend-flow" x1="42" y1="452" x2="72" y2="452"/>
  <text class="sd-legend-label" x="82" y="452" dominant-baseline="central">橙色箭头：执行顺序</text>
  <rect x="280" y="445" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="304" y="452" dominant-baseline="central">青蓝节点：观察过程</text>
  <rect x="510" y="445" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="534" y="452" dominant-baseline="central">实心节点：证据产物</text>

  <text class="sd-small" x="76" y="490">代码解释代码，很多错发现不了；运行结果才有资格反驳它。</text>

  <defs>
    <marker id="sdArrow7" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" height="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

### 老项目里，顺序倒过来

需求来了先别写。看影响面，出计划和怎么验，测试先落下，再改代码，跑一遍，对结果，最后才提交。

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 540" role="img" aria-label="需求依次经过分析影响范围、修改计划、验证方案、先写测试、再改代码、跑验证、对比结果，最后提交">
  <text class="sd-cap" x="32" y="34">图 8 · 老项目里的顺序</text>

  <g>
    <rect x="32" y="78" width="178" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="121" y="102" text-anchor="middle" dominant-baseline="central">需求</text>
    <text class="sd-small" x="121" y="121" text-anchor="middle" dominant-baseline="central">先别写</text>
    <rect x="250" y="78" width="178" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="339" y="102" text-anchor="middle" dominant-baseline="central">分析影响范围</text>
    <text class="sd-small" x="339" y="121" text-anchor="middle" dominant-baseline="central">先看哪里会动</text>
    <rect x="468" y="78" width="178" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="557" y="102" text-anchor="middle" dominant-baseline="central">修改计划</text>
    <text class="sd-small" x="557" y="121" text-anchor="middle" dominant-baseline="central">写清楚怎么改</text>
    <rect x="686" y="78" width="178" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="775" y="102" text-anchor="middle" dominant-baseline="central">验证方案</text>
    <text class="sd-small" x="775" y="121" text-anchor="middle" dominant-baseline="central">先说怎么验</text>
  </g>

  <path class="sd-arrow" d="M210 107H242" marker-end="url(#sdArrow8)"/>
  <path class="sd-arrow" d="M428 107H460" marker-end="url(#sdArrow8)"/>
  <path class="sd-arrow" d="M646 107H678" marker-end="url(#sdArrow8)"/>
  <path class="sd-arrow" d="M775 136V206H121V238" marker-end="url(#sdArrow8)"/>

  <line class="sd-divider" x1="32" y1="190" x2="928" y2="190"/>
  <text class="sd-small" x="32" y="178">计划和怎么验先落下，代码还没开始说话</text>

  <g>
    <rect x="32" y="246" width="178" height="58" rx="10" class="sd-node-agent"/>
    <text class="sd-label" x="121" y="270" text-anchor="middle" dominant-baseline="central">先写测试</text>
    <text class="sd-small" x="121" y="289" text-anchor="middle" dominant-baseline="central">把预期钉住</text>
    <rect x="250" y="246" width="178" height="58" rx="10" class="sd-node-agent"/>
    <text class="sd-label" x="339" y="270" text-anchor="middle" dominant-baseline="central">再改代码</text>
    <text class="sd-small" x="339" y="289" text-anchor="middle" dominant-baseline="central">在边界里实现</text>
    <rect x="468" y="246" width="178" height="58" rx="10" class="sd-node-agent"/>
    <text class="sd-label" x="557" y="270" text-anchor="middle" dominant-baseline="central">跑验证</text>
    <text class="sd-small" x="557" y="289" text-anchor="middle" dominant-baseline="central">让结果出现</text>
    <rect x="686" y="246" width="178" height="58" rx="10" class="sd-node"/>
    <text class="sd-label" x="775" y="270" text-anchor="middle" dominant-baseline="central">对比结果</text>
    <text class="sd-small" x="775" y="289" text-anchor="middle" dominant-baseline="central">新旧数据对上</text>
  </g>

  <path class="sd-arrow" d="M210 275H242" marker-end="url(#sdArrow8)"/>
  <path class="sd-arrow" d="M428 275H460" marker-end="url(#sdArrow8)"/>
  <path class="sd-arrow" d="M646 275H678" marker-end="url(#sdArrow8)"/>
  <path class="sd-arrow" d="M775 304V370H557V394" marker-end="url(#sdArrow8)"/>

  <rect x="468" y="402" width="178" height="58" rx="10" class="sd-node-pass"/>
  <text class="sd-on-fill" x="557" y="431" text-anchor="middle" dominant-baseline="central">提交</text>
  <text class="sd-small" x="32" y="418">Plan → Test → Code → Verify</text>
  <text class="sd-small" x="32" y="440">不是先堆一版，再请另一个模型看一眼。</text>

  <line class="sd-divider" x1="32" y1="490" x2="928" y2="490"/>
  <line class="sd-legend-line sd-legend-flow" x1="42" y1="512" x2="72" y2="512"/>
  <text class="sd-legend-label" x="82" y="512" dominant-baseline="central">橙色箭头：严格顺序</text>
  <rect x="280" y="505" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="304" y="512" dominant-baseline="central">青蓝节点：机器执行</text>
  <rect x="510" y="505" width="14" height="14" rx="3" fill="var(--diagram-agent)"/>
  <text class="sd-legend-label" x="534" y="512" dominant-baseline="central">实心节点：可以提交</text>

  <defs>
    <marker id="sdArrow8" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

Plan → Test → Code → Verify。不是先堆一版再请人（或另一个模型）看一眼。

人往上走：目标、约束、架构、风险。模型在框子里实现，还得拿出证据。证据过不了，就当它没做对。

## 收住

生成已经便宜了。读懂和验过，没有一起变便宜。老系统会很快堆出一堆说不清的债。

我不指望加人盯 diff。约束、自动验证、彼此不问同一句话的检查，再加上真危险才叫人。改代码就得给得出能核对的东西，别让我凭感觉信它。

<div class="diagram">
<svg viewBox="0 0 600 150" role="img" aria-label="从 Vibe Coding 到 AI Software Engineering 的演进">
  <text class="d-cap" x="0" y="14">图 9 · 值钱的地方在往右移</text>

  <g>
    <rect x="0" y="46" width="112" height="48" rx="24" class="d-box-lite"/>
    <text class="d-sub" x="56" y="70" text-anchor="middle" dominant-baseline="central">Vibe Coding</text>

    <rect x="122" y="46" width="112" height="48" rx="24" class="d-box-lite"/>
    <text class="d-sub" x="178" y="70" text-anchor="middle" dominant-baseline="central">AI Coding</text>

    <rect x="244" y="46" width="112" height="48" rx="24" class="d-box-lite"/>
    <text class="d-sub" x="300" y="70" text-anchor="middle" dominant-baseline="central">AI + Harness</text>

    <rect x="366" y="46" width="112" height="48" rx="24" fill="none" stroke="var(--signal)" stroke-width="1.4"/>
    <text class="d-sub" x="422" y="70" text-anchor="middle" dominant-baseline="central">自动验证</text>

    <rect x="488" y="46" width="112" height="48" rx="24" fill="var(--accent)"/>
    <text x="544" y="70" text-anchor="middle" dominant-baseline="central" class="d-on-accent">AI SE</text>
  </g>

  <path class="d-dash" d="M112 70L122 70"/>
  <path class="d-dash" d="M234 70L244 70"/>
  <path class="d-dash" d="M356 70L366 70"/>
  <path class="d-dash" d="M478 70L488 70"/>

  <path class="d-link d-link-accent" d="M494 112L580 112" marker-end="url(#dArrow9)"/>
  <text class="d-sub" x="537" y="130" text-anchor="middle">越往右，越不容易被替代</text>

  <text class="d-sub" x="0" y="130" dominant-baseline="central">写得快会变便宜；能在几十万行老代码里持续改、还不改散，才算工程</text>

  <defs>
    <marker id="dArrow9" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--signal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

谁写得快以后没那么值钱。谁能在几十万、几百万行的老代码里持续改、还不把系统改散，才算把这件事做成了工程。
