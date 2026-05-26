// Beautification additions: floating nav, scroll indicator,
// scroll-discover hint, ambient mesh.

const { useState, useEffect } = React;

// ─── Trust strip: rotating quotes + live counters ────────────────────
const TRUST_QUOTES = [
  "The rubric already says you earned those points.",
  "A fair appeal shouldn't take forty-five minutes.",
  "You shouldn't need a lawyer parent to get heard.",
  "One polite email can change a transcript line.",
  "First-gen students deserve the same draft quality.",
  "Your professor still hears your voice — not ours.",
];

function TrustStrip() {
  const items = [...TRUST_QUOTES, ...TRUST_QUOTES];
  return (
    <section data-screen-label="01b Trust" className="relative" style={{
      borderTop:'1px solid var(--ink-10)', borderBottom:'1px solid var(--ink-10)',
      background:'linear-gradient(180deg, rgba(125,211,252,.08), rgba(242,237,224,.55) 40%, rgba(237,227,207,.65))',
    }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 lg:py-12 grid lg:grid-cols-[1fr_1.05fr] gap-10 items-center">
        <div>
          <div className="eyebrow text-navy/55 mb-3">Why students are signing up</div>
          <div className="overflow-hidden relative rounded-2xl hair py-1" style={{
            maskImage:'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
            WebkitMaskImage:'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
            background:'rgba(255,255,255,.35)',
          }}>
            <div className="flex gap-10 whitespace-nowrap py-3 px-2" style={{animation:'scrollX 42s linear infinite', width:'max-content'}}>
              {items.map((q,i) => (
                <span key={i} className="serif italic text-navy/75 text-[19px] md:text-[21px] inline-flex items-center gap-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{background:'var(--cyan)', boxShadow:'0 0 8px var(--cyan)'}}></span>
                  "{q}"
                </span>
              ))}
            </div>
          </div>
        </div>
        <TrustValueRow />
      </div>
    </section>
  );
}

// ─── Floating frosted nav pill on scroll ─────────────────────────────
function FloatingNav() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed left-1/2 top-4 z-50 pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${shown ? '0' : '-80px'})`,
        opacity: shown ? 1 : 0,
        transition:'transform .55s cubic-bezier(.2,.7,.2,1), opacity .35s ease',
      }}>
      <div className="pointer-events-auto hair-cyan rounded-full px-2 py-2 flex items-center gap-2"
        style={{
          background:'rgba(255,255,255,.92)',
          backdropFilter:'blur(20px) saturate(180%)',
          WebkitBackdropFilter:'blur(20px) saturate(180%)',
          boxShadow:'0 1px 0 rgba(255,255,255,.6) inset, 0 12px 40px -10px rgba(10,31,68,.18)',
        }}>
        <div className="pl-2 pr-1 shrink-0"><RegradeLogo size="nav" /></div>
        <div className="hidden md:flex items-center gap-1 text-[12px] text-navy/70 pr-2">
          <a href="#impact" className="px-2.5 py-1 rounded-full hover:bg-navy/5">Impact</a>
          <a href="#how" className="px-2.5 py-1 rounded-full hover:bg-navy/5">How</a>
          <a href="#intelligence" className="px-2.5 py-1 rounded-full hover:bg-navy/5">Technology</a>
          <a href="#faq" className="px-2.5 py-1 rounded-full hover:bg-navy/5">FAQ</a>
        </div>
        <a href="#cta-section" className="group relative overflow-hidden rounded-full px-4 h-9 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-cream"
          style={{background:'linear-gradient(180deg,#4FA8E0,#2C7FB8)', boxShadow:'0 0 0 1px rgba(125,211,252,.4), 0 8px 20px -8px rgba(79,168,224,.5)'}}>
          <span>Join waitlist</span>
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

// ─── Side scroll dots ────────────────────────────────────────────────
function SideRail() {
  const [labels, setLabels] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => {
      const els = Array.from(document.querySelectorAll('[data-screen-label]'));
      const list = els.map(el => ({ id: el.getAttribute('data-screen-label'), top: el.getBoundingClientRect().top + window.scrollY }));
      setLabels(list);
    };
    update();
    window.addEventListener('resize', update);
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      const els = Array.from(document.querySelectorAll('[data-screen-label]'));
      let cur = 0;
      els.forEach((el, i) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (y >= top) cur = i;
      });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', update); };
  }, []);
  if (labels.length === 0) return null;
  return (
    <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3">
      {labels.map((l, i) => (
        <button key={l.id} onClick={() => {
          const el = document.querySelectorAll('[data-screen-label]')[i];
          el?.scrollIntoView?.({behavior:'smooth', block:'start'});
        }}
          className="group flex items-center gap-3" aria-label={l.id}>
          <span className="text-[10px] tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity text-navy/55">{l.id.replace(/^\d+\s*/,'').replace(/^\w+\s/,'')}</span>
          <span className="block rounded-full transition-all"
            style={{
              width: i === active ? 22 : 6,
              height: 6,
              background: i === active ? 'var(--cyan)' : 'rgba(10,31,68,.22)',
              boxShadow: i === active ? '0 0 12px rgba(125,211,252,.6)' : 'none',
            }} />
        </button>
      ))}
    </div>
  );
}

// ─── Scroll-discover hint below hero ─────────────────────────────────
function ScrollHint() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="flex flex-col items-center gap-3 py-4"
      style={{opacity: hidden ? 0 : 1, transition:'opacity .4s ease', pointerEvents: hidden ? 'none' : 'auto'}}>
      <span className="eyebrow text-navy/45">Scroll to discover</span>
      <div className="w-[1.5px] h-9 rounded-full overflow-hidden" style={{background:'rgba(10,31,68,.12)'}}>
        <div className="w-full" style={{
          height:'40%', background:'linear-gradient(180deg, transparent, var(--cyan))',
          animation:'scrollHintDot 1.8s ease-in-out infinite',
        }}></div>
      </div>
    </div>
  );
}

// ─── Ambient drifting mesh behind hero ───────────────────────────────
function HeroMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute" style={{
        left:'-10%', top:'-20%', width:'70%', height:'80%', borderRadius:'50%',
        background:'radial-gradient(closest-side, rgba(125,211,252,.18), transparent 70%)',
        filter:'blur(60px)',
        animation:'floatBlob 22s ease-in-out infinite',
      }}></div>
      <div className="absolute" style={{
        right:'-10%', top:'10%', width:'60%', height:'70%', borderRadius:'50%',
        background:'radial-gradient(closest-side, rgba(125,211,252,.12), transparent 70%)',
        filter:'blur(70px)',
        animation:'floatBlob 28s ease-in-out infinite reverse',
      }}></div>
      <div className="absolute" style={{
        left:'30%', bottom:'-20%', width:'60%', height:'70%', borderRadius:'50%',
        background:'radial-gradient(closest-side, rgba(79,168,224,.16), transparent 70%)',
        filter:'blur(80px)',
        animation:'floatBlob 32s ease-in-out infinite',
        animationDelay:'-10s',
      }}></div>
    </div>
  );
}

Object.assign(window, { FloatingNav, SideRail, ScrollHint, HeroMesh });
