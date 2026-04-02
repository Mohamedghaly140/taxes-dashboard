import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="landing-hero-bg relative min-h-screen flex flex-col justify-center pt-[60px]"
    >
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* Eyebrow */}
        <p className="fu d1 inline-flex items-center gap-2 rounded-full border border-[#b8972a]/35 bg-[#b8972a]/10 px-3.5 py-1.5 mb-10 dark:border-[#b8972a]/28 dark:bg-[#b8972a]/6">
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#b8972a]"
          />
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#b8972a]">
            Customer Management Platform
          </span>
        </p>

        <h1
          id="hero-heading"
          className="fu d2 text-[clamp(3rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.02em] mb-8 max-w-4xl text-[#1a1918] dark:text-[#eeeae3]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          Replace Excel.
          <br />
          <span className="text-[#b8972a]">Secure</span> every
          <br />
          client file.
        </h1>

        <p className="fu d3 text-[17px] max-w-lg leading-relaxed mb-10 text-[#5a5752] dark:text-[#6b6866]">
          A secure, multi-tenant dashboard built exclusively for tax
          professionals. Manage client credentials, file numbers, and tax
          records — all in one place.
        </p>

        <div className="fu d4 flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-md text-[14px] transition-all bg-[#1a1918] text-[#f5f3ee] hover:brightness-110 dark:bg-[#eeeae3] dark:text-[#080808]"
          >
            Create Free Account{" "}
            <LucideArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/login"
            className="btn-ghost inline-flex items-center gap-2 font-medium px-6 py-3 rounded-md text-[14px] transition-all border border-black/10 text-[#5a5752] dark:border-white/9 dark:text-[#7a776f]"
          >
            Sign In to Dashboard
          </Link>
        </div>
      </div>

      {/* Fade into next section */}
      <div
        aria-hidden="true"
        className="hero-fade absolute inset-x-0 bottom-0 h-24 pointer-events-none"
      />
    </section>
  );
}
