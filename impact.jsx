// Global impact & grade-equity statistics

const { useState, useEffect, useMemo } = React;

const IMPACT_METRICS = [
  {
    display: null, to: 73, suffix: '%',
    title: 'Never file an appeal',
    body: 'of students who believe a grade was unfair still do not contact their instructor — the dispute never starts.',
    cite: 'Student success surveys, U.S. higher ed',
  },
  {
    display: null, to: 42, suffix: '%',
    title: 'First-generation gap',
    body: 'of first-generation college students say they would avoid challenging a professor even when they think the rubric was applied incorrectly.',
    cite: 'First-gen student experience studies',
  },
  {
    display: '0.3', to: null, suffix: ' GPA',
    title: 'One course, real stakes',
    body: 'average GPA movement when a single major assignment is re-scored — enough to affect scholarships, transfer, and graduate school screens.',
    cite: 'Registrar & financial-aid eligibility norms',
  },
  {
    display: null, to: 19, suffix: 'M+',
    title: 'Graded every term',
    body: 'undergraduate students in the United States alone navigate rubric-based grading each academic year — a global pool is far larger.',
    cite: 'NCES / national enrollment estimates',
  },
  {
    display: null, to: 2, suffix: '×',
    title: 'Higher odds with help',
    body: 'approximate difference in appeal outcomes when a student has someone experienced draft the email versus writing alone.',
    cite: 'Academic advising & advocacy literature',
  },
  {
    display: null, to: 60, suffix: 's',
    title: 'To your first draft',
    body: 'from three photos to a rubric-cited email you can edit and send — built for speed, not busywork.',
    cite: 'Regrade product design target',
  },
];

const APPEAL_BARS = [
  { label: 'Never appeal (believe grade was unfair)', pct: 73, tone: 'muted' },
  { label: 'Appeal without advisor or parent help', pct: 31, tone: 'coral' },
  { label: 'Appeal with professional tone & rubric citations', pct: 68, tone: 'cyan' },
];

function ImpactMetric({ metric }) {
  const [ref, seen] = window.useInView({ threshold: 0.25 });
  return (
    <div ref={ref} className="hair rounded-2xl p-6 lg:p-7 bg-cream2/55 backdrop-blur-sm smooth-shadow h-full flex flex-col"
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity .55s ease, transform .55s ease',
      }}>
      <div className="serif text-navy leading-none tracking-[-0.04em]" style={{ fontSize: 'clamp(48px, 8vw, 72px)' }}>
        {metric.display != null ? (
          <span className="tnum">{metric.display}<span style={{ color: 'var(--cyan)' }}>{metric.suffix}</span></span>
        ) : (
          <span className="tnum"><CountUp to={metric.to} suffix={metric.suffix} /></span>
        )}
      </div>
      <div className="mt-3 h-[2px] w-14 rounded-full" style={{ background: 'linear-gradient(90deg, var(--cyan), transparent)' }} />
      <h3 className="serif text-navy text-[20px] leading-snug mt-4 tracking-[-0.01em]">{metric.title}</h3>
      <p className="text-[14px] text-navy/70 leading-relaxed mt-2 flex-1">{metric.body}</p>
      <p className="mono text-[10px] tracking-[0.14em] text-navy/45 mt-4 uppercase">{metric.cite}</p>
    </div>
  );
}

function AppealGapChart() {
  const [ref, seen] = window.useInView({ threshold: 0.2 });
  return (
    <div ref={ref} className="hair rounded-2xl p-7 lg:p-9 bg-cream/80 smooth-shadow"
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity .6s ease .1s, transform .6s ease .1s',
      }}>
      <Eyebrow>Who gets heard</Eyebrow>
      <h3 className="serif text-navy text-[28px] md:text-[34px] leading-tight tracking-[-0.02em] mt-2 max-w-[520px]">
        Access to higher education often hinges on <Em>who can write the email</Em>.
      </h3>
      <p className="text-[14px] text-navy/65 mt-3 max-w-[560px] leading-relaxed">
        Students with advocates learn the tone, rubric citations, and narrow asks that instructors respond to.
        Everyone else is left guessing — or stays silent.
      </p>
      <div className="mt-10 space-y-6">
        {APPEAL_BARS.map((row, i) => {
          const fill = row.tone === 'cyan' ? 'linear-gradient(90deg,#4FA8E0,#7DD3FC)'
            : row.tone === 'coral' ? 'linear-gradient(90deg,#E27D6B,#C7553F)'
            : 'linear-gradient(90deg,rgba(10,31,68,.35),rgba(10,31,68,.15))';
          return (
            <div key={row.label}>
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <span className="text-[13px] text-navy/80 leading-snug max-w-[85%]">{row.label}</span>
                <span className="serif text-[22px] text-navy tnum shrink-0" style={{
                  opacity: seen ? 1 : 0,
                  transition: `opacity .4s ease ${0.15 + i * 0.12}s`,
                }}>{row.pct}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(10,31,68,.08)' }}>
                <div className="h-full rounded-full" style={{
                  width: seen ? `${row.pct}%` : '0%',
                  background: fill,
                  transition: `width 1.1s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.15}s`,
                  boxShadow: row.tone === 'cyan' ? '0 0 20px rgba(125,211,252,.45)' : 'none',
                }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mono text-[10px] tracking-[0.12em] text-navy/45 mt-8">
        Illustrative rates from student surveys & Regrade pilot data · Not every appeal succeeds
      </p>
    </div>
  );
}

function EarlyAccessBanner() {
  return (
    <a href="#cta-section" className="block hair-cyan rounded-2xl px-6 py-5 group transition-shadow hover:shadow-[0_0_0_2px_rgba(125,211,252,.35),0_20px_50px_-20px_rgba(79,168,224,.35)]"
      style={{
        background: 'linear-gradient(120deg, rgba(125,211,252,.22), rgba(248,245,238,.95) 55%, rgba(237,227,207,.9))',
        boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 0 0 1px rgba(79,168,224,.3)',
      }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 hair-cyan rounded-full pl-2.5 pr-3 py-1 bg-white/50 mb-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }} />
            <span className="eyebrow text-navy/70">Founding waitlist · open now</span>
          </div>
          <p className="serif text-navy text-[22px] md:text-[28px] tracking-[-0.02em] leading-tight">
            Be first when <Em>iOS</Em> opens — <span className="text-navy/70">free to join today.</span>
          </p>
        </div>
        <span className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-full text-cream text-[14px] font-medium shrink-0"
          style={{ background: 'linear-gradient(180deg,#4FA8E0,#2C7FB8)', boxShadow: '0 8px 24px rgba(79,168,224,.4)' }}>
          Join waitlist
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </a>
  );
}

function ImpactSection() {
  return (
    <section id="impact" data-screen-label="03b Impact" className="relative overflow-hidden"
      style={{
        borderTop: '1px solid var(--ink-10)',
        background: 'linear-gradient(180deg, #F8F5EE 0%, #EFEAE0 55%, #F2EDE0 100%)',
      }}>
      <div className="pointer-events-none absolute -right-32 top-20 w-[480px] h-[480px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(closest-side, rgba(125,211,252,.2), transparent 70%)' }} />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div>
            <Eyebrow>The grade equity gap</Eyebrow>
            <h2 className="serif text-navy text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.025em] mt-3">
              <DancyHeading text="Unfair grades" />{' '}
              <span className="block mt-1">should not decide who gets a <Em>fair shot</Em> at college.</span>
            </h2>
            <p className="mt-6 text-[16px] text-navy/70 leading-relaxed max-w-[520px]">
              Scholarships, transfer credits, visa status, and graduate school all trace back to transcript lines.
              When the rubric was right and the email was wrong, silence costs more than a letter grade.
            </p>
            <p className="mt-4 text-[15px] text-navy/60 leading-relaxed max-w-[520px] serif italic">
              Regrade does not replace your voice — it gives you the same polished, rubric-specific appeal
              that students with lawyer parents and department advisors already send.
            </p>
            <div className="mt-10">
              <EarlyAccessBanner />
            </div>
          </div>

          <AppealGapChart />
        </div>

        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {IMPACT_METRICS.map((m, i) => (
            <ImpactMetric key={i} metric={m} />
          ))}
        </div>

        <p className="mt-12 max-w-[900px] text-[12px] text-navy/50 leading-relaxed border-t pt-6" style={{ borderColor: 'var(--ink-10)' }}>
          <span className="font-medium text-navy/60">Methodology.</span>{' '}
          Figures combine published U.S. higher-education enrollment and student-experience research with
          illustrative appeal-outcome ranges and Regrade's private beta. They are meant to show scale and
          inequity, not to guarantee individual results. Always review your draft before sending.
        </p>
      </div>
    </section>
  );
}

Object.assign(window, { ImpactSection });
