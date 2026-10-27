(function () {
  'use strict';
  var figures = document.querySelectorAll('[data-story-diagram]');
  var button = document.querySelector('[data-story-motion]');
  if (!figures.length || !button) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused = false;
  var timer = null;
  var diagrams = Array.prototype.map.call(figures, function (figure) {
    return { figure: figure, nodes: figure.querySelectorAll('[data-story-step]'), visible: false, step: 0 };
  });

  function paint(diagram) {
    for (var i = 0; i < diagram.nodes.length; i++) {
      diagram.nodes[i].classList.toggle('is-current', i === diagram.step);
    }
  }

  function sync() {
    var anyRunning = false;
    for (var i = 0; i < diagrams.length; i++) {
      var running = diagrams[i].visible && !paused && !reduced.matches && !document.hidden;
      diagrams[i].figure.setAttribute('data-running', String(running));
      anyRunning = anyRunning || running;
    }
    button.hidden = false;
    button.disabled = reduced.matches;
    button.setAttribute('aria-pressed', String(paused || reduced.matches));
    button.textContent = reduced.matches ? '已按系统设置关闭动画' : paused ? '播放图解动画' : '暂停图解动画';
    if (anyRunning && timer === null) {
      timer = window.setInterval(function () {
        for (var j = 0; j < diagrams.length; j++) {
          if (diagrams[j].figure.getAttribute('data-running') === 'true') {
            diagrams[j].step = (diagrams[j].step + 1) % diagrams[j].nodes.length;
            paint(diagrams[j]);
          }
        }
      }, 1800);
    } else if (!anyRunning && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  diagrams.forEach(paint);
  button.addEventListener('click', function () { paused = !paused; sync(); });
  document.addEventListener('visibilitychange', sync);
  if (reduced.addEventListener) reduced.addEventListener('change', sync);
  else reduced.addListener(sync);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        diagrams.forEach(function (diagram) {
          if (diagram.figure === entry.target) diagram.visible = entry.isIntersecting;
        });
      });
      sync();
    }, { threshold: 0.12 });
    diagrams.forEach(function (diagram) { observer.observe(diagram.figure); });
  }
  // 无 IntersectionObserver 时保留完整静态图，不启动后台动画。
  sync();
})();
