(function () {
  var key = 'barry-theme';
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var btn = document.querySelector('[data-theme-toggle]');
  var bar = document.getElementById('read-progress');

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(next) {
    if (next === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (meta) meta.setAttribute('content', '#101416');
    } else {
      root.removeAttribute('data-theme');
      if (meta) meta.setAttribute('content', '#f4f6f5');
    }
    if (btn) btn.setAttribute('aria-label', next === 'dark' ? '切换为浅色模式' : '切换为深色模式');
    try { localStorage.setItem(key, next); } catch (e) {}
  }

  if (btn) {
    btn.setAttribute('aria-label', current() === 'dark' ? '切换为浅色模式' : '切换为深色模式');
    btn.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark');
    });
  }

  /* 文章目录：窄屏是顶部可折叠块，宽屏（≥1080px，与 style.scss 一致）变常驻侧栏。 */
  var toc = document.querySelector('.article-toc');
  var tocSections = [];
  var sidebarQuery = window.matchMedia('(min-width: 1080px)');

  if (toc) {
    var headings = document.querySelectorAll('.page-article .prose h2');
    var list = toc.querySelector('[data-article-toc-list]');
    var count = toc.querySelector('[data-article-toc-count]');

    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];
      if (!heading.id) heading.id = 'section-' + (i + 1);
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + encodeURIComponent(heading.id);
      /* 侧栏左侧已经有序号，标题自带的「一、」「1.」在目录里是重复的，去掉更清爽。 */
      var label = heading.textContent.trim().replace(/^[一二三四五六七八九十百]+[、.．]\s*/, '').replace(/^\d+[、.．]\s*/, '');
      link.textContent = label || heading.textContent.trim();
      item.appendChild(link);
      list.appendChild(item);
      tocSections.push({ link: link, heading: heading });
    }

    if (tocSections.length) {
      count.textContent = tocSections.length + ' 节';
      toc.hidden = false;

      var syncToc = function () { toc.open = sidebarQuery.matches; };
      toc.addEventListener('toggle', function () {
        if (sidebarQuery.matches && !toc.open) toc.open = true;
      });
      if (sidebarQuery.addEventListener) sidebarQuery.addEventListener('change', syncToc);
      else if (sidebarQuery.addListener) sidebarQuery.addListener(syncToc);
      syncToc();
    }
  }

  function markActiveSection() {
    if (!tocSections.length) return;
    var threshold = window.innerHeight * 0.3;
    var active = -1;
    for (var i = 0; i < tocSections.length; i++) {
      if (tocSections[i].heading.getBoundingClientRect().top <= threshold) active = i;
      else break;
    }
    for (var j = 0; j < tocSections.length; j++) {
      if (j === active) tocSections[j].link.setAttribute('aria-current', 'true');
      else tocSections[j].link.removeAttribute('aria-current');
    }
  }

  function updateProgress() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    bar.style.transform = 'scaleX(' + p + ')';
  }

  var scrollQueued = false;

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () {
      scrollQueued = false;
      markActiveSection();
      updateProgress();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();
