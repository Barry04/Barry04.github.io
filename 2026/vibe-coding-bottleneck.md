---
layout: default
title: 在存量项目中 Vibe Coding，如何更好让 Agent 写出优质代码
date: 2026-09-14
tag: AI / 工程
summary: 旧代码之下，还有没写下来的规矩。让 Agent 理解边界，再用真实证据验证每一次改动。
image: /assets/vibe-coding-bottleneck-illustrations/01-hidden-rules.png
reading_style: story
---

<section class="story-scene" data-scene="先补背景" markdown="1">

## 老项目难改，难在代码之外 {#vibe-coding-bottleneck-opening}

Agent 写得很快。我还没读完这轮 diff，它已经准备好下一版了。新仓库里，这种速度让人高兴；到了老项目，我先想知道另一件事：它看见了多少不能随便改的东西？

当前文件能告诉它实现是什么，却未必能解释当年的取舍。一个看似多余的分支，可能照顾着旧客户端；一段没人敢删的补丁，可能来自一次生产事故。架构边界、业务约定、迁移历史，也不总在注释里。

模型如果只拿着「当前文件 + 当前需求」，就容易把这些背景当成不存在。我最担心的，是一段读起来顺畅的改动弄断了隐性规则，过两个月才在生产里露出来。

{% include story/graphic.html key="vibe-context" %}

![一个写着“当前代码”的抽屉柜下，藏着许多旧规则与维修记录。](../assets/vibe-coding-bottleneck-illustrations/01-hidden-rules.png)

柜子上面的卡片是当前代码，下面几层才是修改时要核对的背景。先把这些背景找出来，Agent 的速度才有地方用。


</section>

<section class="story-scene" data-scene="检查是否独立" markdown="1">

## 自己认同自己，还不能算验证 {#审的和写的是同一张嘴}

让 Agent 写完再审一遍，当然可以发现问题。但如果写和审都沿用同一份背景，最初漏掉的业务条件也会一起漏掉。

假设需求要求「用户不存在时返回明确错误」，实现却写成这样：

```java
if (user == null) {
    return;
}
```

实现者看到的是：已经判了 `null`，空指针不会再发生。审查者也可能沿着这个思路点头。可调用方收到的是什么？如果它需要一个明确的失败信号，悄悄 `return` 就没有完成需求。

{% include story/graphic.html key="vibe-verification" %}

![同一个人写完答案，又拿同一枚章给自己打勾；旁边的证据袋还没有打开。](../assets/vibe-coding-bottleneck-illustrations/02-self-review.png)

多审一遍可以补充检查。要判断这个实现是否真的成立，还需要能反驳它的东西：由需求写出的验收测试、实际运行结果，或清楚业务后果的人。


</section>

<section class="story-scene" data-scene="收住单次影响面" markdown="1">

## 先控制改动范围，再分配人的注意力 {#别指望人把-diff-读完}

“人认真 Review 就行”把压力留到了最后。Agent 十分钟生成的修改，我可能要花一小时才能读明白。仓库越大，越需要限制单次改动的影响面。

我更愿意先定清目标和边界：这次解决什么问题，允许改哪些位置，哪些行为必须保留。机器能检查的越界直接挡回，人的注意力集中在业务语义、风险取舍和关键路径上。


</section>

<section class="story-scene" data-scene="背景与方法各就其位" markdown="1">

## 入口讲清背景，Skill 讲清这次怎么做 {#我现在比较信的做法}

先让 Agent 知道项目从哪里看起。系统用途、架构边界、接口兼容、库表变更、异常契约、日志约定和验证入口，都应该有能找到的说明。

![把“这个系统”“怎么改”“怎么验”三张卡钉在工作台前，危险区域另挂红色标签。](../assets/vibe-coding-bottleneck-illustrations/03-project-map.png)

`AGENTS.md` 适合做短目录，把 Agent 带到相关文档。架构、业务规则、编码约定、库表说明和部署风险分别维护，按任务读取。具体到一次改动，再由 Skill 说明输入、步骤和验证办法。

背景解释约束为什么存在，方法说明这次怎样操作。两者接上，Agent 才能在项目已有的边界里行动。


</section>

<section class="story-scene" data-scene="让检查能够拒绝" markdown="1">

## 检查必须能把不合格的改动挡回来 {#质量得能说不}

编译、单元测试、集成测试、静态检查、安全扫描和架构规则，要接到实际的门禁上。失败之后能阻止合并，检查才对交付产生约束；高风险的取舍再交给人。

审查也要各自回答具体问题，避免几份相似意见重复确认同一个误会：

- 测试只问：需求有没有真的测到？
- 安全只问：有没有引入新洞？
- 架构只问：有没有踩自己的边界？
- 库表只问：变更能不能兼容旧版本？

每项检查都有自己的输入和判断依据，才更容易发现其他环节看不见的问题。


</section>

<section class="story-scene" data-scene="回到真实输入和结果" markdown="1">

## 历史样本验旧行为，新验收检查新契约 {#跑起来才算数}

改计价逻辑时，只读 `calculatePrice()` 的解释还不够。我会拿一批历史订单回放，把预期不变的行为与旧版对照；这次有意改变的行为，则按新的验收标准检查。

两种验证要分开。把所有结果都强行对齐旧版，会把本来应该改变的行为也保护起来；只看新用例，又可能漏掉已有用户的路径。

![把旧订单送进测试装置，左右两张结果单被放在一起，用放大镜核对。](../assets/vibe-coding-bottleneck-illustrations/04-real-evidence.png)

运行结果留下来，才知道哪条路径通过了、哪条还不成立。

### 回到刚才那个 null 分支 {#一个小例子}

再看前面的假设：需求是“用户不存在时返回明确错误”，代码却仍然是：

```java
if (user == null) {
    return;
}
```

编译和空指针测试可能都通过，调用方却没有收到失败信号。因此，验收用例需要核对返回状态、错误信息和调用方行为。如果本次就在调整错误契约，验收依据应随之更新，不能机械地要求结果与旧版完全一致。


</section>

<section class="story-scene" data-scene="把验法放到实现之前" markdown="1">

## 先确定怎样验，再让 Agent 改 {#老项目里顺序倒过来}

把上面的做法串起来，顺序就清楚了：先看影响面，写下计划和验证办法；测试先落下，再实现；运行检查、核对结果，最后提交。

{% include story/graphic.html key="vibe-delivery" %}

![老机器还没动手修，旁边已经摊开检查单、测试纸和量尺；螺丝刀还放在一边。](../assets/vibe-coding-bottleneck-illustrations/05-before-code.png)

这会把一些工作移到编码之前。但相比把隐性规则弄断以后再去生产里找原因，我更愿意提前把问题讲清楚。

原来的顺序可以留在检查单上：

```text
先看 → 先验 → 再改 → 对结果 → 提交
```

人决定目标、约束、架构和风险；模型在范围内实现，拿运行证据交付。验证不过，就带着失败结果继续修复。


</section>

<section class="story-scene" data-scene="交付可核对的改动" markdown="1">

## 写得快之后，要接上读懂和验过的能力 {#收住}

代码生成已经很快，读懂背景和确认结果仍然需要投入。缺少这两步，老系统只会更快积累难以解释的改动。

我的选择是把背景写清，把单次范围收住，让检查能拒绝不合格的结果，再把业务语义和高风险路径交给人。这样，每一次修改都有能回查的依据。

能在大量存量代码里持续交付，又不把系统改散，才是我希望 Agent 帮忙完成的事。

</section>
