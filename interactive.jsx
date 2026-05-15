// Interactive demo + emotional story sections

const { useState, useEffect, useRef } = React;

// ─── Interactive Rubric Demo ─────────────────────────────────────────
// User clicks a deduction on a graded paper. The right side composes
// an appeal email letter-by-letter, citing the rubric back at the teacher.

const MARKS = [
  {
    id: 'q2',
    label: 'Q2 · −3 points',
    teacherNote: '— show your work in step 3',
    rubric: 'Solutions must include full intermediate steps for chain rule applications.',
    yourWork: 'Step 3: applied chain rule (d/dx of sin(u))',
    appeal: "Hi Professor Ramirez,\n\nThanks for the detailed feedback on Problem Set 4. On Q2, I do show the chain rule in step 3 — I differentiate sin(u) and substitute back. Could you take a second look at line 4 of my work? I believe the rubric criterion for intermediate steps is met.\n\nHappy to walk through it in office hours if helpful.\n\nBest,\nMaya"
  },
  {
    id: 'q3',
    label: 'Q3 · −2 points',
    teacherNote: '— wrong method',
    rubric: 'Any valid technique earning the correct antiderivative receives full credit.',
    yourWork: 'Used u-substitution. Result matches expected answer ±C.',
    appeal: "Hi Professor Ramirez,\n\nQuick question about Q3. The rubric says any valid technique earning the correct antiderivative receives full credit. I used u-substitution and arrived at the expected result (off by a constant of integration). Would you be open to reconsidering the method deduction?\n\nThank you for the time,\nMaya"
  },
  {
    id: 'q5',
    label: 'Q5 · −5 points',
    teacherNote: '— missing units',
    rubric: 'Units required on final answers only, not intermediate computations.',
    yourWork: 'Final answer carries units (m/s²). Intermediate lines are unitless.',
    appeal: "Hi Professor Ramirez,\n\nOn Q5, my final answer includes units (m/s²) — the rubric notes units are required on final answers only, not intermediate work. Could the deduction be revisited under that criterion?\n\nGratefully,\nMaya"
  },
];

function InteractiveDemo() {
  const [active, setActive] = useState('q2');
  const [typed, setTyped] = useState('');
  const mark = MARKS.find(m => m.id === active);

  useEffect(() => {
    setTyped('');
    let cancelled = false; let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      if (i <= mark.appeal.length) { setTyped(mark.appeal.slice(0,i)); setTimeout(tick, 14); }
    };
    const t = setTimeout(tick, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [active]);

  return (
    <section data-screen-label="03 Try It" className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-28">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-10">
        <div>
          <Eyebrow>Try the demo</Eyebrow>
          <h2 className="serif text-navy text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.02em] mt-3 max-w-[820px]">
            <DancyHeading text="Tap a red mark." /> <Em>Watch the appeal write itself.</Em>
          </h2>
        </div>
        <p className="max-w-[360px] text-[15px] text-navy/65 leading-relaxed">
          A real graded paper. Real rubric language. Click each deduction to see how Regrade builds your case.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8">
        {/* graded paper */}
        <div className="relative">
          <div className="hair rounded-2xl smooth-shadow overflow-hidden" style={{background:'#ffffff'}}>
            <div className="px-6 pt-6 pb-2 flex items-center justify-between">
              <div>
                <div className="mono text-[10.5px] tracking-[0.18em] text-navy/55">PROBLEM SET 4 · CALCULUS II · FALL 2026</div>
                <div className="serif text-navy text-[22px] mt-1">Maya Rivera — graded 11/03</div>
              </div>
              <div className="serif italic text-[28px] text-navy/60">B−</div>
            </div>
            <div className="px-6 pt-3 pb-6 space-y-4">
              <QuestionRow num="Q1" body="Evaluate ∫ 2x dx" answer="x² + C" mark="+25 / 25" tone="ok" />
              <QuestionRow
                num="Q2" body="Evaluate ∫ x·sin(x) dx by parts" answer="−x·cos(x) + sin(x) + C"
                mark={<MarkClicker id="q2" active={active} onClick={setActive} label="−3" note="show your work in step 3" />}
                tone="bad"
              />
              <QuestionRow
                num="Q3" body="Evaluate ∫ 2x·cos(x²) dx" answer="sin(x²) + C"
                mark={<MarkClicker id="q3" active={active} onClick={setActive} label="−2" note="wrong method" />}
                tone="bad"
              />
              <QuestionRow num="Q4" body="Find d/dx [e^(x²)]" answer="2x·e^(x²)" mark="+25 / 25" tone="ok" />
              <QuestionRow
                num="Q5" body="A ball falls from 80m. Find acceleration." answer="9.8 m/s² downward"
                mark={<MarkClicker id="q5" active={active} onClick={setActive} label="−5" note="missing units" />}
                tone="bad"
              />
            </div>
          </div>
          <div className="mt-3 text-center mono text-[10px] tracking-[0.18em] text-navy/45">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{background:'var(--cyan)',boxShadow:'0 0 8px var(--cyan)'}}></span>
            CLICK ANY RED MARK
          </div>
        </div>

        {/* appeal panel */}
        <div className="relative">
          <div className="hair-cyan rounded-2xl overflow-hidden text-cream relative glow-ring"
            style={{background:'linear-gradient(160deg,#0E2350,#0A1F44 70%,#08183A)'}}>
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div>
                <div className="eyebrow text-cyanglow/85">Appeal builder · {mark.label}</div>
                <div className="serif text-cream text-[22px] mt-1">Your case</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyanglow" style={{boxShadow:'0 0 10px #7DD3FC'}}></span>
                <span className="mono text-[10px] tracking-[0.18em] text-cream/65">DRAFTING</span>
              </div>
            </div>

            <div className="px-6 space-y-2.5">
              <CitationLine label="The rubric says" body={mark.rubric} tone="cyan" />
              <CitationLine label="Your work shows" body={mark.yourWork} tone="cream" />
            </div>

            <div className="mx-6 mt-5 rounded-xl p-4 hair-cyan" style={{background:'rgba(255,255,255,.06)'}}>
              <div className="eyebrow text-cream/55 mb-2">Draft to send</div>
              <div className="text-cream/92 text-[13px] leading-relaxed whitespace-pre-wrap mono" style={{minHeight:200}}>
                {typed}<span className="caret" style={{height:'1em'}}></span>
              </div>
            </div>

            <div className="px-6 pt-4 pb-6 flex items-center gap-2">
              <GlowButton type="button" onClick={() => {
                const to = window.getWaitlistEmail ? window.getWaitlistEmail() : 'hello@regrade.app';
                const subject = encodeURIComponent('Appeal draft (Regrade demo)');
                const body = encodeURIComponent(mark.appeal);
                const href = `mailto:${to}?subject=${subject}&body=${body}`;
                if (window.openMailtoUrl) window.openMailtoUrl(href);
                else window.location.assign(href);
              }}>Open in Mail</GlowButton>
              <button className="h-12 px-5 rounded-full hair-cyan text-cream/90 text-[13px]" style={{background:'rgba(255,255,255,.04)'}}>Refine tone</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionRow({ num, body, answer, mark, tone }) {
  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-start gap-3">
      <div className="mono text-[12px] text-navy/55 pt-1">{num}</div>
      <div>
        <div className="serif text-navy text-[15px] leading-snug">{body}</div>
        <div className="mono text-[12px] text-navy/65 mt-1">→ {answer}</div>
      </div>
      <div className="pt-1">{typeof mark === 'string'
        ? <span className="mono text-[12px] px-2 py-0.5 rounded-full" style={{background:'rgba(31,138,91,.12)',color:'#1F6F3F'}}>{mark}</span>
        : mark}</div>
    </div>
  );
}

function MarkClicker({ id, active, onClick, label, note }) {
  const isOn = active === id;
  return (
    <button onClick={() => onClick(id)}
      className={"relative inline-flex flex-col items-end gap-1 group"} >
      <span
        className="serif italic text-[18px] transition-transform"
        style={{
          color:'#C7553F',
          transform: isOn ? 'rotate(-3deg) scale(1.08)' : 'rotate(-3deg)',
        }}>{label}</span>
      <span className="serif italic text-[11px] max-w-[140px] text-right leading-tight" style={{color:'#A94B39'}}>
        {note}
      </span>
      {isOn && <span className="absolute -inset-2 rounded-md pointer-events-none"
        style={{boxShadow:'0 0 0 1.5px var(--cyan), 0 0 22px rgba(125,211,252,.5)'}}></span>}
    </button>
  );
}

function CitationLine({ label, body, tone = 'cream' }) {
  const accent = tone === 'cyan' ? '#7DD3FC' : '#FFFFFF';
  return (
    <div className="flex gap-3">
      <div className="w-[2px] rounded-full shrink-0" style={{background:accent,opacity:.5,marginTop:6,marginBottom:6}}></div>
      <div>
        <div className="eyebrow" style={{color:'rgba(255,255,255,.55)'}}>{label}</div>
        <div className="text-cream/90 text-[13.5px] leading-snug mt-1">{body}</div>
      </div>
    </div>
  );
}

// ─── Stories from the inbox — emotional rotating cards ──────────────

const STORIES = [
  {
    name: 'Maya, sophomore',
    tag: 'First in family · Bio major · 3.7 GPA',
    before: "I felt sick walking past her office every Tuesday.",
    after: "Sent the email Thursday. Got the regrade Monday.",
    delta: '+8 pts',
    course: 'Calculus II',
    color: '#7DD3FC',
  },
  {
    name: 'Arjun, freshman',
    tag: 'International · CS · second language',
    before: "I rewrote that email seven times. Never sent any of them.",
    after: "Regrade got the tone right in one try. She apologized.",
    delta: '+12 pts',
    course: 'Discrete Math',
    color: '#4FA8E0',
  },
  {
    name: 'Jordan, transfer',
    tag: 'Community college · single parent · works nights',
    before: "I don't have time to be polite for forty-five minutes.",
    after: "Sixty seconds, on the bus. Got my Pell standing back.",
    delta: '+15 pts',
    course: 'English Comp',
    color: '#E27D6B',
  },
  {
    name: 'Priya, senior',
    tag: 'Pre-med · scholarship · 3 jobs',
    before: "He grades on tone. I'm not white. I noticed.",
    after: "Regrade wrote it like the kid who sits next to me wrote it.",
    delta: '+6 pts',
    course: 'Organic Chemistry',
    color: '#7DD3FC',
  },
  {
    name: 'Devon, junior',
    tag: 'First-gen · veteran · age 28',
    before: "I'm too old to feel stupid asking 'is this fair?'",
    after: "It wasn't fair. Now it's fixed.",
    delta: '+9 pts',
    course: 'Statistics',
    color: '#4FA8E0',
  },
];

function StoriesCarousel() {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef(null);
  const dragRef = useRef({ down: false, startX: 0, scroll: 0 });
  const [paused, setPaused] = useState(false);

  // auto rotate
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % STORIES.length), 4200);
    return () => clearInterval(t);
  }, [paused]);

  // drag-to-scroll for the row
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const down = (e) => {
      dragRef.current.down = true;
      dragRef.current.startX = (e.touches?.[0]?.clientX ?? e.clientX);
      dragRef.current.scroll = el.scrollLeft;
      setPaused(true);
    };
    const move = (e) => {
      if (!dragRef.current.down) return;
      const x = (e.touches?.[0]?.clientX ?? e.clientX);
      el.scrollLeft = dragRef.current.scroll - (x - dragRef.current.startX);
    };
    const up = () => { dragRef.current.down = false; };
    el.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    el.addEventListener('touchstart', down, { passive: true });
    el.addEventListener('touchmove', move, { passive: true });
    el.addEventListener('touchend', up);
    return () => {
      el.removeEventListener('mousedown', down);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      el.removeEventListener('touchstart', down);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', up);
    };
  }, []);

  // scroll the row to the active index
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const card = el.children[idx]; if (!card) return;
    const elRect = el.getBoundingClientRect();
    const cRect = card.getBoundingClientRect();
    const target = el.scrollLeft + (cRect.left - elRect.left) - (elRect.width/2 - cRect.width/2);
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, [idx]);

  return (
    <section data-screen-label="04 Stories" className="relative overflow-hidden py-24 lg:py-28"
      style={{background:'#ffffff'}}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <Eyebrow>Stories from the inbox</Eyebrow>
          <h2 className="serif text-navy text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.02em] mt-3 max-w-[760px]">
            <DancyHeading text="The grade was wrong." />
            <br />
            <Em>The email was the hard part.</Em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <NavBtn dir="left" onClick={() => { setPaused(true); setIdx((idx - 1 + STORIES.length) % STORIES.length); }} />
          <NavBtn dir="right" onClick={() => { setPaused(true); setIdx((idx + 1) % STORIES.length); }} />
        </div>
      </div>

      <div ref={containerRef}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        className="drag-zone flex gap-6 overflow-x-auto pb-6 px-6 lg:px-10 scroll-smooth"
        style={{scrollSnapType:'x mandatory', scrollbarWidth:'none'}}>
        <style>{`.drag-zone::-webkit-scrollbar{display:none}`}</style>
        {STORIES.map((s, i) => (
          <StoryCard key={i} s={s} active={i === idx} onClick={() => { setIdx(i); setPaused(true); }} />
        ))}
      </div>

      {/* dots */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mt-6 flex items-center justify-center gap-2">
        {STORIES.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); setPaused(true); }}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === idx ? 36 : 8,
              background: i === idx ? 'var(--cyan)' : 'rgba(10,31,68,.18)',
              boxShadow: i === idx ? '0 0 12px rgba(125,211,252,.5)' : 'none',
            }} aria-label={'Story '+(i+1)} />
        ))}
      </div>
    </section>
  );
}

function NavBtn({ dir, onClick }) {
  return (
    <button onClick={onClick}
      className="w-11 h-11 rounded-full hair-cyan grid place-items-center bg-cream2/70 backdrop-blur"
      aria-label={dir === 'left' ? 'Previous story' : 'Next story'}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {dir === 'left'
          ? <path d="M9 2 4 7l5 5" stroke="#0A1F44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M5 2l5 5-5 5" stroke="#0A1F44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>}
      </svg>
    </button>
  );
}

function StoryCard({ s, active, onClick }) {
  return (
    <button onClick={onClick}
      className={"shrink-0 w-[340px] md:w-[400px] text-left hair rounded-2xl smooth-shadow transition-all duration-500 relative"}
      style={{
        scrollSnapAlign:'center',
        background:'rgba(255,255,255,.92)',
        transform: active ? 'translateY(-6px) scale(1.0)' : 'translateY(0) scale(.96)',
        boxShadow: active
          ? '0 1px 0 rgba(255,255,255,.6) inset, 0 30px 60px -30px rgba(10,31,68,.28), 0 0 0 1.5px '+s.color
          : '0 1px 0 rgba(255,255,255,.6) inset, 0 18px 44px -22px rgba(10,31,68,.18)',
        filter: active ? 'none' : 'saturate(.92) brightness(.99)',
      }}>
      <div className="p-7">
        <div className="flex items-center justify-between">
          <div className="eyebrow text-navy/55">{s.course}</div>
          <div className="serif italic" style={{color:s.color, fontSize:22, textShadow:'0 0 14px '+s.color+'66'}}>{s.delta}</div>
        </div>
        <p className="serif italic text-navy text-[20px] md:text-[22px] leading-snug mt-4">"{s.before}"</p>
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1" style={{background:'rgba(10,31,68,.12)'}}></div>
          <span className="mono text-[10px] tracking-[0.2em] text-navy/45">AFTER REGRADE</span>
          <div className="h-px flex-1" style={{background:'rgba(10,31,68,.12)'}}></div>
        </div>
        <p className="serif text-navy/85 text-[16px] leading-snug">"{s.after}"</p>
        <div className="mt-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full grid place-items-center serif text-cream"
            style={{background:'linear-gradient(135deg,#0A1F44,#1B3464)'}}>{s.name[0]}</div>
          <div>
            <div className="text-[13.5px] font-medium text-navy">{s.name}</div>
            <div className="text-[11.5px] text-navy/55">{s.tag}</div>
          </div>
        </div>
      </div>
    </button>
  );
}

Object.assign(window, { InteractiveDemo, StoriesCarousel });
