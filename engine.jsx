// Regrade product intelligence — sourced from Regrade_True (consumer-facing)

const { useState } = React;

const USER_JOURNEY = [
  { n: '01', label: 'Sign in', detail: 'Google or email · profile saved to your account' },
  { n: '02', label: 'Upload', detail: 'Graded PDF or photos · type & size checked before scan' },
  { n: '03', label: 'Analyze', detail: 'You consent & pick engine · hybrid pipeline runs server-side' },
  { n: '04', label: 'Evidence', detail: 'Appeal context drafted from what was actually on the page' },
  { n: '05', label: 'Verdict', detail: 'Scores, teacher pattern, fairness read, critical findings' },
  { n: '06', label: 'Appeal', detail: 'Edit the letter · advocate chat for follow-up questions' },
];

const PIPELINE_STAGES = [
  {
    id: 'reader',
    n: 'STG_01',
    stage: 'Reader',
    model: 'Gemini 2.5 Flash',
    role: 'extract_only',
    body: 'Vision pass over your pages. Detects LMS or marked paper, pulls per-question scores, rubric rows, and professor comments verbatim. Does not judge fairness — only builds the evidence ledger.',
    out: ['questions[]', 'professor_comments', 'rubric_items_applied', 'source_platform', 'extraction_uncertainties'],
  },
  {
    id: 'reasoner',
    n: 'STG_02',
    stage: 'Reasoner',
    model: 'Claude',
    role: 'advocate',
    body: 'Reads the ledger like an academic advocate. Infers how your teacher grades, flags unexplained deductions, and ranks strongest appeal points with a fairness read.',
    out: ['teacher_profile', 'case_analysis', 'fairness_review', 'strongest_appeal_points'],
  },
  {
    id: 'xcheck',
    n: 'STG_03',
    stage: 'Cross-check',
    model: 'verification',
    role: 'confidence',
    body: 'Compares extracted numbers against reasoned output. Surfaces disagreements in ai_notes so you know where to double-check before you email your professor.',
    out: ['ai_notes.disagreements', 'confidence_adjustment', 'How the AI read this'],
  },
];

const ENGINE_MODES = [
  { id: 'hybrid', label: 'hybrid', desc: 'Gemini reads · Claude reasons — default when both keys are set' },
  { id: 'gemini', label: 'gemini', desc: 'Single-pass Gemini when Anthropic is off or hybrid disabled' },
  { id: 'claude', label: 'claude', desc: 'Full analysis in Claude — your choice under Profile → AI Engine' },
];

const VERDICT_BLOCKS = [
  { id: 'pattern', title: 'Grading Pattern Analysis', src: 'teacher_profile', fields: 'style · rubric use · feedback · deduction pattern' },
  { id: 'fairness', title: 'Fairness read', src: 'case_analysis.fairness_review', fields: 'Per-mark read against rubric language' },
  { id: 'findings', title: 'Critical findings', src: 'unexplained_deductions · calc errors', fields: 'Where points left without rubric backup' },
  { id: 'transparency', title: 'How the AI read this', src: 'ai_notes', fields: 'Extraction · reasoning · cross-check notes' },
];

const PLATFORMS = [
  { id: 'gradescope', name: 'Gradescope', where: 'Blue bubbles · rubric panel · score summary' },
  { id: 'canvas', name: 'Canvas', where: 'SpeedGrader pins · rubric grid · assessment comment' },
  { id: 'moodle', name: 'Moodle', where: 'Feedback table · rubric levels · annotated PDF' },
  { id: 'blackboard', name: 'Blackboard', where: 'Inline bubbles · rubric scorecard' },
  { id: 'brightspace', name: 'D2L Brightspace', where: 'Evaluation panel · achievement rubric' },
  { id: 'google_classroom', name: 'Google Classroom', where: 'Margin chips · grading panel' },
  { id: 'turnitin', name: 'Turnitin', where: 'QuickMarks + rubric — not similarity % alone' },
  { id: 'paper', name: 'Marked paper', where: 'Pen marks · circled scores · margin handwriting' },
  { id: 'schoology', name: 'Schoology', where: 'Checklist rubric · feedback text' },
  { id: 'teams', name: 'Microsoft Teams', where: 'Assignment feedback · rubric checklist' },
];

const TRUST_SIGNALS = [
  { k: 'API keys', v: 'Gemini & Claude stay on the server — never in the browser' },
  { k: 'Your data', v: 'Firebase sign-in · cases scoped to your account in Firestore' },
  { k: 'Input safety', v: 'Security scan on uploads & chat before analysis runs' },
  { k: 'You send it', v: 'Regrade drafts · you review and send from your own inbox' },
];

function TechTag({ children, accent }) {
  return (
    <span className="mono text-[10px] tracking-[0.12em] px-2 py-0.5 rounded"
      style={{
        color: accent || 'rgba(125,211,252,.95)',
        background: 'rgba(10,31,68,.06)',
        border: '1px solid rgba(79,168,224,.25)',
      }}>
      {children}
    </span>
  );
}

function JourneyRail() {
  return (
    <div className="tech-panel mt-12 p-5 lg:p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <Eyebrow>In-app flow</Eyebrow>
        <TechTag>regrade.app · iOS 2026</TechTag>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {USER_JOURNEY.map((s) => (
          <div key={s.n} className="tech-step rounded-xl p-3 lg:p-4">
            <div className="mono text-[10px] text-cyanglow/70 tracking-[0.16em]">{s.n}</div>
            <div className="text-[14px] font-semibold text-cream mt-1">{s.label}</div>
            <div className="text-[11px] text-cream/55 mt-1.5 leading-snug">{s.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineConsole() {
  const [active, setActive] = useState(0);
  const s = PIPELINE_STAGES[active];
  return (
    <div className="mt-12">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
        <div>
          <Eyebrow>Hybrid pipeline</Eyebrow>
          <p className="text-[14px] text-navy/60 mt-1 max-w-[520px]">
            Reader extracts only what is visible. Reasoner judges fairness. Cross-check aligns both.
          </p>
        </div>
        <TechTag>default: hybrid</TechTag>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-4">
        <div className="flex flex-col gap-2">
          {PIPELINE_STAGES.map((st, i) => (
            <button key={st.id} type="button" onClick={() => setActive(i)}
              className="text-left tech-pipeline-btn rounded-xl px-4 py-3.5 transition-all"
              data-active={i === active ? 'true' : 'false'}>
              <div className="flex items-center gap-3">
                <span className="mono text-[10px] text-cyanglow/80 w-14 shrink-0">{st.n}</span>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-cream">{st.stage}</div>
                  <div className="mono text-[10px] text-cream/45 truncate">{st.model}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="tech-panel tech-panel-glow p-5 lg:p-6 min-h-[280px]">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="mono text-[10px] tracking-[0.2em] text-cyanglow/75">{s.n} · {s.role}</div>
              <div className="serif text-cream text-[26px] md:text-[30px] mt-2 tracking-[-0.02em]">{s.stage}</div>
              <div className="mono text-[12px] text-cream/50 mt-1">{s.model}</div>
            </div>
            <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: '#7DD3FC', boxShadow: '0 0 12px #7DD3FC' }} />
          </div>
          <p className="text-[14px] text-cream/72 leading-relaxed mt-4">{s.body}</p>
          <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(248,245,238,.08)' }}>
            <div className="mono text-[9px] tracking-[0.18em] text-cream/40 mb-2">OUTPUT_FIELDS</div>
            <div className="flex flex-wrap gap-1.5">
              {s.out.map((o) => (
                <span key={o} className="mono text-[10px] px-2 py-1 rounded text-cyanglow/90"
                  style={{ background: 'rgba(125,211,252,.08)', border: '1px solid rgba(125,211,252,.2)' }}>
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {ENGINE_MODES.map((m) => (
          <div key={m.id} className="tech-mode-chip flex-1 min-w-[140px] rounded-lg px-3 py-2.5">
            <span className="mono text-[11px] text-cyanglow font-medium">{m.label}</span>
            <p className="text-[11px] text-navy/60 mt-1 leading-snug">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerdictPreview() {
  const [ref, seen] = window.useInView({ threshold: 0.15 });
  return (
    <div ref={ref} className="mt-14 grid lg:grid-cols-[1fr_1.05fr] gap-8 items-start">
      <div>
        <Eyebrow>What you see on Verdict</Eyebrow>
        <h3 className="serif text-navy text-[32px] md:text-[40px] leading-tight tracking-[-0.02em] mt-2">
          Rubric-aware analysis, <Em>not a chatbot guess.</Em>
        </h3>
        <p className="text-[15px] text-navy/70 mt-4 leading-relaxed max-w-[480px]">
          After analysis, your report ties every claim to what was on the upload — grading style, fairness read, unexplained deductions, and where the models agreed or diverged.
        </p>
        <div className="mt-6 perk-chip perk-chip-vivid max-w-[440px]">
          <div className="perk-chip-icon mono text-[10px]">↑</div>
          <div>
            <div className="text-[14px] font-medium text-navy">Best upload</div>
            <div className="text-[12.5px] text-navy/60 mt-0.5 leading-snug">
              Graded PDF with marked work and rubric visible — e.g. Gradescope “Download Graded Copy.”
            </div>
          </div>
        </div>
      </div>
      <div className="tech-panel p-0 overflow-hidden"
        style={{
          opacity: seen ? 1 : 0,
          transform: seen ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity .5s ease, transform .5s ease',
        }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(248,245,238,.08)' }}>
          <span className="mono text-[10px] tracking-[0.16em] text-cream/50">VERDICT_REPORT</span>
          <TechTag>live · post-analyze</TechTag>
        </div>
        <div className="p-4 space-y-2">
          {VERDICT_BLOCKS.map((b, i) => (
            <div key={b.id} className="rounded-lg px-4 py-3"
              style={{
                background: 'rgba(248,245,238,.04)',
                border: '1px solid rgba(125,211,252,.12)',
                opacity: seen ? 1 : 0,
                transition: `opacity .35s ease ${0.06 + i * 0.06}s`,
              }}>
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-[13px] font-medium text-cream/92">{b.title}</span>
                <span className="mono text-[9px] text-cyanglow/70">{b.src}</span>
              </div>
              <p className="mono text-[10px] text-cream/45 mt-1">{b.fields}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 mono text-[10px] text-cream/40 border-t" style={{ borderColor: 'rgba(248,245,238,.08)' }}>
          + platform badge · appeal letter · advocate chat
        </div>
      </div>
    </div>
  );
}

function PlatformMatrix() {
  return (
    <div className="mt-14">
      <Eyebrow>Supported sources</Eyebrow>
      <p className="text-[14px] text-navy/60 mt-2 mb-5 max-w-[560px]">
        Reader detects <span className="mono text-[12px] text-navy/80">source_platform</span> and reads where professors actually leave marks.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PLATFORMS.map((p) => (
          <div key={p.id} className="tech-platform-row rounded-xl px-4 py-3 flex gap-3 items-start">
            <span className="mono text-[10px] text-cyanglow/80 shrink-0 pt-0.5 w-[108px]">{p.id}</span>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-navy">{p.name}</div>
              <div className="text-[12px] text-navy/58 mt-0.5 leading-snug">{p.where}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustRow() {
  return (
    <div className="mt-12 grid sm:grid-cols-2 gap-3">
      {TRUST_SIGNALS.map((t) => (
        <div key={t.k} className="hair rounded-xl px-4 py-3.5 bg-cream2/50">
          <div className="mono text-[10px] tracking-[0.14em] text-navy/45">{t.k.toUpperCase()}</div>
          <div className="text-[13px] text-navy/75 mt-1 leading-snug">{t.v}</div>
        </div>
      ))}
    </div>
  );
}

function IntelligenceSection() {
  return (
    <section id="intelligence" data-screen-label="05 Technology" className="relative overflow-hidden tech-section">
      <div className="tech-section-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 w-[900px] h-[420px] -translate-x-1/2 opacity-25"
        style={{ background: 'radial-gradient(closest-side, rgba(125,211,252,.2), transparent 70%)' }} />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>Technology</Eyebrow>
          <TechTag>AI-assisted grade appeals</TechTag>
        </div>
        <h2 className="serif text-navy text-[44px] md:text-[68px] leading-[1.02] tracking-[-0.025em] mt-3 max-w-[920px]">
          <DancyHeading text="Upload." /> <Em>Understand.</Em> <DancyHeading text="Appeal." />
        </h2>
        <p className="mt-5 max-w-[640px] text-[17px] text-navy/70 leading-relaxed">
          Regrade is an AI-assisted grade-appeal assistant: upload graded coursework from your LMS or marked paper, get a rubric-aware verdict, and draft a respectful appeal — with every step visible before you send anything.
        </p>

        <JourneyRail />
        <PipelineConsole />
        <VerdictPreview />
        <PlatformMatrix />
        <TrustRow />

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 tech-cta-bar rounded-2xl px-6 py-5">
          <p className="text-[14px] text-navy/75 max-w-[520px] leading-relaxed">
            <span className="font-medium text-navy">Coming summer 2026</span> on iOS. Join the waitlist — we email you once when your platform opens.
          </p>
          <a href="#cta-section" className="shrink-0 inline-flex items-center gap-2 px-5 h-11 rounded-full text-cream text-[14px] font-medium"
            style={{ background: 'linear-gradient(180deg,#4FA8E0,#2C7FB8)', boxShadow: '0 8px 22px rgba(79,168,224,.35)' }}>
            Join waitlist
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { IntelligenceSection });
