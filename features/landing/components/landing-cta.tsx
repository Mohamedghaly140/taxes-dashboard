import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2
            id="cta-heading"
            className="text-[clamp(1.4rem,3vw,2rem)] tracking-[-0.02em] mb-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Ready to leave Excel behind?
          </h2>
          <p className="text-[14px]" style={{ color: "#4a4845" }}>
            Set up takes under two minutes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="text-[13px] px-5 py-2.5 rounded-md transition-colors"
            style={{ color: "#5a5752" }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-md transition-all hover:brightness-110"
            style={{ background: "#b8972a", color: "#080808" }}
          >
            Get Started Free{" "}
            <LucideArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
