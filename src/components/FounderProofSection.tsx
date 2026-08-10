import { SectionReveal } from "./SectionReveal";
import { REGRADE_CONFIG } from "../lib/site-config";

export function FounderProofSection() {
  return (
    <section
      id="case-study"
      className="scroll-mt-[var(--site-header)] border-b border-black/[0.07] bg-paper py-[clamp(56px,7vw,80px)]"
    >
      <div className="section-shell">
        <SectionReveal>
          <div className="glass-panel relative mx-auto max-w-[640px] overflow-hidden rounded-[28px] px-7 py-9 text-center sm:px-10 sm:py-11">
            <p className="relative mb-3 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
              Founder case study
            </p>
            <h2 className="relative font-display text-[clamp(1.55rem,3vw,2.1rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-ink">
              A confusing mark became the first Regrade case study.
            </h2>
            <p className="relative mx-auto mt-4 max-w-[500px] text-[15px] leading-[1.65] text-muted sm:text-[16px]">
              One rubric line was counted twice on my essay. Regrade was built to make visible
              what a student can actually point to: the marked work, the rubric, and the gap
              between them. It does not promise a grade change.
            </p>

            <div className="relative mx-auto mt-8 flex max-w-[360px] flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue text-[13px] font-bold tracking-wide text-white shadow-[0_10px_24px_-10px_rgba(30,79,255,0.55)]">
                PS
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
                  Preston Susanto
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-blue">Founder</p>
                <p className="text-[13px] text-muted">EECS student</p>
              </div>
            </div>

            <div className="relative mx-auto mt-7 max-w-[440px] space-y-2.5 text-[14px] leading-relaxed text-muted sm:text-[15px]">
              <p>
                Questions?{" "}
                <a
                  href="mailto:preston@regrade.org"
                  className="font-semibold text-blue transition-colors hover:text-blue-deep"
                >
                  preston@regrade.org
                </a>
              </p>
              <p>
                Regrade updates and CS openings on{" "}
                <a
                  href={REGRADE_CONFIG.founderLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue transition-colors hover:text-blue-deep"
                >
                  LinkedIn
                </a>
                .
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
