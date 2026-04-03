// Mobile About: overlapping card stack — 04 back (top), 01 front (bottom); variable heights; indices never overlap.
(function () {
  const root = document.getElementById('designCardStack');
  if (!root) return;

  const viewport = root.querySelector('.design-stack__viewport');
  const cards = Array.from(root.querySelectorAll('.design-stack-card'));
  if (!viewport || cards.length === 0) return;

  const n = cards.length;
  /* ≥ index line (44px) + padding so 01/02/03/04 stay fully visible */
  const stepPx = 52;

  let order = cards.map((_, i) => i);

  function updateViewportMinHeight() {
    let maxBottom = 0;
    order.forEach((contentIdx, stackPos) => {
      const el = cards[contentIdx];
      const translateY = (n - 1 - stackPos) * stepPx;
      maxBottom = Math.max(maxBottom, translateY + el.offsetHeight);
    });
    viewport.style.minHeight = `${Math.ceil(maxBottom + 20)}px`;
  }

  function applyStack() {
    order.forEach((contentIdx, stackPos) => {
      const el = cards[contentIdx];
      el.classList.toggle('design-stack-card--front', stackPos === 0);
      const z = 40 - stackPos;
      const translateY = (n - 1 - stackPos) * stepPx;
      el.style.zIndex = String(z);
      el.style.transform = `translateY(${translateY}px)`;
      el.style.pointerEvents = stackPos === 0 ? 'auto' : 'none';
      el.setAttribute('aria-hidden', stackPos === 0 ? 'false' : 'true');
    });
    requestAnimationFrame(() => updateViewportMinHeight());
  }

  function rotateStack() {
    order = [...order.slice(1), order[0]];
    applyStack();
  }

  viewport.addEventListener('click', () => {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    rotateStack();
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(max-width: 768px)').matches) applyStack();
  });

  applyStack();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => applyStack());
  }
})();

// Desktop: "How I got into Design" card stack — click to advance
(function () {
  const root = document.getElementById('designCardStackDesktop');
  if (!root) return;

  const viewport = root.querySelector('.design-stack__viewport');
  const cards = Array.from(root.querySelectorAll('.design-stack-card'));
  if (!viewport || cards.length === 0) return;

  const n = cards.length;
  const stepPx = 90;

  let order = cards.map((_, i) => i);

  function updateViewportMinHeight() {
    let maxBottom = 0;
    order.forEach((contentIdx, stackPos) => {
      const el = cards[contentIdx];
      const translateY = (n - 1 - stackPos) * stepPx;
      maxBottom = Math.max(maxBottom, translateY + el.offsetHeight);
    });
    viewport.style.minHeight = `${Math.ceil(maxBottom + 20)}px`;
  }

  function applyStack() {
    order.forEach((contentIdx, stackPos) => {
      const el = cards[contentIdx];
      el.classList.toggle('design-stack-card--front', stackPos === 0);
      const z = 40 - stackPos;
      const translateY = (n - 1 - stackPos) * stepPx;
      el.style.zIndex = String(z);
      el.style.transform = `translateY(${translateY}px)`;
      el.style.pointerEvents = stackPos === 0 ? 'auto' : 'none';
      el.setAttribute('aria-hidden', stackPos === 0 ? 'false' : 'true');
    });
    requestAnimationFrame(() => updateViewportMinHeight());
  }

  function rotateStack() {
    order = [...order.slice(1), order[0]];
    applyStack();
  }

  viewport.addEventListener('click', rotateStack);

  window.addEventListener('resize', applyStack);

  applyStack();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => applyStack());
  }
})();

// My Journey: horizontal swipe + horizontal rotation scrubber
(function () {
  const frame        = document.getElementById('journeyPhone');
  const swipeArea    = document.getElementById('journeySwipeArea');
  const entriesTrack = document.getElementById('journeyEntriesTrack');
  const scrollCont   = document.getElementById('journeyHScroll');
  const trackEl      = document.getElementById('journeyHScrollTrack');
  if (!frame || !swipeArea || !entriesTrack || !scrollCont || !trackEl) return;

  const positions = [
    { num: '01', company: 'Quilly', role: 'UX Designer Intern', dates: 'Jan 2026 - May 2026' },
    { num: '02', company: 'Google Code Next', role: 'Design Mentor Intern', dates: 'Feb 2025 - Jun 2025' },
    { num: '03', company: 'Bearworks', role: 'Product Design Intern', dates: 'Jun 2024 - Aug 2024' },
    { num: '04', company: 'Amplio', role: 'User Experience Designer', dates: 'May 2024 - Aug 2024' },
    { num: '05', company: 'The City University of New York', role: 'Social Media Design Intern', dates: 'Aug 2023 - May 2024' },
  ];

  // ── Build tick marks ───────────────────────────────────────────
  const ENTRY_SPACING = 80; // px between entry ticks (= 10 * 8px steps)
  const TICKS_BETWEEN = 9;  // minor ticks between each entry
  const entryTickEls = [];

  positions.forEach((_, e) => {
    const tick = document.createElement('div');
    tick.className = 'hscroll-tick hscroll-tick--entry';
    trackEl.appendChild(tick);
    entryTickEls.push(tick);

    if (e < positions.length - 1) {
      for (let t = 0; t < TICKS_BETWEEN; t++) {
        const minor = document.createElement('div');
        minor.className = 'hscroll-tick hscroll-tick--minor';
        trackEl.appendChild(minor);
      }
    }
  });

  function updateTicks(index) {
    entryTickEls.forEach((el, i) => el.classList.toggle('active', i === index));
  }

  // ── Entry cards ────────────────────────────────────────────────
  function getSlideWidth() {
    return swipeArea.clientWidth > 0 ? swipeArea.clientWidth : 375;
  }

  positions.forEach((p) => {
    const div = document.createElement('div');
    div.className = 'journey-entry';
    div.innerHTML = `
      <div class="journey-entry__number">${p.num}</div>
      <div class="journey-entry__company-block">
        <div class="journey-entry__company">${p.company}</div>
        <div class="journey-entry__role">${p.role}</div>
        <div class="journey-entry__dates">${p.dates}</div>
      </div>
    `;
    entriesTrack.appendChild(div);
  });

  let current = 0;

  function goTo(index, animate) {
    if (index < 0 || index >= positions.length) return;
    current = index;
    const easing = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    trackEl.style.transition = animate ? easing : 'none';
    trackEl.style.transform  = `translateX(${-current * ENTRY_SPACING}px)`;
    updateTicks(current);

    entriesTrack.style.transition = animate ? easing : 'none';
    entriesTrack.style.transform  = `translateX(${-current * getSlideWidth()}px)`;

    if (!animate) void trackEl.offsetHeight;
  }

  // ── Scrubber drag interaction ──────────────────────────────────
  let scrubDragging = false;
  let scrubStartX   = 0;

  function scrubStart(x) {
    scrubDragging = true;
    scrubStartX   = x;
    trackEl.style.transition      = 'none';
    entriesTrack.style.transition = 'none';
  }

  function scrubMove(x) {
    if (!scrubDragging) return;
    const dx  = x - scrubStartX;
    const min = -(positions.length - 1) * ENTRY_SPACING;
    const raw = -current * ENTRY_SPACING + dx;
    trackEl.style.transform = `translateX(${Math.max(min, Math.min(0, raw))}px)`;
  }

  function scrubEnd(x) {
    if (!scrubDragging) return;
    scrubDragging = false;
    const dx       = x - scrubStartX;
    const rawEntry = current - dx / ENTRY_SPACING;
    goTo(Math.max(0, Math.min(positions.length - 1, Math.round(rawEntry))), true);
  }

  scrollCont.addEventListener('mousedown',  (e) => scrubStart(e.clientX));
  window.addEventListener('mousemove',      (e) => scrubMove(e.clientX));
  window.addEventListener('mouseup',        (e) => scrubEnd(e.clientX));
  scrollCont.addEventListener('touchstart', (e) => scrubStart(e.touches[0].clientX),         { passive: true });
  window.addEventListener('touchmove',      (e) => { if (scrubDragging) scrubMove(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',       (e) => scrubEnd(e.changedTouches[0].clientX));

  // ── Card swipe interaction ─────────────────────────────────────
  let startX = 0, startY = 0, swipeDragging = false, lockAxis = null;

  swipeArea.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    swipeDragging = true; lockAxis = null;
  }, { passive: true });

  swipeArea.addEventListener('touchmove', (e) => {
    if (!swipeDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (!lockAxis && (Math.abs(dx) > 6 || Math.abs(dy) > 6))
      lockAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    if (lockAxis === 'x') {
      e.preventDefault();
      entriesTrack.style.transition = 'none';
      entriesTrack.style.transform  = `translateX(${-current * getSlideWidth() + dx * 0.6}px)`;
    }
  }, { passive: false });

  swipeArea.addEventListener('touchend', (e) => {
    if (!swipeDragging) return;
    swipeDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (lockAxis === 'x') {
      if (dx < -40 && current < positions.length - 1) goTo(current + 1, true);
      else if (dx > 40 && current > 0) goTo(current - 1, true);
      else goTo(current, true);
    }
    lockAxis = null;
  });

  // ── Init ───────────────────────────────────────────────────────
  function layout() {
    if (swipeArea.clientWidth <= 0) return;
    const hw = Math.round(scrollCont.offsetWidth / 2);
    trackEl.style.paddingLeft  = `${hw}px`;
    trackEl.style.paddingRight = `${hw}px`;
    goTo(current, false);
  }

  layout();
  requestAnimationFrame(() => layout());
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => layout());
})();
