// Main app composition with Tweaks

const { useEffect } = React;
const useTweaks = window.useTweaks;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#4FA8E0",
  "displayFont": "Fraunces",
  "bodyFont": "Geist",
  "auroraIntensity": 0.55,
  "grainOn": true,
  "loopWords": "60 seconds, one tap, a coffee break, a study break"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks via CSS custom properties
  useEffect(() => {
    document.documentElement.style.setProperty('--cyan', t.accent);
    // derive a brighter glow variant by mixing toward white
    const glow = mix(t.accent, '#FFFFFF', 0.35);
    document.documentElement.style.setProperty('--cyan-bright', glow);
  }, [t.accent]);

  useEffect(() => {
    document.body.style.fontFamily = `"${t.bodyFont}", ui-sans-serif, system-ui, sans-serif`;
    document.documentElement.style.setProperty('--display-font', `"${t.displayFont}"`);
  }, [t.bodyFont, t.displayFont]);

  useEffect(() => {
    const el = document.querySelector('.grain-fixed');
    if (el) el.style.display = t.grainOn ? 'block' : 'none';
  }, [t.grainOn]);

  // Inject style with display font binding
  useEffect(() => {
    let s = document.getElementById('display-font-style');
    if (!s) { s = document.createElement('style'); s.id = 'display-font-style'; document.head.appendChild(s); }
    s.textContent = `.serif{font-family:var(--display-font,"Fraunces"),ui-serif,Georgia,serif !important}`;
  }, [t.displayFont]);

  const loopWords = (t.loopWords || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="relative">
      <ScrollProgress />
      <FloatingNav />
      <SideRail />
      <CursorBlob />
      <Nav />
      <HeroWithLoop words={loopWords.length ? loopWords : ['60 seconds']} />
      <ScrollHint />
      <InteractiveDemo />
      <ImpactSection />
      <div id="why"><WhyRegrade auroraIntensity={t.auroraIntensity} /></div>
      <div id="how"><HowItWorks /></div>
      <PlatformsMarquee />
      <IntelligenceSection />
      <div id="faq"><FAQ /></div>
      <FinalCTA />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Color" />
        <TweakColor label="Accent" value={t.accent}
          options={['#4FA8E0','#7C5CFF','#1F8A5B','#E27D6B','#D9A441']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Display font" value={t.displayFont}
          options={['Fraunces','Geist','Geist Mono']}
          onChange={(v) => setTweak('displayFont', v)} />
        <TweakSelect label="Body font" value={t.bodyFont}
          options={['Geist','Fraunces','Geist Mono']}
          onChange={(v) => setTweak('bodyFont', v)} />
        <TweakSection label="Motion" />
        <TweakSlider label="Aurora intensity" min={0} max={1} step={0.05} value={t.auroraIntensity}
          onChange={(v) => setTweak('auroraIntensity', v)} />
        <TweakToggle label="Background grain" value={t.grainOn}
          onChange={(v) => setTweak('grainOn', v)} />
        <TweakSection label="Hero copy" />
        <TweakText label="Loop words" value={t.loopWords}
          onChange={(v) => setTweak('loopWords', v)} />
      </TweaksPanel>
    </div>
  );
}

// Hero variant that accepts loop words
function HeroWithLoop({ words }) {
  // Re-export the existing Hero but parameterize the LoopType
  return <HeroParameterized words={words} />;
}

function HeroParameterized({ words }) {
  return (
    <section data-screen-label="01 Hero" className="relative overflow-hidden">
      <HeroMesh />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-10 pb-24 lg:pt-16 lg:pb-32 z-10">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 hair-cyan rounded-full pl-3 pr-4 h-8 bg-cream2/70 backdrop-blur">
              <Dot />
              <span className="text-[12px] tracking-tight text-navy/75">Coming soon · iOS first · Android & Web later 2026</span>
            </div>

            <h1 className="serif mt-7 text-[58px] sm:text-[72px] md:text-[88px] leading-[0.96] tracking-[-0.025em] text-navy">
              Appeal an unfair grade in <Em className="italic">{words[0] || '60 seconds'}</Em>.
            </h1>

            <p className="mt-8 max-w-[560px] text-[18px] leading-relaxed text-navy/75">
              Upload graded coursework from Gradescope, Canvas, Moodle, or marked paper. Regrade reads every rubric line and professor comment, surfaces what's worth appealing, and drafts the respectful email — in your voice, calibrated to how your teacher actually grades.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <EmailPill cta="Get Early Access" />
            </div>

            <div className="mt-8">
              <p className="text-[13px] font-medium text-navy/70 mb-3">
                Built for community college, first-gen, and international students — <span className="serif italic text-navy">no fake hype, just a fair shot.</span>
              </p>
              <FoundingPerks />
            </div>
          </div>

          <div className="relative h-[640px] hidden lg:block">
            <PaperPeek />
            <div className="absolute right-4 top-2"><PhoneMockup /></div>
            <GradeChip />
            <FloatingBadge style={{left:-30, bottom:30, transform:'rotate(-8deg)'}}>
              <div className="eyebrow text-navy/55 mb-0.5">Calibrated to</div>
              <div className="serif text-navy text-[14px]">Prof. Ramirez · 11 yrs</div>
            </FloatingBadge>
          </div>
          <div className="lg:hidden flex justify-center"><PhoneMockup /></div>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[680px] h-[680px] rounded-full"
        style={{background:'radial-gradient(closest-side, rgba(125,211,252,.22), rgba(79,168,224,0) 70%)'}}></div>
    </section>
  );
}

function FloatingBadge({ children, style }) {
  return (
    <div className="absolute hair rounded-2xl bg-cream2/80 backdrop-blur px-4 py-3 smooth-shadow" style={style}>
      {children}
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
    <div className="absolute -right-6 top-6 hair rounded-2xl bg-cream/90 backdrop-blur px-4 py-3 smooth-shadow rotate-[6deg]" style={{zIndex:5}}>
      <div className="eyebrow text-navy/60 mb-1">Grade after appeal</div>
      <div className="flex items-center gap-2">
        <span className="serif text-[22px] text-navy/60 line-through">C+</span>
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none"><path d="M0 7h18m-4-4 4 4-4 4" stroke="currentColor" style={{color:'var(--cyan)'}} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="serif text-[28px] font-medium" style={{color:'#0A1F44'}}>A<span style={{color:'var(--cyan)'}}>−</span></span>
      </div>
    </div>
  );
}

// Helper: mix two hex colors
function mix(hexA, hexB, t) {
  const a = parseHex(hexA), b = parseHex(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return '#' + [r,g,bl].map(n => n.toString(16).padStart(2,'0')).join('');
}
function parseHex(h) {
  const s = h.replace('#','');
  return { r: parseInt(s.slice(0,2),16), g: parseInt(s.slice(2,4),16), b: parseInt(s.slice(4,6),16) };
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
