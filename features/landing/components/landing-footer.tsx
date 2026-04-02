export function LandingFooter() {
  return (
    <footer
      className="py-8"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2" aria-label="TaxDash">
          <span
            aria-hidden="true"
            className="w-5 h-5 rounded flex items-center justify-center text-[#080808] text-[10px] font-bold"
            style={{ background: "#b8972a" }}
          >
            T
          </span>
          <span className="text-[12px]" style={{ color: "#2e2d2b" }}>
            TaxDash
          </span>
        </div>

        <small
          className="text-[12px] not-italic"
          style={{ color: "#2e2d2b" }}
        >
          © {new Date().getFullYear()} TaxDash. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
