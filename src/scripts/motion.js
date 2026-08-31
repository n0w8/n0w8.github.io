// ============================================================
// NORDWEG Motion v2 - "Lenis-Klasse" Scroll-Erlebnis
// Butterweiches Scrollen + Parallax + Zeilen-Reveals + Magnetic.
// Alles hinter prefers-reduced-motion abgesichert; nur transform/
// opacity (kein Layout-Shift, Core-Web-Vitals-sicher).
// ============================================================
import Lenis from 'lenis';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- 1) Smooth Scroll (Lenis) ----------
let lenis = null;
if (!reduced) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // Mobile behaelt natives Scrollen (fluessiger + vertrauter)
  });
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.documentElement.classList.add('has-lenis');

  // Anker-Links (z.B. Inhaltsverzeichnis) weich scrollen
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const ziel = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    if (ziel) { e.preventDefault(); lenis.scrollTo(ziel, { offset: -90 }); }
  });
}

// ---------- 2) Scroll-Fortschritt + Header-Zustand ----------
const progress = document.querySelector('.scroll-progress');
const header = document.querySelector('header');
let lastY = 0;
function onScroll(y) {
  if (progress) {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }
  if (header) {
    header.classList.toggle('is-scrolled', y > 40);
    // Einblenden beim Hochscrollen, ausblenden beim Runterscrollen (ab 300px)
    header.classList.toggle('is-hidden', y > 300 && y > lastY + 4);
    if (Math.abs(y - lastY) > 4) lastY = y;
  }
}
if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
// Immer AUCH nativ binden: greift bei Tastatur-Scroll, gedrosseltem rAF, Hintergrund-Tabs
addEventListener('scroll', () => onScroll(scrollY), { passive: true });
onScroll(scrollY);

// ---------- 3) Parallax ([data-parallax="0.15"] = Staerke) ----------
const px = [...document.querySelectorAll('[data-parallax]')];
if (px.length && !reduced) {
  let ticking = false;
  const step = () => {
    for (const el of px) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > innerHeight + 80) continue;
      const mitte = r.top + r.height / 2 - innerHeight / 2;
      const staerke = parseFloat(el.dataset.parallax || '0.15');
      el.style.transform = `translate3d(0, ${(-mitte * staerke).toFixed(1)}px, 0) scale(${el.dataset.parallaxScale || 1.12})`;
    }
    ticking = false;
  };
  const anfordern = () => { if (!ticking) { ticking = true; requestAnimationFrame(step); } };
  if (lenis) lenis.on('scroll', anfordern); else addEventListener('scroll', anfordern, { passive: true });
  anfordern();
}

// ---------- 4) Zeilen-Reveal ([data-lines]: Woerter in maskierte Zeilen zerlegen) ----------
if (!reduced) {
  for (const el of document.querySelectorAll('[data-lines]')) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\n|<br\s*\/?>/i).map((z) => z.trim()).filter(Boolean)
      .map((zeile, i) => `<span class="line-mask" aria-hidden="true"><span class="line-inner" style="transition-delay:${0.09 * i}s">${zeile}</span></span>`)
      .join('');
  }
}

// ---------- 5) Reveal-Observer (uebernimmt .reveal + [data-lines] + .stagger) ----------
const ziele = document.querySelectorAll('.reveal, [data-lines], .stagger');
if (reduced || !('IntersectionObserver' in window)) {
  ziele.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((eintraege) => {
    for (const e of eintraege) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  ziele.forEach((el) => io.observe(el));
}

// ---------- 6) Magnetic-Buttons ([data-magnetic]) ----------
if (!reduced && matchMedia('(pointer: fine)').matches) {
  for (const el of document.querySelectorAll('[data-magnetic]')) {
    const staerke = parseFloat(el.dataset.magnetic || '0.35');
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * staerke}px, ${(e.clientY - r.top - r.height / 2) * staerke}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  }
}

// ---------- 7) Zahlen-Counter ([data-count="447000"]) ----------
if (!reduced) {
  const zahlen = document.querySelectorAll('[data-count]');
  if (zahlen.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        io2.unobserve(e.target);
        const ziel = parseFloat(e.target.dataset.count);
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / 1400);
          const eased = 1 - Math.pow(1 - p, 3);
          e.target.textContent = Math.round(ziel * eased).toLocaleString('de-AT');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    zahlen.forEach((el) => io2.observe(el));
  }
}

// ---------- 8) Sicherheitsnetz ----------
// Wenn der IntersectionObserver nicht feuert (gedrosselter Renderer, exotische
// Browser), werden nach 3s ALLE Reveals sichtbar geschaltet. Inhalt > Effekt.
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.is-visible), [data-lines]:not(.is-visible), .stagger:not(.is-visible)')
    .forEach((el) => el.classList.add('is-visible'));
}, 3000);
