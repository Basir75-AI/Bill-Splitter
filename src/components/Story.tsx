function FounderMark() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full text-ink/70" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="120" cy="92" r="42" />
        <path d="M56 210c0-46 29-72 64-72s64 26 64 72" />
        <path d="M84 78c6-18 24-30 36-30s30 12 36 30" opacity={0.4} strokeDasharray="1 6" />
      </g>
      <line x1="62" y1="222" x2="178" y2="222" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1="62" y1="214" x2="62" y2="222" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1="178" y1="214" x2="178" y2="222" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <text x="120" y="238" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="currentColor" opacity={0.5}>
        FOUNDER-01
      </text>
    </svg>
  );
}

export function Story() {
  return (
    <section id="story" className="bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <div className="paper-grid mx-auto aspect-square max-w-sm rounded-2xl border border-ink/12 bg-paper-2/50 p-10">
            <FounderMark />
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-copper-dark">Why we started</p>
          <blockquote className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-ink md:text-3xl">
            &ldquo;I returned three pairs of headphones in one year before I decided to
            just build the ones I wanted.&rdquo;
          </blockquote>
          <div className="mt-8 space-y-4 font-sans text-base leading-relaxed text-ink/70">
            <p>
              Mr B Ventures started on a kitchen table with a soldering iron and a
              spreadsheet of everything wrong with the electronics we were buying:
              batteries that degraded in a year, plastic that creaked, spec sheets
              that rounded every number up.
            </p>
            <p>
              We build in small runs, test every unit against the spec printed on
              the box, and publish the tolerances most brands keep in an internal
              doc. If a number on our site doesn&rsquo;t match what you measure at
              home, we want to hear about it.
            </p>
          </div>
          <p className="mt-8 font-display text-lg text-ink">&mdash; Mr. B, Founder</p>
        </div>
      </div>
    </section>
  );
}
