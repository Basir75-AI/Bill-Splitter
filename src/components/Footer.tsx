const COLUMNS = [
  {
    title: "Shop",
    links: ["Earbuds", "Headphones", "Speakers", "Watches", "Charging"],
  },
  {
    title: "Company",
    links: ["Our story", "Engineering notes", "Sustainability", "Careers"],
  },
  {
    title: "Support",
    links: ["Warranty", "Spare parts", "Shipping & returns", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy pt-20">
      <div className="mx-auto max-w-7xl px-6 pb-10 md:px-10">
        <div className="grid grid-cols-2 gap-10 border-b border-chalk/12 pb-14 md:grid-cols-5">
          <div className="col-span-2">
            <span className="font-display text-lg font-semibold tracking-tight text-paper">
              MR B <span className="text-copper">VENTURES</span>
            </span>
            <p className="mt-3 max-w-xs font-sans text-sm text-chalk">
              Precision-engineered audio, wearables, and charging gear. Designed,
              tuned, and tolerance-checked in-house.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-chalk-dim">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-sans text-sm text-chalk transition-colors hover:text-copper">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 py-6 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-chalk-dim">
            &copy; {new Date().getFullYear()} Mr B Ventures. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-chalk-dim">
            Designed on the bench, not in a boardroom.
          </p>
        </div>
      </div>
    </footer>
  );
}
