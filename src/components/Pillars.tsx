import { BatteryCharging, Layers, Recycle, Waves } from "lucide-react";

const PILLARS = [
  {
    icon: Waves,
    title: "Acoustic tuning",
    detail:
      "Every driver is measured against a reference library of 400 tracks before a design ships, then measured again after the tooling changes.",
    highlight: "14 months average tuning time",
  },
  {
    icon: Layers,
    title: "Material science",
    detail:
      "We choose aluminum, bio-cellulose, and recycled polymers for what they do to sound and weight, not for what they do to margin.",
    highlight: "62% recycled input by mass",
  },
  {
    icon: BatteryCharging,
    title: "Battery engineering",
    detail:
      "Cells are rated to 800 cycles at 80% capacity, not the 300 most brands quote, and every dock ships with sag-tested wiring.",
    highlight: "800-cycle rated cells",
  },
  {
    icon: Recycle,
    title: "Circular design",
    detail:
      "Every product opens with five common screws. Replacement batteries, tips, and cushions ship for as long as the product does.",
    highlight: "10-year spare parts pledge",
  },
];

export function Pillars() {
  return (
    <section id="engineering" className="blueprint-grid bg-navy py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-copper">How we build</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-paper md:text-4xl">
            Four disciplines, one bench.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 divide-y divide-chalk/12 border-t border-chalk/12 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex flex-col gap-4 py-8 pr-6 first:pl-0 sm:px-6">
              <pillar.icon className="h-6 w-6 text-copper" strokeWidth={1.5} />
              <h3 className="font-display text-lg font-semibold text-paper">{pillar.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-chalk">{pillar.detail}</p>
              <p className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-copper-light">
                {pillar.highlight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
