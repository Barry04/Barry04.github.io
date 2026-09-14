(function () {
  var key = 'barry-theme';
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var btn = document.querySelector('[data-theme-toggle]');
  var bar = document.getElementById('read-progress');
  var diagramSources = [];

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
    try { localStorage.setItem(key, next); } catch (e) {}
    renderMermaid();
  }

  if (btn) {
    btn.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark');
    });
  }

  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    bar.style.transform = 'scaleX(' + p + ')';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function renderMermaid() {
    if (typeof mermaid === 'undefined') return;
    var nodes = document.querySelectorAll('.mermaid');
    if (!nodes.length) return;
    nodes.forEach(function (el, i) {
      if (diagramSources[i] == null) diagramSources[i] = el.textContent.trim();
      el.removeAttribute('data-processed');
      el.removeAttribute('data-mermaid-processed');
      el.innerHTML = diagramSources[i];
    });
    mermaid.initialize({
      startOnLoad: false,
      theme: current() === 'dark' ? 'dark' : 'neutral',
      securityLevel: 'strict',
      fontFamily: 'Noto Sans SC, PingFang SC, sans-serif',
      flowchart: { htmlLabels: true, curve: 'basis', padding: 12 }
    });
    mermaid.run({ nodes: Array.prototype.slice.call(nodes) });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMermaid);
  } else {
    renderMermaid();
  }
})();
