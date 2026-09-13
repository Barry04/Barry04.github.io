(function () {
  var key = 'barry-theme';
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var btn = document.querySelector('[data-theme-toggle]');

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(next) {
    if (next === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (meta) meta.setAttribute('content', '#0f1716');
    } else {
      root.removeAttribute('data-theme');
      if (meta) meta.setAttribute('content', '#f3efe7');
    }
    try { localStorage.setItem(key, next); } catch (e) {}
  }

  if (btn) {
    btn.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark');
    });
  }
})();
