import Link from "next/link";
import { LucideArrowRight } from "lucide-react";
import ThemeSwitcher from "@/components/theme/theme-switcher";

export function LandingNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b backdrop-blur-md border-black/6 bg-[#f5f3ee]/82 dark:border-white/5 dark:bg-[#080808]/82">
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
            className="w-7 h-7 rounded flex items-center justify-center bg-[#b8972a] text-[#080808] text-sm font-bold shrink-0"
          >
            T
          </span>
          <span className="font-semibold text-[14px] tracking-tight text-[#1a1918] dark:text-[#eeeae3]">
            TaxDash
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeSwitcher className="shrink-0 border-black/10 bg-background/60 dark:border-border" />
          <Link
            href="/login"
            className="text-[13px] px-4 py-2 rounded-md transition-colors text-[#5a5752] hover:text-[#1a1918] dark:text-[#7a776f] dark:hover:text-[#eeeae3]"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md transition-all bg-[#b8972a] text-[#080808] hover:brightness-110"
          >
            Get Started <LucideArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
