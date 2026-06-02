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
      <WaitlistTopBanner />
      <HeroWithLoop words={loopWords.length ? loopWords : ['60 seconds']} />
      <HeroStats />
      <ScrollHint />
      <div id="how"><HowItWorks /></div>
      <ComparisonSection />
      <InteractiveDemo />
      <WhyDifferentSection />
      <PlatformsMarquee />
      <WaitlistFormSection />
      <JoinMovementSection />
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
  const platforms = ['Gradescope', 'Canvas', 'Moodle', 'Blackboard', 'Brightspace', 'Turnitin', 'Teams', 'Paper'];
  return (
    <section data-screen-label="01 Hero" className="relative overflow-hidden">
      <HeroMesh />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-8 pb-16 lg:pt-12 lg:pb-20 z-10">
        <div className="max-w-[820px] mx-auto text-center">
          <div className="flex justify-center mb-6 lg:mb-8">
            <RegradeLogo size="hero" showHalo className="hero-logo-single" />
          </div>
          <h1 className="serif text-[48px] sm:text-[64px] md:text-[80px] lg:text-[92px] leading-[0.96] tracking-[-0.025em] text-navy">
            Appeal unfair grades in{' '}
            <span className="block mt-1">
              <Em className="italic"><LoopType words={words.length ? words : ['60 seconds']} /></Em>.
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {platforms.map((p) => (
              <span key={p} className="inline-flex items-center hair rounded-full px-3 py-1 text-[12px] text-navy/70 bg-cream2/70">
                {p}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-[580px] mx-auto text-[18px] leading-relaxed text-navy/75">
            Upload graded coursework from any LMS. Regrade reads every rubric line, surfaces what's worth appealing, and drafts the email — in your voice.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <JoinWaitlistButton size="lg">Join the Waitlist</JoinWaitlistButton>
            <a href="#how" className="cta-outline cta-glow--lg">
              See How It Works
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <p className="mt-6 text-[13px] text-navy/50">
            Free to join · No credit card · Summer 2026 iOS launch
          </p>
        </div>

        <div className="relative mt-16 hidden lg:block h-[420px] max-w-[900px] mx-auto">
          <PaperPeek />
          <div className="absolute right-4 top-2"><PhoneMockup /></div>
          <GradeChip />
          <FloatingBadge style={{left: 0, bottom: 20, transform: 'rotate(-8deg)'}}>
            <div className="eyebrow text-navy/55 mb-0.5">Calibrated to</div>
            <div className="serif text-navy text-[14px]">Prof. Ramirez · 11 yrs</div>
          </FloatingBadge>
        </div>
        <div className="lg:hidden flex justify-center mt-10"><PhoneMockup /></div>
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
