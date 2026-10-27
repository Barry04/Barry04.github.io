---
layout: default
title: JEV：让决策从对话里走出来
date: 2026-09-22
tag: AI / 工程
summary: 从一次排查里的分支、状态和证据出发，理解决策运行时的职责，以及它仍然需要验证的边界。
reading_style: story
---

<section class="story-scene" data-scene="从临时判断到可管理对象" markdown="1">

## 会话结束以后，那些判断还剩下什么 {#jev-model-thinking-opening}

[存量项目里怎么让 Agent 别改散](./vibe-coding-bottleneck.md)、[Skill 攒多了怎么管](./skill-lifecycle.md)，前两篇都在补模型之外的工程工作：背景怎么提供，边界怎么确定，经验怎么留下。

再往前走，会遇到另一个问题。一次排查做过几个判断，某条路为什么被放弃，最后凭什么选择这个修复方案？如果这些只活在聊天里，换了会话就很难接着检查。

最近看 JEV 的文档和 demo，我把它和前两篇接到了一起。下面是个人理解与推演，不是官方定义，也不代表对其生产能力的验证。

> 我关心的是：能不能让判断离开临时对话，成为可以保存、检查和继续推进的对象。

Prompt 表达目标，Harness 组织工作环境，Skill 留下经验。JEV 这类决策运行时让我想到的下一步，是把分支、状态和证据也放到明确的结构里。


</section>

<section class="story-scene" data-scene="沿着证据推进" markdown="1">

## 把判断写成路径，才能知道哪里需要回退 {#一先说我把-jev-理解成了什么}

我把 JEV 理解为一种管理决策路径的尝试。普通模型调用会根据本轮可见上下文生成内容；任务走到哪里、哪个结论已验证，需要外围系统保存和组织。

用一个假设的缓存排查说明。任务并不止是写出一段分析，它还包括连续的观察和选择：

```text
查日志 -> 判断是不是缓存问题 -> 查缓存 -> 判断是不是热点 -> 查热点 -> 判断修复方案
```

日志还没查清，修复就不该先落地；证据不支持缓存假设，就应允许换方向；选择了回滚，也得能说明依据。路径因此需要表达依赖、回退与证据。

{% include story/graphic.html key="jev-path" %}

把判断当成管理对象，我期待它能承担四件事：

- **记着走到哪了。** 上下文会截断，会话会丢，但走过的路径应该在。
- **知道哪条路已经验证过。** 同一个决策点，别每次重新猜；上次怎么判断的、结果对不对，存下来。
- **知道哪个活可以并行、哪个必须等。** 排查可以并发跑三条线，修复必须等结论。
- **把证据链补齐再让人拍板。** 不是「我建议回滚」，而是「三条证据指向这三个改动之一，请你选」。

这四件事指向决策的状态：已走过什么、证据支持什么、还有什么没定。保存聊天记录可以提供材料，却还没有自动完成这些管理工作。


</section>

<section class="story-scene" data-scene="区分不同控制点" markdown="1">

## 把控制点分开，才能看清各层负责什么 {#二把这条演进路径摆出来}

我更愿意把 Prompt、Harness / Skill 和决策运行时看成几类控制点。这个分层帮助理解职责，并不表示所有系统都按同一条产品路线演进。

{% include story/graphic.html key="jev-controls" %}

<details class="story-detail" markdown="1">
<summary>展开：Prompt、Harness 与决策运行时的完整职责图</summary>

<figure class="diagram diagram-sumsec">
<svg viewBox="0 0 960 470" role="img" aria-label="Prompt、Harness/Skill、JEV 三代做法在同一坐标上的对比：控制点逐代外移，解决的问题和留下的空白">
  <text class="sd-cap" x="32" y="32">同一条坐标轴</text>
  <text class="sd-small" x="32" y="58">每一代都在把「控制点」从模型里面往外搬；把控制点全收走，模型就退回「会写不会做」</text>

  <line class="sd-divider" x1="32" y1="92" x2="928" y2="92"/>

  <text class="sd-small" x="32" y="122">控制点位置</text>
  <text class="sd-small" x="260" y="122">解决的问题</text>
  <text class="sd-small" x="600" y="122">留下的空白</text>

  <rect x="32" y="142" width="182" height="88" rx="10" class="sd-node"/>
  <text class="sd-label" x="52" y="170">Prompt</text>
  <text class="sd-small" x="52" y="194">在模型里面</text>
  <text class="sd-small" x="52" y="214">靠语气和记忆</text>

  <rect x="244" y="142" width="306" height="88" rx="10" class="sd-node-agent"/>
  <text class="sd-label" x="264" y="170">说清「要注意什么」</text>
  <text class="sd-small" x="264" y="194">让模型知道目标与边界</text>
  <text class="sd-small" x="264" y="214">不越界，但每次从零开始</text>

  <rect x="600" y="142" width="328" height="88" rx="10" class="sd-node-risk"/>
  <text class="sd-label" x="620" y="170">无法复用 · 无法验证</text>
  <text class="sd-small" x="620" y="194">同一指令换个措辞，结果就变</text>
  <text class="sd-small" x="620" y="214">没有地方记录「上次这样做对不对」</text>

  <rect x="32" y="258" width="182" height="94" rx="10" class="sd-node"/>
  <text class="sd-label" x="52" y="286">Harness · Skill</text>
  <text class="sd-small" x="52" y="310">在模型外面</text>
  <text class="sd-small" x="52" y="330">靠文件与目录</text>

  <rect x="244" y="258" width="306" height="94" rx="10" class="sd-node-agent"/>
  <text class="sd-label" x="264" y="286">说清「这类活怎么做」</text>
  <text class="sd-small" x="264" y="310">人的经验变成可检索的说明书</text>
  <text class="sd-small" x="264" y="330">可安装、可版本管理、按需加载</text>

  <rect x="600" y="258" width="328" height="94" rx="10" class="sd-node-risk"/>
  <text class="sd-label" x="620" y="286">静态 · 不产生新证据</text>
  <text class="sd-small" x="620" y="310">文档写得多准，也回答不了这一次</text>
  <text class="sd-small" x="620" y="330">「这次跑出来的结果说明了什么」</text>

  <rect x="32" y="380" width="182" height="66" rx="10" class="sd-node-pass"/>
  <text class="sd-on-fill" x="52" y="408">决策运行时</text>
  <text class="sd-on-fill" x="52" y="430" font-size="11">在过程中间</text>

  <path class="sd-arrow sd-arrow-agent" d="M123 356V376" marker-end="url(#sdArrowJev1)"/>

  <text class="sd-small" x="244" y="410">说清「这一步凭什么这么定」</text>
  <text class="sd-small" x="244" y="432">路径、分支、回退、证据、归因</text>
  <text class="sd-small" x="600" y="410">正在补的空白：跨会话的长期记忆</text>
  <text class="sd-small" x="600" y="432">会记住「上次这样做对了」，也会记住错的</text>

  <defs>
    <marker id="sdArrowJev1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-agent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
<figcaption>三代做法的差别不在「谁更强」，在控制点被搬到了哪一层。也可以反过来读：把最外面那层拿掉，模型立刻退回「会写不会做」。</figcaption>
</figure>

</details>

看到 Claude Code 这类工具里的项目指令、Skill、子代理、权限和校验环节，我会用这个分层去理解它们：模型负责生成，外围工程接过任务组织和运行控制。

ReAct 把推理与行动交替组织，也可以放到相同的观察框架里。对我有启发的地方是：一个局部技巧可以被整理为可复用机制，再与其他工程能力组合。


</section>

<section class="story-scene" data-scene="检查判断的前提" markdown="1">

## 路径可以完整，判断的前提仍可能错 {#三把台阶拆开看能看到什么}

把这几类控制点放在一起，解决的问题、维护成本和失败方式就更清楚了：

| | Prompt | Harness / Skill | JEV 这类决策运行时 |
|---|---|---|---|
| 主要解决什么 | 让模型知道该往哪走 | 让模型按对的方法走 | 让模型在岔路口有依据地走 |
| 载体 | 一次对话里的文字 | 文件、目录、脚本、门禁 | 路径、分支、回退、证据链 |
| 谁能改 | 会说话的人都能改 | 懂项目的人能改 | 需要能定义风险和验证的人 |
| 主要成本 | 反复调措辞的隐形时间 | 文档维护、Review、回归 | 建模正确性、可调试性 |
| 出问题时 | 说不清为什么这次不行 | 规则过期了还在执行 | 决策链本身要能解释、能追责 |
| 失败的样子 | 结果时好时坏 | 灵活任务被框死 | 路径看着完整，结论是错的 |

最后一行是我最在意的。

我最担心的，是结构本身让错误显得更可信。规则可能已经过期，文件却还被照常执行；路径可能每一步都有记录，结论依然错了。

回到假设的排查。如果某一步把“没触发熔断”直接当成“系统健康”，即使日志真实、操作可追踪，判断前提仍可能不成立。此时需要追问的是这一步为什么能够成立，并找到被默认接受的假设。

这也是我看重可调试性的原因：能检查路径的依据，才有机会纠正一条解释得很完整的错误路径。


</section>

<section class="story-scene" data-scene="留下状态与依据" markdown="1">

## 判断成为对象以后，要能保存、标状态和追查 {#四三个第一次值得单独拿出来说}

把“决策成为对象”拆开，我关心三个变化：它能独立于会话保存，能标明执行状态，还能追查证据与回退原因。这里说的是我希望看到的能力，不是在断言这些事情第一次出现在某个产品里。

<details class="story-detail" markdown="1">
<summary>展开：持久化、状态与追踪的完整对照图</summary>

<figure class="diagram diagram-sumsec">
<svg viewBox="0 0 960 520" role="img" aria-label="决策独立保存、带执行状态、可追踪与回退三个变化">
  <text class="sd-cap" x="32" y="32">决策变成一等公民</text>
  <text class="sd-small" x="32" y="58">左边是对话里的临时判断，右边是能被单独查看、验证、重放的对象</text>

  <text class="sd-label" x="32" y="104">01</text>
  <text class="sd-label" x="88" y="104">决策可以独立于对话存在</text>
  <text class="sd-small" x="88" y="128">对话可以关掉、上下文可以截断、人可以换班，路径还在</text>

  <rect x="32" y="146" width="420" height="60" rx="10" class="sd-node"/>
  <text class="sd-small" x="54" y="172">判断活在一次会话的记忆里</text>
  <text class="sd-small" x="54" y="192">关掉窗口就等于没发生过</text>

  <rect x="508" y="146" width="420" height="60" rx="10" class="sd-node-agent"/>
  <text class="sd-small" x="530" y="172">判断活在显式结构里</text>
  <text class="sd-small" x="530" y="192">谁在哪一步定的、依据是什么，可以事后调出来</text>

  <path class="sd-arrow" d="M452 176H504" marker-end="url(#sdArrowJevA)"/>

  <line class="sd-divider" x1="32" y1="236" x2="928" y2="236"/>

  <text class="sd-label" x="32" y="272">02</text>
  <text class="sd-label" x="88" y="272">决策带上执行状态</text>
  <text class="sd-small" x="88" y="296">知道哪条已经验证过、哪条在等、哪两条冲突、哪步该回退</text>

  <rect x="32" y="314" width="420" height="60" rx="10" class="sd-node"/>
  <text class="sd-small" x="54" y="340">每一步都是「重新想一次」</text>
  <text class="sd-small" x="54" y="360">同一个方向反复试，没有去过哪的记录</text>

  <rect x="508" y="314" width="420" height="60" rx="10" class="sd-node-agent"/>
  <text class="sd-small" x="530" y="340">决策点有状态机</text>
  <text class="sd-small" x="530" y="360">已定、待验、冲突、回退各不相同</text>

  <path class="sd-arrow" d="M452 344H504" marker-end="url(#sdArrowJevA)"/>

  <line class="sd-divider" x1="32" y1="404" x2="928" y2="404"/>

  <text class="sd-label" x="32" y="440">03</text>
  <text class="sd-label" x="88" y="440">决策可以被追踪和复查</text>
  <text class="sd-small" x="88" y="464">模型给出理由不算证据；换一批任务还能重现，才算数</text>

  <text class="sd-small" x="32" y="502">靠事后追问「你当时怎么想的」</text>
  <text class="sd-small" x="508" y="502">记录输入与证据，比较重跑时的决策差异</text>

  <defs>
    <marker id="sdArrowJevA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
<figcaption>可以借用数据库的几种能力帮助理解：持久化让记录留下，事务与状态管理约束推进，审计让决定可以追查。这个类比用来区分职责。</figcaption>
</figure>

</details>

这与前两篇的门禁要求相通：当依据不足或验收失败时，系统需要能够拒绝继续推进。到了决策层，拒绝的对象还包括一个未经支持的判断。

能回滚代码，并不代表已经执行的业务后果也能自动撤回。因此，检查点应该出现在行动之前，回退能力也要按具体动作设计。


</section>

<section class="story-scene" data-scene="这是解释比喻" markdown="1">

## 模型能力和上下文组织，哪一边都不能缺 {#五给这条曲线画个函数}

为了表达两种能力互相制约的关系，我用过这个式子：

```text
Agent 的可用性 = 模型能力 × 上下文组织
```

它是一个帮助理解的比喻，不是经过测量得到的定量公式。模型能力可以理解为单轮判断和生成的能力，上下文组织则表示任务条件、规则与证据能否及时到位。

那么三代做法的差别，就可以用两个极端来推：

- 上下文组织接近零 —— 也就是零上下文。模型再强，也不知道这个仓库的规矩，只能瞎猜。乘积为零。
- 模型能力接近零 —— 上下文组织到极致，也是一具没有判断力的骨架，只能照章办事。

**任何一边单独登顶，乘积都不大。**

从这个比喻看，工程侧补文档、Skill、门禁和校验，是在改善任务交给模型的条件。模型升级后，这些组织工作也仍需维护。

投入应该补哪一边，得看当前任务的短板。在我讨论的存量项目场景里，项目背景和证据组织往往还有大量手工工作值得先补；不能仅凭这个比喻就断言所有团队都该把投入放在同一处。


</section>

<section class="story-scene" data-scene="固定检查点，接受新证据" markdown="1">

## 稳定来自检查点，具体分支接受新证据 {#六主线是把不确定性挤出流程}

这些做法共同尝试减少任务中无从检查的部分。Prompt 影响模型看见什么，Harness 给运行加边界，决策结构进一步留下分支选择和验证依据。

能保存和重放过程，有助于复查与比较，却不自动保证同一输入得到完全相同的模型判断。模型、外部状态和工具结果都需要一并考虑。

生物上有「前馈」和「反馈」两个词，我觉得用来区分这三代挺合适：

- 前馈（anticipate）：规则是提前定好的，算的是「输入像不像我认识的那类问题」。Workflow、硬编码规则属于这一类。
- 反馈（observe then decide）：听结果，根据观察调整。ReAct、Agent Loop 属于这一类。

预先规定路径容易稳定，也可能把任务限制得过窄；完全依赖实时反馈更能应变，却需要反复求证。我的兴趣在于能否让两者各自承担合适的职责。

{% include story/graphic.html key="jev-boundaries" %}

结构是确定的——有几个关键判断、什么条件下必须验证、哪些并发哪些串行、什么时候必须停下来问人。走哪条路是灵活的——同一个决策点，走的可能是上次已验证的路径，也可能是新收集的证据。

Skill 可以给这些判断提供可复用的方法：需要哪些输入，怎样验证，什么条件下应该换方向。后端工程则可以落实状态、权限和恢复机制，让判断的输入、检查点与恢复路径各有归属。


</section>

<section class="story-scene" data-scene="给已有能力安排位置" markdown="1">

## 把已有能力接到路径上，职责会更清楚 {#七它不是替代前三层而是重新安排它们的位置}

沿着这个思路，决策运行时可以把已有能力接到明确的位置，而不是再造一个包办所有事情的 Agent：

- **Prompt 从「人写的话」变成「运行时组装的上下文」**——不再是我一次写完，而是根据当前走到哪一步动态拼出来。
- **Harness 从「静态规矩」变成「路径上的检查点」**——不是文档里写「要测试」，而是在这条链的第几步必须过测试，过不了就停。
- **Skill 从「说明书」变成「决策模板」**——不只是「这类活怎么做」，还有「做到这一步时，什么情况下该换个方向」。

这些是对职责的重新安排。它们是否比原有组合更容易调试、更可靠，需要通过实际任务来判断。


</section>

<section class="story-scene" data-scene="保留尚未验证的问题" markdown="1">

## 粒度、权限、效果和旧路径，都还需要回答 {#八我自己觉得还没着落的地方}

前面是我理解的方向，下面四个问题仍然没有在这篇文章里得到验证。

**第一，决策的粒度。** 太粗没意义，太细就是「第二步要选 B」的另一种硬编码，模型被降级成执行器。这个粒度怎么定，跟团队和任务强相关，很难推广。

**第二，谁能改决策规则。** 改一个 prompt 不影响过审，改一段判断逻辑可能影响线上行为。它该走什么流程？有没有灰度？谁来签字？这些问题现在基本没有答案。

**第三，怎么衡量它真的有用。** 按输出质量评分太主观。也许该看的是另一类数字：同一个任务重跑两次，决策链一致率有多高；上次验证过的路径被复用了多少次；回退率是升还是降。**如果不比「每次重新猜」更确定，那这套东西的价值就只是好看。**

**第四，它会不会把模型锁死。** 强路径加验证，短期确实更稳。可模型一旦升级，旧路径可能反而拖后腿——它把上一代模型的能力上限当成了这一代的约束。这可能就是 Skill 腐化在决策层的版本：**比过期的文档更麻烦，因为过期的是路径。**

说到这儿，其实又回到了前两篇。那篇讲的是 Skill 要有进门和出门，这篇讲的是同一个道理往上走了一层：**决策路径同样需要一套生命周期。** 产生不等于采纳，验证过不等于一直有效，被替换的路径该有地方退休——不然它们会安静地待在链路里，等着把 Agent 带到上一次正确、这一次错误的地方。


</section>

<section class="story-scene" data-scene="路径也要维护与退出" markdown="1">

## 决策路径也要有自己的进门和退出办法 {#收住}

把这些职责连起来，可以留下这样一张简短索引：

```text
prompt  ->  告诉模型该注意什么
harness ->  帮模型把注意力管好
skill   ->  把人的经验固化下来
决策    ->  让模型在岔路口有依据地走
```

我关心的主线，是让模型生成之外的工作有明确归属：背景谁组织，经验谁维护，判断怎么检查，失效的路径怎么退出。

这仍然回到前两篇的提醒。新的判断结构也需要验证、维护与淘汰机制，不能因为它比聊天更整齐，就默认一直有效。

> 模型可以很强，但把它接到真实世界里，剩下的工位得有人去填。

我不是 JEV 的作者，也摸不到生产环境。这篇只能算站在外面，对着一条我刚刚看懂的曲线做的一点推演。如果这条曲线是对的，那接下来会遇到的问题大概也能提前知道——只不过问题会出现在哪一层，现在还说不准。

</section>
