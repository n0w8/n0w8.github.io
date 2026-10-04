// ============================================================
// NORDWEG Motion v3 - GSAP ScrollTrigger + SplitText + Lenis
// Echte "Lenis-Klasse": alles lebt MIT dem Scroll (Scrub),
// nicht nur einmalige Einblendungen. Progressive Enhancement:
// ohne JS ist ALLES sichtbar (Startzustaende setzt nur GSAP).
// ============================================================
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fein = window.matchMedia('(pointer: fine)').matches;

// ---------- 1) Lenis + ScrollTrigger verheiraten ----------
let lenis = null;
if (!reduced) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('has-lenis');

  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const ziel = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    if (ziel) { e.preventDefault(); lenis.scrollTo(ziel, { offset: -90 }); }
  });
}

// ---------- 2) Fortschritt + Header (immer, auch reduced) ----------
const progress = document.querySelector('.scroll-progress');
const header = document.querySelector('header');
let lastY = 0;
function onScroll() {
  const y = window.scrollY;
  if (progress) {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  }
  if (header) {
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > 300 && y > lastY + 4);
    if (Math.abs(y - lastY) > 4) lastY = y;
  }
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (!reduced) {
  // ---------- 3) HERO: Kamera-Fahrt beim Wegscrollen (Scrub) ----------
  const hero = document.querySelector('.hero');
  if (hero) {
    const bg = hero.querySelector('.hero-bg');
    const inhalt = hero.querySelector('.hero-inner');
    if (bg) gsap.fromTo(bg, { scale: 1.16, yPercent: -4 }, {
      scale: 1.28, yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    if (inhalt) gsap.to(inhalt, {
      yPercent: -18, opacity: 0, scale: 0.94, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: '75% top', scrub: true },
    });
  }

  // ---------- 4) SplitText: Ueberschriften zeichenweise (einmalig beim Eintritt) ----------
  document.fonts.ready.then(() => {
    document.querySelectorAll('.section-title, .article-title, h1.page-title').forEach((el) => {
      if (el.closest('.hero')) return;
      const split = new SplitText(el, { type: 'words,chars', wordsClass: 'st-wort', charsClass: 'st-zeichen' });
      gsap.from(split.chars, {
        yPercent: 130, rotate: 4, opacity: 0,
        duration: 0.9, ease: 'power4.out', stagger: 0.018,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  });

  // ---------- 5) Bilder: Clip-Reveal mit Scrub (Karten + Artikel-Hero) ----------
  document.querySelectorAll('.card-media img, .article-hero img').forEach((img) => {
    gsap.fromTo(img,
      { clipPath: 'inset(10% 6% 10% 6%)', scale: 1.18 },
      { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top 95%', end: 'top 45%', scrub: 0.6 } });
  });

  // ---------- 6) Riesige Konturwoerter wandern quer (Scrub) ----------
  document.querySelectorAll('.giant-word').forEach((el, i) => {
    gsap.fromTo(el, { xPercent: i % 2 ? 14 : -14 }, {
      xPercent: i % 2 ? -14 : 14, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // ---------- 7) [data-parallax] via ScrollTrigger ----------
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    if (el.classList.contains('hero-bg')) return; // Hero hat eigene Fahrt
    const staerke = parseFloat(el.dataset.parallax || '0.15') * 100;
    gsap.fromTo(el, { yPercent: staerke * 0.6, scale: el.dataset.parallaxScale || 1.1 }, {
      yPercent: -staerke * 0.6, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // ---------- 8) Velocity: Marquee reagiert auf Scrollgeschwindigkeit ----------
  const track = document.querySelector('.marquee-track');
  if (track && lenis) {
    track.style.animation = 'none'; // CSS-Marquee aus, GSAP uebernimmt
    const tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
    lenis.on('scroll', ({ velocity }) => {
      const v = gsap.utils.clamp(-4, 4, 1 + Math.abs(velocity) * 0.22);
      gsap.to(tween, { timeScale: velocity < 0 ? -v : v, duration: 0.3, overwrite: true });
    });
  }

  // ---------- 9) Velocity-Skew auf Karten-Grids ----------
  // Entschaerft am 4.10.2026: vorher +-4 Grad und pro Scroll-Ereignis ein neuer
  // gsap.to() je Grid. Das hat bei jedem Scrollen das ganze Raster neu zeichnen
  // lassen und zusammen mit dem alten Zeiger den Ruckel-Eindruck erzeugt.
  // Jetzt: halber Ausschlag und feste quickTo-Setter (kein Tween-Nachschub).
  if (lenis) {
    const grids = [...document.querySelectorAll('.post-grid, .cat-grid, .artist-grid')];
    if (grids.length) {
      const setter = grids.map((g) => gsap.quickTo(g, 'skewY', { duration: 0.5, ease: 'power2.out' }));
      let letzter = 0;
      lenis.on('scroll', ({ velocity }) => {
        const ziel = gsap.utils.clamp(-0.7, 0.7, velocity * 0.05);
        if (Math.abs(ziel - letzter) < 0.02) return;
        letzter = ziel;
        for (const s of setter) s(ziel);
      });
    }
  }

  // ---------- 10) Zeiger ----------
  // Bewusst KEIN JavaScript-Cursor mehr. Der frueher hier nachgezogene Ring lag
  // immer hinter der echten Maus und wirkte wie eine hakende Seite (Mike,
  // 4.10.2026). Der Nordweg-Zeiger ist jetzt ein echter SVG-Systemcursor in
  // global.css - den zeichnet das Betriebssystem, er kann nicht nachlaufen.
}

// ---------- 11) Reveal-Observer (Basis-Einblendungen, wie v2) ----------
const ziele = document.querySelectorAll('.reveal, .stagger');
if (reduced || !('IntersectionObserver' in window)) {
  ziele.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  ziele.forEach((el) => io.observe(el));
}

// ---------- 12) Magnetic ----------
if (!reduced && fein) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const staerke = parseFloat(el.dataset.magnetic || '0.35');
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * staerke, y: (e.clientY - r.top - r.height / 2) * staerke, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }));
  });
}

// ---------- 13) Zahlen-Counter ----------
if (!reduced) {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const ziel = parseFloat(el.dataset.count);
    gsap.fromTo(el, { textContent: 0 }, {
      textContent: ziel, duration: 1.6, ease: 'power3.out', snap: { textContent: 1 },
      onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)).toLocaleString('de-AT'); },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

// ---------- 14) Sicherheitsnetz: nichts bleibt unsichtbar ----------
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.is-visible), .stagger:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
}, 3000);
