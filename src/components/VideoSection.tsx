import { SectionReveal } from "./SectionReveal";

export function VideoSection() {
  return (
    <section className="section-paper py-[clamp(56px,8vw,88px)]">
      <div className="section-shell">
        <SectionReveal>
          <div className="mx-auto max-w-[640px] text-center">
            <p className="mb-3 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
              60-second walkthrough
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-ink">
              See what the app actually does.
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-muted">
              Upload → scan rubric → see recoverable points → optional email draft. That&apos;s the
              whole flow.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.06}>
          <div className="mx-auto mt-10 max-w-[800px]">
            <div className="aspect-video overflow-hidden rounded-2xl border border-black/[0.08] bg-[#0a0f2e] shadow-[0_8px_40px_rgba(9,9,11,0.08)]">
              <video
                controls
                playsInline
                preload="metadata"
                className="h-full w-full"
                aria-label="Regrade 60-second product demo"
              >
                <source src="/regrade-demo.mp4" type="video/mp4" />
                Your browser does not support this video format.
              </video>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mx-auto mt-12 max-w-[1120px]">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
                  More from Regrade
                </p>
                <h3 className="mt-2 font-display text-[clamp(1.35rem,2.5vw,1.8rem)] font-semibold tracking-[-0.025em] text-ink">
                  A closer product look.
                </h3>
              </div>
              <p className="max-w-[330px] text-right text-[14px] leading-relaxed text-muted">
                More walkthroughs will live here as Regrade grows.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <article className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#0a0f2e] shadow-[0_8px_32px_rgba(9,9,11,0.07)]">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="block aspect-video w-full"
                  aria-label="Regrade product feature demo"
                >
                  <source src="/regrade-demo-product.mp4" type="video/mp4" />
                  Your browser does not support this video format.
                </video>
                <div className="bg-white px-5 py-4">
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-blue">Feature walkthrough</p>
                  <h4 className="mt-1 font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">From marked work to a clear next step.</h4>
                </div>
              </article>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
