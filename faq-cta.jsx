// FAQ accordion + final CTA + footer + nav

const { useState, useEffect, useMemo } = React;

const FAQS = [
  { q: 'When does Regrade launch?',
    a: "iOS first, summer 2026. Android and Web later in 2026. Sign up for the waitlist and we will email you the moment your platform opens — one email, never more." },
  { q: 'Does Regrade send the email for me?',
    a: "Never. Regrade writes the draft and hands it back to you. You read it, edit it, and hit send from your own inbox. We never sign for you and we never have your password." },
  { q: 'Will my teacher know I used an AI?',
    a: "Regrade writes in your voice, calibrated to how your teacher writes back. The draft avoids the giveaway phrases AI detectors flag, and every sentence is yours to edit before sending." },
  { q: 'Is this just for college students?',
    a: "Regrade was built for community college, first generation, and international students first — but it works for any student with an assignment, a rubric, and a grade. High school welcome." },
  { q: 'What does it cost?',
    a: "The waitlist is free. Pricing at launch is a small monthly fee, with a free tier for students on financial aid. We will publish exact pricing when iOS opens — early access members are grandfathered in." },
];

function StreamAnswer({ text, run }) {
  const [n, setN] = useState(0);
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  useEffect(() => {
    if (!run) { setN(0); return; }
    let cancelled = false;
    let i = 0;
    const count = words.filter(w => !/^\s+$/.test(w)).length;
    const tick = () => {
      if (cancelled) return;
      i++;
      if (i <= count) { setN(i); setTimeout(tick, 38); }
    };
    const t = setTimeout(tick, 80);
    return () => { cancelled = true; clearTimeout(t); };
  }, [run]);
  let count = 0;
  return (
    <p className="text-[15px] leading-relaxed text-navy/75">
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        count++;
        const on = count <= n;
        return <span key={i} style={{opacity: on?1:0, transition:'opacity .25s ease'}}>{w}</span>;
      })}
    </p>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  const [streamed, setStreamed] = useState(new Set([0]));
  const toggle = (i) => {
    setOpen(open === i ? -1 : i);
    if (!streamed.has(i)) setStreamed(s => new Set([...s, i]));
  };
  return (
    <section data-screen-label="08 FAQ" className="relative max-w-[1100px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <Eyebrow>FAQ</Eyebrow>
      <h2 className="serif text-navy text-[44px] md:text-[68px] leading-[1.02] tracking-[-0.025em] mt-3 max-w-[920px]">
        <DancyHeading text="Questions you'd ask" /> <br/>your <Em>smartest friend</Em>.
      </h2>

      <div className="mt-12 divide-y" style={{borderTop:'1px solid var(--ink-10)', borderBottom:'1px solid var(--ink-10)'}}>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="py-5" style={{borderColor:'var(--ink-10)'}}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-start justify-between gap-6 text-left group"
                aria-expanded={isOpen}>
                <h3 className="serif text-navy text-[22px] md:text-[26px] leading-snug tracking-[-0.01em]">
                  {f.q}
                </h3>
                <span className="shrink-0 w-9 h-9 rounded-full hair-cyan grid place-items-center transition-transform duration-300"
                  style={{transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', background:'rgba(79,168,224,.07)'}}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="#4FA8E0" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>
              <div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
                style={{maxHeight: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0}}>
                <div className="pt-4 max-w-[760px]">
                  <StreamAnswer text={f.a} run={isOpen && streamed.has(i)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Final CTA ──────────────────────────────────────────────────────────

function PlatformCard_unused({ name, when, icon }) {
  return null;
}

function PlatformCard({ name, when, icon, accent }) {
  const ref = window.useTilt(6);
  return (
    <div ref={ref} className="tilt-card group relative hair rounded-2xl px-5 py-5 transition-all"
      style={{
        background:'rgba(255,255,255,.65)',
        backdropFilter:'blur(8px)',
        boxShadow:'0 1px 0 rgba(255,255,255,.5) inset, 0 14px 32px -16px rgba(10,31,68,.18)',
      }}>
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{boxShadow:'0 0 0 1.5px rgba(125,211,252,.55), 0 24px 60px -20px rgba(125,211,252,.6)'}}></div>
      <div className="relative flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl grid place-items-center"
          style={{background:'linear-gradient(160deg,#0A1F44,#1B3464)', color:'#FFFFFF', boxShadow:'0 6px 16px -8px rgba(10,31,68,.5)'}}>{icon}</div>
        <div>
          <div className="serif text-navy text-[18px] leading-tight">{name}</div>
          <div className="eyebrow text-navy/55 mt-1">{when}</div>
        </div>
      </div>
    </div>
  );
}

function FinalCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [burst, setBurst] = useState(false);
  const [streamedMsg, setStreamedMsg] = useState(0);
  const [signupDetail, setSignupDetail] = useState(null);
  const onSubmit = (detail) => {
    setBurst(true);
    setTimeout(() => setBurst(false), 1500);
    setSignupDetail(detail && detail.mailtoHref ? detail : null);
    setSubmitted(true);
  };

  const confirmText = "You're on the list. See you summer 2026.";
  useEffect(() => {
    if (!submitted) return;
    let i = 0; let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i++;
      if (i <= confirmText.split(/\s+/).length) { setStreamedMsg(i); setTimeout(tick, 110); }
    };
    setTimeout(tick, 350);
    return () => { cancelled = true; };
  }, [submitted]);

  return (
    <section id="cta-section" data-screen-label="09 CTA" className="relative overflow-hidden">
      <Confetti run={burst} />

      {/* Cinematic backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute" style={{
          left:'-15%', top:'-10%', width:'80%', height:'80%', borderRadius:'50%',
          background:'radial-gradient(closest-side, rgba(125,211,252,.18), transparent 70%)',
          filter:'blur(80px)', animation:'floatBlob 24s ease-in-out infinite',
        }}></div>
        <div className="absolute" style={{
          right:'-10%', bottom:'10%', width:'70%', height:'70%', borderRadius:'50%',
          background:'radial-gradient(closest-side, rgba(79,168,224,.12), transparent 70%)',
          filter:'blur(90px)', animation:'floatBlob 28s ease-in-out infinite reverse',
        }}></div>
      </div>

      <div className="relative max-w-[1180px] mx-auto px-6 lg:px-10 pt-24 pb-32 lg:pt-32 lg:pb-40 text-center">
        <div className="inline-flex items-center gap-2 hair-cyan rounded-full pl-3 pr-4 h-8 bg-cream2/60 backdrop-blur">
          <Dot />
          <span className="text-[12px] tracking-tight text-navy/75">Be first in line · iOS opens Summer 2026</span>
        </div>

        <h2 className="serif text-navy mt-7 text-[52px] md:text-[112px] lg:text-[128px] leading-[0.94] tracking-[-0.03em] max-w-[1180px] mx-auto">
          <span className="block"><DancyHeading text="Stop accepting" /></span>
          <span className="block"><DancyHeading text="grades that aren't" /></span>
          <span className="block"><Em>actually yours</Em>.</span>
        </h2>

        <p className="mt-9 max-w-[680px] mx-auto text-[19px] md:text-[21px] leading-[1.55] text-navy/75 serif" style={{fontWeight:400}}>
          One email when early access opens. One when Android and Web go live.
          <span className="block mt-1 italic text-navy/65">That's it. No spam, ever.</span>
        </p>

        <div className="mt-11 flex justify-center">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 max-w-[560px] mx-auto">
              <div className="hair-cyan rounded-full px-7 min-h-16 py-3 inline-flex items-center gap-3 bg-cream2/70 backdrop-blur glow-ring"
                style={{boxShadow:'0 0 0 1.5px rgba(79,168,224,.4), 0 0 60px rgba(125,211,252,.35)'}}>
                <span className="w-7 h-7 shrink-0 rounded-full grid place-items-center" style={{background:'linear-gradient(180deg,#7DD3FC,#4FA8E0)', boxShadow:'0 0 16px rgba(125,211,252,.6)'}}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5 12 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="serif italic text-navy text-[19px] text-left">
                  {confirmText.split(/\s+/).map((w,i) => (
                    <span key={i} style={{opacity: i < streamedMsg ? 1 : 0, transition:'opacity .3s ease', marginRight: 4}}>{w}</span>
                  ))}
                </span>
              </div>
              {signupDetail?.mailtoHref ? (
                <p className="text-[14px] text-navy/70 leading-relaxed text-center px-2">
                  If nothing opened, use this link to open your mail app:{' '}
                  <a href={signupDetail.mailtoHref} className="text-navy font-medium underline decoration-[color:var(--cyan)] underline-offset-2 break-all">
                    Send waitlist email
                  </a>
                </p>
              ) : null}
            </div>
          ) : (
            <BigEmailPill onSubmit={onSubmit} />
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[860px] mx-auto text-left">
          <PlatformCard name="App Store" when="Summer 2026" icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12.4c0-2.4 2-3.6 2.1-3.6-1.1-1.6-2.9-1.8-3.5-1.9-1.5-.15-2.9.9-3.7.9-.8 0-1.95-.85-3.2-.83-1.65.03-3.18.95-4.03 2.43-1.72 2.98-.44 7.4 1.24 9.82.82 1.18 1.8 2.5 3.07 2.46 1.24-.05 1.7-.8 3.2-.8 1.5 0 1.92.8 3.22.78 1.33-.02 2.18-1.2 3-2.39.94-1.36 1.33-2.68 1.35-2.75-.03-.01-2.59-.99-2.62-3.95zM14.1 5.1c.66-.8 1.11-1.92.98-3.03-.95.04-2.1.63-2.79 1.43-.61.7-1.16 1.85-1.01 2.94 1.06.08 2.16-.54 2.82-1.34z"/></svg>
          } />
          <PlatformCard name="Web App" when="Later 2026" icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>
          } />
          <PlatformCard name="Google Play" when="Later 2026" icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.6 2.4c-.4.4-.6.9-.6 1.5v16.2c0 .6.2 1.1.6 1.5l9.4-9.4-9.4-9.8zm10.6 10.6 2.4 2.4 3.4-1.9c.8-.4.8-1.6 0-2l-3.4-1.9-2.4 3.4zM4.6 22.4l8.4-8.4 2.2 2.2-8.7 5c-.7.4-1.5.4-1.9.2zM4.6 1.6 13 10l2.2-2.2-8.7-5c-.7-.4-1.5-.4-1.9-.2z"/></svg>
          } />
        </div>
      </div>

      {/* Pulsing cyan accent line above footer */}
      <div className="relative h-px" style={{background:'linear-gradient(90deg, transparent, rgba(79,168,224,.5), rgba(125,211,252,.9), rgba(79,168,224,.5), transparent)'}}>
        <div className="absolute inset-0" style={{background:'inherit', filter:'blur(4px)', animation:'breath 3.4s ease-in-out infinite', opacity:.7}}></div>
      </div>
    </section>
  );
}

// Larger CTA pill specifically for the climactic section
function BigEmailPill({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n || !em || !em.includes('@')) return;
    setBusy(true);
    try {
      const r = await window.submitWaitlistSignup({ name: n, email: em, source: 'cta-bottom' });
      onSubmit?.({ name: n, email: em, mailtoHref: r.mailtoHref });
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit}
      className="hair flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 pl-6 pr-3 py-3 sm:py-2 sm:h-16 rounded-[28px] sm:rounded-full bg-cream2/70 backdrop-blur-md w-full max-w-[620px] transition-shadow focus-within:shadow-[0_0_0_3px_rgba(125,211,252,.18)]"
      style={{boxShadow:'0 1px 0 rgba(255,255,255,.6) inset, 0 18px 44px -22px rgba(10,31,68,.18), 0 0 0 1px var(--ink-20)'}}>
      <input
        type="text" name="name" required autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        disabled={busy}
        className="w-full sm:w-[28%] sm:min-w-[110px] shrink-0 bg-transparent outline-none text-[17px] placeholder:text-[color:var(--ink-40)] text-navy serif disabled:opacity-60"
      />
      <input
        type="email" name="email" required autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@school.edu"
        disabled={busy}
        className="w-full flex-1 min-w-0 bg-transparent outline-none text-[17px] placeholder:text-[color:var(--ink-40)] text-navy serif sm:border-l sm:border-[color:var(--ink-10)] sm:pl-5 disabled:opacity-60"
      />
      <GlowButton type="submit" className="!h-12 !px-7 w-full sm:w-auto shrink-0 justify-center" disabled={busy}>
        {busy ? 'Sending…' : 'Reserve My Spot'}
      </GlowButton>
    </form>
  );
}

// Footer & Nav ───────────────────────────────────────────────────────

function Wordmark({ className = '' }) {
  return (
    <div className={"serif text-navy text-[22px] tracking-[-0.01em] " + className}>
      Regrade<span style={{color:'var(--cyan)'}}>.</span>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 nav-blur" style={{background:'rgba(255,255,255,.92)',borderBottom:'1px solid var(--ink-10)'}}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Wordmark />
        <nav className="hidden md:flex items-center gap-8 text-[13px] text-navy/70">
          <a href="#how" className="hover:text-navy">How it works</a>
          <a href="#why" className="hover:text-navy">Why Regrade</a>
          <a href="#platforms" className="hover:text-navy">Platforms</a>
          <a href="#faq" className="hover:text-navy">FAQ</a>
        </nav>
        <a href="#cta-section" className="group relative overflow-hidden hair-cyan rounded-full px-5 h-10 inline-flex items-center gap-2 text-[13px] font-medium text-navy bg-cream2/60 transition-all hover:bg-navy hover:text-cream"
          style={{boxShadow:'0 0 0 1px rgba(79,168,224,.4)'}}>
          <span className="relative z-10">Join Waitlist</span>
          <svg className="relative z-10" width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative border-t" style={{borderColor:'var(--ink-10)'}}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 flex flex-wrap items-center justify-between gap-6">
        <Wordmark />
        <div className="flex items-center gap-7 text-[13px] text-navy/65">
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Press</a>
          <a href={'mailto:' + (typeof window !== 'undefined' && window.getWaitlistEmail ? window.getWaitlistEmail() : 'hello@regrade.app')}>Contact</a>
          <a href="waitlist-data.html" className="text-navy/80">Waitlist log</a>
        </div>
        <div className="eyebrow text-navy/45">© 2026 REGRADE INC.</div>
      </div>
    </footer>
  );
}

Object.assign(window, { FAQ, FinalCTA, Nav, Footer });
