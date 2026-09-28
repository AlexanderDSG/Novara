/* ==========================================================
   NOVARA — Tarjeta "catálogo" del hero (estilo BODEN)
   - Al seleccionar una miniatura: cambia la tarjeta grande Y
     el fondo del hero, a la misma imagen.
   - Si no se selecciona nada, avanza sola cada 5 segundos,
     en orden, y vuelve al principio al llegar a la última.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  var mainImg = document.getElementById('nvShowcaseImg');
  var label = document.getElementById('nvShowcaseLabel');
  var heroBgImg = document.getElementById('heroBgImg');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.nv-showcase__thumb'));

  if (!mainImg || !thumbs.length) return;

  var AUTOPLAY_MS = 5000;
  var current = 0;
  var autoplayTimer = null;

  function fadeSwap(imgEl, newSrc) {
    if (!imgEl || !newSrc || imgEl.getAttribute('src') === newSrc) return;
    imgEl.style.opacity = '0';
    setTimeout(function () {
      imgEl.src = newSrc;
      imgEl.style.opacity = '1';
    }, 200);
  }

  function selectThumb(index) {
    current = index;
    var thumb = thumbs[index];
    var image = thumb.getAttribute('data-image');
    var text = thumb.getAttribute('data-label') || '';

    fadeSwap(mainImg, image);
    fadeSwap(heroBgImg, image);
    if (label) label.textContent = text;

    thumbs.forEach(function (t) { t.classList.remove('is-active'); });
    thumb.classList.add('is-active');
  }

  function goToNext() {
    selectThumb((current + 1) % thumbs.length);
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(goToNext, AUTOPLAY_MS);
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      selectThumb(index);
      restartAutoplay(); // si el usuario elige una, el conteo de 5s vuelve a empezar
    });
  });

  restartAutoplay();
});