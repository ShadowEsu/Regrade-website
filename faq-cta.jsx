// FAQ accordion + final CTA + footer + nav

const { useState, useEffect, useMemo } = React;

const FAQS = [
  { q: 'When does Regrade launch?',
    a: "iOS first, summer 2026. Android and Web later in 2026. Join the waitlist — we'll email you once when your platform opens. No spam." },
  { q: 'What can I upload?',
    a: "Graded PDFs and photos from Gradescope, Canvas, Moodle, Blackboard, D2L Brightspace, Google Classroom, Turnitin, Schoology, Microsoft Teams Education, or marked paper. Best results: a graded copy with both your work and the rubric visible." },
  { q: 'Does Regrade send the email for me?',
    a: "Never. You get an evidence summary and appeal draft to edit. You send from your own inbox — we never have your email password." },
  { q: 'How is Regrade different from ChatGPT?',
    a: "ChatGPT doesn't read your rubric or learn how your professor grades. Regrade extracts every mark and comment, builds a teacher profile, and drafts an appeal tied to specific evidence — in your voice, not a generic template." },
  { q: 'Is my coursework private?',
    a: "You sign in with Firebase. Cases are stored per account under Firestore security rules. Uploads are scanned for safety before analysis. We don't train models on your files." },
  { q: 'What does it cost?',
    a: "The waitlist is free — no credit card needed. Regrade will be free at launch for early waitlist members. Pricing details will come later, but joining costs nothing today." },
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
    <section data-screen-label="10 FAQ" className="relative max-w-[1100px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <Eyebrow>Got questions?</Eyebrow>
      <h2 className="serif text-navy text-[44px] md:text-[56px] leading-[1.02] tracking-[-0.025em] mt-3 max-w-[920px]">
        Frequently Asked <Em>Questions</Em>
      </h2>
      <p className="mt-4 text-[16px] text-navy/65">Everything you need to know about Regrade.</p>

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
      <div className="mt-12 flex justify-center">
        <JoinWaitlistButton size="lg">Join the Waitlist</JoinWaitlistButton>
      </div>
    </section>
  );
}

// Final CTA ──────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section id="cta-section" data-screen-label="11 CTA" className="relative overflow-hidden border-t" style={{ borderColor: 'var(--ink-10)' }}>
      <div className="relative max-w-[1180px] mx-auto px-6 lg:px-10 py-20 lg:py-28 text-center">
        <h2 className="serif text-navy text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.025em] max-w-[800px] mx-auto">
          Ready to appeal <Em>fairly</Em>?
        </h2>
        <p className="mt-5 max-w-[520px] mx-auto text-[17px] text-navy/70 leading-relaxed">
          Join the waitlist — free, no credit card, one email when we launch.
        </p>
        <div className="mt-10 flex justify-center">
          <JoinWaitlistButton size="lg">Join the Waitlist</JoinWaitlistButton>
        </div>
      </div>
      <div className="relative h-px" style={{background:'linear-gradient(90deg, transparent, rgba(79,168,224,.5), rgba(125,211,252,.9), rgba(79,168,224,.5), transparent)'}}></div>
    </section>
  );
}

// Footer & Nav ───────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="sticky top-0 z-40 nav-blur" style={{background:'rgba(255,255,255,.94)',borderBottom:'1px solid var(--ink-10)'}}>
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-[80px] md:h-[88px]">
        <nav className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 items-center gap-6 lg:gap-8 text-[13px] text-navy/70">
          <a href="#how" className="hover:text-navy transition-colors">How it works</a>
          <a href="#compare" className="hover:text-navy transition-colors">Why Regrade</a>
          <a href="#waitlist-form" className="hidden lg:inline hover:text-navy transition-colors">Waitlist</a>
          <a href="#faq" className="hidden lg:inline hover:text-navy transition-colors">FAQ</a>
        </nav>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Wordmark size="nav" />
        </div>
        <div className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2">
          <a href="#waitlist-form" className="cta-glow cta-glow--sm shrink-0">
            <span className="cta-glow-shine" aria-hidden />
            <span className="relative z-10 hidden sm:inline">Join Waitlist</span>
            <span className="relative z-10 sm:hidden">Join</span>
            <svg className="relative z-10" width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative border-t" style={{borderColor:'var(--ink-10)'}}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 flex flex-wrap items-center justify-between gap-6">
        <Wordmark size="md" />
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
