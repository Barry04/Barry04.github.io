/* Homepage-only animated tech backdrop.
   Particle constellation rendered to <canvas id="home-bg-canvas">.
   - Colours are read from CSS custom properties, so theme switching stays in sync.
   - Honours prefers-reduced-motion (draws one static frame, no rAF loop).
   - Pauses while the tab is hidden; caps device pixel ratio at 2. */
(function () {
  'use strict';

  var canvas = document.getElementById('home-bg-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var root = document.documentElement;
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var state = {
    w: 0,
    h: 0,
    dpr: 1,
    nodes: [],
    linkDist: 150,
    pointer: { x: -1e4, y: -1e4, active: false },
    colors: { node: '43,179,154', warm: '217,108,55' },
    raf: null,
    reduced: reduceQuery.matches
  };

  /* ---- colour helpers ---- */

  function toRgb(value, fallback) {
    if (!value) return fallback;
    var text = value.trim();

    var hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      var h = hex[1];
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var n = parseInt(h, 16);
      return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
    }

    var fn = text.match(/rgba?\(([^)]+)\)/);
    if (fn) {
      var parts = fn[1].split(',');
      return [
        parseFloat(parts[0]) || 0,
        parseFloat(parts[1]) || 0,
        parseFloat(parts[2]) || 0
      ].join(',');
    }

    return fallback;
  }

  function readColors() {
    var cs = getComputedStyle(root);
    state.colors.node = toRgb(cs.getPropertyValue('--signal'), '43,179,154');
    state.colors.warm = toRgb(cs.getPropertyValue('--signal-warm'), '217,108,55');
  }

  /* ---- geometry ---- */

  function seed() {
    var area = state.w * state.h;
    var count = Math.round(Math.min(78, Math.max(22, area / 28000)));
    var nodes = [];

    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * state.w,
        y: Math.random() * state.h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.7 + Math.random() * 1.2,
        warm: Math.random() < 0.12
      });
    }

    state.nodes = nodes;
    state.linkDist = Math.max(112, Math.min(172, Math.min(state.w, state.h) * 0.2));
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    state.w = Math.max(1, rect.width);
    state.h = Math.max(1, rect.height);
    state.dpr = Math.min(2, window.devicePixelRatio || 1);

    canvas.width = Math.round(state.w * state.dpr);
    canvas.height = Math.round(state.h * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    seed();
  }

  /* ---- simulation ---- */

  function step() {
    var nodes = state.nodes;
    var w = state.w;
    var h = state.h;
    var p = state.pointer;

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -24) { n.x = -24; n.vx = Math.abs(n.vx); }
      else if (n.x > w + 24) { n.x = w + 24; n.vx = -Math.abs(n.vx); }

      if (n.y < -24) { n.y = -24; n.vy = Math.abs(n.vy); }
      else if (n.y > h + 24) { n.y = h + 24; n.vy = -Math.abs(n.vy); }

      if (p.active) {
        var dx = p.x - n.x;
        var dy = p.y - n.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 1) {
          var pull = 0.05 / Math.sqrt(d2);
          n.x += dx * pull;
          n.y += dy * pull;
        }
      }
    }
  }

  /* ---- rendering ---- */

  function render() {
    var w = state.w;
    var h = state.h;
    var nodes = state.nodes;
    var p = state.pointer;
    var nodeColor = state.colors.node;
    var warmColor = state.colors.warm;

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;

    var linkDist = state.linkDist;
    var maxDist2 = linkDist * linkDist;
    var i, j, a, b, dx, dy, d2, alpha;

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x;
        dy = a.y - b.y;
        d2 = dx * dx + dy * dy;
        if (d2 > maxDist2) continue;

        alpha = (1 - Math.sqrt(d2) / linkDist) * 0.42;
        ctx.strokeStyle = 'rgba(' + nodeColor + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    if (p.active) {
      var reach = 190;
      var reach2 = reach * reach;
      for (i = 0; i < nodes.length; i++) {
        var c = nodes[i];
        var pdx = c.x - p.x;
        var pdy = c.y - p.y;
        var pd2 = pdx * pdx + pdy * pdy;
        if (pd2 > reach2) continue;

        var pa = (1 - Math.sqrt(pd2) / reach) * 0.34;
        ctx.strokeStyle = 'rgba(' + warmColor + ',' + pa.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
      }
    }

    for (i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      ctx.fillStyle = 'rgba(' + (node.warm ? warmColor : nodeColor) + ',' +
        (node.warm ? '0.85' : '0.72') + ')';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---- loop control ---- */

  function frame() {
    state.raf = null;
    step();
    render();
    if (!state.reduced) state.raf = window.requestAnimationFrame(frame);
  }

  function start() {
    if (state.reduced) {
      render();
      return;
    }
    if (state.raf !== null) return;
    state.raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (state.raf !== null) {
      window.cancelAnimationFrame(state.raf);
      state.raf = null;
    }
  }

  function restart() {
    stop();
    state.reduced = reduceQuery.matches;
    readColors();
    resize();
    start();
  }

  /* ---- events ---- */

  function onPointerMove(event) {
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    state.pointer.active = true;
  }

  function onPointerLeave() {
    state.pointer.active = false;
  }

  var resizeTimer = null;

  function onResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      resize();
      if (state.reduced) render();
    }, 160);
  }

  restart();

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  if (window.MutationObserver) {
    new MutationObserver(function () {
      readColors();
      if (state.reduced) render();
    }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (!state.reduced && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
  }

  if (reduceQuery.addEventListener) {
    reduceQuery.addEventListener('change', restart);
  } else if (reduceQuery.addListener) {
    reduceQuery.addListener(restart);
  }
})();
