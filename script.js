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

// Mobile menu toggle (Material Icons)
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.getElementById('navLinks');

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    menuToggle.textContent = isOpen ? 'close' : 'menu';
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking a link (mobile)
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      menuToggle.textContent = 'menu';
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Prevent nav links default for now (until anchors are added)
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
    const projectName = card.querySelector('.project-name').textContent;
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

console.log('Portfolio website loaded successfully!');
