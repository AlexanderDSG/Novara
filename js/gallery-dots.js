/* ==========================================================
   NOVARA — Puntos de paginación para galerías horizontales
   Se generan solos según cuántas tarjetas haya (si agregas o
   quitas una, los puntos se ajustan sin tocar este archivo).
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  function setupDots(galleryId, dotsId, cardSelector, align) {
    var gallery = document.getElementById(galleryId);
    var dotsWrap = document.getElementById(dotsId);
    if (!gallery || !dotsWrap) return;

    var cards = Array.prototype.slice.call(gallery.querySelectorAll(cardSelector));
    if (!cards.length) return;

    dotsWrap.innerHTML = '';
    cards.forEach(function (card, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'nv-dots__dot';
      dot.setAttribute('aria-label', 'Ir a la tarjeta ' + (i + 1) + ' de ' + cards.length);
      dot.addEventListener('click', function () {
        if (align === 'center') {
          var g = gallery.getBoundingClientRect();
          var c = card.getBoundingClientRect();
          var delta = (c.left + c.width / 2) - (g.left + g.width / 2);
          gallery.scrollTo({ left: gallery.scrollLeft + delta, behavior: 'smooth' });
        } else {
          card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.nv-dots__dot'));
    dots[0].classList.add('is-active');

    function updateActive() {
      var gRect = gallery.getBoundingClientRect();
      var closestIndex = 0;
      var closestDistance = Infinity;

      cards.forEach(function (card, i) {
        var cRect = card.getBoundingClientRect();
        var distance = align === 'center'
          ? Math.abs((cRect.left + cRect.width / 2) - (gRect.left + gRect.width / 2))
          : Math.abs(cRect.left - gRect.left);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === closestIndex);
      });
    }

    var ticking = false;
    gallery.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateActive();
        ticking = false;
      });
    }, { passive: true });
  }

  setupDots('nvGallery', 'nvGalleryDots', '.nv-card');
  setupDots('nvCompareGallery', 'nvCompareDots', '.nv-compare-card');
  setupDots('nvVideoGrid', 'nvVideoDots', '.nv-video-card', 'center');

});