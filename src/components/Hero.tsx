import { motion } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { HeroBlueprint } from "./HeroBlueprint";

const STATS = [
  { value: "40mm", label: "Driver diameter" },
  { value: "-42dB", label: "Active noise cancelling" },
  { value: "60h", label: "Battery, ANC on" },
];

export function Hero() {
  return (
    <section id="top" className="blueprint-grid relative overflow-hidden bg-navy pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/0 via-navy/0 to-navy" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-12 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:col-span-6"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-copper">
            Collection 006 &mdash; Est. by two engineers who hated their commute
          </p>
          <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-paper text-balance md:text-6xl">
            We design electronics like they&rsquo;ll get taken apart to be understood.
          </h1>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-chalk">
            Mr B Ventures builds audio, wearables, and charging gear from the driver
            out&nbsp;&mdash; tuned, tolerance-checked, and specified in the open. No
            filler features, no planned obsolescence.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#catalog"
              className="group inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-navy transition-colors hover:bg-copper-light"
            >
              Shop the catalog
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#engineering"
              className="inline-flex items-center gap-2 rounded-full border border-chalk/25 px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-chalk transition-colors hover:border-copper hover:text-copper"
            >
              <FileText className="h-3.5 w-3.5" />
              Read the spec sheet
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-chalk/15 pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-semibold text-copper">{s.value}</dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-chalk-dim">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="md:col-span-6"
        >
          <div className="relative rounded-2xl border border-chalk/15 bg-navy-2/60 p-4">
            <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.14em] text-chalk-dim">
              Fig. 01 &mdash; Halcyon, exploded
            </span>
            <HeroBlueprint />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
