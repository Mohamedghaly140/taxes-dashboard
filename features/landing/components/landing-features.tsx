import {
  LucideShield,
  LucideFileText,
  LucideKey,
  LucideUsers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  Icon: LucideIcon;
  title: string;
  desc: string;
};

const features: Feature[] = [
  {
    Icon: LucideShield,
    title: "Secure & Isolated",
    desc: "Multi-tenant architecture ensures total data isolation. Each account sees only their own clients.",
  },
  {
    Icon: LucideUsers,
    title: "Full Client CRUD",
    desc: "Add, edit, search, and remove customer records instantly with a clean, responsive interface.",
  },
  {
    Icon: LucideKey,
    title: "Credential Storage",
    desc: "Store portal passwords, email credentials, and national IDs in a single organised location.",
  },
  {
    Icon: LucideFileText,
    title: "File & Tax Tracking",
    desc: "Organise clients by file number and tax registration number. Never lose track of a case.",
  },
];

export function LandingFeatures() {
  return (
    <section aria-labelledby="features-heading" className="py-28">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-16">
          <p
            className="text-[11px] uppercase tracking-[0.14em] font-medium mb-4"
            style={{ color: "#b8972a" }}
          >
            Why TaxDash
          </p>
          <h2
            id="features-heading"
            className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Everything you need,
            <br />
            <span style={{ color: "#5a5752" }}>nothing you don&apos;t.</span>
          </h2>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 list-none p-0 m-0">
          {features.map(({ Icon, title, desc }) => (
            <li
              key={title}
              className="card-hover rounded-xl p-6"
              style={{
                border: "1px solid rgba(255,255,255,0.05)",
                background: "#0c0c0c",
              }}
            >
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{
                  background: "rgba(184,151,42,0.08)",
                  border: "1px solid rgba(184,151,42,0.12)",
                }}
              >
                <Icon className="w-5 h-5" style={{ color: "#b8972a" }} />
              </div>
              <h3
                className="font-medium text-[13px] mb-2.5"
                style={{ color: "#d4cfc7" }}
              >
                {title}
              </h3>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "#4a4845" }}
              >
                {desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
