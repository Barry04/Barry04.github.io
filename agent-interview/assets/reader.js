(()=>{const body=document.body,search=document.querySelector("#chapter-search"),links=[...document.querySelectorAll(".chapter-link")],empty=document.querySelector("#search-empty"),storageKey="agent-interview-reader-theme",zoomKey="agent-interview-reader-zoom";const setTheme=(dark)=>{body.classList.toggle("dark",dark);localStorage.setItem(storageKey,dark?"dark":"light");window.dispatchEvent(new CustomEvent("reader-theme-change",{detail:{dark}}))};const setZoom=(value)=>{const zoom=Math.min(1.3,Math.max(.9,value));document.documentElement.style.setProperty("--reader-zoom",zoom);const label=document.querySelector("#zoom-value");if(label)label.textContent=`${Math.round(zoom*100)}%`;localStorage.setItem(zoomKey,String(zoom))};setTheme(localStorage.getItem(storageKey)==="dark");setZoom(Number(localStorage.getItem(zoomKey))||1);const revealActiveChapter=()=>{const sidebar=document.querySelector(".sidebar"),active=document.querySelector(".chapter-link.active");if(!sidebar||!active)return;if(sidebar.scrollHeight<=sidebar.clientHeight+4)return;const sidebarRect=sidebar.getBoundingClientRect(),activeRect=active.getBoundingClientRect();sidebar.scrollTop+=activeRect.top-sidebarRect.top-(sidebar.clientHeight-activeRect.height)/2};revealActiveChapter();requestAnimationFrame(revealActiveChapter);document.addEventListener("click",async(event)=>{const action=event.target.closest("[data-action]")?.dataset.action;if(action==="open-sidebar"||action==="toggle-sidebar")body.classList.add("sidebar-open");if(action==="close-sidebar")body.classList.remove("sidebar-open");if(action==="toggle-theme")setTheme(!body.classList.contains("dark"));if(action==="zoom-in")setZoom((Number(localStorage.getItem(zoomKey))||1)+.05);if(action==="zoom-out")setZoom((Number(localStorage.getItem(zoomKey))||1)-.05);if(event.target.closest(".chapter-link"))body.classList.remove("sidebar-open");const copyButton=event.target.closest(".copy-code");if(copyButton){const code=copyButton.closest(".code-block").querySelector("code").innerText;await navigator.clipboard?.writeText(code);copyButton.textContent="已复制";setTimeout(()=>{copyButton.textContent="复制"},1400)}});search?.addEventListener("input",()=>{const query=search.value.trim().toLowerCase();const sidebarEl=document.querySelector(".sidebar");if(sidebarEl)sidebarEl.scrollTop=0;let visible=0;links.forEach((link)=>{const match=!query||link.dataset.search.toLowerCase().includes(query);link.hidden=!match;if(match)visible++});document.querySelectorAll(".topic-group").forEach((group)=>{group.hidden=![...group.querySelectorAll(".chapter-link")].some((link)=>!link.hidden)});if(empty)empty.hidden=visible!==0});const progress=document.createElement("div");progress.className="reading-progress";progress.style.cssText="position:fixed;z-index:20;top:0;left:0;height:3px;width:0;background:#55bbaa;transition:width .1s linear;";body.append(progress);window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${max>0?window.scrollY/max*100:0}%`},{passive:true})})();

/* ---- suncy.me 站点桥接补丁（由 tools/sync-agent-interview.mjs 注入，勿手改）---- */
(() => {
  const brand = document.querySelector(".sidebar-brand");
  if (brand) {
    const back = document.createElement("a");
    back.className = "back-to-blog";
    back.href = "/";
    back.textContent = "← 返回 suncy.me";
    brand.parentNode.insertBefore(back, brand);
  }
  const status = document.querySelector(".reading-status");
  if (status) status.innerHTML = '<span class="status-dot"></span>Agent Interview 100';
  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML =
      'Agent Interview 100 · 内容来自 ' +
      '<a href="https://github.com/BigKunLun/Agent-Interview-100" target="_blank" rel="noopener">BigKunLun/Agent-Interview-100</a>' +
      '（MIT）· 本站仅作阅读器托管';
  }
})();
