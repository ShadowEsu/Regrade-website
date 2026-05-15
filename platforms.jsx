// Supported platforms grid + AI panel

const PLATFORMS = [
  { name: 'Canvas', cat: 'Most Popular · LMS', desc: 'Reads assignments, rubrics, SpeedGrader feedback, and exported PDF submissions.', back: 'Direct screenshot of SpeedGrader, plus exported submission PDFs with annotations preserved.' },
  { name: 'Gradescope', cat: 'LMS · Math heavy', desc: 'Reads rubric items, point deductions, and instructor margin notes on PDF submissions.', back: 'Pulls per-question rubric labels and matches your scanned work against criteria language.' },
  { name: 'Google Classroom', cat: 'K–College · LMS', desc: 'Reads turned-in docs, private comments, and graded rubric tiles.', back: 'Works with screenshots from the mobile or web grader, including comment thread context.' },
  { name: 'Moodle', cat: 'LMS', desc: 'Reads marking guides, advanced rubrics, and feedback annotations.', back: 'Handles both the marking-guide and rubric grading methods; preserves criterion-level scoring.' },
  { name: 'Blackboard', cat: 'LMS', desc: 'Reads inline grading marks, rubric criteria, and instructor narrative feedback.', back: 'Compatible with Ultra and Original courses. Reads BlackBoard Annotate margin comments.' },
  { name: 'D2L Brightspace', cat: 'LMS', desc: 'Reads competencies, rubric levels, and turn-it-in feedback layered on top.', back: 'Pulls outcome-aligned rubric levels and recognizes mastery-based grading scales.' },
  { name: 'Turnitin', cat: 'Plagiarism · Feedback', desc: 'Reads QuickMarks, voice comments transcripts, and rubric scoring tiles.', back: 'Maps QuickMark codes to plain-English explanations Regrade uses in the appeal email.' },
  { name: 'Handwritten', cat: 'On Paper', desc: 'Photograph the paper. Regrade reads handwriting, math notation, and red-pen feedback.', back: 'Vision grade OCR handles cursive, equations, and faint scans. Just hold the camera steady.' },
];

function PlatformTile({ p }) {
  return (
    <div className="tile-flip h-[170px]">
      <div className="inner relative">
        <div className="face hair rounded-2xl bg-cream2/55 smooth-shadow">
          <Eyebrow>{p.cat}</Eyebrow>
          <div className="serif text-navy text-[26px] leading-tight mt-2">{p.name}</div>
          <div className="text-[13px] text-navy/65 mt-2 leading-snug flex-1">{p.desc}</div>
          <div className="flex items-center justify-between text-[11px] text-navy/45 mt-3">
            <span className="mono">SUPPORTED</span>
            <span>Hover for detail →</span>
          </div>
        </div>
        <div className="face back hair-cyan rounded-2xl glow-ring text-cream" style={{background:'linear-gradient(165deg,#0E2350,#0A1F44)'}}>
          <div className="eyebrow text-cyanglow/85">{p.name}</div>
          <div className="serif text-[18px] leading-snug text-cream/95 mt-3 flex-1">{p.back}</div>
          <div className="mt-3 mono text-[10px] tracking-[0.18em] text-cream/60">READS · RUBRIC · FEEDBACK</div>
        </div>
      </div>
    </div>
  );
}

function PlatformsGrid() {
  return (
    <section data-screen-label="06 Universal Support" className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-28">
      <Eyebrow>Universal Support</Eyebrow>
      <div className="flex items-end justify-between gap-8 flex-wrap mt-3">
        <h2 className="serif text-navy text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.02em] max-w-[820px]">
          If your school uses it, <Em>Regrade reads it</Em>.
        </h2>
        <p className="max-w-[360px] text-[15px] text-navy/65 leading-relaxed">
          Photos, screenshots, PDFs, and exported submissions. Cursive, math, and red pen welcome.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLATFORMS.map(p => <PlatformTile key={p.name} p={p} />)}
      </div>
    </section>
  );
}

// AI panel ────────────────────────────────────────────────────────────

function AiIcon() {
  return (
    <div className="relative w-16 h-16 rounded-2xl grid place-items-center" style={{background:'linear-gradient(160deg,#7DD3FC,#4FA8E0)',boxShadow:'0 0 40px rgba(125,211,252,.5)'}}>
      <div className="absolute inset-0 rounded-2xl" style={{animation:'breath 3s ease-in-out infinite',boxShadow:'inset 0 0 24px rgba(255,255,255,.4)'}}></div>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" fill="#0A1F44"/>
        <circle cx="18" cy="18" r="1.6" fill="#0A1F44"/>
        <circle cx="6" cy="17" r="1.2" fill="#0A1F44"/>
      </svg>
    </div>
  );
}

function AiPanel() {
  const pills = ['Vision grade OCR','Handwriting + math','Tone calibrated','English + 30 languages'];
  const [ref, seen] = window.useInView({threshold:0.35});
  return (
    <section data-screen-label="07 AI Panel" className="relative py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="relative rounded-3xl overflow-hidden text-cream hair-cyan"
          style={{background:'linear-gradient(150deg,#0A1F44 0%,#1B3464 60%,#0F2A5A 100%)'}}>
          <div className="aurora" style={{filter:'blur(70px)',opacity:.45}}>
            <div className="blob" style={{left:'10%',top:'10%',width:380,height:380,background:'radial-gradient(closest-side,#7DD3FC,transparent)'}}></div>
            <div className="blob" style={{right:'5%',bottom:'-10%',width:520,height:520,background:'radial-gradient(closest-side,#4FA8E0,transparent)',animationDelay:'-9s'}}></div>
          </div>
          <div className="relative p-10 md:p-14 grid lg:grid-cols-[auto_1fr] gap-10 items-start">
            <AiIcon />
            <div>
              <Eyebrow color="rgba(248,245,238,.6)">Powered by the best AI on the planet</Eyebrow>
              <h2 className="serif text-[34px] md:text-[48px] leading-[1.05] tracking-[-0.02em] mt-3 max-w-[820px]">
                A vision model that reads handwriting like a TA, and a writer that <Em>knows your teacher</Em>.
              </h2>
              <p className="mt-5 max-w-[680px] text-[15.5px] text-cream/75 leading-relaxed">
                Multimodal vision reads handwriting, math notation, screenshots, and PDFs. Calibrated reasoning composes the email in the tone that actually works on your specific teacher — never generic, never AI-flavored.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {pills.map((p,i) => (
                  <div key={p} className="hair-cyan rounded-full px-4 h-9 inline-flex items-center text-[13px] text-cream/95"
                    style={{
                      background:'rgba(248,245,238,.06)',
                      opacity: seen ? 1 : 0,
                      transform: seen ? 'translateY(0)' : 'translateY(6px)',
                      transition:`opacity .5s ease ${i*0.12}s, transform .5s ease ${i*0.12}s`,
                      boxShadow: seen ? '0 0 22px rgba(125,211,252,.18)' : 'none',
                    }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{background:'#7DD3FC',boxShadow:'0 0 8px #7DD3FC'}}></span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PlatformsGrid, AiPanel });
