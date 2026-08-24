(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* current year in the footer */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── nav ─────────────────────────────────────────── */

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  var setMenu = function (open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1000 && !menu.hidden) setMenu(false);
  });

  /* ── the walkthrough ─────────────────────────────────
     Scroll position drives video.currentTime. The clip is
     encoded all-keyframe so every seek lands immediately.  */

  var walk = document.querySelector('.walk');
  var video = document.getElementById('walkVideo');
  var caps = [].slice.call(document.querySelectorAll('.cap'));
  var railFill = document.getElementById('railFill');
  var railMarks = [].slice.call(document.querySelectorAll('.rail__marks li'));
  var hint = document.getElementById('walkHint');

  var target = 0;      // scroll-derived progress, 0..1
  var current = 0;     // eased progress actually shown
  var duration = 0;
  var ticking = false;

  var readProgress = function () {
    var span = walk.offsetHeight - window.innerHeight;
    if (span <= 0) return 0;
    return clamp(-walk.getBoundingClientRect().top / span, 0, 1);
  };

  var paintCaptions = function (p) {
    for (var i = 0; i < caps.length; i++) {
      var c = caps[i];
      var on = p >= parseFloat(c.dataset.from) && p < parseFloat(c.dataset.to);
      c.classList.toggle('is-on', on);
    }
    if (railFill) railFill.style.transform = 'scaleY(' + p + ')';
    for (var j = 0; j < railMarks.length; j++) {
      var at = parseFloat(railMarks[j].dataset.at);
      var next = railMarks[j + 1] ? parseFloat(railMarks[j + 1].dataset.at) : 1.001;
      railMarks[j].classList.toggle('is-on', p >= at && p < next);
    }
    if (hint) hint.classList.toggle('is-gone', p > 0.02);
  };

  var frame = function () {
    // ease toward the scroll target so fast flicks still look like a dolly
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.0004) current = target;

    if (duration) {
      var t = current * (duration - 0.06);
      // only seek on a real change — spamming currentTime stalls mobile Safari
      if (Math.abs(video.currentTime - t) > 0.015) {
        try { video.currentTime = t; } catch (e) { /* not seekable yet */ }
      }
    }
    paintCaptions(current);

    if (Math.abs(target - current) > 0.0004) {
      requestAnimationFrame(frame);
    } else {
      ticking = false;
    }
  };

  var kick = function () {
    target = readProgress();
    nav.classList.toggle('is-stuck', window.scrollY > 40);
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  };

  if (walk && video) {
    // never let it play on its own — scroll is the only transport
    video.addEventListener('play', function () { video.pause(); });

    var onMeta = function () {
      duration = video.duration || 0;
      walk.classList.add('is-ready');
      video.pause();
      kick();
    };

    if (video.readyState >= 1) onMeta();
    else video.addEventListener('loadedmetadata', onMeta);

    video.addEventListener('error', function () {
      // poster carries the section; captions still advance on scroll
      walk.classList.add('is-fallback');
    });

    if (reduced) {
      // no scrubbing: hold the opening frame, reveal every caption in flow
      walk.classList.add('is-static');
      caps.forEach(function (c) { c.classList.add('is-on'); });
    } else {
      window.addEventListener('scroll', kick, { passive: true });
      window.addEventListener('resize', kick);
      kick();
    }
  }

  /* ── scroll reveals for the rest of the page ─────── */

  var items = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }
})();
