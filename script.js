// script.js

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.getElementById('navLinks');

function closeMenu() {
  if (!menuToggle || !navLinksContainer) return;
  navLinksContainer.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}

function openMenu() {
  if (!menuToggle || !navLinksContainer) return;
  navLinksContainer.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
}

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.contains('open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Close menu when clicking a link (mobile)
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // Close on Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close if resized to desktop (prevents stuck open state)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

// Prevent nav links default for anchor links (# only)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      console.log('Navigation clicked:', link.textContent);
    }
  });
});

// Project card hover effects enhancement (only if cards exist)
const projectCards = document.querySelectorAll('.project-card');

// Custom cursor: "View case study" with eye icon (desktop only)
if (projectCards.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.id = 'case-study-cursor';
  cursor.innerHTML = `
    <svg class="eye" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    </svg>
    <span class="label">View case study</span>
  `;
  document.body.appendChild(cursor);

  let raf = 0;
  let mx = 0;
  let my = 0;

  function moveCursor() {
    raf = 0;
    cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }

  function setPos(x, y) {
    mx = x;
    my = y;
    if (!raf) raf = requestAnimationFrame(moveCursor);
  }

  const cursorLabel = cursor.querySelector('.label');
  const cursorEye = cursor.querySelector('.eye');

  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const isComingSoon = card.classList.contains('coming-soon-card');
      cursorLabel.textContent = isComingSoon ? 'Coming Soon' : 'View Case Study';
      cursorEye.style.display = isComingSoon ? 'none' : '';
      cursor.classList.add('visible');
    });
    card.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    card.addEventListener('mousemove', (e) => setPos(e.clientX, e.clientY));
  });

  // Hide cursor when leaving the window (prevents a stuck cursor)
  window.addEventListener('blur', () => cursor.classList.remove('visible'));
}

projectCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
    card.style.transition = 'transform 0.25s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });

  card.addEventListener('click', () => {
    const projectNameEl = card.querySelector('.project-name');
    const projectName = projectNameEl ? projectNameEl.textContent : 'Unknown project';
    console.log('Project clicked:', projectName);
  });
});

// Intersection Observer for scroll animations (only if cards exist)
if (projectCards.length) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  projectCards.forEach(card => observer.observe(card));
}

// Social link interactions
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', () => {
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
      link.style.transform = 'scale(1.08)';
    }, 100);
  });
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';

  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Slot-machine hover: wrap nav link text into per-letter spans
document.querySelectorAll('.nav-link.slot').forEach((link) => {
  const text = link.getAttribute('data-text') || link.textContent.trim();
  link.textContent = '';

  const wrap = document.createElement('span');
  wrap.className = 'slot-wrap';

  [...text].forEach((ch, i) => {
    const char = document.createElement('span');
    char.className = 'slot-char';
    char.style.setProperty('--d', `${i * 18}ms`);

    const inner = document.createElement('span');
    inner.innerHTML = `
      <span>${ch === ' ' ? '&nbsp;' : ch}</span>
      <span>${ch === ' ' ? '&nbsp;' : ch}</span>
    `;

    char.appendChild(inner);
    wrap.appendChild(char);
  });

  link.appendChild(wrap);
});

// NYC time — updates mobile header (#nyc-time) and desktop header (.desktop-header__time)
function updateNYCTime() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const parts = formatter.formatToParts(now);
  let timeHtml = '';
  let timeText = '';
  for (const part of parts) {
    if (part.type === 'literal' && part.value === ':') {
      timeHtml += '<span class="time-colon" aria-hidden="true">:</span>';
      timeText += ':';
    } else {
      timeHtml += part.value;
      timeText += part.value;
    }
  }

  // Mobile header (blinking colon)
  const nycEl = document.getElementById('nyc-time');
  if (nycEl) nycEl.innerHTML = `[ NYC · ${timeHtml} ]`;

  // Desktop header (with blinking colon)
  document.querySelectorAll('.desktop-header__time').forEach(function(el) {
    el.innerHTML = `[ NYC · ${timeHtml} ]`;
  });
}

updateNYCTime();
setInterval(updateNYCTime, 1000);

// Sandbox sliders (supports multiple sliders on the same page)
document.querySelectorAll('.right').forEach((right) => {
  const track = right.querySelector('.track');
  const slides = right.querySelectorAll('.slide');
  const dotsWrap = right.querySelector('.dots');

  if (!track || !slides.length || !dotsWrap) return;

  dotsWrap.innerHTML = '';
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.dot');

  function goTo(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  goTo(0);
});




// Smooth page transitions between internal pages (desktop only).
// Primary path: cross-document view transitions in styles.css — the
// browser cross-fades only the content panel while the sidebar stays
// static. Fallback path (no support): fade the content panel out via
// JS, navigate, then fade back in with the pageEnter animation.
(function () {
  const desktopView = window.matchMedia('(min-width: 769px)');

  // Feature-detect cross-document view transitions: browsers that
  // support them parse the @view-transition rule, others drop it.
  let nativeVT = false;
  try {
    const probe = document.createElement('style');
    probe.textContent = '@view-transition { navigation: auto; }';
    document.head.appendChild(probe);
    nativeVT = probe.sheet.cssRules.length > 0;
    probe.remove();
  } catch (err) {
    nativeVT = false;
  }
  if (nativeVT) return; // native transitions handle everything

  document.documentElement.classList.add('no-vt');

  // If the page is restored from the back/forward cache, clear the
  // exit state so the content panel isn't stuck invisible.
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-exit');
  });

  document.querySelectorAll('.sidebar a[href$=".html"]').forEach((link) => {
    if (link.target === '_blank') return;
    link.addEventListener('click', (e) => {
      if (!desktopView.matches) return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--duration-page');
      const duration = parseFloat(raw) || 250;
      setTimeout(() => {
        window.location.href = link.getAttribute('href');
      }, duration);
    });
  });
})();

// Email icon: hover shows a "Copy email" tooltip; clicking copies the
// address and flips the tooltip to a green "Copied" for a moment.
(function () {
  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) { /* ignore */ }
    ta.remove();
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => copyFallback(text));
    }
    copyFallback(text);
    return Promise.resolve();
  }

  document.querySelectorAll('.social-link[aria-label="Email"]').forEach((link) => {
    const email = (link.getAttribute('href') || '').replace('mailto:', '');
    if (!email) return;

    link.classList.add('social-link--copy');
    link.dataset.tooltip = 'Copy email';

    let resetTimer;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      copyText(email).then(() => {
        link.dataset.tooltip = 'Copied';
        link.classList.add('copied');
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          link.dataset.tooltip = 'Copy email';
          link.classList.remove('copied');
        }, 2000);
      });
    });
  });
})();

console.log('Portfolio website loaded successfully!');
