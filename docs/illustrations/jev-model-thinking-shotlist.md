# 《JEV：让决策从对话里走出来》配图设计稿

文章：`2026/jev-model-thinking.md`

## 配图策略

文章里已经有两张内联 SVG（第二节「三代对比表」、第四节「三个第一次」），它们承担的是**结构化对比**。
PNG 配图不重复这件事，只接管 SVG 讲不好的部分：**隐喻、状态、荒诞感、单一记忆点**。

每张图只讲一个结构，主体占 40%–60%，留白 ≥ 35%，中文手写批注 5–8 处。

### 通例：所有生图调用都必须参考的模板图

```
C:\Users\12897\.workbuddy-ai\skills\sumsec-illustrations\assets\sumsec-observer-target.png
```

它负责锁定 SumSec Observer 的人物一致性（深墨凌乱短发、细框眼镜、浅冷灰高领连帽夹克、
暗青蓝内衬与斜挎包带、灰褐工具包、黑色夹板、胸前小工作证式 SummerSec 铭牌、双 S 戒指、
清醒低情绪的工作中气质、干净下颌无胡须）。若工具支持参考图输入，优先一并传入；
若不支持，下面的文字 prompt 已包含等价约束。

### 通用前缀（每张图都要带，下面正文里用 `{VISUAL_DNA}` 代指）

```text
Generate one standalone 16:9 horizontal Chinese article illustration for a sumsec.me style technical blog.

Visual DNA:
Pure white background. Clean minimalist deep charcoal contour line art, not pixelated, with restrained low-saturation character color washes. Use fewer lines: clean outline, low-density details, minimal hair strokes, no dense sketch hatching. Lots of empty white space. Sparse cyan-blue and red-orange handwritten Chinese annotations. Clean restrained engineering sketch feeling, with dry humor. No gradients, no shadows, no paper texture, no complex background, no commercial vector style, no PPT infographic look, no cute mascot poster, no children's illustration, no realistic UI, no cyberpunk poster, no black-and-white pixel art, no 8-bit style, no dithered bitmap look, no low-resolution jagged edges.

Recurring SumSec personal avatar required:
SumSec Observer, an original personal avatar for sumsec.me: a young adult security researcher and system observer, late 20s to early 30s. Preserve the reference character identity strictly: quiet sober eyes, low-key melancholic working expression, slightly tired from work but not dramatic or depressed, focused, intelligent, restrained, no cheerful smile, no sweet smile, no mascot expression. Smooth clean-shaven jawline, no facial hair, no mustache, no beard, no stubble, no chin shadow, no age lines. Dark ink / dark brown-black short hair, slightly messy side-swept bangs partly covering the forehead and one eyebrow, thin-frame glasses. Natural upright posture with relaxed shoulders; slight forward lean is allowed only when inspecting something, but do not make the character hunched, round-backed, slumped, or neck-forward. Young adult proportions, not chibi.

Do not redesign the outfit or equipment. Use a pale cool-gray high-collar lightweight hooded jacket, dark cyan-blue inner lining and drawstrings, black inner shirt, dark pants, dark cyan-blue crossbody strap across the chest, muted gray-brown side crossbody tool bag filled with log papers, notes, small clips, tiny cyan cables, red-orange evidence tags, black clipboard/tablet, small work-ID / evidence badge labeled "SummerSec", exactly two subtle silver rings with cyan-blue SummerSec S emblems, and a small black tool chip with cyan S logo used only for recording and analysis. Cyan-blue identifiers must be small and restrained, not large logos. The character must perform the core engineering action, not decorate the scene.

Allowed simple hand poses only: adjusting glasses, holding a small evidence note, holding a black clipboard/tablet, writing on the clipboard, placing one label, or pointing at a log. Avoid cable-plugging hands, twisted wrists, complex interlocked fingers, extra fingers, and impossible hand anatomy. SummerSec badge may also appear as a tiny simplified cyan-blue water-S tool chip or evidence seal only when structurally useful; do not pile up extra S symbols. Do not make the SummerSec nameplate a big title, big logo, advertising badge, or central subject. Not cyberpunk, not hacker villain, not gloomy collapse, not cheerful mascot, not middle-aged, not old, not bearded, not rugged detective, not overly cute, not anime idol, not superhero, not a children's cartoon, not an external IP character, not flat commercial full-color cartoon.
```

### 通用后缀（每张图都要带，下面正文里用 `{CONSTRAINTS}` 代指）

```text
Constraints:
One image explains only one core structure. Keep the main subject around 40%-60% of the canvas. Preserve at least 35% blank white space. Use at most 5-8 short handwritten Chinese labels. Do not write a title in the top-left corner. Do not write the structure type on the image. Do not make it a formal diagram, course slide, dense explainer, brand mascot poster, security vendor key visual, cyberpunk UI scene, black-and-white pixel avatar, 8-bit sprite, dithered bitmap, or low-resolution pixel-art image. Do not copy prior examples or reuse known case compositions unless explicitly requested; invent a fresh engineering metaphor for this specific article. It should be clear but not instructional, interesting but not childish, dryly funny but clean.
```

---

## 01 · 决策的状态，不是对话的状态

**放置**：第一节末尾，「用一句话概括：**它管的是决策的状态，不是对话的状态。**」之后。

**核心意思**：模型每轮重新读一遍上下文，走过的路不留痕迹；决策运行时把走过的路钉下来。

**结构类型**：前后对比

**隐喻**：左边是一块被反复擦平的沙地，几串脚印一圈圈绕回原点，一个橡皮擦挂在旁边；
右边是同一片沙地，SumSec Observer 正把编号路桩一根根钉进土里，桩间拉着细青蓝线，
身后已经连成一条能看清的折线。红橙标签只钉在"回退"那一根倒插的桩上。

**画面**：SumSec Observer 站在右半边，一手扶眼镜，一手握着一根木桩往下按，
黑色夹板夹在腋下。SummerSec 铭牌在胸前斜挎带旁，小到不抢戏。
左半边留白，只画绕圈的淡脚印和一个孤零零的橡皮擦。

**标注词**：`每轮重读` / `擦掉了` / `走到哪了` / `已验证` / `回退`

**Suggested elements**：沙地 / 绕圈脚印 / 编号路桩 / 青蓝细线 / 倒插的红橙桩

```
{VISUAL_DNA}

Theme:
同一个任务，模型"每轮重新读一遍上下文" vs 决策运行时"把走过的路径钉下来"。

Structure type:
前后对比

Core idea:
对话状态会随会话消失，决策状态不会。左边是反复被擦平、原地绕圈的沙地；右边是同一片沙地上，走过的每一步都被钉成带编号的路桩，连成一条可回看的折线。

Composition:
画面左半边：一片空白沙地，几串淡脚印绕成两三个圈又回到原点，旁边孤零零挂着一个橡皮擦。大量留白。画面右半边：SumSec Observer 站在沙地里，一手扶眼镜，一手把一根带编号的木桩往下按进土里；黑色夹板夹在腋下，灰褐工具包挂在身侧。已经钉好的四根桩之间拉着细青蓝线，连成一条能看清的折线；其中一根桩倒插着，上面挂一枚红橙标签。胸前斜挎带旁别着小小的 SummerSec 工作证铭牌。橙色细箭头从左边绕圈脚印指向右边第一根桩。

Suggested elements:
沙地 / 绕圈脚印 / 橡皮擦 / 编号路桩 / 青蓝连线 / 倒插的红橙桩

Chinese handwritten labels:
每轮重读 / 擦掉了 / 走到哪了 / 已验证 / 回退

Color use:
Deep charcoal for main line art. SumSec Observer must not be pure black-and-white: pale cool gray high-collar hooded jacket, dark cyan-blue inner lining and crossbody strap, very light warm skin tone for face and hands, dark ink hair, muted gray-brown tool bag, black clipboard, tiny red-orange evidence tag on the reversed stake. Cyan-blue thin lines connect the stakes to show the recorded path. Red-orange only on the reversed stake label. Keep colors sparse and translucent, like light marker or watercolor washes.

{CONSTRAINTS}
```

---

## 02 · 路径完整，结论是错的

**放置**：第三节末尾，「它以为『没触发熔断』等于『系统健康』」那段之后。
**这是全文最强的认知锚点，优先保证这张图。**

**核心意思**：不是幻觉——每一步都有真实证据，错的是某一个环节把"没报警"默认成了"健康"。

**结构类型**：证据栈

**隐喻**：一串搭在浅沟上的踏板桥，每块踏板都是一张盖了章的证据纸，一块接一块排得整整齐齐，
一直铺到对岸。SumSec Observer 站在桥中间，蹲下用放大镜看其中一块踏板——
那张纸上写的其实是"没报警"，却被盖上了一枚写着"健康"的青蓝印章。
桥的尽头落在对岸一处明显不长东西的干地上。

**画面**：踏板桥从画面左下延伸到右上，占据主体。SumSec Observer 蹲在其中一块踏板上，
一手拿放大镜，一手扶地。红橙只用来标那枚盖错的章和尽头的干地。
其余大量留白，不要画水流、不要画风景。

**标注词**：`都有证据` / `没报警` / `当成健康` / `这一步没错` / `结论错了`

**Suggested elements**：踏板桥 / 盖章证据纸 / 放大镜 / 盖错的青蓝章 / 尽头的干地

```
{VISUAL_DNA}

Theme:
决策运行时的失败不是"幻觉"：每个环节都有真实证据，错的是某一环把"没触发熔断"默认等同于"系统健康"，于是整条链看着完整，结论是错的。

Structure type:
证据栈

Core idea:
一条盖满章的证据踏板桥，每一步都合规、都可解释，但其中一个默认成立的假设是错的；桥铺得很完整，却把人送到了不该到的地方。

Composition:
一串踏板桥从画面左下延伸到右上，每块踏板都是一张盖了章的证据纸，排列整齐、间距均匀，一直搭到对岸。SumSec Observer 蹲在桥中段的一块踏板上，身体微微前倾，一手拿放大镜对准纸面，一手扶着踏板；黑色夹板放在脚边。放大镜下的那张纸上，原文写着"没报警"，却被盖上一枚写着"健康"的青蓝色印章——这是唯一的红橙强调点之一。桥的尽头落在对岸一块明显干裂、什么都没长的地上。其余区域大量留白，不画水、不画风景、不画天空。

Suggested elements:
踏板桥 / 盖了章的证据纸 / 放大镜 / 盖错的印章 / 干裂的对岸

Chinese handwritten labels:
都有证据 / 没报警 / 当成健康 / 每一步都对 / 结论错了

Color use:
Deep charcoal for main line art. SumSec Observer must not be pure black-and-white: pale cool gray hooded jacket, dark cyan-blue inner lining and crossbody strap, light warm skin tone, dark ink hair, muted gray-brown tool bag, black clipboard. Cyan-blue for the wrongly stamped "healthy" seal and the routine evidence stamps. Red-orange only for the wrong assumption annotation and the dry cracked endpoint. Keep colors sparse and translucent.

{CONSTRAINTS}
```

---

## 03 · 两个因子是乘法

**放置**：第五节末尾，「**模型每几个月涨一截，上下文组织却还是手工活。**」之后。

**核心意思**：可用性 = 模型能力 × 上下文组织。任何一边归零，乘积都归零；补短板才有意义。

**结构类型**：概念隐喻

**隐喻**：两个咬合在一起的齿轮，一个明显大、一个明显小。大齿轮是"模型能力"，
小齿轮是"上下文组织"，小齿轮那边挂着几张手写便签和一卷没接完的线。
SumSec Observer 一手扶眼镜，一手正把那枚小齿轮往大一号的方向换——
地上有另一枚还没拆封的新齿轮。大齿轮再大，转速也被小齿轮卡着。

**画面**：两个齿轮占画面中部偏左，SumSec Observer 站在右侧俯身操作，
黑色夹板靠在脚边。不要画机器外壳、不要画电路板、不要画仪表盘。

**标注词**：`模型能力` / `上下文组织` / `还是手工活` / `卡在这` / `乘积`

**Suggested elements**：大齿轮 / 小齿轮 / 待换的新齿轮 / 手写便签 / 没接完的线

```
{VISUAL_DNA}

Theme:
Agent 的可用性 = 模型能力 × 上下文组织。两个因子是乘法，不是加法：任何一边接近零，整体就接近零。

Structure type:
概念隐喻

Core idea:
一对咬合的齿轮，一大一小。大齿轮是模型能力，一直在变大；小齿轮是上下文组织，还是手工活，卡死了整体转速。补短板才是唯一有意义的投入。

Composition:
画面中部偏左是一对咬合的齿轮，一个明显大，一个明显小。大齿轮上贴着一张手写便签，小齿轮上挂着几张手写便签和一卷没接完的细线。SumSec Observer 站在右侧，身体微微前倾，一手扶眼镜，一手正把小齿轮拆下来、准备换上旁边地上一枚稍大的新齿轮；黑色夹板靠在脚边，灰褐工具包在身侧。齿轮之间不画机器外壳、不画电路板、不画仪表盘。右侧和上方大量留白。

Suggested elements:
大齿轮 / 小齿轮 / 待换的新齿轮 / 手写便签 / 没接完的细线

Chinese handwritten labels:
模型能力 / 上下文组织 / 还是手工活 / 卡在这 / 乘积

Color use:
Deep charcoal for main line art. SumSec Observer must not be pure black-and-white: pale cool gray hooded jacket, dark cyan-blue inner lining and crossbody strap, light warm skin tone, dark ink hair, muted gray-brown tool bag, black clipboard. Cyan-blue notes mark the smaller gear as the engineering side. Red-orange only on the "卡在这" annotation. Keep colors sparse and translucent.

{CONSTRAINTS}
```

---

## 04 · 结构硬，上下文活

**放置**：第六节末尾，「**你写的每一个 skill，都是在往这个结构里填一个『这类判断该怎么做』的模板。**」之后。

**核心意思**：把"稳定"和"灵活"拆开放——稳定来自决策结构，灵活来自上下文。

**结构类型**：概念隐喻

**隐喻**：一段固定在地上的硬质水槽（木头槽道，接口是死的，闸门位置是写死的），
水流在里面流，水可以随时换、可以改道。SumSec Observer 蹲在槽边，
正往其中一个卡口里插入一块写着判断条件的挡板——挡板是可以换的。
槽是硬的，水是活的。

**画面**：水槽横贯画面中部，从左进右出，接口处有明确的卡口和两道闸门。
SumSec Observer 在右侧蹲着插挡板。水流用青蓝细线表示，不要画真实水花。
不要画灌溉场景、不要画农田、不要画地形。

**标注词**：`结构是定的` / `水是活的` / `到这必须验` / `可以换` / `该停就停`

**Suggested elements**：木水槽 / 卡口 / 两道闸门 / 可换挡板 / 青蓝水流线

```
{VISUAL_DNA}

Theme:
把"稳定"和"灵活"拆开放：稳定来自决策结构，灵活来自上下文。不再靠"边界写得多死"求稳，也不再靠"模型自己聪明"求活。

Structure type:
概念隐喻

Core idea:
一段硬质的、接口写死的水槽，里面流着可以随时更换的水。槽代表决策结构：哪几个关键判断、什么条件下必须验证、哪些并发哪些串行、什么时候必须停下来问人。水代表上下文：走哪条路、这次拿到什么证据。

Composition:
一段横贯画面中部的木质水槽，从左进右出，接口是死的，槽身上有两个明确的卡口和两道闸门。SumSec Observer 蹲在右侧槽边，一手扶着槽沿，一手正把一块挡插进卡口里——挡板边上还立着两块备用的、写着不同条件的挡板。水流用青蓝细线表示，沿着槽底流动，不画水花、不画灌溉场景、不画农田、不画地形。画面上下大量留白。

Suggested elements:
木水槽 / 卡口 / 两道闸门 / 可换挡板 / 青蓝水流线

Chinese handwritten labels:
结构是定的 / 水是活的 / 到这必须验 / 可以换 / 该停就停

Color use:
Deep charcoal for main line art. SumSec Observer must not be pure black-and-white: pale cool gray hooded jacket, dark cyan-blue inner lining and crossbody strap, light warm skin tone, dark ink hair, muted gray-brown tool bag. Cyan-blue thin lines for the flowing context inside the fixed channel. Red-orange only on the "该停就停" gate label. Keep colors sparse and translucent.

{CONSTRAINTS}
```

---

## 05 · 往上搭一层，底下被重写

**放置**：第七节末尾，「所以往上一层，底下那层不是被取代，是被重新定义了一遍。」之后。

**核心意思**：控制点往外挪一层，前三层本身的性质也变了——不是取代，是重新定义。

**结构类型**：方法分层

**隐喻**：一副四层的工作架，最上面一层刚搭好、还空着。
底下三层原本钉着的旧木牌（"人写的话""静态规矩""说明书"）正被
SumSec Observer 一块块翻过来重钉，背面已经写好了新字
（"运行时组装""路径检查点""决策模板"）。旧牌没被扔掉，只是被翻了个面。

**画面**：四层架子靠画面左侧立着，SumSec Observer 站在中层，
一手扶着横杆，一手正把一块木牌翻面重新钉上，嘴里没叼东西、手里一把小锤子。
架顶那层空着，旁边立着一块还没写字的新牌。不要画工地、不要画安全帽、不要画楼房。

**标注词**：`人写的话` / `静态规矩` / `说明书` / `翻个面` / `底下没扔`

**Suggested elements**：四层工作架 / 正在翻面的木牌 / 小锤子 / 顶层的空位 / 未写字的牌

```
{VISUAL_DNA}

Theme:
控制点往外挪一层之后，前三层本身的性质也变了：Prompt 从"人写的话"变成"运行时组装的上下文"，Harness 从"静态规矩"变成"路径上的检查点"，Skill 从"说明书"变成"决策模板"。不是被取代，是被重新定义。

Structure type:
方法分层

Core idea:
把已有能力升级，而不是替换。底下三层没被扔掉，只是被翻了个面、重新写了一遍。

Composition:
一副四层的工作架靠画面左侧立着，最上面一层刚搭好、还空着。底下三层横杆上钉着木牌。SumSec Observer 站在中层横杆旁，一手扶杆，一手正把其中一块木牌翻过来重新钉上——木牌背面已经写好了新字，旁边还立着一块尚未写字的新牌和一把小锤子。已翻好的两块、正在翻的一块、还没翻的一块，层次要能一眼看出来。不画工地、不画安全帽、不画楼房、不画人字梯以外的施工器材。画面右侧大量留白。

Suggested elements:
四层工作架 / 正在翻面的木牌 / 小锤子 / 顶层的空位 / 未写字的牌

Chinese handwritten labels:
人写的话 / 静态规矩 / 说明书 / 翻个面 / 底下没扔

Color use:
Deep charcoal for main line art. SumSec Observer must not be pure black-and-white: pale cool gray hooded jacket, dark cyan-blue inner lining and crossbody strap, light warm skin tone, dark ink hair, muted gray-brown tool bag. Cyan-blue for the newly written back-side labels. Red-orange on the top empty layer marker. Keep colors sparse and translucent.

{CONSTRAINTS}
```

---

## 06 · 过期的是路径

**放置**：第八节末尾，「**比过期的文档更麻烦，因为过期的是路径。**」之后。

**核心意思**：决策路径也要有生命周期。过期的不是文档，是路径——
它安静地待在链路里，等着把 Agent 带到上一次正确、这一次错误的地方。

**结构类型**：地图路线

**隐喻**：一条岔路口，路面已经封了、摆着路障，但指路牌还立着，
箭头坚定地指向那条封掉的路。SumSec Observer 站在牌子前，
一手扶眼镜，一手拿着一张"待复核"的红橙便签，正要往牌子上贴。
牌脚的土已经松了，牌面上还留着上一次通过的日期。

**画面**：岔路从画面下方分出去两条，左边那条摆着路障、尽头截断；右边那条正常。
指路牌立在岔口，箭头坚决指向左边。SumSec Observer 站在牌子前偏右，
正抬手往牌面贴便签。不画山、不画树、不画城市、不画车。

**标注词**：`上次对` / `这次不一定` / `待复核` / `该退休了` / `它还立着`

**Suggested elements**：岔路 / 封掉的那条 / 路障 / 照旧指路的牌子 / 待复核便签

```
{VISUAL_DNA}

Theme:
决策路径同样需要一套生命周期。过期的不是文档，是路径——旧路径会安静地待在链路里，把 Agent 带到"上一次正确、这一次错误"的地方。

Structure type:
地图路线

Core idea:
一条已经被封掉的路，指路牌却还坚定地指向它。过期的规则不会报错，只会用很笃定的语气把人带错。

Composition:
画面下方是一个岔路口，分出两条路：左边那条尽头被路障封住、路面截断；右边那条正常延伸出去。岔口立着一块指路牌，箭头明确指向左边那条封掉的路，牌脚的土已经松了，牌面下方还留着上一次通过的日期。SumSec Observer 站在牌子前方偏右，一手扶眼镜，一手抬起来正要把一张便签贴到牌面上；黑色夹板夹在腋下，灰褐工具包在身侧。不画山、不画树、不画城市、不画车、不画天空。画面上方和右侧大量留白。

Suggested elements:
岔路 / 封掉的那条 / 路障 / 照旧指路的牌子 / 待复核便签

Chinese handwritten labels:
上次对 / 这次不一定 / 待复核 / 该退休了 / 它还立着

Color use:
Deep charcoal for main line art. SumSec Observer must not be pure black-and-white: pale cool gray hooded jacket, dark cyan-blue inner lining and crossbody strap, light warm skin tone, dark ink hair, muted gray-brown tool bag, black clipboard. Red-orange for the barrier, the "待复核" sticky note, and the outdated sign label. Keep colors sparse and translucent.

{CONSTRAINTS}
```

---

## 落地顺序与保存

图片生成后保存到（与既有文章一致）：

```text
assets/jev-model-thinking-illustrations/
├── 01-decision-state-vs-chat.png
├── 02-complete-path-wrong-conclusion.png
├── 03-two-factor-multiplication.png
├── 04-rigid-channel-living-water.png
├── 05-scaffold-upper-layer.png
└── 06-expired-signpost.png
```

插入文章时用与现有文章一致的写法：

```markdown
![一句话图注](../assets/jev-model-thinking-illustrations/01-decision-state-vs-chat.png)
```

## 生成后自检（qa-checklist）

逐张检查，命中任意一条就重生成或局部编辑：

- SumSec Observer 只是站在旁边装饰，没有承担核心动作
- 角色像吉祥物、表情包、儿童卡通或外部 IP
- 画面太满，留白不足 35%
- 太像流程图、PPT、课件
- 左上角出现"流程图 / 系统架构图 / 方法分层"等类型标题
- 中文标注超过 8 处，或有错字
- 人物纯黑白线稿，没有低饱和局部色彩
- 出现胡子、中年感、驼背、阳光笑脸
- 手部结构异常、手指数量不对
- 背景不是干净纯白
