---
layout: default
title: Skill 生命周期：Vibe Coding 下的管理与演进
date: 2026-09-17
tag: AI / 工程
summary: 经验越积越多，怎样避免工具箱越来越乱？从候选、验证到归档，给 Skill 一条完整的生长路径。
image: /assets/skill-lifecycle-illustrations/01-skill-toolbox-chaos.png
---

上一篇写存量项目里的 Agent 怎么改代码。[上下文、验证、Harness](./vibe-coding-bottleneck.md) 解决的是「这一次别改散」。

还有第二个问题，我觉得更烦：

> **代码会腐化，Skill 也会腐化。**

项目连续让 AI 开发几个月，`skills/` 很容易长成这样：

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

每个文件都有来头：有的是某次线上故障留下的笔记，有的是模型觉得“以后可能还会用”顺手写的。单独看都没错。麻烦出在一起。

这就像工具房里有十把看着差不多的扳手，标签还写着“修水管”“修水管新版”“真的修水管”。下次漏水时，没人知道该拿哪把。

![面对一柜近义 Skill，SumSec Observer 正在找真正能用的那一张。](../assets/skill-lifecycle-illustrations/01-skill-toolbox-chaos.png)

Skill 不能按普通文件堆着管。它更像项目里的经验：能试用，能入库，也该能淘汰。

这不是凭空画出来的目录。我自己的 [ai-skill-repository](https://github.com/Barry04/ai-skill-repository) 已经在做前半段：把项目理解、跨仓定位、远程验证、经验沉淀拆成可安装、可审查、可版本管理的 Skill。写这篇，是因为跑起来之后才更明显地看见它下一步该补什么。

## 已经有人在解决前半题

我暂时没找到一个成熟产品，已经把「Vibe Coding → 自动留下经验 → 评估 → 合并 → 淘汰」整条链做完。

不过前半题已经有好参考：怎么把很多 Skill 放在一起，又不把模型撑爆。

[Anthropic 的 Claude Code](https://claude.com/blog/lessons-from-building-claude-code-how-we-use-skills) 说，他们内部已经在用数百个 Skill。[Codex](https://developers.openai.com/codex/skills)、[Agent Skills 开放标准](https://github.com/agentskills/agentskills) 和 [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/agents/skills) 也走了相近的路。

它们的共同点是：**先看工具箱标签，再拿具体工具。**

启动时，Agent 只看每个 Skill 的名字、简介和位置。比如：

```text
database-migration
修改表结构时使用；包含兼容旧版本、回滚与验证步骤。
```

只有任务真和数据库迁移有关，它才打开完整说明，必要时再读里面的脚本、示例和参考资料。

这有个正式名字，叫 Progressive Disclosure，中文通常译成「渐进式披露」。叫法不用记，意思很简单：别把整间工具房搬到桌上。

Codex 甚至给最初那张“工具目录”留了上下文预算。目录太长时，先压缩简介；再大，某些 Skill 可能根本不会出现在模型眼前。这个限制很诚实：Skill 越多，不一定越好找。

所以 Skill 管理首先是上下文管理，其次才是文件管理。

我的仓库也按这个思路工作。`AGENTS.md` 是一张短地图：任务开始时，Agent 从索引里挑最多两个相关 Skill；细节放进各自的 `SKILL.md`、`references/` 和脚本里，真需要才读。这样“项目理解”和“Linux 验证”不会在每次任务一开始就占满上下文。

## 后半题要项目自己补齐

这些方案主要解决的是：Skill 如何定义、如何被发现、如何按需加载、如何跟着仓库版本管理。Anthropic 也已经在用试用区、PR 和使用量统计来管理一部分 Skill。

它们不会替项目判断：

- 这份经验只是一次偶然，还是以后都适用？
- 两份 Skill 到底是不是同一件事？
- 里面的规则有没有过期？
- 两条相反的建议，该听谁的？

前半题是“怎么找到说明书”。我更关心的后半题是：项目怎样用证据判断说明书该不该留在默认工具箱里。

我把后半题叫 **Skill Lifecycle**。不是什么新名词，和代码的生命周期差不多：新东西先别急着当规范；用久了、验证过，才留下；被替代或长期不用，先复核再收起来。

## 先别把所有东西都叫 Skill

我会先把它们放到三类货架上，再分别判断生命周期状态和适用范围。状态决定是否进入正式路由；范围决定它在哪个项目或技术域内生效。项目专属的 Skill 也可以很成熟，不必为了“升级”而强行抽象成通用能力。

一类是**稳定能力**。比如：

```text
java-api/
database-migration/
redis-operation/
error-handling/
testing/
```

它们不是为了某一个 bug 才存在。项目每隔一阵就会碰到，规则也相对稳定。这种可以放进正式工具箱。

另一类是**项目知识**。比如一个告警系统的抑制规则、多站点部署顺序、某张表的历史包袱。它们看起来像 Skill，实际更接近“这个项目到底怎么运转”的说明。换一个项目，往往不适用，但这不妨碍它在本项目里成为稳定、正式的能力。

还有一类是**临时记录**：

```text
fix-xxx-bug
investigate-xxx
migration-xxx
temporary-debug
experiment-xxx
```

它们可能只会用一次。写下来当然没问题，但不应该直接挤进正式库。否则以后每次检索，都得先穿过一层旧事故现场。

<div class="diagram diagram-sumsec">
<svg viewBox="0 0 960 500" role="img" aria-label="Skill 从临时记录经过验证，按需成为项目 Skill 或通用能力">
  <text class="sd-cap" x="32" y="34">经验演进</text>
  <text class="sd-small" x="32" y="62">生命周期状态与适用范围分别判断，默认路由只纳入已批准内容</text>

  <g>
    <rect x="32" y="346" width="430" height="94" rx="12" class="sd-node-risk"/>
    <text class="sd-label" x="58" y="375">临时记录</text>
    <text class="sd-small" x="58" y="401">一次事故 · 调查笔记 · 实验结果</text>
    <text class="sd-small" x="58" y="423">默认不参与 Skill 路由</text>

    <rect x="112" y="218" width="350" height="94" rx="12" class="sd-node"/>
    <text class="sd-label" x="138" y="247">项目 Skill</text>
    <text class="sd-small" x="138" y="273">项目专属规则 · 操作方法 · 历史约束</text>
    <text class="sd-small" x="138" y="295">在项目范围内优先使用</text>

    <rect x="192" y="90" width="270" height="94" rx="12" class="sd-node-pass"/>
    <text class="sd-on-fill" x="218" y="119">通用能力（可选）</text>
    <text class="sd-on-fill" x="218" y="145" font-size="11">跨项目验证 · 保留边界</text>
    <text class="sd-on-fill" x="218" y="167" font-size="11">进入共享 Skill 库</text>
  </g>

  <path class="sd-arrow" d="M247 346V320" marker-end="url(#sdArrowLevel)"/>
  <text class="sd-small" x="265" y="334">同类问题再次命中 + 验证通过</text>

  <path class="sd-arrow" d="M327 218V192" marker-end="url(#sdArrowLevel)"/>
  <text class="sd-small" x="345" y="206">必要时提炼通用部分 + 跨项目验证</text>

  <line class="sd-divider" x1="510" y1="80" x2="510" y2="452"/>

  <text class="sd-label" x="554" y="110">Elasticsearch 超时示例</text>

  <rect x="554" y="140" width="348" height="66" rx="10" class="sd-node-pass"/>
  <text class="sd-on-fill" x="578" y="166">elasticsearch-timeout-troubleshooting</text>
  <text class="sd-on-fill" x="578" y="188" font-size="11">跨项目可复用的排错与验证方法</text>

  <rect x="554" y="244" width="348" height="66" rx="10" class="sd-node"/>
  <text class="sd-label" x="578" y="270">alarm-es-timeout</text>
  <text class="sd-small" x="578" y="292">告警服务专属查询链路与阈值</text>

  <rect x="554" y="348" width="348" height="66" rx="10" class="sd-node-risk"/>
  <text class="sd-label" x="578" y="374">es-timeout-20260917</text>
  <text class="sd-small" x="578" y="396">某次故障的日志、证据与临时推测</text>

  <path class="sd-arrow" d="M728 348V318" marker-end="url(#sdArrowLevel)"/>
  <path class="sd-arrow" d="M728 244V214" marker-end="url(#sdArrowLevel)"/>

  <line class="sd-divider" x1="32" y1="466" x2="928" y2="466"/>
  <text class="sd-small" x="32" y="488">升级不是改目录名，而是补齐证据，并分别确认状态与适用范围。</text>

  <defs>
    <marker id="sdArrowLevel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="var(--diagram-flow)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
</svg>
</div>

这三类不是固定的上下级。一次排错记录如果后来反复命中，可以整理成项目 Skill；只有在其他项目也验证有效、且没有丢掉原有边界时，才有必要再提炼成通用 Skill。有些项目知识会长期保持项目级，同样可以是稳定能力。

### 一个完整的实践样例

假设某次告警服务出现 Elasticsearch 查询超时。第一次处理时，只留下调查材料：

```text
skills/candidate/es-timeout-20260917/
├── notes.md              # 当时看过哪些日志
├── evidence/             # 慢查询与调用链证据
└── proposed-skill.md     # 暂时推测出的处理办法
```

这时它仍是临时记录。不能因为问题修好了，就直接宣布“所有 Elasticsearch 超时都这样处理”。

这里的 `candidate/` 和 `active/` 是仓库的管理约定；只有安装器或路由配置明确纳入的目录，才会被 Agent 当作可用 Skill 发现。

后来同类问题再次出现，旧记录确实帮 Agent 找到了根因，而且修复经过查询回放和压测验证。再把它整理成项目级 Skill：

```text
skills/active/domain/alarm-es-timeout/
├── SKILL.md
├── references/
│   ├── query-path.md
│   └── known-failures.md
└── scripts/
    └── replay-query.py
```

`SKILL.md` 不保存那次事故的全部日志，只留下以后还成立的部分：

```yaml
---
name: alarm-es-timeout
description: 告警服务出现 Elasticsearch 查询超时、慢查询或批量检索积压时使用
---

when:
  - 告警查询超时
  - 批量检索积压

procedure:
  - 确认超时发生在哪一段调用链
  - 对照已知失败模式
  - 使用历史查询样本回放

validation:
  - 回放结果一致
  - P95 延迟回到阈值内
  - 无新增错误日志
```

如果这套方法以后在别的服务、别的项目里也成立，再去掉告警系统专属内容，提炼成更通用的 `elasticsearch-timeout-troubleshooting`。

```text
一次事故记录
    ↓ 同类问题再次命中
项目级 alarm-es-timeout
    ↓ 跨项目验证仍然成立
通用 elasticsearch-timeout-troubleshooting
```

这就是我理解的“演进”：不是把临时文件换个名字塞进 `active/`，而是每升一层，都删掉偶然细节，补上验证证据，再扩大适用范围。

## 给新经验留一个试用盒

最简单的目录就够用：

```text
skills/
├── active/       # 常用、验证过
├── candidate/    # 新经验，先观察
└── archive/      # 不再默认使用
```

Agent 做完任务，发现一个看起来能复用的办法，可以先放到 `candidate/`。

这里的“候选”很重要。它表示：**这是一条待验证的经验，不是项目规则。**

![新经验先放进试用盒，验证过才进入常用工具架。](../assets/skill-lifecycle-illustrations/02-skill-candidate-box.png)

之后真的遇到类似问题，再让它按这份说明做一次。如果结果稳定、验证也过得去，才把它移到 `active/`。如果后来发现只是当时环境碰巧如此，或者有更好的办法，就先触发复核，确认不再需要后再归档或删除。

这比“每修一次就新建一个正式 Skill”慢一点，但工具箱会干净得多。

成熟度也不用搞得很复杂：

```text
草稿 → 候选 → 已验证 → 常用 → 已废弃
```

人看得懂，模型也看得懂。

## 这套仓库已经怎么做

[ai-skill-repository](https://github.com/Barry04/ai-skill-repository) 不是一个把提示词堆起来的目录。它现在的布局，已经有了几个生命周期里的关键位置：

```text
AGENTS.md                    # 入口地图：先选，再读
skill/<name>/SKILL.md        # 正式、可安装的 Skill
eval/<skill>/                # 回归用例和评分标准
experiments/skillopt/        # 本地实验产物，不安装
proposals/<skill>/           # 等人工审查的候选修改
scripts/skillopt/            # 评分与 proposal 工具
```

其中最有用的不是 `skill/`，而是 `proposals/` 和 `experiments/`。

它们把“我有一个优化想法”和“我要改正式 Skill”分开了。SkillOpt 的产物先进实验区和候选提案，不能直接覆盖正在使用的版本；人确认后，才合回正式 Skill。这个规则很笨，但笨得对。经验还没被验证，就别给它发正式工牌。

`eval/` 也很关键。仓库现在为部分 Skill 准备了确定性的回归检查，并在 CI 里对没有评测的 Skill 给出明确告警。它至少让“这个修改让 Skill 更好了”不只是一次主观判断。

另一个我不想丢掉的边界是：`evolving-skill` 发现可复用经验后，只能先提示用户，不能静默写进项目 Skill。自动产生建议可以，自动把建议升格成项目规则不行。

这套做法已经对应了一个很实际的链条：

```text
正式 Skill → 实验 → 候选提案 → 人工确认 → 回归检查 → 正式 Skill
```

它还不是完整的 Skill 生命周期，但至少有了“新东西先别直接进门”的门槛。

## 不是写得像说明书，就算有用

很多 Skill 只有这种内容：

```markdown
# Redis Skill

使用 Redis 时注意线程安全。
操作前先检查 key。
不要删除生产数据。
```

这几句话没有错，可读完还是不知道这次该怎么做。它更像提醒，不像能拿来工作的工具。

我觉得一个真正有用的 Skill，至少要说清七件小事：

1. 什么情况下拿它出来；
2. 开始前要知道什么；
3. 大致怎么做；
4. 哪些事不能做；
5. 有没有一个像样的例子；
6. 怎么确认做对了；
7. 这条经验从哪来的。

拿数据库迁移举例：

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

重点不在 YAML。重点是最后的 `validation`。

如果一份 Skill 没有“怎么验”，它往往只是某个人当时的偏好。反过来，一条能被测试、回滚或核对结果的经验，才有资格慢慢变成项目规则。性能阈值还要写清来源、负载和对照条件；“P95 回到阈值内”不能脱离这些条件单独成立。

Anthropic 特别提到过 Verification Skill：不是让 Agent “认真检查一下”，而是让它真的跑一遍注册、结算或命令行操作，再对关键状态做断言。菜谱写得再漂亮，也得尝一口。

## 重复的，要合并；相反的，要说清

Skill 变多后，最常见的不是缺内容，是同一件事被说了四遍：

```text
redis-debug
redis-troubleshooting
redis-connection-debug
redis-connection-problem
```

如果它们解决的都是连接失败，那最好合成一份 `redis-connection-troubleshooting`。旧文件留下跳转说明，或者直接进 archive。不要让 Agent 在四个近义词之间靠感觉选。

相反的情况更危险：

```text
Skill A：Redis 修改必须使用事务
Skill B：Redis 修改禁止事务
```

这时不能期待模型有“常识”。两份文字它都能读懂，两份文字它也都可能照做。

项目应该把覆盖关系写明白。最粗粒度的办法就够：

```text
通用规则 → 项目规则 → 模块规则 → 当前任务规则
```

在允许局部覆盖的配置层里，越靠右通常越具体，优先级越高；安全、合规和明确标记为不可覆盖的约束仍然优先。要是两条同层规则冲突，宁可停下来问人，也别悄悄选一条。

## 给工具箱做一张索引卡

一开始不用数据库。一个 `skills/index.yaml` 就行：

```yaml
skills:
  - name: api-design
    path: active/core/api-design
    status: stable
    priority: 90

  - name: alarm-debug
    path: active/domain/alarm-debug
    status: verified
    priority: 80

  - name: es-timeout
    path: candidate/es-timeout
    status: candidate
    priority: 30
```

这张索引卡不是把所有内容再抄一遍。它只负责告诉 Agent：有哪些工具、放在哪里、现在能不能优先用。`priority` 是索引器的自定义字段；如果路由器没有实现排序，不能假设 Agent 会自动理解这个数字。

目录也别全平铺：

```text
skills/
├── active/
│   ├── core/          # 编码、测试、Git、Review
│   ├── domain/        # 告警、集群、部署
│   └── technology/    # Redis、MySQL、Elasticsearch
└── candidate/
```

任务来了，先按范围缩小：它是哪个项目的问题？属于哪个领域？碰到什么技术？最后只读少数几个相关 Skill。

![SumSec Observer 记录索引，把重复经验移出常用工具柜。](../assets/skill-lifecycle-illustrations/03-skill-index-and-archive.png)

不是让 AI 在一百份说明书里大海捞针。

对这个仓库来说，下一步不该先做一个大而全的后台，而是补齐索引卡现在没有记录的几件事：某个 Skill 被实际选中过几次、最近一次什么时候用、使用后有没有通过验证、它和哪份 Skill 的触发词重叠。

有了这些数据，`proposals/` 才不只是“等人看的改动”；它可以更明确地回答：该升级、该合并，还是该关进 archive。

## 经验要有进门，也要有出门

我现在更愿意把 Project Harness 看成两部分。

一部分管“这次怎么做”：项目背景、代码边界、测试、风险。这是上一篇讲的事。

另一部分管“上次学到的东西还算不算数”：哪些候选经验被验证过，哪些该合并，哪些该退休。

这两件事接上，才不会出现一个有点荒诞的场面：AI 一边帮项目写新代码，一边持续往工具箱里塞来历不明的纸条。

可以把规则压成几句：

```text
产生，不等于进入常用库。
用过，不等于有效。
多次成功，并且有验证证据，才升级。
长期不用或被替代，先复核，再归档。
内容重复或互相打架，就合并或说清优先级。
```

不用一开始就做 Skill 数据库、评分模型或复杂后台。把 Candidate、验证证据、索引和定期清理做扎实，已经能挡住大部分腐化。

代码会老，经验也会老。区别只是代码老了会报错，过时的 Skill 往往还会用一种很笃定的语气，把 Agent 带到错路上。

我的 [ai-skill-repository](https://github.com/Barry04/ai-skill-repository) 已经有了地图、正式库、实验区、候选提案和回归检查。下一步要做的，是让它知道哪些经验真的被反复证明有用，哪些只是当时写得很像那么回事。
