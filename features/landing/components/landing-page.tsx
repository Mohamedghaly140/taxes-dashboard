import { LandingNav } from "./landing-nav";
import { LandingHero } from "./landing-hero";
import { LandingFeatures } from "./landing-features";
import { LandingCta } from "./landing-cta";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#080808", color: "#eeeae3" }}
    >
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
        .card-hover:hover { border-color: rgba(184,151,42,0.22) !important; background: #101010 !important; transform: translateY(-2px); }
        .btn-ghost:hover { color: #eeeae3; border-color: rgba(255,255,255,0.18); }
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
