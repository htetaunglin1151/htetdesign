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

// Content-panel interactions. Everything here binds to elements inside
// .content-panel, so it runs on initial load AND again after every
// SPA-style page swap (see the navigation block near the end).
function initContentInteractions() {
  const projectCards = document.querySelectorAll('.project-card');

  // Custom cursor: "View case study" with eye icon (desktop only)
  if (projectCards.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let cursor = document.getElementById('case-study-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'case-study-cursor';
      cursor.innerHTML = `
        <svg class="eye" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
        </svg>
        <span class="label">View case study</span>
      `;
      document.body.appendChild(cursor);

      // Hide cursor when leaving the window (prevents a stuck cursor)
      window.addEventListener('blur', () => cursor.classList.remove('visible'));
    }

    let raf = 0;
    let mx = 0;
    let my = 0;

    const moveCursor = () => {
      raf = 0;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const setPos = (x, y) => {
      mx = x;
      my = y;
      if (!raf) raf = requestAnimationFrame(moveCursor);
    };

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

}

initContentInteractions();

// Social link interactions
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', () => {
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
      link.style.transform = 'scale(1.08)';
    }, 100);
  });
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

// Sliding active-page indicator: one persistent dot in the sidebar nav
// that travels to the active link via transform (never `top`). It
// stretches vertically / squeezes horizontally while moving — a bit
// more for longer hops — then settles back into a perfect circle.
// With prefers-reduced-motion it still moves, but without the stretch
// and blur. Returns the update function so the SPA router below can
// animate it on page switches (including back/forward).
const updateNavIndicator = (function () {
  const nav = document.querySelector('.sidebar__nav');
  const indicator = nav ? nav.querySelector('.sidebar__nav-indicator') : null;
  if (!nav || !indicator) return function () {};

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lastY = null;
  let settleTimer = null;
  let onEnd = null;

  function activeLink() {
    return nav.querySelector('.sidebar__nav-link--active');
  }

  // Target position relative to the nav container: vertically centered
  // on the active link, just to the right of its label text.
  function targetFor(link) {
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(link);
    const textRect = range.getBoundingClientRect();
    return {
      x: textRect.right - navRect.left + 8,
      y: linkRect.top - navRect.top + (linkRect.height - indicator.offsetHeight) / 2
    };
  }

  function settle(base) {
    indicator.classList.remove('is-moving');
    indicator.style.transform = base;
  }

  function update(animate) {
    const link = activeLink();
    if (!link || !nav.offsetParent) return; // sidebar hidden (mobile)

    const { x, y } = targetFor(link);
    const base = 'translate(' + x + 'px, ' + y + 'px)';
    const distance = lastY === null ? 0 : Math.abs(y - lastY);
    lastY = y;

    if (onEnd) indicator.removeEventListener('transitionend', onEnd);
    clearTimeout(settleTimer);

    // First placement: position instantly (no slide in from the corner).
    if (!indicator.classList.contains('is-ready')) {
      indicator.style.transition = 'none';
      settle(base);
      void indicator.offsetWidth;
      indicator.style.transition = '';
      indicator.classList.add('is-ready');
      return;
    }

    if (!animate || distance === 0 || reduceMotion.matches) {
      settle(base);
      return;
    }

    // Squash & stretch, scaled up slightly for longer travel.
    const stretch = Math.min(1.9, 1.25 + distance / 220);
    const squeeze = Math.max(0.72, 1 - (stretch - 1) * 0.3);

    indicator.classList.add('is-moving');
    indicator.style.transform = base + ' scale(' + squeeze + ', ' + stretch + ')';

    onEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      indicator.removeEventListener('transitionend', onEnd);
      onEnd = null;
      settle(base);
    };
    indicator.addEventListener('transitionend', onEnd);
    // Fallback so the dot always rounds back (e.g. backgrounded tab).
    settleTimer = setTimeout(() => {
      if (onEnd) indicator.removeEventListener('transitionend', onEnd);
      onEnd = null;
      settle(base);
    }, 700);
  }

  update(false);
  // Re-measure once fonts load (label widths change) and on resize.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => update(false));
  }
  window.addEventListener('resize', () => update(false));

  return update;
})();

// SPA-style navigation between internal pages (desktop only): fetch the
// target page in the background and swap ONLY the right content panel.
// The left sidebar element is never replaced, so it stays perfectly
// still — no full-page reload, no black flash.
(function () {
  const desktopView = window.matchMedia('(min-width: 769px)');

  function duration() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--duration-page');
    return parseFloat(raw) || 250;
  }

  // Normalize URLs so "/", "/index.html" and "/index" compare equal.
  function pageKey(url) {
    let p = new URL(url, window.location.href).pathname.replace(/\.html$/, '');
    if (p.endsWith('/index')) p = p.slice(0, -'index'.length);
    return p;
  }

  // Copy the active-link markers from the fetched page into the
  // persistent sidebar nav and mobile menu.
  function syncNavActive(doc) {
    ['.sidebar__nav', '.nav-links'].forEach((sel) => {
      const cur = document.querySelector(sel);
      const next = doc.querySelector(sel);
      if (!cur || !next) return;
      const nextLinks = [...next.querySelectorAll('a[href]')];
      [...cur.querySelectorAll('a[href]')].forEach((a) => {
        const match = nextLinks.find((b) => b.getAttribute('href') === a.getAttribute('href'));
        if (!match) return;
        ['sidebar__nav-link--active', 'nav-link-active'].forEach((cls) => {
          a.classList.toggle(cls, match.classList.contains(cls));
        });
      });
    });
  }

  // Load stylesheets the next page needs that this one doesn't have yet
  // (e.g. about.css) BEFORE the swap, so content never renders unstyled.
  function syncStylesheets(doc) {
    const have = new Set(
      [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href'))
    );
    const pending = [];
    doc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
      const href = l.getAttribute('href');
      if (!href || have.has(href)) return;
      const clone = document.createElement('link');
      clone.rel = 'stylesheet';
      clone.href = href;
      pending.push(new Promise((resolve) => {
        clone.onload = resolve;
        clone.onerror = resolve;
      }));
      document.head.appendChild(clone);
    });
    return Promise.all(pending);
  }

  // Re-run page-specific scripts (e.g. about.js) against the swapped-in
  // content. script.js itself must not run twice.
  function runPageScripts(doc) {
    doc.querySelectorAll('script[src]').forEach((s) => {
      const src = s.getAttribute('src');
      if (!src || src.endsWith('script.js')) return;
      const el = document.createElement('script');
      el.src = src;
      el.onload = () => el.remove();
      el.onerror = () => el.remove();
      document.body.appendChild(el);
    });
  }

  let navigating = false;

  async function loadPage(url, push) {
    if (navigating) return;
    const panel = document.querySelector('.content-panel');
    if (!panel) {
      window.location.href = url;
      return;
    }
    navigating = true;

    let doc = null;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    } catch (err) {
      window.location.href = url; // network trouble → normal navigation
      return;
    }

    const nextPanel = doc.querySelector('.content-panel');
    if (!nextPanel) {
      window.location.href = url;
      return;
    }

    // Fade the old panel out while any new stylesheets finish loading.
    panel.classList.add('is-swapping');
    await Promise.all([
      syncStylesheets(doc),
      new Promise((resolve) => setTimeout(resolve, duration()))
    ]);

    nextPanel.classList.add('is-swapping');
    panel.replaceWith(nextPanel);

    document.title = doc.title;
    document.body.className = doc.body.className;
    syncNavActive(doc);
    updateNavIndicator(true);
    initContentInteractions();
    runPageScripts(doc);
    if (push) history.pushState({ spa: true }, '', url);

    // Commit the hidden state with a forced reflow, then remove the
    // class so the opacity transition plays. (No rAF — that stalls in
    // hidden/background tabs and would leave the panel invisible.)
    void nextPanel.offsetWidth;
    nextPanel.classList.remove('is-swapping');
    navigating = false;
  }

  document.querySelectorAll('.sidebar a[href$=".html"]').forEach((link) => {
    if (link.target === '_blank') return;
    link.addEventListener('click', (e) => {
      if (!desktopView.matches) return;
      e.preventDefault();
      if (pageKey(link.href) === pageKey(window.location.href)) return; // already here
      loadPage(link.getAttribute('href'), true);
    });
  });

  // Back/forward buttons re-use the same swap.
  window.addEventListener('popstate', () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    loadPage(page, false);
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
