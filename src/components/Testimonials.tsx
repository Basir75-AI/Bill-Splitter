const REPORTS = [
  {
    quote:
      "I've measured the ANC depth myself against three flagship pairs. Halcyon is the only one that hit its printed number outdoors.",
    name: "R. Okafor",
    role: "Audio engineer",
    product: "MB-02 Halcyon",
  },
  {
    quote:
      "Anchor replaced three separate chargers on my desk and it's the only one my phone actually fast-charges from every time.",
    name: "T. Vance",
    role: "Field technician",
    product: "MB-05 Anchor",
  },
  {
    quote:
      "Nine days was a real number, not a lab number. I charge Tempo on Sundays and forget about it the rest of the week.",
    name: "S. Ibarra",
    role: "Trail runner",
    product: "MB-04 Tempo",
  },
];

export function Testimonials() {
  return (
    <section id="field-notes" className="bg-paper-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-copper-dark">Field notes</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Measured by the people who bought it.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {REPORTS.map((r) => (
            <figure key={r.name} className="flex h-full flex-col rounded-xl border border-ink/12 bg-paper p-6">
              <blockquote className="flex-1 font-sans text-[15px] leading-relaxed text-ink/80">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-ink/10 pt-4">
                <p className="font-display text-sm font-semibold text-ink">{r.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                  {r.role} &middot; {r.product}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
