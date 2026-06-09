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
    var scene = document.querySelector('.cta-scene');
    var container = document.getElementById('ctaWhales');
    var content = document.querySelector('.cta-content');
    if (!scene || !container || !content) return;

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function overlap(a, b, pad) {
      pad = pad || 0;
      return !(
        a.right + pad < b.left ||
        a.left - pad > b.right ||
        a.bottom + pad < b.top ||
        a.top - pad > b.bottom
      );
    }

    function whaleCount() {
      var w = scene.clientWidth;
      if (w < 520) return 10;
      if (w < 760) return 14;
      return 18;
    }

    function clamp(val, min, max) {
      return Math.min(max, Math.max(min, val));
    }

    function createWhale(sizePx, flip, rot, delay) {
      var whale = document.createElement('span');
      whale.className = 'cta-whale' + (reduced ? '' : ' cta-whale--bob');
      var img = document.createElement('img');
      img.src = '/assets/whale-pixel.png?v=3';
      img.alt = '';
      img.className = 'whale-pixel whale-pixel--cta';
      img.width = 140;
      img.height = 140;
      img.decoding = 'async';
      img.style.width = sizePx.toFixed(0) + 'px';
      img.style.transform = 'scaleX(' + flip + ') rotate(' + rot + 'deg)';
      whale.style.animationDelay = delay.toFixed(2) + 's';
      whale.appendChild(img);
      return whale;
    }

    function placeWhales() {
      container.innerHTML = '';
      var sceneRect = scene.getBoundingClientRect();
      var contentRect = content.getBoundingClientRect();
      var w = sceneRect.width;
      var h = sceneRect.height;
      var edge = 14;
      var gap = 22;
      var contentLeft = contentRect.left - sceneRect.left;
      var contentRight = contentRect.right - sceneRect.left;
      var contentTop = contentRect.top - sceneRect.top;
      var contentBottom = contentRect.bottom - sceneRect.top;
      var narrowView = w < 640;
      var baseW = narrowView
        ? Math.min(88, Math.max(56, w * 0.16))
        : Math.min(128, Math.max(72, w * 0.11));
      var contentPad = narrowView ? -28 : 10;
      var placed = [];
      var count = whaleCount();

      function inBounds(box) {
        return (
          box.left >= edge &&
          box.top >= edge &&
          box.right <= w - edge &&
          box.bottom <= h - edge
        );
      }

      function hitsContent(box, pad, side) {
        pad = pad || 10;
        if (side === 'left' || side === 'top-left' || side === 'bottom-left') {
          return box.right > contentLeft - pad;
        }
        if (side === 'right' || side === 'top-right' || side === 'bottom-right') {
          return box.left < contentRight + pad;
        }
        return overlap(
          box,
          {
            left: contentLeft - pad,
            top: contentTop - pad,
            right: contentRight + pad,
            bottom: contentBottom + pad,
          },
          0
        );
      }

      function tryPlace(side, yPct) {
        var marginLeft = Math.max(0, contentLeft - edge - gap);
        var marginRight = Math.max(0, w - contentRight - edge - gap);
        var sizePx = baseW * rand(0.9, 1.12);
        if (side === 'left' || side === 'top-left' || side === 'bottom-left') {
          sizePx = Math.min(sizePx, marginLeft);
        } else if (side === 'right' || side === 'top-right' || side === 'bottom-right') {
          sizePx = Math.min(sizePx, marginRight);
        }
        if (sizePx < (narrowView ? 44 : 52)) return false;
        var flip = side === 'right' ? -1 : 1;
        if (Math.random() > 0.75) flip *= -1;
        var rot = rand(side === 'left' ? -20 : 8, side === 'left' ? -6 : 22);
        var whale = createWhale(sizePx, flip, rot, rand(0, 2.8));
        container.appendChild(whale);

        var whaleW = whale.offsetWidth;
        var whaleH = whale.offsetHeight;
        var y = clamp((h * yPct) / 100 - whaleH * 0.5, edge, h - whaleH - edge);
        var x;
        var leftMax = contentLeft - whaleW - gap;
        var rightMin = contentRight + gap;
        var narrow = leftMax < edge + 4;

        if (side === 'left') {
          x = narrowView
            ? edge
            : clamp(rand(edge, Math.max(edge, leftMax)), edge, w - whaleW - edge);
        } else if (side === 'right') {
          x = narrowView
            ? w - whaleW - edge
            : clamp(rand(Math.min(rightMin, w - whaleW - edge), w - whaleW - edge), edge, w - whaleW - edge);
        } else if (side === 'top-left') {
          x = clamp(rand(edge, Math.max(edge, narrow ? w * 0.38 - whaleW : leftMax)), edge, w - whaleW - edge);
          y = clamp(rand(edge, Math.max(edge, contentTop - whaleH - gap)), edge, h - whaleH - edge);
        } else if (side === 'top-right') {
          x = clamp(rand(Math.min(narrow ? w * 0.62 : rightMin, w - whaleW - edge), w - whaleW - edge), edge, w - whaleW - edge);
          y = clamp(rand(edge, Math.max(edge, contentTop - whaleH - gap)), edge, h - whaleH - edge);
        } else if (side === 'bottom-left') {
          x = clamp(rand(edge, Math.max(edge, narrow ? w * 0.38 - whaleW : leftMax)), edge, w - whaleW - edge);
          y = clamp(rand(Math.min(contentBottom + gap, h - whaleH - edge), h - whaleH - edge), edge, h - whaleH - edge);
        } else {
          x = clamp(rand(Math.min(narrow ? w * 0.62 : rightMin, w - whaleW - edge), w - whaleW - edge), edge, w - whaleW - edge);
          y = clamp(rand(Math.min(contentBottom + gap, h - whaleH - edge), h - whaleH - edge), edge, h - whaleH - edge);
        }

        whale.style.left = x + 'px';
        whale.style.top = y + 'px';

        var box = { left: x, top: y, right: x + whaleW, bottom: y + whaleH };
        var ok =
          inBounds(box) &&
          !hitsContent(box, contentPad, side) &&
          !placed.some(function (p) {
            return overlap(box, p, gap);
          });

        if (ok) {
          placed.push(box);
          return true;
        }
        container.removeChild(whale);
        return false;
      }

      var slots = [];
      var ySteps = [8, 22, 38, 54, 70, 86];

      ySteps.forEach(function (yPct) {
        slots.push({ side: 'left', yPct: yPct });
        slots.push({ side: 'right', yPct: yPct });
      });
      slots.push({ side: 'top-left', yPct: 6 });
      slots.push({ side: 'top-right', yPct: 6 });
      slots.push({ side: 'bottom-left', yPct: 94 });
      slots.push({ side: 'bottom-right', yPct: 94 });

      slots.forEach(function (slot) {
        if (placed.length >= count) return;
        if (!tryPlace(slot.side, slot.yPct)) {
          tryPlace(slot.side, slot.yPct + rand(-4, 4));
        }
      });

      var extra = 0;
      while (placed.length < count && extra < 60) {
        extra++;
        var sides = ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        tryPlace(sides[Math.floor(Math.random() * sides.length)], rand(6, 94));
      }

      if (placed.length < 6) {
        var fallback = [
          { side: 'left', yPct: 12 },
          { side: 'left', yPct: 34 },
          { side: 'left', yPct: 58 },
          { side: 'left', yPct: 82 },
          { side: 'right', yPct: 18 },
          { side: 'right', yPct: 42 },
          { side: 'right', yPct: 66 },
          { side: 'right', yPct: 88 },
        ];
        fallback.forEach(function (slot) {
          if (placed.length >= count) return;
          for (var attempt = 0; attempt < 6; attempt++) {
            if (tryPlace(slot.side, slot.yPct + rand(-3, 3))) break;
          }
        });
      }
    }

    function schedulePlace() {
      requestAnimationFrame(function () {
        requestAnimationFrame(placeWhales);
      });
    }

    schedulePlace();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(schedulePlace, 220);
    });
    window.addEventListener('load', schedulePlace);

    if ('IntersectionObserver' in window) {
      var ctaIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) schedulePlace();
          });
        },
        { threshold: 0.08 }
      );
      ctaIo.observe(scene);
    }
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
