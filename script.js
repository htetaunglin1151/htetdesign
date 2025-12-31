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

// NYC time (safe on pages without #nyc-time)
function updateNYCTime() {
  const nycEl = document.getElementById('nyc-time');
  if (!nycEl) return;

  const now = new Date();

  const options = {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  const dateOptions = {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric'
  };

  const time = now.toLocaleString('en-US', options);
  const date = now.toLocaleString('en-US', dateOptions);

  nycEl.textContent = `${time}, ${date}`;
}

// Update immediately + every minute (won't do anything if element missing)
updateNYCTime();
setInterval(updateNYCTime, 60000);

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

// Swipe slider for mobile (supports multiple sliders)
document.querySelectorAll('.right').forEach((right) => {
  const track = right.querySelector('.track');
  const slides = Array.from(right.querySelectorAll('.slide'));
  const dotsWrap = right.querySelector('.dots'); // can exist, but hidden on mobile

  if (!track || slides.length === 0) return;

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isTouching = false;

  // If dots exist, build them (desktop). On mobile they are hidden by CSS.
  let dots = [];
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot';
      b.type = 'button';
      b.setAttribute('aria-label', `Slide ${i + 1}`);
      b.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(b);
    });
    dots = Array.from(dotsWrap.querySelectorAll('.dot'));
  }

  function setDots() {
    if (!dots.length) return;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i, animate) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transition = animate ? 'transform 300ms ease' : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
    setDots();
  }

  // Init
  goTo(0, true);

  // Touch swipe
  track.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    isTouching = true;
    startX = e.touches[0].clientX;
    currentX = startX;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    currentX = e.touches[0].clientX;
    const dx = currentX - startX;

    // drag a bit while swiping
    track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isTouching) return;
    isTouching = false;

    const dx = currentX - startX;
    const threshold = 60; // swipe sensitivity

    if (dx < -threshold) index += 1;      // swipe left
    else if (dx > threshold) index -= 1;  // swipe right

    goTo(index, true);
  });

  // Optional: keep correct slide on resize
  window.addEventListener('resize', () => goTo(index, false));
});



console.log('Portfolio website loaded successfully!');
