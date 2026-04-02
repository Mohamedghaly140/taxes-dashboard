import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col justify-center pt-[60px]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(184,151,42,0.09) 0%, transparent 65%), radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 32px 32px",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* Eyebrow */}
        <p
          className="fu d1 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-10"
          style={{
            border: "1px solid rgba(184,151,42,0.28)",
            background: "rgba(184,151,42,0.06)",
          }}
        >
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#b8972a" }}
          />
          <span
            className="text-[11px] font-medium tracking-[0.14em] uppercase"
            style={{ color: "#b8972a" }}
          >
            Customer Management Platform
          </span>
        </p>

        <h1
          id="hero-heading"
          className="fu d2 text-[clamp(3rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.02em] mb-8 max-w-4xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          Replace Excel.
          <br />
          <span style={{ color: "#b8972a" }}>Secure</span> every
          <br />
          client file.
        </h1>

        <p
          className="fu d3 text-[17px] max-w-lg leading-relaxed mb-10"
          style={{ color: "#6b6866" }}
        >
          A secure, multi-tenant dashboard built exclusively for tax
          professionals. Manage client credentials, file numbers, and tax
          records — all in one place.
        </p>

        <div className="fu d4 flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-md text-[14px] transition-all hover:brightness-110"
            style={{ background: "#eeeae3", color: "#080808" }}
          >
            Create Free Account{" "}
            <LucideArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/login"
            className="btn-ghost inline-flex items-center gap-2 font-medium px-6 py-3 rounded-md text-[14px] transition-all"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#7a776f",
            }}
          >
            Sign In to Dashboard
          </Link>
        </div>
      </div>

      {/* Fade into next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #080808)",
        }}
      />
    </section>
  );
}
