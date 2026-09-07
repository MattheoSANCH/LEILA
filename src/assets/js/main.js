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

  var supportsInert = 'inert' in HTMLElement.prototype;

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
        El panel tapa toda la pantalla, así que mientras está abierto
        el resto de la página queda inerte: ni foco ni lector de pantalla.
     --------------------------------------------------------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    var behind = [document.getElementById('main'), document.querySelector('.site-footer')];

    var setBehindInert = function (state) {
      if (!supportsInert) return;
      behind.forEach(function (el) { if (el) el.inert = state; });
    };

    var isMenuOpen = function () { return mobileMenu.classList.contains('is-open'); };

    var closeMenu = function (returnFocus) {
      // El foco no puede quedarse dentro de algo que se vuelve invisible.
      if (returnFocus !== false && mobileMenu.contains(document.activeElement)) {
        menuToggle.focus();
      }
      mobileMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      setBehindInert(false);
    };

    var openMenu = function () {
      mobileMenu.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Cerrar menú');
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
      setBehindInert(true);
      // Leer una medida fuerza el recálculo de estilo: sin esto el panel
      // sigue en visibility:hidden en este instante y .focus() no surte efecto.
      void mobileMenu.offsetWidth;
      var first = mobileMenu.querySelector('a');
      if (first) first.focus();
    };

    menuToggle.addEventListener('click', function () {
      if (isMenuOpen()) { closeMenu(); } else { openMenu(); }
    });

    // Cerrar al elegir un destino: el enlace navega igual (no hacemos preventDefault).
    // No devolvemos el foco al botón: el navegador ya se lleva al usuario a otra página.
    Array.prototype.forEach.call(mobileMenu.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && isMenuOpen()) closeMenu();
    });

    // Si se vuelve a escritorio con el menú abierto, lo cerramos.
    // La consulta es exactamente la complementaria de la del CSS (max-width: 920px),
    // para que no quede una franja de anchos donde el botón ya no se ve.
    if (window.matchMedia) {
      var mobileMq = window.matchMedia('(max-width: 920px)');
      var onBreakpoint = function (e) { if (!e.matches && isMenuOpen()) closeMenu(false); };
      if (mobileMq.addEventListener) {
        mobileMq.addEventListener('change', onBreakpoint);
      } else if (mobileMq.addListener) {
        mobileMq.addListener(onBreakpoint);
      }
    }
  }

  /* ---------------------------------------------------------
     3. Micro-animaciones al hacer scroll (fade + slide suave)
        La clase .js del <head> es la que activa el estado oculto en CSS:
        sin JS (o si este archivo no carga) todo se ve con normalidad.
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
    var dotsWrap = slider.querySelector('.hero__dots');
    var prevBtn = slider.querySelector('.hero-arrow--prev');
    var nextBtn = slider.querySelector('.hero-arrow--next');
    var index = 0;
    var timer = null;
    var paused = false;
    var DELAY = 6000;

    if (slides.length > 1) {
      var show = function (i, moveFocus) {
        index = (i + slides.length) % slides.length;
        Array.prototype.forEach.call(slides, function (slide, n) {
          slide.classList.toggle('is-active', n === index);
        });
        Array.prototype.forEach.call(dots, function (dot, n) {
          var active = n === index;
          dot.classList.toggle('is-active', active);
          if (active) {
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.removeAttribute('aria-current');
          }
        });
        // Si el cambio vino del teclado, el foco acompaña al indicador activo.
        if (moveFocus && dots[index]) dots[index].focus();
      };

      var stop = function () { if (timer) { clearInterval(timer); timer = null; } };

      var start = function () {
        stop();
        if (reduceMotion || paused) return; // respetamos la preferencia y la pausa manual
        timer = setInterval(function () { show(index + 1); }, DELAY);
      };

      Array.prototype.forEach.call(dots, function (dot, n) {
        dot.addEventListener('click', function () { show(n); start(); });
      });
      if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); start(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); start(); });

      // La pausa se recuerda: pulsar una flecha con el ratón encima no
      // reactiva el avance automático a los 6 segundos.
      var pause = function () { paused = true; stop(); };
      var resume = function () { paused = false; start(); };
      slider.addEventListener('mouseenter', pause);
      slider.addEventListener('mouseleave', resume);
      slider.addEventListener('focusin', pause);
      slider.addEventListener('focusout', resume);

      // Flechas del teclado SOLO sobre los indicadores: si el listener cubriera
      // toda la portada, pulsar una flecha desde el botón "Agenda tu cita"
      // cambiaría la imagen sin que el visitante lo haya pedido.
      if (dotsWrap) {
        dotsWrap.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1, true); start(); }
          if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, true); start(); }
        });
      }

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
