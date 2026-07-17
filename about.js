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

// About: concert ticket galleries (mobile + desktop) — slides built from data
// (newest first); tap/click or Enter/Space flips a card to its photo; mouse
// users can also drag the track to scroll
(function () {
  const tracks = Array.from(document.querySelectorAll('.ticket-gallery__track'));
  if (tracks.length === 0) return;

  // sec/seat are placeholders where the real ones aren't known — edit freely.
  // Add a `photo` (+ `alt`) to show a picture on the back; otherwise a
  // "Photo coming soon" placeholder is shown.
  const tickets = [
    { tour: 'Music Of The Spheres World Tour', artist: 'Coldplay', date: 'Jul 15, 2025', venue: 'Gillette Stadium', sec: 'Sec Floor', seat: 'Seat GA' },
    { tour: 'DETOX North American Tour 2025', artist: 'ONE OK ROCK', date: 'May 30, 2025', venue: 'Prudential Center', sec: 'Sec Floor', seat: 'Seat GA' },
    { tour: 'The Script', date: 'Sep 30, 2024', venue: 'Brooklyn Paramount', sec: 'Sec Floor', seat: 'Seat GA' },
    { tour: 'Global Citizen Festival', date: 'Sep 28, 2024', venue: 'Great Lawn at Central Park', sec: 'Sec Lawn', seat: 'Seat GA' },
    { tour: 'LOOM World Tour', artist: 'Imagine Dragons', date: 'Aug 2, 2024', venue: 'Northwell at Jones Beach Theater', sec: 'Sec Floor', seat: 'Seat GA' },
    { tour: 'Music From the Studio Ghibli Films', artist: 'Joe Hisaishi', date: 'Jul 13, 2024', venue: 'Madison Square Garden', sec: 'Sec 212', seat: 'Seat 9' },
    { tour: 'Head in the Clouds', date: 'May 11, 2024', venue: 'Forest Hills Stadium', sec: 'Sec Floor', seat: 'Seat GA' },
    { tour: 'Fly by Midnight', date: 'Apr 24, 2024', venue: 'Racket', sec: 'Sec Floor', seat: 'Seat GA' },
    { tour: 'a beautiful blur: the world tour', artist: 'LANY', date: 'Apr 12, 2024', venue: 'Manhattan Center Hammerstein Ballroom', sec: 'Sec Floor', seat: 'Seat GA' },
    { tour: "The 1st World Tour 'Show What I Have'", artist: 'IVE', date: 'Mar 29, 2024', venue: 'Prudential Center', sec: 'Sec 8', seat: 'Seat 15' },
    { tour: 'NIKI', date: 'Aug 3, 2023', venue: 'The Rooftop at Pier 17', sec: 'Sec Floor', seat: 'Seat GA' },
    {
      tour: '+–=÷× Tour', artist: 'Ed Sheeran', date: 'Jun 11, 2023', venue: 'MetLife Stadium',
      sec: 'Sec 111', seat: 'Seat 12',
      photo: 'images/Concert1.JPEG', alt: 'Htet at MetLife Stadium before Ed Sheeran\'s Mathematics Tour'
    },
  ];

  const eyeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>`;

  function buildSlide(track, t) {
    const who = t.artist || t.tour;
    const back = t.photo
      ? `<img src="${t.photo}" alt="${t.alt || ''}" class="ticket-flip__photo" loading="lazy" />`
      : `<p class="ticket-flip__placeholder">Photo coming soon</p>`;

    const slide = document.createElement('div');
    slide.className = 'ticket-gallery__slide';
    slide.innerHTML = `
      <div class="ticket-flip" role="button" tabindex="0" aria-pressed="false"
        aria-label="Concert ticket for ${who} at ${t.venue} — tap to flip and see the photo">
        <div class="ticket-flip__inner">
          <div class="ticket-flip__face ticket-flip__face--front">
            <article class="ticket">
              <div class="ticket__grid">
                <div class="ticket__row ticket__row--meta">
                  <span class="ticket__cell">${t.venue}</span>
                  <span class="ticket__cell">${t.date}</span>
                </div>
                <div class="ticket__row ticket__row--title">
                  <span class="ticket__tour">${t.tour}</span>
                  ${t.artist ? `<span class="ticket__artist">${t.artist}</span>` : ''}
                </div>
                <div class="ticket__row ticket__row--seat">
                  <span class="ticket__cell">${t.sec}</span>
                  <span class="ticket__cell">Role · Fan</span>
                  <span class="ticket__cell">${t.seat}</span>
                  <span class="ticket__cell ticket__cell--eye" aria-hidden="true">${eyeSvg}</span>
                </div>
              </div>
              <span class="ticket__rail ticket__rail--flip" aria-hidden="true">tap for photo</span>
            </article>
          </div>
          <div class="ticket-flip__face ticket-flip__face--back">${back}</div>
        </div>
      </div>`;
    track.appendChild(slide);

    const card = slide.querySelector('.ticket-flip');
    function flip() {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    }
    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  }

  // Mouse drag-to-scroll (touch keeps native scrolling). Scroll snap is
  // paused during the drag, then the track snaps to the nearest ticket.
  // A drag beyond the threshold swallows the click so cards don't flip.
  function enableDragScroll(track) {
    let down = false, dragged = false, startX = 0, startScroll = 0;

    function slideStep() {
      const slide = track.querySelector('.ticket-gallery__slide');
      if (!slide) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slide.offsetWidth + gap;
    }

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true;
      dragged = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
    });

    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > 5) {
        dragged = true;
        track.classList.add('is-dragging');
        track.style.scrollSnapType = 'none';
        track.style.scrollBehavior = 'auto';
      }
      if (dragged) track.scrollLeft = startScroll - dx;
    });

    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (!dragged) return;
      track.classList.remove('is-dragging');
      const step = slideStep();
      const target = Math.round(track.scrollLeft / step) * step;
      track.style.scrollBehavior = '';
      if (Math.abs(target - track.scrollLeft) < 1) {
        track.style.scrollSnapType = '';
        return;
      }
      // Re-enable snap only once the smooth scroll has finished, or it
      // would cancel the animation mid-flight (fallback timer for
      // browsers without scrollend)
      let restored = false;
      const restore = () => {
        if (restored) return;
        restored = true;
        track.style.scrollSnapType = '';
      };
      track.addEventListener('scrollend', restore, { once: true });
      setTimeout(restore, 800);
      track.scrollTo({ left: target, behavior: 'smooth' });
    });

    track.addEventListener('click', (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    }, true);
  }

  tracks.forEach((track) => {
    tickets.forEach((t) => buildSlide(track, t));
    enableDragScroll(track);
  });
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
