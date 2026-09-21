// Progressive enhancement: the static document is always the complete experience.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const portrait = document.querySelector('.portrait-window img');
const experience = document.querySelector('.experience');
const rows = [...document.querySelectorAll('.experience-row')];
const chapterLinks = [...document.querySelectorAll('[data-chapter]')];
const headerLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const contact = document.querySelector('#contact');
const guide = document.querySelector('.experience-guide');
const header = document.querySelector('.site-header');
const root = document.documentElement;
const reveals = [...document.querySelectorAll('.scene-figure, .portrait-window, .connection, .book-statement')];
root.dataset.motion = 'on';
const entrances = [];
let frame = 0;
let lastChapter = -1;
let lastSection = '';
let destroyed = false;
let pulse;
const clamp = (value) => Math.min(1, Math.max(0, value));

function update() {
  frame = 0;
  if (destroyed) return;
  // Read all geometry before changing any styles.
  const viewport = innerHeight;
  const heroRect = hero.getBoundingClientRect();
  const sectionRect = experience.getBoundingClientRect();
  const contactRect = contact.getBoundingClientRect();
  const rowRects = rows.map(row => row.getBoundingClientRect());
  const focalLine = Math.min(viewport * .42, 350);
  const inExperience = sectionRect.top < viewport * .65 && sectionRect.bottom > 100;
  let active = 0;
  rowRects.forEach((rect, i) => { if (rect.top < focalLine) active = i; });
  const phase = inExperience ? active : -1;
  const section = contactRect.top < viewport * .5 ? '#contact' : inExperience ? '#ervaring' : '';
  const heroProgress = clamp(-heroRect.top / Math.max(heroRect.height, 1));
  const pageProgress = clamp(scrollY / Math.max(root.scrollHeight - viewport, 1));

  root.classList.toggle('has-scrolled', scrollY > 24);
  if (!reduce.matches) {
    for (const el of reveals) {
      if (el.classList.contains('is-in')) continue;
      const box = el.getBoundingClientRect();
      if (box.top < viewport * .92 && box.bottom > 0) el.classList.add('is-in');
    }
  }
  if (portrait) portrait.style.transform = reduce.matches ? '' : `scale(${1.035 - heroProgress * .035}) translateY(${-heroProgress * 12}px)`;
  header.style.setProperty('--page-progress', pageProgress.toFixed(4));
  if (phase !== lastChapter) {
    rows.forEach((row, i) => row.classList.toggle('is-active', i === phase));
    chapterLinks.forEach((link, i) => {
      if (i === phase) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const point = guide.querySelector('.connection-point');
    if (phase >= 0 && point && !reduce.matches) {
      pulse?.cancel();
      pulse = point.animate(
        [{ strokeWidth: '7px' }, { strokeWidth: '12px', offset: .4 }, { strokeWidth: '7px' }],
        { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
    }
    lastChapter = phase;
  }
  if (section !== lastSection) {
    headerLinks.forEach(link => {
      if (link.getAttribute('href') === section) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    lastSection = section;
  }
}

function schedule() {
  if (!frame && !document.hidden && !destroyed) frame = requestAnimationFrame(update);
}

function settleMotion() {
  if (reduce.matches) {
    revealObserver?.disconnect();
    reveals.forEach(el => el.classList.add('is-in'));
    entrances.forEach(animation => animation.cancel());
    pulse?.cancel();
  }
  schedule();
}

// One short focal entrance, no content waits for JavaScript or a loading screen.
if (!reduce.matches && scrollY < 100) {
  const options = { duration: 720, easing: 'cubic-bezier(.16,1,.3,1)' };
  const first = document.querySelector('.title-first');
  const second = document.querySelector('.title-second');
  entrances.push(first.animate([{ transform: 'translateX(-22px)', opacity: .65 }, { transform: 'translateX(0)', opacity: 1 }], options));
  entrances.push(second.animate([{ transform: 'translateX(22px)', opacity: .65 }, { transform: 'translateX(0)', opacity: 1 }], { ...options, delay: 80 }));
  entrances.push(document.querySelector('.portrait-window').animate(
    [{ clipPath: 'inset(0 12% 0 12%)' }, { clipPath: 'inset(0 0 0 0)' }], options
  ));
}

// Eenrichtingsonthulling. Werkt ook bij een directe link naar #ervaring,
// waar geen scroll-event hoeft te vuren. Zonder observer staat alles er gewoon.
let revealObserver;
if (!reduce.matches && 'IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      obs.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  reveals.forEach(el => revealObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-in'));
}

addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
addEventListener('pageshow', schedule);
document.addEventListener('visibilitychange', schedule);
reduce.addEventListener('change', settleMotion);
schedule();

// Astro's dev server can replace this module; don't stack event handlers during editing.
if (import.meta.hot) import.meta.hot.dispose(() => {
  destroyed = true;
  revealObserver?.disconnect();
  cancelAnimationFrame(frame);
  entrances.forEach(animation => animation.cancel());
  pulse?.cancel();
  removeEventListener('scroll', schedule);
  removeEventListener('resize', schedule);
  removeEventListener('pageshow', schedule);
  document.removeEventListener('visibilitychange', schedule);
  reduce.removeEventListener('change', settleMotion);
});
