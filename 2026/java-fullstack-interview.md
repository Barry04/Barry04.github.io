---
layout: default
title: Java 全栈面试突击手册
date: 2026-11-22
tag: Java / 面试
summary: 按招聘职责练 7 组场景和 14 轮追问，覆盖 Java 核心业务、Web 与 App 联调、系统稳定性和 AI 上线。
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

专项补练：[Java 基础](#java-basics) · [Spring 与 MyBatis](#spring-basics) · [JD 场景题](#jd-scenarios)。时间紧先练岗位场景里的工单重试、告警慢查询和缓存压测。

## 按岗位职责模拟技术面 {#jd-scenarios}

以下是根据招聘截图设计的模拟题。工单和 App 是练习场景，阿童木与齐治是简历中的项目。每题先独立回答，再展开两轮追问。

### 1. 核心 Java 模块与 Spring 事务

对应职责 1、2 和基本要求 3。用阿童木设计器的保存接口作类比，工单是练习场景。

**面试官问：App 显示提交超时，用户又点一次。后台其实已经创建工单，但通知没发出去。你怎么改？**

<details class="interview-followup" markdown="1">
<summary>参考回答与两轮追问</summary>

> 我先和产品约定，同一次提交无论重试几次都返回同一张工单。客户端在第一次提交时生成请求号，重试沿用它。Java 服务按用户和请求号建唯一约束，把工单与待通知记录放进同一个数据库事务。后台发送通知，失败可重试。页面超时后可以用请求号查结果。

**追问一　两个请求同时到，先查再插能挡住吗？**

> 两个请求可能同时查到空。最终靠数据库唯一约束裁决。失败的一方退出失败事务，在可读到已提交数据的新事务里查原结果，还要核对两次提交的内容是否一致。

**追问二　给发送方法加 @Async 和 @Transactional 就行吗？**

> 异步任务在另一个线程里跑，外层事务仍可能回滚，进程重启也可能丢掉待发任务。我会在同一个 Spring 事务里持久化待发记录，发送端带稳定事件号，让消费方也能识别重投。

</details>

### 2. MyBatis、MySQL 慢查询

对应职责 3、基本要求 3。结合告警模块，演示从页面筛选到 SQL 的定位。

**面试官问：告警列表第一页很快，选定租户和状态后按时间翻页就慢。你会拿哪条 SQL 给 DBA 看？**

<details class="interview-followup" markdown="1">
<summary>参考回答与两轮追问</summary>

> 我会拿 MyBatis 实际生成的 SQL、绑定参数和耗时，分开量列表查询与总数查询。假设条件是 tenant_id、status 都等值，按 created_at、id 倒序取 50 条，我会评估 (tenant_id, status, created_at, id) 索引，再用代表性大租户检查执行计划、扫描行数和排序。

**追问一　用户切到「全部状态」，原索引还合适吗？**

> status 夹在租户和时间之间，不同状态的数据各自按时间排列。跨状态排序时，数据库可能需要额外排序。我会按查询频率和计划评估另一条以租户、时间、ID 排列的索引，也要算新增索引的写入成本。

**追问二　如果翻页时又进了新告警，怎么避免同一条出现两次？**

> 用时间和唯一 ID 共同确定顺序，下一页带上一页末条的两个值，查询严格排在它之后的数据。若产品要求导出时看到固定集合，还要约定快照时间和更新规则。

</details>

### 3. 高并发、JVM 与 Redis

对应职责 3、基本要求 3、4。拆缓存来自简历，压测现象是模拟追问。

**面试官问：阿童木拆了缓存后，假设压测时平均耗时下降，最慢的一批请求反而更慢。你先看什么？**

<details class="interview-followup" markdown="1">
<summary>参考回答与两轮追问</summary>

> 我会取同一时段的快慢请求对照，记录本地缓存是否命中、每个请求访问 Redis 的次数、回源 SQL、线程池排队和 GC 暂停。拆小以后，读单个实体可能更快，但读整批实体可能从一次远程访问变成几十次。先验证是哪一类请求把尾部耗时拉高。

**追问一　Redis 慢日志很干净，为什么接口里 Redis 调用仍然慢？**

> 慢日志主要反映服务端执行命令的时间。客户端等连接、网络传输、回包大小和多次往返都要另外量。如果是循环读取多个键，我会评估批量读取，再用相同负载复测。

**追问二　同一时刻 JVM 堆也上涨，你会直接加堆吗？**

> 我先看 GC 后存活量和缓存条目数。如果只是并发请求造成短期分配，就看分配量和暂停时间。如果回收后占用持续上涨，就查本地缓存是否有容量上限、哪些对象被长期引用。用同一组请求复测尾部耗时和内存曲线。

</details>

### 4. Vue、TypeScript 与移动端交付

对应职责 2、4 和基本要求 2。先讲亲手做过的接口或页面，再回答这个设计场景。

**面试官问：Web 和 App 共用告警列表。快速切换筛选后页面显示旧数据，弱网回到 App 又出现重复记录。你怎么联调？**

<details class="interview-followup" markdown="1">
<summary>参考回答与两轮追问</summary>

> 我会给每次请求记下筛选条件、游标、请求号和响应顺序。切换条件时重置列表和游标，用请求序号让 Vue 只接收最新筛选的结果。App 恢复前台时区分刷新和加载下一页，同一次翻页只发一次，按告警 ID 合并结果。前后端共同约定分页顺序、空结果和登录失效的处理。

**追问一　TypeScript 已经声明返回值类型，上线为什么还能出现空字段报错？**

> 类型声明约束开发时的代码。旧 App、旧服务或异常响应都可能返回不同结构。我会在接口边界校验关键字段，对允许为空的值明确展示方式，并拿旧版本响应跑兼容测试。

**追问二　你交给测试的第一个验收用例是什么？**

> 我会让 A 筛选先发后回，B 筛选后发先回。两次都成功时，最终页面必须始终显示 B，加载状态也应属于 B。再测 App 请求还在途中切后台并恢复，检查列表去重和游标位置。

</details>

### 5. 微服务治理与灾备

对应职责 3、基本要求 4。考查异步边界、线程池隔离、消息积压和故障恢复。

**面试官问：通知服务越来越慢，最后连工单保存都超时了。怎么保住核心业务？**

<details class="interview-followup" markdown="1">
<summary>参考回答与两轮追问</summary>

> 我会先确认是哪种资源被共用，比如保存请求同步等待通知，把 Web 线程或数据库连接占满了。如果业务允许通知稍后送达，保存与待发记录一起提交，发送用独立且有界的资源池。依赖持续失败时暂停或降低发送速率，页面区分已保存和通知处理中。

**追问一　队列已经堆积，恢复后能一次全部重放吗？**

> 先看最老消息等待时长、积压量和下游能承受的速率，分批重放。失败消息有限重试并单独处理，用业务事件号对账，避免已送达的通知再发一次。

**追问二　如果这次是主库故障，怎么证明灾备能用？**

> 先和业务定可接受的停机时间和数据损失，再演练隔离旧主、检查复制进度、切换连接和恢复消费。演练后核对已确认工单与待发记录，记录实际恢复时间与缺失范围。

</details>

### 6. RAG、Agent 与大模型 API 上线

对应职责 5、基本要求 5 和优先条件 1。可先讲现有 Wiki 检索和引用校验，再明确哪些属于新设计。

**面试官问：把齐治运维助手接进 App。用户问错了版本、模型响应慢、页面中途断线，整条链路怎么办？**

<details class="interview-followup" markdown="1">
<summary>参考回答与两轮追问</summary>

> 已有项目里，我们先补产品版本，再按范围查 Wiki，生成后校验引用。若接 App，我会让 Java 后端负责身份校验、知识访问范围和模型密钥；为一次问答生成任务号，前端展示生成中、完成、失败三种状态。超时可以先给用户已获准访问的相关资料，恢复连接时按任务号查询。

**追问一　模型引用了正确的页面，却给出了错误操作，怎么评估？**

> 我会拿历史问题标出适用版本、正确文档段落和可接受的建议。分别查是否搜对、建议有没有原文支持、证据不足时是否追问。单看链接是否存在会漏掉这类错误。

**追问二　怎么验证上线效果，决定能不能扩大用户范围？**

> 先小范围使用，对比人工抽检正确率、该拒答时的表现、首次响应时间和单次成本。记录问题类型和模型、知识版本，便于回溯。权限异常或高风险错误要能迅速关掉生成入口，保留人工查询。

</details>

### 7. AI 编程工具与团队代码质量

对应基本要求 6 和优先条件 3。以代码评审设计题回答，可以接一条本人审过的真实改动。

**面试官问：AI 把按租户查询改成了公共缓存，测试全绿。作为评审人，你凭什么拒绝这次合并？**

<details class="interview-followup" markdown="1">
<summary>参考回答与两轮追问</summary>

> 我会看缓存键是否覆盖原查询的权限范围、筛选条件和数据版本。然后准备两个租户，各有相同业务编号但返回内容不同的记录，让 A 请求先把缓存预热，再由 B 调用。如果 B 拿到 A 的结果，我就能指出具体缺陷和能重复验证的测试。

**追问一　AI 给出修复，在键里加租户号，够了吗？**

> 还要看同租户里不同角色是否能看同一批数据。缓存共享的边界要和接口权限一致。角色变更后的失效策略、未命中回源时的鉴权也要一起检查。

**追问二　怎样把这条经验落到团队流程？**

> 把跨租户和角色切换用例加入公共接口测试，让持续集成每次跑。审查清单增加一项：缓存键覆盖了哪些权限和查询条件。后续看类似缺陷和返工次数是否下降，再决定推广范围。

</details>

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

## Java 基础补练 {#java-basics}

<details class="interview-followup" markdown="1">
<summary>HashMap 为什么查得快？当缓存键有什么坑？</summary>

> 它按 key 的哈希值定位到桶，桶里有多个元素时，再用 equals 判断是不是同一个 key。哈希分布均匀时，查找通常接近常数时间。用自定义对象当 key，equals 和 hashCode 要一起实现，而且参与计算的字段在放进去之后要保持不变。否则对象还在 Map 里，却可能按原来的方式查不到。多线程共同修改时，我会按场景用 ConcurrentHashMap 或在业务层同步。需要原子的复合更新，可以考虑 compute 或 putIfAbsent。

[Java HashMap 文档](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)

</details>

<details class="interview-followup" markdown="1">
<summary>volatile、synchronized 和 AtomicInteger 怎么选？</summary>

> volatile 适合跨线程可见的状态，比如一个线程发出停止信号，其他线程能读到。像 count++ 这种操作要先读、再加、再写，多个线程仍然可能覆盖彼此的结果。只更新一个计数器，我会用 AtomicInteger 的原子方法。几个字段要一起更新、共同满足一个业务规则，我会用锁把整段操作保护起来。

</details>

<details class="interview-followup" markdown="1">
<summary>线程池的核心线程、队列和最大线程怎么配？</summary>

> 以 ThreadPoolExecutor 为例，通常先尝试创建核心线程，再入队。队列放不下，才尝试扩到最大线程数。仍然放不下就触发拒绝策略。队列太大，压力会先表现为排队时间变长，所以我会用下游容量和业务允许的等待时间来定线程数和队列长度。压测时看等待时间、拒绝次数和数据库连接占用，判断调大线程数能不能真正提高吞吐。

[Java 线程池文档](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html)

</details>

<details class="interview-followup" markdown="1">
<summary>ThreadLocal 在线程池里为什么要清理？</summary>

> ThreadLocal 的值跟着线程。线程池会把同一个线程交给下一个请求使用，旧请求如果没有把上下文清掉，下一个请求就可能读到旧的用户信息或请求标识。我会在入口统一设置，在 finally 里 remove。如果工作切到了异步线程，就显式传递必要的上下文，并在那边独立清理。

</details>

## Spring 与 MyBatis 补练 {#spring-basics}

<details class="interview-followup" markdown="1">
<summary>Spring 的 IoC 是什么？单例 Bean 能存请求数据吗？</summary>

> IoC 在日常开发里就是把对象创建和依赖组装交给 Spring 容器。比如 Service 依赖 Mapper，我倾向写在构造器里，这样启动和测试时都能明确看到它依赖什么。默认单例作用域下，同一个容器里的多个请求通常会共享这个实例，所以我会用方法参数或局部变量承载每次请求的数据。缓存之类确实需要共享的状态，再单独设计线程安全。

[Spring Bean 作用域](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html)

</details>

<details class="interview-followup" markdown="1">
<summary>AOP 怎么拦截方法？为什么同类调用容易踩坑？</summary>

> Spring AOP 通常通过代理在目标方法前后加逻辑，像事务、日志都可以这么做。JDK 动态代理围绕接口，CGLIB 可以通过生成目标类的子类做代理。外部从容器拿代理来调用，拦截才有机会执行。目标对象内部直接调用自己的方法，通常会绕过代理。遇到这种情况，我会先看职责能否拆到独立 Service，用跨 Bean 调用把事务边界写清楚。

[Spring AOP 代理机制](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)

</details>

<details class="interview-followup" markdown="1">
<summary>Spring Boot 自动配置是怎么回事？数据源没配起来怎么查？</summary>

> Spring Boot 根据依赖、配置项和容器里已有的 Bean，决定哪些默认配置生效。比如自动配置遇到用户自己提供的数据源时，可以让用户的配置接管。排查数据源没起来，我会先看驱动依赖和当前启用的配置文件，再看启动日志里的条件报告，确认是某个条件不满足，还是业务配置覆盖了默认配置。

[Spring Boot 自动配置](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)

</details>

<details class="interview-followup" markdown="1">
<summary>MyBatis 的 <code>#{}</code> 和 <code>${}</code> 有什么区别？动态排序怎么写？</summary>

> `#{}` 会把值作为参数绑定到预编译语句，可以用于 id、状态、日期这样的查询值。`${}` 是直接做文本替换。动态排序需要选列名时，我会让前端只传有限的业务选项，在服务端映射到预先定义好的固定列名和方向，再生成排序语句。

[MyBatis 参数映射文档](https://mybatis.org/mybatis-3/sqlmap-xml.html#Parameters)

</details>

## 后端基础场景速查 {#backend-reference}

<details class="interview-followup" markdown="1">
<summary>告警列表翻到几千页就慢，怎么排查和优化？</summary>

> 我先拿实际筛选条件查清慢的是总数统计，还是列表查询。列表查询看执行计划里的选用索引、扫描行数和排序。若是深度 OFFSET 跳过了大量数据，而且产品主要需要顺序翻页，我会用告警时间和 ID 做稳定排序，把上一页最后一条记录作为下一页的起点。如果还要任意跳页，就先确认产品需求，再决定保留哪种分页方式。改完会用生产量级的数据验证耗时和翻页结果。

[MySQL 执行计划](https://dev.mysql.com/doc/refman/8.4/en/explain.html)

</details>

<details class="interview-followup" markdown="1">
<summary>一个热点缓存过期，大量请求同时打到数据库，怎么处理？</summary>

> 我会对同一个 key 合并回源，让少数请求负责重建缓存，并给数据库回源设并发上限。配置场景如果接受短时间旧值，可以在重建时先返回旧值。若是大量不同 key 同时到期，我还会给过期时间加随机偏移。恢复后看缓存命中率、回源次数和数据库压力，确认流量确实挡住了。

</details>

<details class="interview-followup" markdown="1">
<summary>MQ 开始积压，怎么处理？扩消费者会不会重复处理？</summary>

> 我先比较生产速度、消费速度和最老消息等了多久，再看消费者是跑得慢、被下游拖住，还是反复重试。下游有余量时可以提高消费并发，坏消息反复失败时按有限重试和死信流程处理。消费端用稳定业务键去重，把去重和业务更新放在同一个本地事务里，提交后再确认。这样即使消费者处理完后崩溃，消息重新投递，业务也能识别这件事已经做过了。

[RabbitMQ 消费确认与生产确认](https://www.rabbitmq.com/docs/confirms)

</details>

<details class="interview-followup" markdown="1">
<summary>微服务调用下游超时，重试几次合适？</summary>

> 我先从整条请求允许的时间往下分，给下游调用设明确超时。重试要在剩余时间内，只处理适合重试的短暂错误，而且写操作得先有幂等保障。比如创建告警通知时，第一次超时可能已经写成功了，重试需要使用同一个业务请求标识，或者先查执行结果。下游持续失败时可以熔断，给主流程保留资源，并让页面知道这一步暂时不可用。

</details>

<details class="interview-followup" markdown="1">
<summary>Java 进程内存一直涨，怎么判断是正常缓存还是泄漏？</summary>

> 我先确认涨的是 JVM 堆还是整个进程内存，再看流量增加后，GC 回收完的堆能不能降回原来的区间。要是缓存上涨，我会看缓存条目数、大小上限和淘汰情况。如果回收后的占用还在持续抬升，就抓对象统计，必要时挑合适的窗口获取堆转储，查看哪些对象一直被引用。找到持有者以后再修，常见方向是给缓存设边界，或清理本应随请求释放的引用。

</details>

<details class="interview-followup" markdown="1">
<summary>数据库主库故障，切换前后你关心什么？</summary>

> 我先问业务能接受多久恢复、最多能丢多少数据。切换前看备库复制进度，避免旧主恢复后和新主同时接受写入。切换后验证核心读写、连接池恢复和数据一致性，再处理故障时结果不明确的请求。备份也要定期实际做恢复演练，记录多久能恢复到可用状态，以及能恢复到哪个时间点。

</details>
