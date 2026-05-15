// Text streaming sampler + Why Regrade exists

const { useState, useEffect, useMemo } = React;
const QA_SAMPLES = [
  {
    q: "What's my best shot at recovering points on Q2?",
    a: "Your work shows the chain rule applied correctly in step 3 — the deduction reads as a missed explanation, not a wrong answer. Lead with that. Ask for a second look at step 3 before requesting full credit.",
    label: "TYPEWRITER",
  },
  {
    q: "How do I sound respectful without sounding desperate?",
    a: "Open with gratitude, not grievance. Anchor on the rubric, not the grade. Close with a small ask — office hours, a second read — never a demand. Short, specific, kind.",
    label: "WORD FADE",
  },
  {
    q: "My teacher prefers brief emails. How short?",
    a: "Three short paragraphs. Five sentences total. One ask. Subject line: short, neutral, specific to the assignment. Avoid hedging language and apologies.",
    label: "BLUR FOCUS",
  },
  {
    q: "Will my professor know I used an AI to draft this?",
    a: "Regrade writes in your voice, calibrated to how your professor writes back. We never sign for you, never send for you, and never include phrases teachers flag as AI-generated.",
    label: "LINE SLIDE",
  },
];

// Cell wrapper with hover tilt + halo
function StreamCell({ children, label, q }) {
  const ref = window.useTilt(10);
  return (
    <div ref={ref} className="cell relative">
      <div className="relative w-[280px] h-[300px] md:w-[300px] md:h-[300px] rounded-2xl overflow-hidden hair-cyan"
        style={{background:'linear-gradient(165deg,#0E2350 0%,#0A1F44 60%,#08183A 100%)'}}>
        <div className="scrollglow"></div>
        {/* breathing inner glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{boxShadow:'inset 0 0 80px rgba(79,168,224,.18)',animation:'breath 5s ease-in-out infinite'}}></div>
        <div className="relative p-5 h-full flex flex-col">
          <div className="serif italic text-cream/85 text-[13.5px] leading-snug">"{q}"</div>
          <div className="mt-3 h-px w-full" style={{background:'rgba(248,245,238,.12)'}}></div>
          <div className="mt-3 flex-1 text-cream/85 text-[12.5px] leading-snug">
            {children}
          </div>
        </div>
      </div>
      <div className="mono text-[10px] tracking-[0.18em] text-navy/55 mt-3 text-center">{label}</div>
    </div>
  );
}

// Variant 1 — typewriter
function VTypewriter({ text, loopKey }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    let cancelled = false;
    let step = 0;
    const tick = () => {
      if (cancelled) return;
      step++;
      if (step <= text.length) { setI(step); setTimeout(tick, 22); }
      else { setTimeout(() => { setI(0); setTimeout(tick, 200); }, 2400); }
    };
    const t = setTimeout(tick, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [text, loopKey]);
  return <span>{text.slice(0,i)}<span className="caret" style={{height:'1em'}}></span></span>;
}

// Variant 2 — word fade with glow bloom
function VWordFade({ text }) {
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const [n, setN] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const visibleCount = words.filter(w => !/^\s+$/.test(w)).length;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      if (i <= visibleCount) { setN(i); setTimeout(tick, 110); }
      else { setTimeout(() => { setN(0); i = 0; setTimeout(tick, 200); }, 2600); }
    };
    const t = setTimeout(tick, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [text]);
  let count = 0;
  return (
    <span>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        count++;
        const on = count <= n;
        return (
          <span key={i} style={{
            opacity: on ? 1 : 0,
            filter: on ? 'none' : 'blur(2px)',
            textShadow: on ? '0 0 12px rgba(125,211,252,.45)' : 'none',
            transition: 'opacity .35s ease, filter .35s ease, text-shadow .9s ease',
          }}>{w}</span>
        );
      })}
    </span>
  );
}

// Variant 3 — character blur to focus
function VBlurFocus({ text }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      if (i <= text.length) { setN(i); setTimeout(tick, 24); }
      else { setTimeout(() => { setN(0); i = 0; setTimeout(tick, 200); }, 2600); }
    };
    const t = setTimeout(tick, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [text]);
  return (
    <span>
      {Array.from(text).map((c, i) => {
        const on = i < n;
        return (
          <span key={i} style={{
            display:'inline-block',
            opacity: on ? 1 : 0.0,
            filter: on ? 'blur(0px)' : 'blur(6px)',
            transition: 'filter .35s ease, opacity .35s ease',
          }}>{c === ' ' ? '\u00A0' : c}</span>
        );
      })}
    </span>
  );
}

// Variant 4 — line by line slide up
function VLineSlide({ text }) {
  const lines = useMemo(() => {
    // Split into 4-5 short lines by punctuation/words
    const parts = text.split(/(?<=[.!?])\s+/);
    return parts.filter(Boolean);
  }, [text]);
  const [n, setN] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      if (i <= lines.length) { setN(i); setTimeout(tick, 460); }
      else { setTimeout(() => { setN(0); i = 0; setTimeout(tick, 200); }, 2200); }
    };
    const t = setTimeout(tick, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [text]);
  return (
    <span className="block">
      {lines.map((l, i) => (
        <span key={i} className="block" style={{
          opacity: i < n ? 1 : 0,
          transform: i < n ? 'translateY(0)' : 'translateY(8px)',
          transition: 'transform .45s cubic-bezier(.2,.7,.2,1), opacity .45s ease',
          marginBottom: 4,
        }}>{l}</span>
      ))}
    </span>
  );
}

function StreamingSampler() {
  return (
    <section data-screen-label="02 Streaming Sampler" className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pb-20">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <Eyebrow>Watch how it writes</Eyebrow>
          <h2 className="serif text-navy text-[44px] md:text-[56px] leading-[1.02] tracking-[-0.02em] mt-3 max-w-[760px]">
            Four ways the words arrive. <Em>One voice</Em> that sounds like you.
          </h2>
        </div>
        <p className="max-w-[360px] text-[15px] text-navy/65 leading-relaxed">
          Every sentence is composed against your specific teacher's tone and the exact rubric language they grade by.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 place-items-center">
        <StreamCell label={QA_SAMPLES[0].label} q={QA_SAMPLES[0].q}>
          <VTypewriter text={QA_SAMPLES[0].a} />
        </StreamCell>
        <StreamCell label={QA_SAMPLES[1].label} q={QA_SAMPLES[1].q}>
          <VWordFade text={QA_SAMPLES[1].a} />
        </StreamCell>
        <StreamCell label={QA_SAMPLES[2].label} q={QA_SAMPLES[2].q}>
          <VBlurFocus text={QA_SAMPLES[2].a} />
        </StreamCell>
        <StreamCell label={QA_SAMPLES[3].label} q={QA_SAMPLES[3].q}>
          <VLineSlide text={QA_SAMPLES[3].a} />
        </StreamCell>
      </div>
    </section>
  );
}

function WhyRegrade() {
  return (
    <section data-screen-label="03 Why Regrade" className="relative overflow-hidden text-cream" style={{background:'linear-gradient(180deg,#0A1F44,#0C234D 60%,#0A1F44)'}}>
      {/* aurora */}
      <div className="aurora">
        <div className="blob" style={{left:'5%',top:'10%',width:520,height:520,background:'radial-gradient(closest-side,#4FA8E0,transparent)'}}></div>
        <div className="blob" style={{left:'55%',top:'40%',width:620,height:620,background:'radial-gradient(closest-side,#7DD3FC,transparent)',animationDelay:'-7s'}}></div>
        <div className="blob" style={{left:'30%',top:'70%',width:480,height:480,background:'radial-gradient(closest-side,#3D5CB8,transparent)',animationDelay:'-14s'}}></div>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <Eyebrow color="rgba(248,245,238,.55)">Why Regrade exists</Eyebrow>
        <h2 className="serif text-[52px] md:text-[88px] leading-[1.0] tracking-[-0.025em] mt-4 max-w-[1180px]">
          <DancyHeading text="Every student has been failed" />
          <br/>
          <span>by a grade that </span><Em className="italic">wasn't actually fair</Em>.
        </h2>
        <p className="mt-7 max-w-[680px] text-[16.5px] leading-relaxed text-cream/75">
          Well funded students have parents, advisors, and family friends who know exactly how to write the email. Community college, first generation, and international students often have nobody in the room. Regrade is the advocate everyone else gets for free.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4">
          <Stat to={73} suffix="%" caption="of students never appeal a grade they believe is unfair." />
          <Divider />
          <Stat to={9} suffix="%" caption="of those who do appeal, do so without help from a parent or advisor." />
          <Divider />
          <Stat to={60} suffix="s" caption="is all Regrade needs to read your work and draft the email." />
        </div>
      </div>
    </section>
  );
}

function Divider() {
  return <div className="hidden md:block w-px h-32 self-center mx-auto" style={{background:'linear-gradient(180deg,transparent,rgba(248,245,238,.18),transparent)'}}></div>;
}

function Stat({to, suffix, caption}) {
  return (
    <div className="relative">
      <div className="serif text-[88px] md:text-[112px] leading-none tracking-[-0.04em] text-cream">
        <CountUp to={to} suffix={suffix} />
      </div>
      <div className="mt-2 h-[2px] w-20" style={{background:'linear-gradient(90deg,#7DD3FC,transparent)',filter:'blur(.5px)'}}></div>
      <div className="mt-5 max-w-[260px] text-[14px] text-cream/70 leading-relaxed">{caption}</div>
    </div>
  );
}

Object.assign(window, { StreamingSampler, WhyRegrade });
