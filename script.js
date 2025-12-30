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

// Prevent nav links default for anchor links, but allow external navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    // Allow navigation for actual page links (like sandbox.html)
    // Only prevent default for anchor-only links (#)
    if (href === '#') {
      e.preventDefault();
      console.log('Navigation clicked:', link.textContent);
    }
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

// Gallery swipe functionality
function initGallery() {
  const galleryTrack = document.getElementById('galleryTrack');
  const indicators = document.querySelectorAll('.indicator');
  
  if (!galleryTrack || indicators.length === 0) return;

  let currentIndex = 0;
  const slides = galleryTrack.querySelectorAll('.gallery-slide');
  const totalSlides = slides.length;

  function updateGallery() {
    galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateGallery();
    });
  });

  // Touch swipe handlers
  let startX = 0;
  let endX = 0;
  let isDragging = false;
  let startTranslate = 0;
  let currentTranslate = 0;

  const galleryContainer = galleryTrack.parentElement;

  galleryContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    startTranslate = currentIndex * -100;
    galleryTrack.style.transition = 'none';
  });

  galleryContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = startTranslate + (diff / galleryContainer.offsetWidth) * 100;
    
    // Constrain the translate
    const minTranslate = -(totalSlides - 1) * 100;
    const maxTranslate = 0;
    currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));
    
    galleryTrack.style.transform = `translateX(${currentTranslate}%)`;
  });

  galleryContainer.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    galleryTrack.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    // Get the end position from the changedTouches (more reliable than currentX)
    endX = e.changedTouches[0].clientX;
    const threshold = 0.15; // 15% of slide width
    const diff = endX - startX;
    const slideWidth = galleryContainer.offsetWidth;

    if (Math.abs(diff) > slideWidth * threshold) {
      // Swipe left (finger moved left, negative diff) = show next slide (increase index)
      if (diff < 0 && currentIndex < totalSlides - 1) {
        currentIndex++;
      } 
      // Swipe right (finger moved right, positive diff) = show previous slide (decrease index)
      else if (diff > 0 && currentIndex > 0) {
        currentIndex--;
      }
    }

    updateGallery();
  });

  // Mouse drag handlers for desktop
  let mouseStartX = 0;
  let mouseIsDragging = false;
  let mouseStartTranslate = 0;
  let mouseCurrentTranslate = 0;

  galleryContainer.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    mouseIsDragging = true;
    mouseStartTranslate = currentIndex * -100;
    galleryTrack.style.transition = 'none';
    galleryContainer.style.cursor = 'grabbing';
    e.preventDefault();
  });

  galleryContainer.addEventListener('mousemove', (e) => {
    if (!mouseIsDragging) return;
    const diff = e.clientX - mouseStartX;
    mouseCurrentTranslate = mouseStartTranslate + (diff / galleryContainer.offsetWidth) * 100;
    
    // Constrain the translate
    const minTranslate = -(totalSlides - 1) * 100;
    const maxTranslate = 0;
    mouseCurrentTranslate = Math.max(minTranslate, Math.min(maxTranslate, mouseCurrentTranslate));
    
    galleryTrack.style.transform = `translateX(${mouseCurrentTranslate}%)`;
  });

  galleryContainer.addEventListener('mouseup', (e) => {
    if (!mouseIsDragging) return;
    mouseIsDragging = false;
    galleryTrack.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    galleryContainer.style.cursor = 'grab';

    const threshold = 0.15; // 15% of slide width (lowered for better responsiveness)
    const diff = e.clientX - mouseStartX;
    const slideWidth = galleryContainer.offsetWidth;

    if (Math.abs(diff) > slideWidth * threshold) {
      // Swipe left (negative diff) = move to next slide (increase index)
      if (diff < 0 && currentIndex < totalSlides - 1) {
        currentIndex++;
      } 
      // Swipe right (positive diff) = move to previous slide (decrease index)
      else if (diff > 0 && currentIndex > 0) {
        currentIndex--;
      }
    }

    updateGallery();
  });

  galleryContainer.addEventListener('mouseleave', () => {
    if (mouseIsDragging) {
      mouseIsDragging = false;
      galleryTrack.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      galleryContainer.style.cursor = 'grab';
      updateGallery();
    }
  });

  // Set initial cursor
  galleryContainer.style.cursor = 'grab';
}

// Initialize gallery when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery);
} else {
  initGallery();
}

console.log('Portfolio website loaded successfully!');
