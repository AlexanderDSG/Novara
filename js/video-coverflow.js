/* ==========================================================
   NOVARA — Efecto "Coverflow" propio para los videos (móvil)
   Sin librerías. Usa el scroll nativo del dedo (con su inercia
   y su "snap") y, en cada movimiento, calcula qué tan lejos del
   centro está cada tarjeta para inclinarla, alejarla y oscurecerla.

   Los parámetros tienen los mismos nombres que en Swiper para que
   sea fácil ajustarlos.
   ========================================================== */
(function () {

  var COVERFLOW = {
    rotate: 40,         // grados que giran las tarjetas laterales
    depth: 120,         // px que se "hunden" hacia el fondo (eje Z)
    modifier: 1,        // multiplicador del efecto: número, o función(offset) → número
    scale: 0.88,        // escala de las laterales (1 = sin cambio de tamaño)
    stretch: 24,        // acerca las tarjetas al centro: número (px) o "50%"
    slideShadows: true, // oscurece las tarjetas laterales
    perspective: 900    // px de perspectiva 3D
  };

  var MOBILE = '(max-width: 640px)'; // mismo punto donde ya se ocultan las flechas

  document.addEventListener('DOMContentLoaded', function () {

    var grid = document.getElementById('nvVideoGrid');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.nv-video-card'));
    if (!cards.length) return;

    var active = false;
    var ticking = false;
    var pitch = 1; // distancia entre el centro de una tarjeta y el de la siguiente

    /* ---------- utilidades ---------- */

    function innerOf(card) { return card.querySelector('.nv-cf-inner'); }

    function ensureShadow(card) {
      var inner = innerOf(card);
      if (!inner) return null;
      var shadow = inner.querySelector('.nv-cf-shadow');
      if (!shadow) {
        shadow = document.createElement('span');
        shadow.className = 'nv-cf-shadow';
        shadow.setAttribute('aria-hidden', 'true');
        // tocar una tarjeta lateral la lleva al centro
        shadow.addEventListener('click', function () { centerCard(card); });
        inner.appendChild(shadow);
      }
      return shadow;
    }

    function centerCard(card) {
      var g = grid.getBoundingClientRect();
      var c = card.getBoundingClientRect();
      var delta = (c.left + c.width / 2) - (g.left + g.width / 2);
      grid.scrollTo({ left: grid.scrollLeft + delta, behavior: 'smooth' });
    }

    function measure() {
      pitch = cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth;
      if (!pitch) pitch = cards[0].offsetWidth || 1;
    }

    function stretchToPx(width) {
      var s = COVERFLOW.stretch;
      if (typeof s === 'string' && s.indexOf('%') > -1) {
        return (parseFloat(s) / 100) * width;
      }
      return parseFloat(s) || 0;
    }

    /* ---------- el cálculo del efecto ---------- */

    function update() {
      ticking = false;
      if (!active) return;

      var g = grid.getBoundingClientRect();
      var center = g.left + g.width / 2;

      cards.forEach(function (card) {
        var inner = innerOf(card);
        if (!inner) return;

        var r = card.getBoundingClientRect();
        // offset normalizado: 0 = centrada, ±1 = una tarjeta a cada lado
        var o = ((r.left + r.width / 2) - center) / pitch;

        var m = typeof COVERFLOW.modifier === 'function'
          ? COVERFLOW.modifier(o)
          : o * COVERFLOW.modifier;
        m = Math.max(-2, Math.min(2, m)); // las muy lejanas no giran más de la cuenta
        var abs = Math.abs(m);

        var rotateY = -m * COVERFLOW.rotate;
        var translateZ = -abs * COVERFLOW.depth;
        var translateX = -m * stretchToPx(r.width);
        var scale = 1 + (COVERFLOW.scale - 1) * Math.min(abs, 1);

        inner.style.transform =
          'perspective(' + COVERFLOW.perspective + 'px) ' +
          'translateX(' + translateX.toFixed(2) + 'px) ' +
          'translateZ(' + translateZ.toFixed(2) + 'px) ' +
          'rotateY(' + rotateY.toFixed(2) + 'deg) ' +
          'scale(' + scale.toFixed(3) + ')';

        // la tarjeta del centro siempre queda por encima de las laterales
        card.style.zIndex = String(Math.round(100 - abs * 10));

        if (COVERFLOW.slideShadows) {
          var shadow = ensureShadow(card);
          if (shadow) {
            shadow.style.opacity = (Math.min(abs, 1) * 0.6).toFixed(3);
            // si no es la del centro, la capa recibe el toque (y no el video)
            shadow.style.pointerEvents = abs > 0.3 ? 'auto' : 'none';
          }
        }
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    function onResize() {
      measure();
      requestUpdate();
    }

    /* ---------- activar / desactivar según el ancho ---------- */

    function enable() {
      if (active) return;
      active = true;
      grid.classList.add('is-coverflow');
      grid.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', onResize);
      measure();
      update();
    }

    function disable() {
      if (!active) return;
      active = false;
      grid.classList.remove('is-coverflow');
      grid.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
      cards.forEach(function (card) {
        var inner = innerOf(card);
        if (inner) inner.style.transform = '';
        card.style.zIndex = '';
        var shadow = inner && inner.querySelector('.nv-cf-shadow');
        if (shadow) {
          shadow.style.opacity = '';
          shadow.style.pointerEvents = '';
        }
      });
    }

    var mql = window.matchMedia(MOBILE);
    function sync() { mql.matches ? enable() : disable(); }
    sync();
    if (mql.addEventListener) mql.addEventListener('change', sync);
    else if (mql.addListener) mql.addListener(sync);
  });

})();