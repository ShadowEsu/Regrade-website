// Shared building blocks for Regrade

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const REGRADE_LOGO_SRC = 'logo-mark.png';

const REGRADE_LOGO_SIZES = {
  icon: { h: 34 },
  sm: { h: 44 },
  nav: { h: 64 },
  md: { h: 72 },
  lg: { h: 80 },
  hero: { h: 96 },
  xl: { h: 112 },
};

function RegradeLogo({ size = 'nav', className = '', asLink = true, showHalo = false }) {
  const s = REGRADE_LOGO_SIZES[size] || REGRADE_LOGO_SIZES.nav;
  const img = (
    <img
      src={REGRADE_LOGO_SRC}
      alt="Regrade"
      className={'regrade-logo ' + (showHalo ? 'regrade-logo-halo ' : '') + (className || '')}
      style={{ height: s.h, width: 'auto', display: 'block' }}
      decoding="async"
    />
  );
  if (!asLink) return img;
  return (
    <a
      href="#"
      className="inline-flex shrink-0 items-center"
      aria-label="Regrade home"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}>
      {img}
    </a>
  );
}

function Wordmark({ className = '', size = 'nav' }) {
  return <RegradeLogo size={size} className={className} />;
}

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

function buildWaitlistMailtoHref({ name, email, phone, interestedTime, referral }) {
  const to = getWaitlistEmail();
  const subject = encodeURIComponent('Regrade waitlist — early access');
  const lines = [
    'Please add me to the Regrade early access waitlist.\n',
    `Name: ${String(name).trim()}`,
    `Email: ${String(email).trim()}`,
  ];
  if (phone) lines.push(`Phone: ${String(phone).trim()}`);
  if (interestedTime) lines.push(`Interested in: ${String(interestedTime).trim()}`);
  if (referral) lines.push(`Heard about us: ${String(referral).trim()}`);
  const body = encodeURIComponent(lines.join('\n'));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function openWaitlistMailto({ name, email }) {
  openMailtoUrl(buildWaitlistMailtoHref({ name, email }));
}

function recordWaitlistEntry({ name, email, phone, interestedTime, referral, source }) {
  try {
    const prev = JSON.parse(localStorage.getItem(REGRADE_WAITLIST_LS) || '[]');
    if (!Array.isArray(prev)) return;
    prev.push({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : '',
      interestedTime: interestedTime ? String(interestedTime).trim() : '',
      referral: referral ? String(referral).trim() : '',
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
async function submitWaitlistSignup({
  name, email, phone = '', interestedTime = '', referral = '', consent = false, source = 'form',
  openMailto = false,
}) {
  const n = String(name).trim();
  const em = String(email).trim();
  const ph = String(phone).trim();
  const when = String(interestedTime).trim();
  const ref = String(referral).trim();
  recordWaitlistEntry({ name: n, email: em, phone: ph, interestedTime: when, referral: ref, source });

  const cfg = typeof window !== 'undefined' && window.REGRADE_CONFIG;
  const key = cfg && String(cfg.web3formsAccessKey || '').trim();
  let serverOk = null;
  if (key) {
    try {
      const message =
        `Regrade early-access waitlist\n\n` +
        `Name: ${n}\n` +
        `Email: ${em}\n` +
        (ph ? `Phone: ${ph}\n` : '') +
        (when ? `Interested in: ${when}\n` : '') +
        (ref ? `Heard about us: ${ref}\n` : '') +
        `Consent: ${consent ? 'yes' : 'no'}\n` +
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

  const mailtoHref = buildWaitlistMailtoHref({ name: n, email: em, phone: ph, interestedTime: when, referral: ref });
  if (openMailto || !key || serverOk === false) {
    openMailtoUrl(mailtoHref);
  }

  return { mailtoHref, serverOk, web3formsEnabled: !!key };
}

function scrollToWaitlist() {
  const el = document.getElementById('waitlist-form');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const INTERESTED_TIME_OPTIONS = [
  { value: 'summer-2026-ios', label: 'Summer 2026 — iOS launch' },
  { value: 'later-2026', label: 'Later 2026 — Android & Web' },
  { value: 'asap', label: 'As soon as any platform is ready' },
  { value: 'not-sure', label: 'Not sure yet — keep me updated' },
];

const REFERRAL_OPTIONS = [
  'Social Media (Instagram, TikTok, etc.)',
  'LinkedIn',
  'Word of Mouth (Friend or Family)',
  'School or Campus Event',
  'Search Engine (Google, etc.)',
  'Online Advertisement',
  'News Article or Blog',
  'Other',
];

function JoinWaitlistButton({ children = 'Join the Waitlist', className = '', size = 'md' }) {
  const sizeCls = size === 'lg' ? 'cta-glow--lg' : size === 'sm' ? 'cta-glow--sm' : '';
  return (
    <GlowButton onClick={scrollToWaitlist} variant="primary" className={sizeCls + ' ' + className}>
      {children}
    </GlowButton>
  );
}

function WaitlistForm({ source = 'form', compact = false, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interestedTime, setInterestedTime] = useState('');
  const [referral, setReferral] = useState('');
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mailtoHref, setMailtoHref] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const n = name.trim();
    const em = email.trim();
    const ph = phone.trim();
    if (!n || !em || !em.includes('@')) { setError('Please enter your full name and a valid email.'); return; }
    if (!interestedTime) { setError('Please select when you want early access.'); return; }
    if (!referral) { setError('Please tell us how you heard about Regrade.'); return; }
    if (!consent) { setError('Please agree to receive updates so we can reach you.'); return; }
    setBusy(true);
    try {
      const r = await submitWaitlistSignup({
        name: n, email: em, phone: ph, interestedTime, referral, consent, source,
      });
      setMailtoHref(r.mailtoHref || '');
      setDone(true);
      onSuccess?.({ name: n, email: em, mailtoHref: r.mailtoHref });
    } finally {
      setBusy(false);
    }
  };

  const inputCls = 'w-full hair rounded-xl px-4 py-3 bg-cream2/80 outline-none text-[15px] text-navy placeholder:text-[color:var(--ink-40)] focus:shadow-[0_0_0_3px_rgba(125,211,252,.18)] transition-shadow';
  const labelCls = 'block text-[13px] font-medium text-navy/80 mb-1.5';

  if (done) {
    return (
      <div className="text-center py-8 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
          style={{ background: 'linear-gradient(180deg,#7DD3FC,#4FA8E0)', boxShadow: '0 0 40px rgba(125,211,252,.45)' }}>
          <svg width="28" height="28" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5 12 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h3 className="serif text-navy text-[28px] md:text-[36px] tracking-[-0.02em]">You're on the list!</h3>
        <p className="mt-3 text-[16px] text-navy/70 max-w-[420px] mx-auto leading-relaxed">
          We'll email you when early access opens — Summer 2026 for iOS first.
        </p>
        {mailtoHref ? (
          <p className="mt-4 text-[13px] text-navy/60">
            Didn't get a confirmation?{' '}
            <a href={mailtoHref} className="text-navy underline decoration-[color:var(--cyan)] underline-offset-2">Send a backup email</a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={'w-full ' + (compact ? 'max-w-[520px]' : 'max-w-[560px]')}>
      <div className="space-y-4">
        <div>
          <label className={labelCls} htmlFor={'wl-name-' + source}>Full Name *</label>
          <input id={'wl-name-' + source} type="text" name="name" required autoComplete="name"
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith"
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor={'wl-email-' + source}>Email Address *</label>
          <input id={'wl-email-' + source} type="email" name="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu"
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor={'wl-phone-' + source}>Phone Number</label>
          <div className="flex gap-2">
            <span className="hair rounded-xl px-3 py-3 bg-cream2/80 text-[14px] text-navy/60 shrink-0">🇺🇸 +1</span>
            <input id={'wl-phone-' + source} type="tel" name="phone" autoComplete="tel"
              value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567"
              className={inputCls + ' flex-1'} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor={'wl-time-' + source}>When are you interested in early access? *</label>
          <select id={'wl-time-' + source} name="interestedTime" required value={interestedTime}
            onChange={(e) => setInterestedTime(e.target.value)}
            className={inputCls + ' appearance-none cursor-pointer'}>
            <option value="">Select a time</option>
            {INTERESTED_TIME_OPTIONS.map((o) => (
              <option key={o.value} value={o.label}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor={'wl-ref-' + source}>How did you hear about Regrade? *</label>
          <select id={'wl-ref-' + source} name="referral" required value={referral}
            onChange={(e) => setReferral(e.target.value)}
            className={inputCls + ' appearance-none cursor-pointer'}>
            <option value="">Select an option</option>
            {REFERRAL_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <label className="flex items-start gap-3 cursor-pointer text-left">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded accent-[#4FA8E0] shrink-0" />
          <span className="text-[13px] text-navy/70 leading-relaxed">
            I agree to receive application updates and promotional emails and text messages from Regrade.
            Message and data rates may apply. Reply STOP to opt out at any time. *
          </span>
        </label>
        {error ? <p className="text-[13px] text-[#C7553F]">{error}</p> : null}
        <GlowButton type="submit" variant="primary" showArrow={!busy} className="cta-glow--lg w-full !h-14 justify-center" disabled={busy}>
          {busy ? 'Securing your spot…' : 'Secure My Spot'}
        </GlowButton>
        <p className="text-center text-[12px] text-navy/50">
          We'll never share your information. Unsubscribe anytime.
        </p>
      </div>
    </form>
  );
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

// Primary CTA — gradient, glow ring, shimmer on hover
function GlowButton({ children, onClick, type = 'button', className = '', disabled = false, variant = 'primary', showArrow = true }) {
  const isPrimary = variant === 'primary';
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={
        (isPrimary ? 'cta-glow ' : 'cta-outline ') +
        'group relative inline-flex items-center justify-center gap-2 font-semibold tracking-tight disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none ' +
        className
      }>
      {isPrimary ? <span className="cta-glow-shine" aria-hidden /> : null}
      <span className="relative z-10">{children}</span>
      {showArrow ? (
        <svg className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : null}
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
      const r = await submitWaitlistSignup({ name: n, email: em, source: 'hero', openMailto: true });
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
  RegradeLogo, Wordmark,
  JoinWaitlistButton, WaitlistForm, scrollToWaitlist,
  INTERESTED_TIME_OPTIONS, REFERRAL_OPTIONS,
});
