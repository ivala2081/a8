(function () {
  'use strict';

  // Custom cursor (fine pointer only)
  var cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768) {
    var cx = -100, cy = -100, tx = -100, ty = -100;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });

    (function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .srv-item, input, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
    });

    document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  // Nav scroll
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  // Mobile menu
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  var overlay = document.getElementById('navOverlay');

  if (toggle && menu) {
    function closeMenu() {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', String(open));
      if (overlay) overlay.classList.toggle('active');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight + 20 : 80;
        window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // Active nav link on scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinks = menu ? menu.querySelectorAll('a[href^="#"]') : [];

  if (navLinks.length > 0) {
    function updateActiveNav() {
      var scrollPos = window.scrollY + 150;
      var found = false;

      for (var i = sections.length - 1; i >= 0; i--) {
        var section = sections[i];
        if (scrollPos >= section.offsetTop) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + section.id) {
              link.classList.add('active');
            }
          });
          found = true;
          break;
        }
      }

      if (!found || window.scrollY < 300) {
        navLinks.forEach(function (link) { link.classList.remove('active'); });
      }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Form — language-aware submit text, double-submit guard
  var form = document.querySelector('.form');
  if (form) {
    var submitted = false;
    var isEnglish = document.documentElement.lang === 'en';

    form.addEventListener('submit', function (e) {
      if (submitted) { e.preventDefault(); return; }
      submitted = true;
      var btn = form.querySelector('.btn-send');
      if (btn) {
        btn.innerHTML = isEnglish ? 'Sending\u2026' : 'G\u00f6nderiliyor\u2026';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      }
    });
  }
})();
