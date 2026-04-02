import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-20 border-t border-black/6 dark:border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2
            id="cta-heading"
            className="text-[clamp(1.4rem,3vw,2rem)] tracking-[-0.02em] mb-2 text-[#1a1918] dark:text-[#eeeae3]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Ready to leave Excel behind?
          </h2>
          <p className="text-[14px] text-[#5c5955] dark:text-[#4a4845]">
            Set up takes under two minutes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="text-[13px] px-5 py-2.5 rounded-md transition-colors text-[#5a5752] hover:text-[#1a1918] dark:text-[#5a5752] dark:hover:text-[#eeeae3]"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-md transition-all bg-[#b8972a] text-[#080808] hover:brightness-110"
          >
            Get Started Free{" "}
            <LucideArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
