/* ==========================================================
   NOVARA — Antes y Después
   1) Slider comparador: arrastra el círculo (mouse o touch) para
      revelar la foto de "antes" o "después".
   2) Flechas de la galería horizontal (igual que en Catálogo).
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1) Slider comparador ---------- */
  document.querySelectorAll('[data-compare]').forEach(function (box) {
    var before = box.querySelector('.nv-compare__before');
    var handle = box.querySelector('.nv-compare__handle');
    if (!before || !handle) return;

    var dragging = false;

    function setPosition(clientX) {
      var rect = box.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      before.style.width = pct + '%';
      handle.style.left = pct + '%';
    }

    function start(e) {
      dragging = true;
      box.classList.add('is-dragging');
      if (box.setPointerCapture && e.pointerId !== undefined) {
        box.setPointerCapture(e.pointerId);
      }
      setPosition(e.clientX);
    }

    function move(e) {
      if (!dragging) return;
      setPosition(e.clientX);
    }

    function end() {
      dragging = false;
      box.classList.remove('is-dragging');
    }

    box.addEventListener('pointerdown', start);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', end);
    box.addEventListener('pointercancel', end);
    box.addEventListener('pointerleave', function () {
      if (dragging) end();
    });
  });

  /* ---------- 2) Flechas de la galería ---------- */
  var gallery = document.getElementById('nvCompareGallery');
  var btnLeft = document.getElementById('compareLeft');
  var btnRight = document.getElementById('compareRight');

  function scrollGallery(direction) {
    if (!gallery) return;
    var card = gallery.querySelector('.nv-compare-card');
    var step = card ? card.getBoundingClientRect().width + 24 : 360;
    gallery.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  if (btnLeft) btnLeft.addEventListener('click', function () { scrollGallery(-1); });
  if (btnRight) btnRight.addEventListener('click', function () { scrollGallery(1); });

});