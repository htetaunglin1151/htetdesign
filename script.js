// script.js

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle (SVG icons, no Material Icons)
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
    link.addEventListener('click', () => {
      closeMenu();
    });
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

// Prevent nav links default for now (until anchors are added)
// NOTE: This will also block real links like sandbox.html.
// If you want sandbox.html to work, remove this block or add a condition.
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Navigation clicked:', link.textContent);
  });
});

// Project card hover effects enhancement
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

// Intersection Observer for scroll animations
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

function updateNYCTime() {
  const now = new Date();

  // Format time for NYC (America/New_York timezone)
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

  document.getElementById('nyc-time').textContent = `${time}, ${date}`;
}

// Update immediately
updateNYCTime();

// Update every minute
setInterval(updateNYCTime, 60000);

console.log('Portfolio website loaded successfully!');
