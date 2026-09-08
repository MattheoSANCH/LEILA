/* =========================================================
   Dra. Alejandra Sánchez Navarro Palazuelos — comportamiento
   ---------------------------------------------------------
   Reglas duras del sistema:
   · Se anima únicamente opacity, transform, el ancho de los
     filetes y background-color. Nunca height, top, box-shadow,
     filter ni blur.
   · Ninguna curva con rebote. Cero parallax. Cero animaciones
     en bucle. Nada se mueve sin que lo provoque el usuario.
   · CERO listeners de scroll en toda la página: tres
     IntersectionObserver y nada más.
   ========================================================= */
(function () {
  'use strict';

  var raiz = document.documentElement;

  /* El script en línea del <head> comprueba esta marca al cargarse la página:
     si main.js no llegó a ejecutarse, retira html.js y el contenido, que nace
     visible, se queda visible. */
  raiz.classList.add('animado');

  var soporta = 'IntersectionObserver' in window;
  var movimientoReducido = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ── 1. Revelado al entrar en pantalla ──────────────────
     Con movimiento reducido, o sin IntersectionObserver, se
     aplica el estado final de inmediato y no se observa nada. */
  var revelables = document.querySelectorAll('.rev');

  function revelarTodo() {
    for (var i = 0; i < revelables.length; i++) {
      revelables[i].classList.add('on');
    }
  }

  if (!soporta) {
    /* Sin observador no hay revelado ni cabecera compacta: se vuelve al modo
       sin JavaScript, donde todo nace visible y la cabecera lleva fondo. */
    raiz.classList.remove('js');
    revelarTodo();
  } else if (movimientoReducido) {
    revelarTodo();
  } else {
    var obsRevelado = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('on');
            obsRevelado.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    for (var j = 0; j < revelables.length; j++) {
      obsRevelado.observe(revelables[j]);
    }
  }

  /* ── 2. El meridiano de la banda oscura ─────────────────
     Se dibuja de arriba abajo al entrar la sección. */
  var meridiano = document.querySelector('.meridiano');
  if (meridiano) {
    if (!soporta || movimientoReducido) {
      meridiano.classList.add('on');
    } else {
      var obsMeridiano = new IntersectionObserver(
        function (entradas) {
          entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
              entrada.target.classList.add('on');
              obsMeridiano.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      obsMeridiano.observe(meridiano);
    }
  }

  /* ── 3. El filete bajo la especialidad del hero ─────────
     Se dispara al cargar, no al hacer scroll: el hero ya
     está a la vista. */
  var filete = document.querySelector('.filete-anim');
  if (filete) {
    if (movimientoReducido) {
      filete.classList.add('on');
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          filete.classList.add('on');
        });
      });
    }
  }

  /* ── 4. Cabecera compacta ───────────────────────────────
     Un centinela de 1px en el tope del documento. Al salir de
     vista, la cabecera se condensa. No produce movimiento, así
     que se registra incluso con movimiento reducido. */
  var cabecera = document.getElementById('cabecera');
  var centinela = document.getElementById('centinela');
  if (soporta && cabecera && centinela) {
    var obsCabecera = new IntersectionObserver(
      function (entradas) {
        /* El último registro es el estado actual: la cola puede acumular
           varias observaciones si el hilo principal iba ocupado. */
        var ultima = entradas[entradas.length - 1];
        cabecera.classList.toggle('compacta', !ultima.isIntersecting);
      },
      { threshold: 0 }
    );
    obsCabecera.observe(centinela);
  }

  /* ── 5. Sección activa en la navegación ─────────────────
     Sin unobserve: el estado cambia en los dos sentidos. */
  var enlacesNav = document.querySelectorAll('.nav a[href^="#"]');
  if (soporta && enlacesNav.length) {
    var porId = {};
    var secciones = [];

    for (var k = 0; k < enlacesNav.length; k++) {
      var id = enlacesNav[k].getAttribute('href').slice(1);
      var seccion = document.getElementById(id);
      if (seccion) {
        porId[id] = enlacesNav[k];
        secciones.push(seccion);
      }
    }

    var visibles = {};

    var obsNav = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          visibles[entrada.target.id] = entrada.isIntersecting;
        });
        /* Solo una sección puede ser la actual: gana la primera visible
           en el orden del documento. */
        var actual = null;
        for (var i = 0; i < secciones.length; i++) {
          if (actual === null && visibles[secciones[i].id]) actual = secciones[i].id;
        }
        for (var n = 0; n < secciones.length; n++) {
          var seccionId = secciones[n].id;
          if (seccionId === actual) {
            porId[seccionId].setAttribute('aria-current', 'true');
          } else {
            porId[seccionId].removeAttribute('aria-current');
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    for (var m = 0; m < secciones.length; m++) {
      obsNav.observe(secciones[m]);
    }
  }
})();
