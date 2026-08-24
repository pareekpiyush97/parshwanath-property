(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* current year in the footer */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── nav ─────────────────────────────────────────── */

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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

  /* ── hero film ───────────────────────────────────── */

  var video = document.getElementById('heroVideo');

  if (video) {
    var reveal = function () { video.classList.add('is-on'); };
    if (video.readyState >= 2) reveal();
    else video.addEventListener('loadeddata', reveal);

    if (reduced) {
      // hold the poster rather than looping motion nobody asked for
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      var play = video.play();
      if (play && play.catch) play.catch(reveal); // autoplay refused — poster stands in
    }
  }

  /* ── scroll reveals ──────────────────────────────── */

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
