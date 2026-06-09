(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EMAIL_TEXT =
    "Hi Professor Chen,\n\n" +
    "I hope you're doing well. I'm writing about my Essay 2 grade on Canvas. Your feedback noted I needed deeper analysis, but the rubric's Evidence & Explanation row asks for cited examples — which I included in paragraphs 2 and 4.\n\n" +
    "Would you be open to a second look when you have a moment? Thank you for your time.\n\n" +
    'Best,\nJordan';

  var FADE_SELECTORS = [
    '.reveal',
    '.step-anim',
    '.step-row',
    '.step-strip',
    '.check-row',
    '.email-studio',
    '.trust-item',
    '.faq-row',
    '.email-card',
    '.draft-h',
    '.tabs',
    '.app-head',
    '.quote-eyebrow',
    '.quote-mark',
    '.quote-text',
    '.quote-by',
    '.foot p',
    '.face',
    '.proof-txt',
    '.rating',
    '.spin-once',
    '.phone-frame',
    '.trust',
    '.app-panel',
    '.hero-phone',
    '.signup',
    '.waitlist-perk',
    '.input-wrap',
    '.topbar-logo',
    '.brand-wordmark',
    '.btn-nav',
    '.trust-band-label',
    '.privacy-note',
    '.privacy-note-title',
    '.privacy-note-text',
    '.whale-mascot',
    '.hero-whale-mascot',
    '.world-globe',
    '.hero-visual',
    '.foot-top',
    '.foot-grid',
    '.foot-copy',
    '.glass-note',
    '.topbar-nav',
    '.felix-feature',
    '.felix-feature-num',
  ];

  /* ── Scroll progress + topbar ── */
  var progress = document.getElementById('scrollProgress');
  var topbar = document.querySelector('.topbar');

  function syncHeaderHeight() {
    if (!topbar) return;
    document.documentElement.style.setProperty('--header-h', topbar.offsetHeight + 'px');
  }

  function syncHeroPhoneTop() {
    var whale = document.querySelector('.hero-whale-mascot');
    var visual = document.querySelector('.hero-visual');
    var layout = document.querySelector('.hero-layout');
    if (!whale || !visual || !layout) return;

    if (window.innerWidth > 899) {
      visual.style.top = '';
      visual.style.transform = '';
      return;
    }

    var top = whale.getBoundingClientRect().top - layout.getBoundingClientRect().top;
    visual.style.top = Math.max(0, top) + 'px';
    visual.style.transform = 'none';
  }

  var lastScrollY = window.scrollY || 0;
  var headerRevealY = 72;
  var headerScrollDelta = 8;

  function onScroll() {
    var doc = document.documentElement;
    var y = window.scrollY;
    var pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
    if (progress) progress.style.width = (pct * 100) + '%';
    if (topbar) {
      topbar.classList.toggle('scrolled', y > 24);
      if (!reduced) {
        if (y <= headerRevealY) {
          topbar.classList.remove('is-hidden');
        } else if (y > lastScrollY + headerScrollDelta) {
          topbar.classList.add('is-hidden');
        } else if (y < lastScrollY - headerScrollDelta) {
          topbar.classList.remove('is-hidden');
        }
      } else {
        topbar.classList.remove('is-hidden');
      }
    }
    lastScrollY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  var heroPhoneTimer;
  function onLayoutChange() {
    syncHeaderHeight();
    clearTimeout(heroPhoneTimer);
    heroPhoneTimer = setTimeout(syncHeroPhoneTop, 50);
  }
  window.addEventListener('resize', onLayoutChange, { passive: true });
  window.addEventListener('load', onLayoutChange);
  syncHeaderHeight();
  syncHeroPhoneTop();
  onScroll();

  /* ── Typewriter helper ── */
  var typeTimers = {};

  function clearTypeTimer(id) {
    if (typeTimers[id]) {
      clearTimeout(typeTimers[id]);
      delete typeTimers[id];
    }
  }

  function typeText(el, text, speed, id, onDone) {
    if (!el) return;
    clearTypeTimer(id);
    el.textContent = '';
    var i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        typeTimers[id] = setTimeout(tick, speed);
      } else {
        clearTypeTimer(id);
        if (onDone) onDone();
      }
    }
    tick();
  }

  /* ── Bidirectional scroll fade for everything ── */
  function collectFadeEls() {
    var seen = new Set();
    var els = [];

    FADE_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (seen.has(el)) return;
        seen.add(el);
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal', 'reveal-up');
        }
        els.push(el);
      });
    });

    return els;
  }

  function initScrollFade() {
    var els = collectFadeEls();
    if (!els.length) return;

    if (reduced) {
      els.forEach(function (el) {
        el.classList.add('in');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var el = e.target;
          if (e.isIntersecting) {
            el.classList.add('in');
            handleEnter(el);
          } else {
            el.classList.remove('in');
            handleExit(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function handleEnter(el) {
    if (el.classList.contains('quote-text')) startReviewTyping();
  }

  function handleExit(el) {
    if (el.classList.contains('quote-text')) {
      resetReviewTyping();
    }
    if (el.classList.contains('faq-row') && el.classList.contains('open')) {
      el.classList.remove('open');
      var btn = el.querySelector('.faq-btn');
      var ans = el.querySelector('.faq-answer');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (ans) {
        clearTypeTimer('faq-' + ans.getAttribute('data-answer'));
        ans.textContent = '';
      }
    }
  }

  /* ── Email preview typing (replays on re-enter) ── */
  var emailTyping = false;
  var emailStarted = false;

  function emailTypeSpeed() {
    return window.matchMedia('(min-width: 900px)').matches ? 12 : 16;
  }

  function startEmailTyping() {
    var card = document.querySelector('.email-card');
    var el = document.getElementById('emailType');
    var cursor = document.getElementById('emailCursor');
    if (!card || !el || emailTyping || emailStarted) return;

    emailTyping = true;
    emailStarted = true;
    card.classList.add('typing');
    if (cursor) cursor.classList.remove('done');
    typeText(el, EMAIL_TEXT, emailTypeSpeed(), 'email', function () {
      card.classList.remove('typing');
      if (cursor) cursor.classList.add('done');
      emailTyping = false;
    });
  }

  function resetEmailTyping() {
    var card = document.querySelector('.email-card');
    var el = document.getElementById('emailType');
    var cursor = document.getElementById('emailCursor');
    clearTypeTimer('email');
    emailTyping = false;
    emailStarted = false;
    if (el) el.textContent = '';
    if (card) card.classList.remove('typing');
    if (cursor) cursor.classList.remove('done');
  }

  function initEmailTypingObserver() {
    var studio = document.querySelector('.email-studio');
    if (!studio || reduced) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            startEmailTyping();
          } else {
            resetEmailTyping();
          }
        });
      },
      { threshold: 0.28, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(studio);
  }

  /* ── Review quote typing (replays on re-enter) ── */
  var reviewFull = '';
  var reviewTyping = false;

  function startReviewTyping() {
    var el = document.getElementById('reviewQuote');
    if (!el || reviewTyping) return;
    if (!reviewFull) reviewFull = el.getAttribute('data-full') || el.textContent.trim();
    reviewTyping = true;
    typeText(el, reviewFull, 22, 'review', function () {
      reviewTyping = false;
    });
  }

  function resetReviewTyping() {
    var el = document.getElementById('reviewQuote');
    clearTypeTimer('review');
    reviewTyping = false;
    if (el) el.textContent = '';
  }

  function initReviewText() {
    var el = document.getElementById('reviewQuote');
    if (!el) return;
    reviewFull = el.textContent.trim();
    el.setAttribute('data-full', reviewFull);
    if (!reduced) el.textContent = '';
  }

  /* ── Tab highlight cycle (demo) ── */
  function initTabCycle() {
    if (reduced) return;
    var tabs = document.querySelectorAll('.tab');
    if (!tabs.length) return;
    var idx = 0;
    setInterval(function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
      });
      idx = (idx + 1) % tabs.length;
      tabs[idx].classList.add('active');
    }, 3200);
  }

  /* ── FAQ accordion + typing answers ── */
  function initFaq() {
    document.querySelectorAll('.faq-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('.faq-row');
        var open = row.classList.contains('open');

        document.querySelectorAll('.faq-row.open').forEach(function (el) {
          el.classList.remove('open');
          el.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
          var ans = el.querySelector('.faq-answer');
          if (ans) {
            clearTypeTimer('faq-' + (ans.getAttribute('data-answer') || ''));
            ans.textContent = '';
          }
        });

        if (!open) {
          row.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          var answerEl = row.querySelector('.faq-answer');
          var text = answerEl && answerEl.getAttribute('data-answer');
          if (answerEl && text) {
            if (reduced) {
              answerEl.textContent = text;
            } else {
              answerEl.textContent = '';
              typeText(answerEl, text, 18, 'faq-' + text);
            }
          }
        }
      });
    });
  }

  /* ── Button ripple on click ── */
  function initRipple() {
    if (reduced) return;
    document.querySelectorAll('.btn-anim').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText =
          'position:absolute;border-radius:50%;background:rgba(255,255,255,0.45);' +
          'width:20px;height:20px;left:' +
          (e.clientX - rect.left - 10) +
          'px;top:' +
          (e.clientY - rect.top - 10) +
          'px;pointer-events:none;animation:ripple-out .6s ease forwards;';
        btn.appendChild(ripple);
        setTimeout(function () {
          ripple.remove();
        }, 600);
      });
    });

    if (!document.getElementById('ripple-style')) {
      var style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent =
        '@keyframes ripple-out{from{transform:scale(0);opacity:1}to{transform:scale(8);opacity:0}}';
      document.head.appendChild(style);
    }
  }

  /* ── Boot ── */
  /* ── Whale mascot — idle + wave on hero enter (Felix cat-style) ── */
  function initWhaleMascot() {
    var whale = document.getElementById('whaleMascot');
    if (!whale || reduced) return;

    function wave() {
      whale.classList.add('wave');
      setTimeout(function () {
        whale.classList.remove('wave');
      }, 700);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) wave();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(whale);

    setInterval(wave, 9000);
    whale.addEventListener('click', wave);
  }

  function initLogoMarquee() {
    var tracks = document.querySelectorAll('.logo-marquee-track');
    if (!tracks.length) return;

    function setupTrack(track) {
      var first = track.querySelector('.logo-marquee-set');
      if (!first) return;

      track.querySelectorAll('.logo-marquee-set').forEach(function (set, i) {
        if (i > 0) set.remove();
      });

      var clone = first.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);

      function syncSets() {
        var setWidth = first.offsetWidth;
        if (!setWidth) return;
        track.style.setProperty('--marquee-shift', setWidth + 'px');
        track.style.setProperty('--marquee-duration', setWidth / 55 + 's');
      }

      track.querySelectorAll('img').forEach(function (img) {
        if (!img.complete) {
          img.addEventListener('load', syncSets, { once: true });
        }
      });

      syncSets();
      return syncSets;
    }

    var syncers = [];
    tracks.forEach(function (track) {
      var sync = setupTrack(track);
      if (sync) syncers.push(sync);
    });

    var marqueeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(marqueeTimer);
      marqueeTimer = setTimeout(function () {
        syncers.forEach(function (sync) {
          sync();
        });
      }, 120);
    });
    window.addEventListener('load', function () {
      syncers.forEach(function (sync) {
        sync();
      });
    });
  }

  function initCtaWhales() {
    var whales = document.querySelectorAll('.cta-whale--static');
    if (!whales.length || reduced) return;
    whales.forEach(function (whale, i) {
      whale.style.animationDelay = (i * 0.22) + 's';
    });
  }

  function initStepStrip() {
    var strips = document.querySelectorAll('.step-strip');
    if (!strips.length || reduced) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            strips.forEach(function (s) {
              s.classList.remove('active');
            });
            e.target.classList.add('active');
          }
        });
      },
      { threshold: 0.55, rootMargin: '0px 0px -20% 0px' }
    );
    strips.forEach(function (s) {
      io.observe(s);
    });
    strips[0].classList.add('active');
  }

  function boot() {
    initReviewText();
    initScrollFade();
    initEmailTypingObserver();
    initTabCycle();
    initFaq();
    initRipple();
    initWhaleMascot();
    initLogoMarquee();
    initCtaWhales();
    initStepStrip();
    syncHeroPhoneTop();

    if (reduced) {
      var el = document.getElementById('emailType');
      if (el) el.textContent = EMAIL_TEXT;
      var cursor = document.getElementById('emailCursor');
      if (cursor) cursor.classList.add('done');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
