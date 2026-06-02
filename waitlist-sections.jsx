// LangPal-inspired waitlist sections — comparison, stats, movement

const { useState } = React;

function WaitlistTopBanner() {
  return (
    <div className="relative z-30 text-center py-2.5 px-4"
      style={{ background: 'linear-gradient(90deg, #0A1F44, #1B3464)', borderBottom: '1px solid rgba(125,211,252,.2)' }}>
      <button type="button" onClick={scrollToWaitlist}
        className="text-[13px] md:text-[14px] text-cream/90 hover:text-cream transition-colors">
        <span className="mr-1.5">🔥</span>
        Join the founding waitlist — <span className="font-medium text-[#7DD3FC]">free</span> · iOS Summer 2026
        <span className="ml-2 underline underline-offset-2 decoration-[#7DD3FC]/50">Sign up →</span>
      </button>
    </div>
  );
}

function HeroStats() {
  const stats = [
    { value: '10+', label: 'Platforms', sub: 'Gradescope, Canvas & more' },
    { value: 'Summer', label: '2026 Launch', sub: 'iOS early access first' },
    { value: '60s', label: 'To Your Draft', sub: 'Upload to appeal email' },
    { value: 'Free', label: 'To Join', sub: 'No credit card needed' },
  ];
  return (
    <section data-screen-label="01b Stats" className="relative border-y" style={{ borderColor: 'var(--ink-10)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="serif text-navy leading-none tracking-[-0.03em]" style={{ fontSize: 'clamp(36px, 5vw, 52px)' }}>
                {s.value}
              </div>
              <div className="mt-1 text-[14px] font-semibold text-navy tracking-tight">{s.label}</div>
              <div className="mt-0.5 text-[12px] text-navy/55">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const COMPARISON_FEATURES = [
  { name: 'Rubric-aware analysis', regrade: true, manual: false, chatgpt: false, nothing: false },
  { name: 'Teacher grading pattern', regrade: true, manual: false, chatgpt: false, nothing: false },
  { name: 'Appeal in your voice', regrade: true, manual: 'partial', chatgpt: false, nothing: false },
  { name: 'Evidence citations from your work', regrade: true, manual: 'partial', chatgpt: false, nothing: false },
  { name: 'Draft in ~60 seconds', regrade: true, manual: false, chatgpt: 'partial', nothing: false },
  { name: 'You stay in control (you send)', regrade: true, manual: true, chatgpt: true, nothing: true },
];

function CheckCell({ val }) {
  if (val === true) return <span className="text-[18px]" aria-label="Yes">✅</span>;
  if (val === 'partial') return <span className="text-[13px] text-navy/50 font-medium">Partial</span>;
  return <span className="text-[18px] opacity-40" aria-label="No">❌</span>;
}

function ComparisonSection() {
  return (
    <section id="compare" data-screen-label="04 Comparison" className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <Eyebrow>The competition</Eyebrow>
      <h2 className="serif text-navy text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.025em] mt-3 max-w-[900px]">
        Why Regrade beats <Em>everything else</Em>
      </h2>
      <p className="mt-5 max-w-[640px] text-[16px] text-navy/65 leading-relaxed">
        There is no real alternative. We built what nobody else would — rubric-first AI appeals from day one.
      </p>

      <div className="mt-12 overflow-x-auto comparison-table-wrap">
        <table className="comparison-table w-full min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left">Feature</th>
              <th className="comparison-highlight">⭐ Best Choice<br/><span className="serif text-[16px]">Regrade</span></th>
              <th>Manual appeal</th>
              <th>Generic ChatGPT</th>
              <th>Do nothing</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_FEATURES.map((f) => (
              <tr key={f.name}>
                <td className="text-[14px] text-navy/85 font-medium">{f.name}</td>
                <td className="comparison-highlight text-center"><CheckCell val={f.regrade} /></td>
                <td className="text-center"><CheckCell val={f.manual} /></td>
                <td className="text-center"><CheckCell val={f.chatgpt} /></td>
                <td className="text-center"><CheckCell val={f.nothing} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-center">
        <JoinWaitlistButton size="lg">Join the Waitlist</JoinWaitlistButton>
      </div>
    </section>
  );
}

const DIFF_PAIRS = [
  { before: 'Staring at a rubric for an hour', after: 'Upload and get a draft in 60 seconds' },
  { before: 'Generic AI that sounds robotic', after: 'An appeal that sounds like you' },
  { before: 'Guessing what your professor wants', after: 'Calibrated to how they actually grade' },
  { before: 'Too nervous to send anything', after: 'A respectful draft you can edit and send' },
];

function WhyDifferentSection() {
  return (
    <section data-screen-label="06 Why different" className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8F9FB 0%, #FFFFFF 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <Eyebrow>Why Regrade is different</Eyebrow>
            <h2 className="serif text-navy text-[44px] md:text-[56px] leading-[1.04] tracking-[-0.025em] mt-3">
              We're not like <Em>anything</Em> out there
            </h2>
            <p className="mt-5 text-[16px] text-navy/65 leading-relaxed max-w-[480px]">
              No other tool reads your rubric, learns your professor's grading style, and drafts a fair appeal in your voice. Regrade is in a category of one.
            </p>
            <div className="mt-8">
              <JoinWaitlistButton>Join the Waitlist</JoinWaitlistButton>
            </div>
          </div>
          <div className="space-y-4">
            {DIFF_PAIRS.map((p) => (
              <div key={p.before} className="flex items-center gap-3 hair rounded-xl px-4 py-3.5 bg-cream2/60">
                <span className="text-[13px] text-navy/50 line-through shrink-0 max-w-[42%]">{p.before}</span>
                <span className="text-[18px] text-[#4FA8E0] shrink-0">→</span>
                <span className="text-[14px] font-medium text-navy">{p.after}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistFormSection() {
  const [burst, setBurst] = useState(false);
  const onSuccess = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 1500);
  };
  return (
    <section id="waitlist-form" data-screen-label="08 Waitlist" className="relative overflow-hidden scroll-mt-20">
      <Confetti run={burst} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute" style={{
          left: '-10%', top: '-10%', width: '60%', height: '60%', borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(125,211,252,.14), transparent 70%)',
          filter: 'blur(80px)',
        }}></div>
      </div>
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left">
            <Eyebrow>Join the waitlist</Eyebrow>
            <h2 className="serif text-navy text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.025em] mt-3">
              Be among the <Em>first</Em> to appeal fairly
            </h2>
            <p className="mt-5 text-[16px] text-navy/65 leading-relaxed max-w-[480px] mx-auto lg:mx-0">
              Free to join. One email when your platform opens. No spam, no pricing surprises — Regrade is free at launch for waitlist members.
            </p>
            <div className="mt-8 hidden lg:flex flex-col gap-3 text-[14px] text-navy/60">
              <div className="flex items-center gap-2"><span className="text-[#4FA8E0]">✓</span> Rubric-first AI analysis</div>
              <div className="flex items-center gap-2"><span className="text-[#4FA8E0]">✓</span> Appeal draft in your voice</div>
              <div className="flex items-center gap-2"><span className="text-[#4FA8E0]">✓</span> You review and send — we never mail for you</div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[560px] hair rounded-2xl p-6 md:p-8 bg-cream2/70 backdrop-blur-md smooth-shadow">
              <WaitlistForm source="main-form" onSuccess={onSuccess} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinMovementSection() {
  const stats = [
    { value: 'Growing', label: 'Waitlist', sub: 'Students signing up every day' },
    { value: 'Summer', label: '2026', sub: 'Public launch target' },
    { value: 'Free', label: 'At launch', sub: 'No credit card to join' },
  ];
  return (
    <section data-screen-label="09 Movement" className="relative text-cream overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A1F44, #0C234D)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28 text-center">
        <Eyebrow color="rgba(255,255,255,.55)">Join the movement</Eyebrow>
        <h2 className="serif text-[40px] md:text-[56px] leading-[1.04] tracking-[-0.025em] mt-3 max-w-[720px] mx-auto">
          Be part of something <Em>exciting</Em>
        </h2>
        <p className="mt-4 text-[16px] text-cream/70 max-w-[520px] mx-auto">
          Students who deserve a fair grade are already signing up. Don't miss out.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[720px] mx-auto">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="serif text-[48px] md:text-[56px] leading-none tracking-[-0.03em]">{s.value}</div>
              <div className="mt-1 text-[15px] font-semibold">{s.label}</div>
              <div className="mt-0.5 text-[13px] text-cream/60">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <JoinWaitlistButton size="lg">Join the Waitlist</JoinWaitlistButton>
        </div>
        <p className="mt-6 text-[13px] text-cream/50">🚀 Backed by strong early interest</p>
      </div>
    </section>
  );
}

function InlineWaitlistCTA({ headline, sub }) {
  return (
    <div className="text-center py-12 px-6">
      <h3 className="serif text-navy text-[28px] md:text-[36px] tracking-[-0.02em]">{headline}</h3>
      {sub ? <p className="mt-3 text-[15px] text-navy/65 max-w-[480px] mx-auto">{sub}</p> : null}
      <div className="mt-6 flex justify-center">
        <JoinWaitlistButton size="lg">Join the Waitlist</JoinWaitlistButton>
      </div>
    </div>
  );
}

Object.assign(window, {
  WaitlistTopBanner, HeroStats, ComparisonSection, WhyDifferentSection,
  WaitlistFormSection, JoinMovementSection, InlineWaitlistCTA,
});
