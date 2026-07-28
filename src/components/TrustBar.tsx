const ITEMS = [
  "Designed & tuned in-house",
  "2-year warranty, no questions",
  "30-day returns",
  "Free 2-day shipping over $75",
];

export function TrustBar() {
  return (
    <div className="border-y border-ink/10 bg-paper-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-4 md:justify-between md:px-10">
        {ITEMS.map((item) => (
          <span key={item} className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
