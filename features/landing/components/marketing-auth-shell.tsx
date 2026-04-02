import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";

export function MarketingAuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#f5f3ee] text-[#1a1918] dark:bg-[#080808] dark:text-[#eeeae3]">
      <LandingNav />
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-[84px]">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
