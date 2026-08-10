import { REGRADE_CONFIG } from "../lib/site-config";
import { RegradeLogo } from "./RegradeLogo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Understand, Review, Appeal, Coach", href: "/#product" },
      { label: "Connections", href: "/#connections" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Downloads coming soon", href: "/#download" },
      { label: "Supervisor private beta", href: "/#supervisor" },
      { label: "Join waitlist for onboarding", href: "/#waitlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Founder case study", href: "/#case-study" },
      { label: "preston@regrade.org", href: "mailto:preston@regrade.org" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy.html" },
      { label: "Terms of service", href: "/terms.html" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "LinkedIn · updates & CS jobs", href: REGRADE_CONFIG.founderLinkedIn, external: true },
      { label: "Instagram", href: "https://instagram.com/regrade_app", external: true },
      { label: "X", href: "https://x.com/regrade_app", external: true },
      { label: "Book an interview", href: REGRADE_CONFIG.calendlyUrl, external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute -right-16 top-0 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(30,79,255,0.22)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="section-shell relative py-14 sm:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[360px]">
            <a
              href="/#top"
              className="inline-flex items-center transition-transform duration-300 hover:scale-105"
            >
              <RegradeLogo variant="wordmark" size={44} invert />
            </a>
            <p className="mt-5 font-display text-[17px] font-medium leading-[1.55] text-white/80">
              Understand your grade. Learn from it. Make the strongest appeal.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Educational support — not legal advice. Follow your school&apos;s appeal policy.
            </p>
          </div>

          <div className="grid w-full max-w-[720px] grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-4 font-ui text-[12px] font-semibold uppercase tracking-[0.12em] text-white/55">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...("external" in link && link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="font-ui text-[16px] leading-snug text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-ui text-[14px] text-white/60">
            © {new Date().getFullYear()} Preston Jay Susanto. All rights reserved.
          </p>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#f26522] font-display text-[11px] font-bold text-white">
              Y
            </span>
            <span className="font-display text-[14px] font-medium tracking-[-0.01em] text-white/90">
              Applying to Y Combinator · Winter 2026 Batch
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
