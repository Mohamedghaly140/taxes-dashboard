import { LandingNav } from "./landing-nav";
import { LandingHero } from "./landing-hero";
import { LandingFeatures } from "./landing-features";
import { LandingCta } from "./landing-cta";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f3ee] text-[#1a1918] dark:bg-[#080808] dark:text-[#eeeae3]">
      {/* Global animation + hover styles scoped to the landing page */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fu { opacity: 0; animation: fadeUp 0.75s cubic-bezier(0.22,1,0.36,1) forwards; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.18s; }
        .d3 { animation-delay: 0.30s; }
        .d4 { animation-delay: 0.44s; }
        .card-hover { transition: border-color 0.25s, background 0.25s, transform 0.25s; }
        .card-hover:hover {
          border-color: rgba(184,151,42,0.35) !important;
          background: #ebe7de !important;
          transform: translateY(-2px);
        }
        .dark .card-hover:hover {
          border-color: rgba(184,151,42,0.22) !important;
          background: #101010 !important;
        }
        .btn-ghost:hover {
          color: #1a1918;
          border-color: rgba(0,0,0,0.12);
        }
        .dark .btn-ghost:hover {
          color: #eeeae3;
          border-color: rgba(255,255,255,0.18);
        }
        .landing-hero-bg {
          background-image:
            radial-gradient(ellipse 70% 55% at 50% -5%, rgba(184,151,42,0.12) 0%, transparent 65%),
            radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 100% 100%, 32px 32px;
        }
        .dark .landing-hero-bg {
          background-image:
            radial-gradient(ellipse 70% 55% at 50% -5%, rgba(184,151,42,0.09) 0%, transparent 65%),
            radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 100% 100%, 32px 32px;
        }
        .hero-fade {
          background: linear-gradient(to bottom, transparent, #f5f3ee);
        }
        .dark .hero-fade {
          background: linear-gradient(to bottom, transparent, #080808);
        }
      `}</style>

      <LandingNav />

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
