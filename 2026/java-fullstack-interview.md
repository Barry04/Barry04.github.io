---
layout: default
title: Java 全栈面试突击手册
date: 2026-11-22
tag: Java / 面试
summary: 7 道常问的面试题，每题配一段口语回答和两轮追问。先练阿童木缓存优化、齐治运维助手和 Web / App 交付。
permalink: /java-fullstack-interview/
---

<style>
.interview-start {
  padding: 1rem 1.125rem;
  border: 1px solid currentColor;
  border-radius: .75rem;
  margin-block: 1.25rem 2rem;
}
.interview-start > p {
  margin: 0 0 .5rem;
}
.interview-start > ul {
  display: flex;
  flex-wrap: wrap;
  gap: .25rem 1rem;
  padding-left: 0;
  margin: 0;
  list-style: none;
}
.interview-start a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.interview-followup {
  margin-block: .65rem;
  padding-inline: .9rem;
  border: 1px solid currentColor;
  border-radius: .6rem;
}
.interview-followup summary {
  box-sizing: border-box;
  min-height: 44px;
  padding-block: .6rem;
  cursor: pointer;
  font-weight: 600;
}
.interview-followup summary:focus-visible,
.interview-start a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
.interview-followup > blockquote {
  margin-top: .25rem;
  margin-bottom: .85rem;
}
</style>

<section class="interview-start" aria-label="优先练习">
  <p><strong>只剩 30 分钟</strong> 先练前三题，每题讲 60–90 秒，再点开两轮追问。</p>
  <ul>
    <li><a href="#cache">阿童木缓存优化</a></li>
    <li><a href="#rag">齐治运维助手</a></li>
    <li><a href="#web-app">Web / App 交付</a></li>
  </ul>
</section>

后四题先用 30–45 秒讲清楚，听到追问再展开。项目业绩数字和页面交付范围按能确认的经历说。

## 1. 阿童木的接口为什么慢？你做了什么优化？ {#cache}

**主答**

> 阿童木是低代码平台，设计器经常要读实体和字段配置。我做过一条元数据查询的优化。那条请求只需要一个实体，但原来缓存是按应用存的，每次要把整个应用的元数据从 Redis 读出来，反序列化以后，再用列表遍历匹配。
>
> 我参与的改动有三个。第一，把缓存从应用粒度拆到实体粒度，只读当前请求需要的数据。第二，把可按键定位的查找改成 Map，避免每次扫一遍列表。第三，把热点实体放到 Guava 本地缓存里，减少频繁访问 Redis。最有价值的是第一步，因为它同时减少了传输量和反序列化开销，后面两步再降低查询和远程调用成本。

<details class="interview-followup" markdown="1">
<summary>第一轮追问｜怎么判断慢在缓存和 Java？「10 秒到 3 毫秒」是哪一段？</summary>

> 我会按同一条请求把数据库回源、Redis 读取、反序列化和业务匹配分开看。这里一个关键线索是，请求只要一个实体，代码却读取并处理了整份应用配置。复测时我会用同一个应用、同一个实体、同样的缓存命中条件，分别比对接口总耗时和各段耗时。热缓存和冷启动也要分开看，否则很容易把两种情况混在一起。

**数字怎么说**　过去的备考记录提到「10 秒到 3 毫秒」。能说清测量范围和条件再报这组数字。现场记不清，可以接一句：「我记得这条路径的改善很明显，具体耗时我需要回看当时的记录。能确定的是读取粒度从整个应用缩到了单个实体。」

</details>

<details class="interview-followup" markdown="1">
<summary>第二轮追问｜加了本地缓存，多台机器怎么知道配置更新了？</summary>

> 我们做过基于 MD5 的内容校验，用内容指纹判断缓存里的配置和权威数据是否一致。发现不一致就回源重建。这里我会重点看指纹从哪里来、什么时候更新，因为两个节点各自读到的版本可能不同。再设计这条链路的话，我会在配置提交配置时一并更新持久化版本，并让节点失效对应实体的缓存。回填时再检查版本，避免一个慢请求把旧配置写回来。

</details>

## 2. 齐治的运维助手，从提问到输出建议怎么走？ {#rag}

**主答**

> 这个助手是给堡垒机售后和现场运维用的。我负责检索、生成和告警场景接入。比如售后拿到一个告警码，系统先识别为告警问题，选对应的 Skill。这个 Skill 规定要收集哪些信息、搜哪个 Wiki 空间、用哪些只读工具。缺产品版本时先追问，因为同一个告警在不同版本里可能有不同处置方式。
>
> 信息齐了以后，就通过 Wiki MCP 搜索并取正文，必要时再读当前告警字段，对照文档的适用条件。输出分成排查项、处理建议和验证方式，程序会核对引用是否来自本轮检索。资料不足时，会提示还缺什么信息。助手保留只读权限，实际变更继续走原来的业务流程。

<details class="interview-followup" markdown="1">
<summary>第一轮追问｜你怎么避免搜到旧版本？为什么要在检索时处理？</summary>

> 我们在搜索时就传入产品空间、标签和版本等条件。这样模型拿到的候选资料范围更准。举个例子，同一个告警码的新旧文档标题可能很像，两篇看起来都相关。先按版本缩小范围，可以少让模型在冲突的资料里猜。关键版本缺失就追问，版本对上了但资料仍不足，就告诉用户下一步需要补什么。

</details>

<details class="interview-followup" markdown="1">
<summary>第二轮追问｜链接校验通过，怎么证明这条建议真的有依据？</summary>

> 我们上线的校验能证明链接来自本轮检索。建议是否被文档支持，还要看具体段落和适用条件。比如文档只说某个版本可以改一项配置，模型即使引用对了页面，也可能漏掉版本限制。如果继续做，我会让关键步骤带上对应段落，再用真实历史问题抽样评估三件事：有没有找到正确资料，建议有没有被原文支持，该追问或拒答时有没有做到。

</details>

## 3. 你实际做过哪些 Web 或 App 功能？负责到哪一步？ {#web-app}

**主答**

> 我在全栈交付里做得最多的是 Java 后端和 Web 联调。拿阿童木设计器来说，我参与过实体建模、实体关系图和 SQL 反向建模。以反向建模为例，我参与的是把数据库里的表和字段信息转换成平台能识别的模型，让设计器可以继续使用。
>
> 我比较熟悉的是沿着页面、接口和后端数据一路查问题。能读组件、跟请求，也能处理简单页面调整。说到 App，我会按具体项目讲我参与的是页面、接口还是联调。

如果你的 App 经历主要在接口侧，最后一句可以直接换成「**移动端这块，我能举出来的交付主要在 Java 接口和联调侧。**」简历里能坐实的是设计器后端和系统对接，具体页面改动用你亲手做过的例子补。

<details class="interview-followup" markdown="1">
<summary>第一轮追问｜设计器页面显示不对，你怎么判断是前端还是后端？</summary>

> 我先在浏览器 Network 面板看页面实际发出的参数和接口返回。比如用户选了某张表，我先确认传的是不是那张表，再看返回的字段列表里有没有缺项。参数就错了，我往组件的取值和请求组装查。参数对、返回缺了字段，我沿后端日志查数据库元数据怎么读、怎么转换。返回里字段齐全但页面少了，就查前端的数据映射和渲染。这样每看一步都能缩小范围。

</details>

<details class="interview-followup" markdown="1">
<summary>第二轮追问｜现在让你用 Vue 和 TypeScript 做一个告警列表，你怎么落地？</summary>

> 我会先把接口定清楚，包括告警级别、状态、时间范围、分页和排序，前端用 TypeScript 给请求参数和返回值定类型。页面把筛选、列表和详情分开，补齐加载中、无结果、失败和重试。还有一个细节，用户快速切换筛选条件时，旧请求可能比新请求晚回来。我会取消旧请求，或者给请求编号，只让最新一次的结果更新页面。最后和测试一起用真实接口验分页和异常返回。

</details>

## 4. Spring 事务为什么没回滚？ {#spring}

**主答**

> 我先看事务有没有开启，再看异常有没有触发回滚。默认代理模式下，同一个类里直接调用带 `@Transactional` 的方法，内层方法的事务配置可能没经过代理。异常也可能在方法内部被捕获，事务拦截器看见的是正常返回。还要看异常类型，默认运行时异常和 `Error` 会触发回滚，受检异常要看配置。如果中间切到了异步线程，新线程里的数据库操作要检查自己的事务边界。

<details class="interview-followup" markdown="1">
<summary>第一轮追问｜外层已经把异常捕获了，为什么提交时还报错？</summary>

> 如果内外两个方法都经过了事务代理，传播方式都是 `REQUIRED`，它们可能共用一个数据库事务。内层异常触发回滚规则后，把这个事务标成只能回滚。外层即使捕获异常继续执行，提交时仍可能收到 `UnexpectedRollbackException`。 [Spring 事务传播](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)

</details>

<details class="interview-followup" markdown="1">
<summary>第二轮追问｜那把内层改成 <code>REQUIRES_NEW</code> 呢？</summary>

> 它会开启独立事务。外层如果已经锁住一行，内层又来更新同一行，内层可能一直等到锁超时。外层此时还在等内层返回，而且两个事务会占用额外连接。我会先看业务究竟要一起提交，还是确实需要独立提交，再决定怎么调整事务范围和写入顺序。 [Spring 事务传播](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)

</details>

## 5. 流量突然上来，接口大量超时，你先查什么？ {#timeouts}

**主答**

> 我先确认影响范围，看看是单个接口、某几个实例，还是多个服务一起变慢。然后拿慢请求拆耗时，看哪一段先涨，是应用线程池排队、等数据库连接、SQL 执行，还是下游调用。也会对照同一时间的发布、流量和 GC 暂停。确认瓶颈后再止损，比如数据库已经顶住了，就先限制入口并发或降级非核心查询，让核心业务能继续跑。

<details class="interview-followup" markdown="1">
<summary>第一轮追问｜线程池队列满了，多加线程不就行了？</summary>

> 要看线程在忙什么。如果它们都在等数据库连接，多加线程只会让更多请求一起等。我会看线程栈、队列等待时间和下游连接池占用，把并发控制在下游能承受的范围内。入口也要有明确的超时和拒绝策略，让调用方知道请求是否被接受。

</details>

<details class="interview-followup" markdown="1">
<summary>第二轮追问｜定位到 MySQL 了，怎么继续查？</summary>

> 我先区分是连接池拿不到连接、SQL 自己执行慢，还是在等锁。SQL 慢就拿实际参数去看执行计划，关注索引、扫描行数和排序。等锁就找持锁事务和它为什么迟迟没提交。改完用接近的负载复测，既看接口耗时，也看数据库压力有没有降下来。

</details>

## 6. 多个实例同时改一张表，你怎么防冲突？ {#redis-lock}

**主答**

> 阿童木的设计器会触发物理表结构变更，比如给实体加字段。多个实例同时对同一张表执行变更，可能产生冲突，我们用 Redis 分布式锁控制这类操作的并发。按表控制锁粒度的话，同一张表需要排队，不同表可以继续处理。锁要带过期时间和持有者标识，释放时原子地核对标识，再释放自己那把锁。 [Redis 分布式锁文档](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)

<details class="interview-followup" markdown="1">
<summary>第一轮追问｜锁到期了，原请求还没执行完怎么办？</summary>

> 比较标识只能避免旧请求误删新锁。旧请求可能还在改表，续期也只能减少中途到期的机会。如果这个场景要严格保证串行，我会让变更走受控的任务入口，保存每张表的执行状态。遇到执行结果不明，先确认前一次操作有没有完成，再允许后续任务接手。

</details>

<details class="interview-followup" markdown="1">
<summary>第二轮追问｜数据库已经执行成功，但应用超时了，怎么重试？</summary>

> 重试前先查实际表结构。如果目标列的名称、类型等定义都符合预期，就可以把任务补记为成功。列存在但定义不同，要进入冲突处理。确认数据库没有执行成功时，再按任务状态和重试规则重跑。这样就算消息重复投递，也能按同一个变更任务来处理。

</details>

## 7. AI 生成的代码，你怎么判断能不能合？ {#ai-review}

**主答**

> 我用过 Cursor、Codex 和 Claude Code。我的习惯是先限定改动范围和验收条件。生成以后先看实际改了哪些文件，再按业务路径检查权限、事务、异常处理和对旧调用方的影响。测试方面，我会看断言到底验证了什么。比如测试写着“保存失败”，就要检查失败后数据库里的状态，光检查接口返回错误码还不够。最后由人审查和决定合入。

<details class="interview-followup" markdown="1">
<summary>第一轮追问｜能举一个你怎么审的例子吗？</summary>

> 拿阿童木的多库适配做例子。如果把分页改动交给 AI，我会先检查生成的 SQL 有没有把 MySQL 的 `LIMIT` 写进公共层。然后拿同一组分页条件测各个支持的数据库，对比排序、总数、最后一页和空结果。这个例子里，测试的价值是验证调用方看到的结果一致。

这一段是用你做过的多库适配来答设计题。如果面试官明确问「你上一次用 AI 做的改动」，换成那次真实改动，讲清 **AI 写了什么、你改了什么、哪个测试证明改对了**。

</details>

<details class="interview-followup" markdown="1">
<summary>第二轮追问｜如果让整个团队用，你会怎么管？</summary>

> 我会先挑一个重复度高、验收标准清楚的场景，比如补接口测试。把允许修改的范围、构建命令和必须覆盖的边界条件放到仓库里，沿用人工审查和自动测试。试行一段时间后看从提交到合入的耗时、审查返工和缺陷。如果生成快了但审查返工变多，就收窄使用范围，先把规则和验收做实。

</details>
