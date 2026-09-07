/* =========================================================
   EYE CENTER Mexicali — scripts
   Vanilla JS, sin dependencias. Todo es progresivo:
   si el JS falla, el sitio sigue siendo navegable y legible.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ---------------------------------------------------------
     1. Header sticky — sombra al hacer scroll
     --------------------------------------------------------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     2. Menú móvil (burger)
     --------------------------------------------------------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    var closeMenu = function () {
      mobileMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('no-scroll');
    };

    var openMenu = function () {
      mobileMenu.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Cerrar menú');
      document.body.classList.add('no-scroll');
    };

    menuToggle.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });

    // Cerrar al elegir un destino: el enlace navega igual (no hacemos preventDefault).
    Array.prototype.forEach.call(mobileMenu.querySelectorAll('a'), function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') closeMenu();
    });

    // Si se vuelve a escritorio con el menú abierto, lo cerramos.
    if (window.matchMedia) {
      var desktop = window.matchMedia('(min-width: 921px)');
      var onBreakpoint = function (e) { if (e.matches) closeMenu(); };
      if (desktop.addEventListener) {
        desktop.addEventListener('change', onBreakpoint);
      } else if (desktop.addListener) {
        desktop.addListener(onBreakpoint);
      }
    }
  }

  /* ---------------------------------------------------------
     3. Micro-animaciones al hacer scroll (fade + slide suave)
        Sin JS o sin IntersectionObserver: todo visible (ver <noscript>).
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

      Array.prototype.forEach.call(revealEls, function (el) { observer.observe(el); });
    } else {
      Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------------------------------------------------------
     4. Slider del hero (portada)
        Transición por opacidad entre "slides". Hoy los slides son
        degradados de sustitución: para poner las fotos reales basta
        con dar un background-image a cada .hero-slide en el CSS
        (ver assets/css/style.css → "FOTOS REALES").
     --------------------------------------------------------- */
  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.hero-slide');
    var dots = slider.querySelectorAll('.hero-dot');
    var prevBtn = slider.querySelector('.hero-arrow--prev');
    var nextBtn = slider.querySelector('.hero-arrow--next');
    var index = 0;
    var timer = null;
    var DELAY = 6000;

    if (slides.length > 1) {
      var show = function (i) {
        index = (i + slides.length) % slides.length;
        Array.prototype.forEach.call(slides, function (slide, n) {
          slide.classList.toggle('is-active', n === index);
        });
        Array.prototype.forEach.call(dots, function (dot, n) {
          var active = n === index;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-selected', active ? 'true' : 'false');
          dot.setAttribute('tabindex', active ? '0' : '-1');
        });
      };

      var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
      var start = function () {
        stop();
        if (reduceMotion) return; // respetamos la preferencia del sistema
        timer = setInterval(function () { show(index + 1); }, DELAY);
      };

      Array.prototype.forEach.call(dots, function (dot, n) {
        dot.addEventListener('click', function () { show(n); start(); });
      });
      if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); start(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); start(); });

      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
      slider.addEventListener('focusin', stop);
      slider.addEventListener('focusout', start);

      // Flechas del teclado sobre los indicadores
      slider.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { show(index - 1); start(); }
        if (e.key === 'ArrowRight') { show(index + 1); start(); }
      });

      // Pausa cuando la pestaña no está visible (ahorra batería)
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { stop(); } else { start(); }
      });

      show(0);
      start();
    }
  }

  /* ---------------------------------------------------------
     5. Tratamientos — resaltado de la especialidad visible
        La navegación por anclas funciona sin JS (scroll-behavior CSS);
        esto solo añade el estado "activo" en las pestañas.
     --------------------------------------------------------- */
  var tabs = document.querySelectorAll('[data-spy-tab]');
  if (tabs.length && 'IntersectionObserver' in window) {
    var byId = {};
    var sections = [];

    Array.prototype.forEach.call(tabs, function (tab) {
      var id = (tab.getAttribute('href') || '').split('#')[1];
      if (!id) return;
      var section = document.getElementById(id);
      if (!section) return; // enlace sin destino: no lo espiamos (y no debería existir)
      byId[id] = tab;
      sections.push(section);
    });

    var setActive = function (id) {
      Array.prototype.forEach.call(tabs, function (tab) {
        var isActive = tab === byId[id];
        tab.classList.toggle('is-active', isActive);
        if (isActive) {
          tab.setAttribute('aria-current', 'true');
        } else {
          tab.removeAttribute('aria-current');
        }
      });
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------------------------------------------------------
     6. Año en curso en el pie de página
     --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
