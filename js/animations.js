/* ==========================================================
   NOVARA — Animaciones (GSAP + ScrollTrigger)
   1) Intro: nav + título del hero línea por línea + conteo
   2) Aparición de cada sección al hacer scroll
   (El catálogo horizontal volvió al scroll normal — manejado
   por script.js. En móvil, product-swiper.js lo reemplaza por
   Swiper con efecto Coverflow.)
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  if (typeof gsap === 'undefined') return; // si el CDN no cargó, no rompemos nada
  gsap.registerPlugin(ScrollTrigger);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // respeta la preferencia del sistema, todo queda visible por CSS

  /* ==========================================================
     1) INTRO (al entrar por primera vez)
     ========================================================== */
  var introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  introTl
    .to('.nv-nav', { opacity: 1, y: 0, duration: 0.55 })
    .to('#heroEyebrow', { opacity: 1, y: 0, duration: 0.5 }, '-=0.15')
    .to('#heroTitle .nv-line__inner', { y: 0, duration: 0.85, stagger: 0.14 }, '-=0.2')
    .to('.nv-hero__lead', { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
    .to('.nv-hero__actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .to('.nv-hero__bg', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
    .to('.nv-showcase', { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
    .to('#heroStats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
    .add(animateCounters, '-=0.3');

  /* Conteo de números (75+, 4.95, 100%) */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var proxy = { val: 0 };

      gsap.to(proxy, {
        val: target,
        duration: 1.3,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = proxy.val.toFixed(decimals) + suffix;
        },
      });
    });
  }

  /* ==========================================================
     2) APARICIÓN DE SECCIONES AL HACER SCROLL
     ========================================================== */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

});