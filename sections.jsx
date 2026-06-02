// How it works, Testimonials, AI panel

function HowItWorks() {
  const cards = [
    {
      n: '01', title: 'Upload graded work',
      body: "PDF or photos from Gradescope, Canvas, Moodle, or marked paper — with rubric and feedback visible.",
    },
    {
      n: '02', title: 'Get your Verdict',
      body: "AI reads every mark and comment, flags unfair deductions, and shows where it's confident vs. where to double-check.",
    },
    {
      n: '03', title: 'Send your appeal',
      body: "Evidence summary and a respectful draft in your voice. Edit everything, then send from your own inbox.",
    },
  ];
  return (
    <section data-screen-label="03 How it works" className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <Eyebrow>Simple process</Eyebrow>
      <h2 className="serif text-navy text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.025em] mt-3 max-w-[900px]">
        How it <Em>works</Em>
      </h2>
      <p className="mt-5 max-w-[560px] text-[16px] text-navy/65 leading-relaxed">
        Three simple steps to start appealing fairly
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((c) => (
          <div key={c.n} className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
              style={{ background: 'linear-gradient(145deg,#7DD3FC,#4FA8E0)', boxShadow: '0 4px 16px rgba(79,168,224,.3)' }}>
              <span className="serif text-cream text-[18px] font-medium">{c.n.replace('0','')}</span>
            </div>
            <h3 className="serif text-navy text-[22px] leading-tight">{c.title}</h3>
            <p className="text-[14.5px] text-navy/65 mt-2 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <JoinWaitlistButton size="lg">Join the Waitlist</JoinWaitlistButton>
      </div>
    </section>
  );
}

function SnapArt() {
  const items = [
    {l:'Assignment', sub:'PS 4 · Calc II'},
    {l:'Rubric', sub:'4 criteria'},
    {l:'Feedback', sub:'graded · 3 marks'},
  ];
  return (
    <div className="relative h-[180px]">
      {items.map((it, i) => (
        <div key={i} className="absolute hair rounded-md p-3 w-[140px] h-[170px]"
          style={{
            background:'#ffffff',
            left: 8 + i*36,
            top: 4 + i*8,
            transform:`rotate(${(i-1)*-4}deg)`,
            zIndex: 3-i,
            boxShadow:'0 8px 22px -10px rgba(10,31,68,.25)',
          }}>
          <div className="mono text-[9px] tracking-[0.18em] text-navy/55">{it.l.toUpperCase()}</div>
          <div className="mt-1 h-px w-full" style={{background:'rgba(10,31,68,.15)'}}></div>
          <div className="mt-3 space-y-1">
            {[68,84,52,76,40].map((w,j) => (
              <div key={j} className="h-1.5 rounded-sm" style={{background:'rgba(10,31,68,.18)',width:w+'%'}}></div>
            ))}
          </div>
          <div className="absolute bottom-2 left-3 text-[10px] text-navy/55">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

function RubricArt() {
  const rows = [
    {k:'Q1 · Method correct', v:'+25 / 25', tone:'cyan'},
    {k:'Q2 · Step 3 explained', v:'+3 unexplained', tone:'coral'},
    {k:'Q3 · Rubric mismatch', v:'+2 off-rubric', tone:'coral'},
    {k:'Q4 · Final answer', v:'+25 / 25', tone:'cyan'},
  ];
  const [ref, seen] = window.useInView({threshold:0.4});
  return (
    <div ref={ref} className="space-y-2">
      {rows.map((r,i) => (
        <div key={i} className="flex items-center justify-between hair rounded-lg px-3 py-2 bg-cream/70"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? 'translateY(0)' : 'translateY(6px)',
            transition:`opacity .5s ease ${i*0.15}s, transform .5s ease ${i*0.15}s`,
          }}>
          <span className="text-[12.5px] text-navy/85">{r.k}</span>
          <span className={"mono text-[11px] px-2 py-0.5 rounded-full "}
            style={{
              background: r.tone==='cyan' ? 'rgba(79,168,224,.14)' : 'rgba(226,125,107,.16)',
              color: r.tone==='cyan' ? '#1F6FAA' : '#A94B39',
            }}>{r.v}</span>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-between text-[12px]">
        <span className="text-navy/55">Recoverable</span>
        <span className="serif text-cyan2 text-[22px]">+5 pts</span>
      </div>
    </div>
  );
}

function DraftArt() {
  return (
    <div className="relative hair rounded-lg p-4 bg-cream">
      <div className="absolute -top-2 -left-1 serif text-[44px] leading-none" style={{color:'var(--cyan)'}}>"</div>
      <div className="pl-3 serif text-[13.5px] leading-relaxed text-navy/85" style={{fontStyle:'italic'}}>
        Hi Professor Ramirez — thank you for the thorough feedback on PS4. I wanted to flag one item on Q2: I do show the chain rule in step 3, and I think it may have been overlooked. Could you take a second look?
      </div>
      <div className="mt-3 pt-3 hair flex items-center justify-between" style={{borderTop:'1px solid var(--ink-10)',boxShadow:'none'}}>
        <span className="mono text-[10.5px] text-navy/55">DRAFT · 142 WORDS · READY TO SEND</span>
        <span className="inline-block w-2 h-2 rounded-full" style={{background:'#4FA8E0',boxShadow:'0 0 12px #7DD3FC'}}></span>
      </div>
    </div>
  );
}

// ─── For the ones nobody fights for ───────────────────────────────────────────

function TestimonialCard({ name, role, initial, quote }) {
  const ref = window.useTilt(6);
  return (
    <div ref={ref} className="tilt-card">
      <Glass className="p-7 relative h-full">
        <div className="serif italic absolute -top-3 left-5 text-[68px] leading-none" style={{color:'var(--cyan)'}}>"</div>
        <p className="serif italic text-[18px] leading-snug text-navy mt-4">{quote}</p>
        <div className="mt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full grid place-items-center serif text-cream"
            style={{background:'linear-gradient(135deg,#0A1F44,#1B3464)'}}>{initial}</div>
          <div>
            <div className="text-[13.5px] font-medium text-navy">{name}</div>
            <div className="text-[12px] text-navy/55">{role}</div>
          </div>
        </div>
      </Glass>
    </div>
  );
}

function Testimonials() {
  return (
    <section data-screen-label="05 Testimonials" className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-28">
      <Eyebrow>For the ones nobody fights for</Eyebrow>
      <h2 className="serif text-navy text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.02em] mt-3 max-w-[1100px]">
        You worked too hard for a grade you <Em>can't explain</Em>.
      </h2>
      <p className="mt-5 max-w-[640px] text-[16px] text-navy/65 leading-relaxed">
        Real students. Real grades that didn't add up. Real conversations they were too nervous to start.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        <TestimonialCard
          initial="M" name="Maya R." role="Sophomore · First gen · Bio major"
          quote="I knew the deduction wasn't fair, but I didn't know how to say it without sounding like I was complaining. Regrade wrote what I wanted to write the whole time." />
        <TestimonialCard
          initial="A" name="Arjun S." role="Freshman · International · CS"
          quote="My English is fine. My English to a professor I've never met is not. Regrade calibrated the tone in a way I just couldn't on my own." />
        <TestimonialCard
          initial="J" name="Jordan T." role="Transfer · Community college"
          quote="Nobody in my family went to college. I have nobody to ask. This is the first time school felt like it was on my side." />
      </div>
    </section>
  );
}

// ─── Platforms marquee strip ────────────────────────────────────────────

function PlatformsMarquee() {
  return (
    <section className="relative py-10 lg:py-14">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mb-6">
        <Eyebrow>Works with what you already use</Eyebrow>
      </div>
      <Marquee items={["Gradescope","Canvas","Moodle","Blackboard","Brightspace","Google Classroom","Turnitin","Schoology","Teams","Marked paper"]} />
    </section>
  );
}

Object.assign(window, { HowItWorks, Testimonials, PlatformsMarquee });
