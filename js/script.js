document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Año dinámico en el footer ---------- */
  var yearEl = document.getElementById('nvYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  var nav = document.getElementById('nvNav');
  var burger = document.getElementById('nvBurger');
  var navLinks = document.getElementById('nvNavLinks');

    /* ---------- NAV: transparente en hero / oscuro al hacer scroll ---------- */
  function toggleNavScrolled() {
    if (!nav) return;

    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  toggleNavScrolled();
  window.addEventListener('scroll', toggleNavScrolled, { passive: true });

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
      });
    });
  }

  /* ---------- Galería de productos: flechas de scroll ---------- */
  var gallery = document.getElementById('nvGallery');
  var btnLeft = document.getElementById('galLeft');
  var btnRight = document.getElementById('galRight');

  function scrollGallery(direction) {
    if (!gallery) return;
    var card = gallery.querySelector('.nv-card');
    var step = card ? card.getBoundingClientRect().width + 24 : 320;
    gallery.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  if (btnLeft) btnLeft.addEventListener('click', function () { scrollGallery(-1); });
  if (btnRight) btnRight.addEventListener('click', function () { scrollGallery(1); });

  /* Arrastrar con el mouse en escritorio (además del scroll táctil nativo) */
  if (gallery) {
    var isDown = false, startX, scrollLeftStart;

    gallery.addEventListener('mousedown', function (e) {
      isDown = true;
      gallery.classList.add('is-dragging');
      startX = e.pageX - gallery.offsetLeft;
      scrollLeftStart = gallery.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(function (evt) {
      gallery.addEventListener(evt, function () {
        isDown = false;
        gallery.classList.remove('is-dragging');
      });
    });
    gallery.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - gallery.offsetLeft;
      var walk = (x - startX) * 1.2;
      gallery.scrollLeft = scrollLeftStart - walk;
    });
  }

  /* ---------- Botón flotante de WhatsApp: aparece al hacer scroll ---------- */
  var waFloat = document.getElementById('nvWhatsappFloat');
  function toggleWhatsappVisibility() {
    if (!waFloat) return;
    if (window.scrollY > 280) {
      waFloat.classList.add('is-visible');
    } else {
      waFloat.classList.remove('is-visible');
    }
  }
  toggleWhatsappVisibility();
  window.addEventListener('scroll', toggleWhatsappVisibility, { passive: true });

});
