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
    try { localStorage.setItem(key, next); } catch (e) {}
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
})();
