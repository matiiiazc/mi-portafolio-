// ── REVEAL on scroll ──
const allReveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });
allReveals.forEach(el => revealObserver.observe(el));

// ── CAROUSELS ──
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track  = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots   = carousel.querySelectorAll('.carousel-dot');
  const prev   = carousel.querySelector('.carousel-btn.prev');
  const next   = carousel.querySelector('.carousel-btn.next');
  let current  = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 3500); }
  function stopAuto()  { clearInterval(autoTimer); }

  prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    startAuto();
  });

  startAuto();
});

// ── NAV active link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
}, { passive: true });

// ── Skill cards stagger on scroll ──
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
    } else {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(20px)';
    }
  });
}, { threshold: 0.1 });
skillCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, box-shadow 1.5s ease-in-out';
  skillObserver.observe(card);
});

// ── LIGHTBOX ──
const overlay = document.createElement('div');
overlay.id = 'lightbox-overlay';
Object.assign(overlay.style, {
  display:         'none',
  position:        'fixed',
  inset:           '0',
  background:      'rgba(0,0,0,0.92)',
  zIndex:          '9999',
  alignItems:      'center',
  justifyContent:  'center',
  cursor:          'zoom-out',
  backdropFilter:  'blur(4px)',
});

const lbImg = document.createElement('img');
Object.assign(lbImg.style, {
  maxWidth:      '90vw',
  maxHeight:     '90vh',
  borderRadius:  '8px',
  boxShadow:     '0 0 60px rgba(0,0,0,0.8)',
  userSelect:    'none',
  pointerEvents: 'none',
});

const lbClose = document.createElement('button');
lbClose.textContent = '✕';
Object.assign(lbClose.style, {
  position:   'absolute',
  top:        '1.2rem',
  right:      '1.5rem',
  background: 'transparent',
  border:     'none',
  color:      'white',
  fontSize:   '1.8rem',
  cursor:     'pointer',
  lineHeight: '1',
});

overlay.appendChild(lbImg);
overlay.appendChild(lbClose);
document.body.appendChild(overlay);

function openLightbox(src) {
  lbImg.src = src;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-lightbox]');
  if (target) openLightbox(target.dataset.lightbox);
});

overlay.addEventListener('click', closeLightbox);
lbClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});