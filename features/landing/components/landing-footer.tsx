export function LandingFooter() {
  return (
    <footer className="py-8 border-t border-black/6 dark:border-white/4">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2" aria-label="TaxDash">
          <span
            aria-hidden="true"
            className="w-5 h-5 rounded flex items-center justify-center bg-[#b8972a] text-[#080808] text-[10px] font-bold"
          >
            T
          </span>
          <span className="text-[12px] text-[#5c5955] dark:text-[#9c9890]">
            TaxDash
          </span>
        </div>

        <small className="text-[12px] not-italic text-[#5c5955] dark:text-[#9c9890]">
          © {new Date().getFullYear()} TaxDash. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
