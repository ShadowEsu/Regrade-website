import { SectionReveal } from "./SectionReveal";
import { WaitlistForm } from "./WaitlistForm";
import { DownloadComingSoon } from "./DownloadComingSoon";
import { REGRADE_CONFIG } from "../lib/site-config";

const spotsLeft =
  REGRADE_CONFIG.waitlistDisplayMax - REGRADE_CONFIG.waitlistDisplayCount;

export function CTASection() {
  return (
    <section
      id="waitlist"
      className="relative scroll-mt-[120px] overflow-hidden bg-[linear-gradient(165deg,#050b1f_0%,#0b1a4a_40%,#1236c9_100%)] sm:scroll-mt-[132px]"
    >
      <div className="section-shell relative flex items-center py-[clamp(72px,10vw,112px)]">
        <SectionReveal className="w-full">
          <div className="mx-auto max-w-[700px] text-center">
            <p className="mb-3 font-ui text-[12px] font-bold uppercase tracking-[0.14em] text-[#9db5ff]">
              Final private beta · downloads coming soon
            </p>
            <h2 className="font-display text-[clamp(2.1rem,4.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              <span className="text-gradient-live">See the final onboarding first.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] font-ui text-[15px] leading-relaxed text-white/75 sm:text-[16px]">
              Join the waitlist for a chance to experience the app onboarding in its production-ready
              final bits — before Windows and desktop downloads open.
            </p>
            <div className="mx-auto mt-6 grid max-w-[560px] gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-left backdrop-blur-sm">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[0.12em] text-[#9db5ff]">
                  When you start
                </p>
                <p className="mt-1 font-display text-[clamp(1.25rem,3vw,1.55rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
                  2 months Plus free trial
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-left backdrop-blur-sm">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[0.12em] text-[#9db5ff]">
                  Waitlist offer
                </p>
                <p className="mt-1 font-display text-[clamp(1.25rem,3vw,1.55rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
                  First {REGRADE_CONFIG.waitlistDisplayMax} get Pro free for 1 year
                </p>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-[420px] font-ui text-[14px] leading-relaxed text-white/60">
              Powered by OpenAI.
            </p>

            <div className="mx-auto mt-8 w-full max-w-[720px]">
              <WaitlistForm
                source="offer"
                submitLabel="Join waitlist for onboarding access"
                variant="dark"
                layout="stacked"
                size="lg"
              />
            </div>

            <div className="mx-auto mt-8 w-full max-w-[640px]">
              <DownloadComingSoon tone="dark" showWaitlistCta={false} />
            </div>

            <p className="mx-auto mt-5 max-w-[480px] font-ui text-[13px] leading-relaxed text-white/55">
              We’ll use your details only for early-access updates — see our{" "}
              <a href="/privacy.html" className="text-[#9db5ff] underline-offset-2 transition-colors hover:text-white hover:underline">
                privacy policy
              </a>.
              <br />
              Questions?{" "}
              <a
                href="mailto:preston@regrade.org"
                className="text-[#9db5ff] underline-offset-2 transition-colors hover:text-white hover:underline"
              >
                preston@regrade.org
              </a>
              {" — we reply within 2 business days."}
              {" · "}
              Updates and CS jobs on{" "}
              <a
                href={REGRADE_CONFIG.founderLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9db5ff] underline-offset-2 transition-colors hover:text-white hover:underline"
              >
                LinkedIn
              </a>
            </p>

            <div className="mx-auto mt-9 flex max-w-[420px] justify-center gap-8 text-center">
              <div>
                <p className="font-display text-[1.5rem] font-semibold text-white">
                  {REGRADE_CONFIG.waitlistDisplayCount}
                </p>
                <p className="mt-1 font-ui text-[12px] text-white/55">Joined</p>
              </div>
              <div>
                <p className="font-display text-[1.5rem] font-semibold text-[#9db5ff]">{spotsLeft}</p>
                <p className="mt-1 font-ui text-[12px] text-white/55">Pro spots left</p>
              </div>
              <div>
                <p className="font-display text-[1.5rem] font-semibold text-white">$0</p>
                <p className="mt-1 font-ui text-[12px] text-white/55">During beta</p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
