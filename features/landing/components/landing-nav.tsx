import Link from "next/link";
import { LucideArrowRight } from "lucide-react";

export function LandingNav() {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(8,8,8,0.82)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between"
      >
        <Link
          href="/"
          aria-label="TaxDash — go to homepage"
          className="flex items-center gap-2.5"
        >
          <span
            aria-hidden="true"
            className="w-7 h-7 rounded flex items-center justify-center text-[#080808] text-sm font-bold shrink-0"
            style={{ background: "#b8972a" }}
          >
            T
          </span>
          <span className="font-semibold text-[14px] tracking-tight">
            TaxDash
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] px-4 py-2 rounded-md transition-colors"
            style={{ color: "#7a776f" }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md transition-all"
            style={{ background: "#b8972a", color: "#080808" }}
          >
            Get Started <LucideArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
