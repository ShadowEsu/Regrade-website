// Shared building blocks for Regrade

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const REGRADE_WAITLIST_LS = 'regrade_waitlist_v1';

function getWaitlistEmail() {
  const cfg = typeof window !== 'undefined' && window.REGRADE_CONFIG;
  const raw = cfg && String(cfg.waitlistEmail || '').trim();
  if (!raw || raw.includes('YOUR_EMAIL@')) return 'hello@regrade.app';
  return raw;
}

/** Same-window mailto avoids blank tabs that `window.location` / `target=_blank` often cause. */
function openMailtoUrl(href) {
  try {
    const a = document.createElement('a');
    a.href = href;
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (_) {
    window.location.assign(href);
  }
}

function buildWaitlistMailtoHref({ name, email }) {
  const to = getWaitlistEmail();
  const subject = encodeURIComponent('Regrade waitlist — early access');
  const body = encodeURIComponent(
    'Please add me to the Regrade early access waitlist.\n\n' +
      `Name: ${String(name).trim()}\n` +
      `Email: ${String(email).trim()}\n`
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function openWaitlistMailto({ name, email }) {
  openMailtoUrl(buildWaitlistMailtoHref({ name, email }));
}

function recordWaitlistEntry({ name, email, source }) {
  try {
    const prev = JSON.parse(localStorage.getItem(REGRADE_WAITLIST_LS) || '[]');
    if (!Array.isArray(prev)) return;
    prev.push({
      name: String(name).trim(),
      email: String(email).trim(),
      source: source || 'unknown',
      ts: new Date().toISOString(),
    });
    localStorage.setItem(REGRADE_WAITLIST_LS, JSON.stringify(prev));
  } catch (_) {}
}

/**
 * Saves signup locally, optionally POSTs to Web3Forms (see site-config.js), then opens mailto.
 * Returns { mailtoHref, serverOk, web3formsEnabled } for UI fallbacks.
 */
async function submitWaitlistSignup({ name, email, source = 'form' }) {
  const n = String(name).trim();
  const em = String(email).trim();
  recordWaitlistEntry({ name: n, email: em, source });

  const cfg = typeof window !== 'undefined' && window.REGRADE_CONFIG;
  const key = cfg && String(cfg.web3formsAccessKey || '').trim();
  let serverOk = null;
  if (key) {
    try {
      const message =
        `Regrade early-access waitlist\n\n` +
        `Name: ${n}\n` +
        `Email: ${em}\n` +
        `Source: ${source}\n`;
      const fd = new FormData();
      fd.append('access_key', key);
      fd.append('name', n);
      fd.append('email', em);
      fd.append('message', message);
      fd.append('subject', 'Regrade waitlist — ' + em);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      serverOk = !!(data && data.success);
    } catch (_) {
      serverOk = false;
    }
  }

  const mailtoHref = buildWaitlistMailtoHref({ name: n, email: em });
  openMailtoUrl(mailtoHref);

  return { mailtoHref, serverOk, web3formsEnabled: !!key };
}

// Cursor-tracked tilt + radial glow for any element
function useTilt(maxDeg = 8, scale = 1.0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    let raf = 0, tx = 0, ty = 0, ctx = 0, cty = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tx = (py - 0.5) * -2 * maxDeg;
      ty = (px - 0.5) *  2 * maxDeg;
      el.style.setProperty('--mx', `${(px*100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(py*100).toFixed(2)}%`);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(loop); };
    const loop = () => {
      ctx += (tx - ctx) * 0.12;
      cty += (ty - cty) * 0.12;
      el.style.transform = `perspective(1100px) rotateX(${ctx.toFixed(2)}deg) rotateY(${cty.toFixed(2)}deg) scale(${scale})`;
      if (Math.abs(tx - ctx) > 0.02 || Math.abs(ty - cty) > 0.02) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(raf); };
  }, [maxDeg, scale]);
  return ref;
}

// In-view trigger
function useInView(opts = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || seen) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.3, ...opts });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

// Looping typewriter for a phrase set — locked width so layout doesn't reflow
function LoopType({ words, className = '', hold = 1500, speed = 75 }) {
  const longest = useMemo(() => words.reduce((a, b) => a.length >= b.length ? a : b, ''), [words]);
  const [i, setI] = useState(0);
  const [text, setText] = useState(words[0] || '');
  const [phase, setPhase] = useState('hold');
  useEffect(() => {
    const word = words[i % words.length];
    let t;
    if (phase === 'type') {
      if (text.length < word.length) t = setTimeout(() => setText(word.slice(0, text.length+1)), speed);
      else t = setTimeout(() => setPhase('hold'), hold);
    } else if (phase === 'hold') {
      t = setTimeout(() => setPhase('erase'), hold);
    } else if (phase === 'erase') {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), speed * 0.55);
      else { setPhase('type'); setI((i+1) % words.length); }
    }
    return () => clearTimeout(t);
  }, [text, phase, i, words, speed, hold]);
  return (
    <span className={"relative inline-block whitespace-nowrap " + className} style={{verticalAlign:'baseline'}}>
      <span aria-hidden style={{visibility:'hidden',whiteSpace:'pre'}}>{longest}</span>
      <span style={{position:'absolute',left:0,top:0,whiteSpace:'pre'}}>
        {text}<span className="caret" style={{height:'0.95em',display:'inline-block'}}></span>
      </span>
    </span>
  );
}

// Number that counts up when in view
function CountUp({ to, suffix = '', duration = 1400, className = '' }) {
  const [ref, seen] = useInView();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return <span ref={ref} className={className + ' tnum'}>{v}{suffix}</span>;
}

// Section eyebrow
function Eyebrow({ children, color = 'var(--ink-60)' }) {
  return <div className="eyebrow" style={{color}}>{children}</div>;
}

// Cyan italic emphasis with breathing glow
function Em({ children, className = '' }) {
  return <em className={"pulse-em serif italic " + className} style={{fontStyle:'italic'}}>{children}</em>;
}

// Pulsing dot
function Dot() {
  return <span className="pulse-dot inline-block" style={{width:8,height:8,borderRadius:99,background:'var(--cyan)'}}></span>;
}

const FOUNDING_PERKS = [
  { icon: '60s', title: 'Appeals in about a minute', sub: 'Snap rubric + feedback → draft email' },
  { icon: 'Free', title: 'Waitlist costs nothing', sub: 'One ping when your platform opens' },
  { icon: 'You', title: 'You hit send', sub: 'We never mail your professor for you' },
];

function PerkChip({ icon, title, sub, vivid = false }) {
  return (
    <div className={'perk-chip ' + (vivid ? 'perk-chip-vivid' : '')}>
      <div className="perk-chip-icon mono text-[11px] tracking-tight">{icon}</div>
      <div>
        <div className="text-[14px] font-medium text-navy leading-snug">{title}</div>
        <div className="text-[12.5px] text-navy/60 mt-0.5 leading-snug">{sub}</div>
      </div>
    </div>
  );
}

/** Hero / trust area — honest value props, no inflated waitlist numbers */
function FoundingPerks({ compact = false }) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2.5">
        {FOUNDING_PERKS.map((p) => (
          <span key={p.title} className="inline-flex items-center gap-2 hair-cyan rounded-full pl-2 pr-3.5 py-1.5 bg-cream2/80 text-[12.5px] text-navy/80">
            <span className="w-6 h-6 rounded-full grid place-items-center mono text-[9px] font-medium text-cream"
              style={{ background: 'linear-gradient(145deg,#7DD3FC,#4FA8E0)' }}>{p.icon}</span>
            {p.title}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {FOUNDING_PERKS.map((p, i) => (
        <PerkChip key={p.title} {...p} vivid={i === 0} />
      ))}
    </div>
  );
}

const TRUST_VALUE_CHIPS = [
  { k: 'Rubric-first', v: 'Every line tied to how you were graded' },
  { k: 'Your voice', v: 'Sounds like you — not a template' },
  { k: 'Summer 2026', v: 'iOS early access opens first' },
];

function TrustValueRow() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-end w-full lg:max-w-[520px]">
      {TRUST_VALUE_CHIPS.map((c, i) => (
        <div key={c.k} className="perk-chip perk-chip-vivid flex-1 min-w-[140px]"
          style={{ opacity: 1, transform: 'none' }}>
          <div className="perk-chip-icon serif text-[14px]">{i + 1}</div>
          <div>
            <div className="text-[13px] font-semibold text-navy tracking-tight">{c.k}</div>
            <div className="text-[11.5px] text-navy/60 mt-0.5 leading-snug">{c.v}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CtaTrustLine() {
  return (
    <p className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[14px] text-navy/70">
      <span className="inline-flex items-center gap-2 hair-cyan rounded-full pl-2.5 pr-3 py-1 bg-cream2/70">
        <Dot />
        <span className="font-medium text-navy/85">Founding waitlist — be first in line</span>
      </span>
      <span className="text-navy/50">Free · No spam · iOS Summer 2026</span>
    </p>
  );
}

// Primary CTA — static (no magnetic follow, breathing shadow, shimmer, or ripple)
function GlowButton({ children, onClick, type = 'button', className = '', disabled = false }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={"relative inline-flex items-center justify-center gap-1.5 px-6 h-12 rounded-full text-cream font-medium tracking-tight disabled:opacity-55 disabled:cursor-not-allowed " + className}
      style={{
        background:'linear-gradient(180deg,#4FA8E0,#2C7FB8)',
        color:'#F8F5EE',
        boxShadow:'0 8px 22px rgba(79,168,224,.32), 0 1px 0 rgba(255,255,255,.22) inset',
      }}>
      <span className="relative z-10 text-[14px]">{children}</span>
      <svg className="relative z-10" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// Pill inputs + button — waitlist (mailto + optional Web3Forms; see site-config.js)
function EmailPill({ onSubmit, cta = 'Get Early Access' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [mailtoHref, setMailtoHref] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n || !em || !em.includes('@')) return;
    setBusy(true);
    try {
      const r = await submitWaitlistSignup({ name: n, email: em, source: 'hero' });
      setMailtoHref(r.mailtoHref || '');
      setDone(true);
      onSubmit?.({ name: n, email: em, mailtoHref: r.mailtoHref });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="w-full max-w-[520px]">
      <form onSubmit={submit}
        className="hair flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0 pl-5 pr-1.5 py-2.5 sm:py-0 sm:h-14 rounded-2xl sm:rounded-full bg-cream2/70 backdrop-blur-md w-full"
        style={{ boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 14px 36px -18px rgba(10,31,68,.14), 0 0 0 1px var(--ink-20)' }}>
        <input
          type="text" name="name" required autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={done}
          className="w-full sm:w-[30%] sm:min-w-[100px] shrink-0 bg-transparent outline-none text-[15px] placeholder:text-[color:var(--ink-40)] text-navy disabled:opacity-60"
        />
        <input
          type="email" name="email" required autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.edu"
          disabled={done}
          className="w-full flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-[color:var(--ink-40)] text-navy sm:border-l sm:border-[color:var(--ink-10)] sm:pl-4 disabled:opacity-60"
        />
        <GlowButton type="submit" className="w-full sm:w-auto shrink-0 justify-center" disabled={busy || done}>
          {done ? 'You’re on the list ✓' : busy ? 'Sending…' : cta}
        </GlowButton>
      </form>
      {done && mailtoHref ? (
        <p className="mt-2 text-[13px] text-navy/65 leading-snug">
          If your email app did not open,{' '}
          <a href={mailtoHref} className="text-navy underline decoration-[color:var(--cyan)] underline-offset-2">
            tap here to compose the message
          </a>
          {' '}in your inbox.
        </p>
      ) : null}
    </div>
  );
}

// Glass card
function Glass({ className = '', children, style = {} }) {
  return (
    <div className={"hair rounded-2xl bg-cream2/55 backdrop-blur-sm smooth-shadow " + className} style={style}>
      {children}
    </div>
  );
}

// Tracking marquee row
function Marquee({ items, className = '' }) {
  const doubled = [...items, ...items];
  return (
    <div className={"marquee-mask overflow-hidden " + className}>
      <div className="marquee">
        {doubled.map((x, i) => (
          <span key={i} className="serif italic text-[44px] md:text-[64px] text-navy/70 whitespace-nowrap">{x}</span>
        ))}
      </div>
    </div>
  );
}

// Cursor blob: a soft glow that lazily follows the cursor
function CursorBlob() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.display = 'none'; return; }
    if (window.matchMedia('(hover: none)').matches) { el.style.display = 'none'; return; }
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty, raf;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor-blob"></div>;
}

// Scroll progress bar
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div ref={ref} className="scrollbar"></div>;
}

// Headline with per-letter hover dance (split per word so spaces don't break)
function DancyHeading({ text, className = '', as: Tag = 'span' }) {
  const words = text.split(/(\s+)/);
  return (
    <Tag className={className}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        return (
          <span key={i} className="word-hover" style={{display:'inline-block'}}>
            {Array.from(w).map((c, j) => (
              <span key={j} className="letter">{c}</span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}

// Per-word entrance — wrap each word in a rise-in span on mount
function RiseWords({ text, delayStart = 0, step = 60, className = '', italicLast = false }) {
  const words = text.split(/(\s+)/);
  let wordIdx = 0;
  return (
    <span className={className}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        const idx = wordIdx++;
        return (
          <span key={i} className="rise-word" style={{animationDelay:`${delayStart + idx * step}ms`}}>{w}</span>
        );
      })}
    </span>
  );
}

// Confetti burst on success
function Confetti({ run }) {
  const pieces = useMemo(() => Array.from({length: 56}, (_,i) => {
    const ang = (Math.PI * 2 * i) / 56 + Math.random()*0.4;
    const dist = 220 + Math.random() * 260;
    return {
      dx: Math.cos(ang) * dist,
      dy: Math.sin(ang) * dist,
      rot: (Math.random()*720 - 360) + 'deg',
      delay: Math.random() * 0.15,
      color: i % 3 === 0 ? '#7DD3FC' : i % 3 === 1 ? '#4FA8E0' : '#0A1F44',
    };
  }), []);
  if (!run) return null;
  return (
    <div className="conf">
      {pieces.map((p,i) => (
        <span key={i} style={{
          background:p.color, '--dx':p.dx+'px','--dy':p.dy+'px','--rot':p.rot,
          animationDelay: p.delay+'s'
        }} />
      ))}
    </div>
  );
}

Object.assign(window, {
  useTilt, useInView, LoopType, CountUp, Eyebrow, Em, Dot, GlowButton, EmailPill, Glass, Marquee, Confetti,
  CursorBlob, ScrollProgress, DancyHeading, RiseWords,
  getWaitlistEmail, openWaitlistMailto, openMailtoUrl, buildWaitlistMailtoHref,
  recordWaitlistEntry, submitWaitlistSignup, REGRADE_WAITLIST_LS,
  FoundingPerks, PerkChip, TrustValueRow, CtaTrustLine,
});
