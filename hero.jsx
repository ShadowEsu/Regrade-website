// Hero section

const { useState, useEffect } = React;

function PhoneMockup() {
  const ref = window.useTilt(8, 1);
  const [composing, setComposing] = useState('');
  const draft = "Dear Professor Ramirez,\n\nI hope this finds you well. I'm writing about Problem Set 4. After reviewing the rubric, I believe Q2 was marked down for an explanation I did provide in step 3, and Q3's deduction may reflect a rubric mismatch.\n\nWould you be open to a quick second look? Happy to clarify in office hours.\n\nThank you for your time,\nMaya";
  useEffect(() => {
    let i = 0; let raf; let last = 0;
    const tick = (t) => {
      if (t - last > 22) { i = (i+1) % (draft.length + 60); last = t; }
      setComposing(draft.slice(0, Math.min(i, draft.length)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="tilt-card relative" style={{transform:'perspective(1100px) rotateX(2deg) rotateY(-10deg)'}}>
      {/* Cyan halo behind */}
      <div className="absolute -inset-10 rounded-[64px] pointer-events-none"
        style={{background:'radial-gradient(closest-side, rgba(125,211,252,.32), rgba(79,168,224,0) 70%)'}}></div>
      {/* Phone body */}
      <div className="relative rounded-[44px] p-2 hair-cyan glow-ring"
        style={{width:330, height:660, background:'linear-gradient(160deg,#0A1F44,#1B3464 55%,#0A1F44)'}}>
        {/* notch */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-28 h-6 rounded-full" style={{background:'#04122B'}}></div>
        {/* screen */}
        <div className="relative rounded-[34px] h-full overflow-hidden" style={{background:'#0E2350'}}>
          <div className="px-5 pt-10 pb-4 flex items-center justify-between text-cream/80 text-[11px] mono">
            <span>9:41</span>
            <img src="logo.png" alt="Regrade" className="regrade-logo" style={{ height: 18, width: 'auto', borderRadius: 5, opacity: 0.9 }} />
            <span>100%</span>
          </div>
          <div className="px-5 pt-3">
            <div className="eyebrow text-cyanglow/90">Step 02 · Review</div>
            <h3 className="serif text-cream text-[26px] leading-tight mt-2">Here's what we found.</h3>
          </div>

          <div className="px-5 mt-4 space-y-2.5">
            <Row k="Case strength" v="Strong" tone="cyan" />
            <Row k="Points to recover" v="+8 of 100" tone="cyan" />
            <Row k="Tone" v="Respectful, short" tone="neutral" />
            <Row k="Likely outcome" v="Partial regrade" tone="neutral" />
          </div>

          <div className="mx-5 mt-4 rounded-2xl p-3 hair-cyan" style={{background:'rgba(255,255,255,.06)'}}>
            <div className="eyebrow text-cream/55 mb-1.5">Draft email</div>
            <div className="text-cream/90 text-[11.5px] leading-snug whitespace-pre-wrap mono" style={{minHeight:160,maxHeight:170,overflow:'hidden'}}>
              {composing}<span className="caret" style={{height:'1em'}}></span>
            </div>
          </div>

          <div className="px-5 mt-3 flex items-center gap-2">
            <button type="button" className="flex-1 h-11 rounded-full text-navy font-semibold text-[13px] tracking-tight"
              style={{background:'linear-gradient(180deg,#7DD3FC,#4FA8E0)',boxShadow:'0 8px 24px rgba(79,168,224,.45)'}}
              onClick={() => { window.location.href = '#cta-section'; }}>SEND EMAIL</button>
            <button type="button" className="w-11 h-11 rounded-full hair-cyan text-cream/80 grid place-items-center">↻</button>
          </div>
          <div className="px-5 mt-2 text-center mono text-[10px] text-cream/50">142 words · Calibrated to Prof. Ramirez</div>
        </div>
      </div>
    </div>
  );
}

function Row({k,v,tone}) {
  const color = tone==='cyan' ? '#7DD3FC' : tone==='coral' ? '#E27D6B' : '#FFFFFF';
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-cream/65">{k}</span>
      <span className="font-medium" style={{color}}>{v}</span>
    </div>
  );
}

function PaperPeek() {
  return (
    <div className="absolute -left-12 top-24 -rotate-[10deg] w-[280px] rounded-md hair smooth-shadow"
      style={{background:'#ffffff'}}>
      <div className="p-4">
        <div className="mono text-[10px] text-navy/70 tracking-wide">PROBLEM SET 4 — CALCULUS II — FALL 2026</div>
        <div className="mt-2 serif text-navy text-[15px] leading-snug">
          2. Evaluate <span className="mono">∫ x·sin(x) dx</span> using integration by parts.
        </div>
        <div className="mt-3 h-px w-full" style={{background:'rgba(10,31,68,.15)'}}></div>
        <div className="mt-2 serif text-navy/85 text-[13.5px]" style={{fontStyle:'italic'}}>
          u = x, dv = sin(x)dx → −x·cos(x) + ∫ cos(x) dx = −x·cos(x) + sin(x) + C
        </div>
        <div className="mt-3 flex items-start gap-2">
          <div className="serif italic text-[18px]" style={{color:'#C7553F',transform:'rotate(-3deg)'}}>−3 / explain step 3</div>
        </div>
      </div>
    </div>
  );
}

function GradeChip() {
  return (
    <div className="absolute -right-6 top-6 hair rounded-2xl bg-cream/90 backdrop-blur px-4 py-3 smooth-shadow rotate-[6deg]">
      <div className="eyebrow text-navy/60 mb-1">Grade after appeal</div>
      <div className="flex items-center gap-2">
        <span className="serif text-[22px] text-navy/60 line-through">C+</span>
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M0 7h18m-4-4 4 4-4 4" stroke="#4FA8E0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="serif text-[28px] font-medium" style={{color:'#0A1F44'}}>A<span className="text-cyan2">−</span></span>
      </div>
    </div>
  );
}

function Hero() {
  const handleSubmit = (data) => {
    window.dispatchEvent(new CustomEvent('regrade:join', { detail: data }));
  };
  return (
    <section data-screen-label="01 Hero" className="relative overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-10 pb-24 lg:pt-16 lg:pb-32 z-10">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 hair-cyan rounded-full pl-3 pr-4 h-8 bg-cream2/70 backdrop-blur">
              <Dot />
              <span className="text-[12px] tracking-tight text-navy/75">Coming soon · Android, Web, iOS later in 2026</span>
            </div>

            <h1 className="serif mt-7 text-[64px] md:text-[88px] leading-[0.96] tracking-[-0.02em] text-navy">
              Appeal an unfair grade<br />
              in <Em className="italic"><LoopType words={["60 seconds","one tap","a coffee break","a study break"]} /></Em>.
            </h1>

            <p className="mt-7 max-w-[560px] text-[17px] leading-relaxed text-navy/75">
              Snap your assignment, rubric, and feedback. Regrade reads the room, weighs your case against the rubric, and writes the polite, professional email a lawyer parent would write — calibrated to the exact tone your teacher responds to.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <EmailPill onSubmit={handleSubmit} cta="Get Early Access" />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-0.5" aria-hidden>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#E2A93B"><path d="M12 2l2.9 6.4 6.9.6-5.2 4.7 1.6 6.8L12 17.3 5.8 20.5l1.6-6.8L2.2 9l6.9-.6L12 2z"/></svg>
                ))}
              </div>
              <span className="text-[13px] text-navy/60">Built for community college, first gen, and international students first.</span>
            </div>
          </div>

          <div className="relative h-[640px] hidden lg:block">
            <PaperPeek />
            <div className="absolute right-4 top-2"><PhoneMockup /></div>
            <GradeChip />
          </div>
          {/* mobile: smaller phone */}
          <div className="lg:hidden flex justify-center"><PhoneMockup /></div>
        </div>
      </div>
      {/* subtle cyan glow on cream */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[680px] h-[680px] rounded-full"
        style={{background:'radial-gradient(closest-side, rgba(125,211,252,.22), rgba(79,168,224,0) 70%)'}}></div>
    </section>
  );
}

Object.assign(window, { Hero, PhoneMockup });
