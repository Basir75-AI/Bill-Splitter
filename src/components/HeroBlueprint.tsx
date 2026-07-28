import { motion, Variants } from "motion/react";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: i * 0.15, duration: 1.1, ease: "easeInOut" }, opacity: { delay: i * 0.15, duration: 0.3 } },
  }),
};

const CALLOUTS = [
  { label: "40MM BIO-CELLULOSE DRIVER", x1: 232, y1: 214, x2: 100, y2: 168, tx: 40, ty: 162, anchor: "start" as const },
  { label: "FORGED ALUMINUM YOKE", x1: 320, y1: 120, x2: 320, y2: 54, tx: 320, ty: 40, anchor: "middle" as const },
  { label: "-42dB ANC", x1: 408, y1: 214, x2: 520, y2: 168, tx: 530, ty: 162, anchor: "start" as const },
  { label: "60H PLAYBACK", x1: 408, y1: 280, x2: 520, y2: 320, tx: 530, ty: 324, anchor: "start" as const },
];

export function HeroBlueprint() {
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" aria-hidden="true">
      <g stroke="#B9CBDD" strokeWidth={1} opacity={0.18}>
        <line x1="0" y1="200" x2="640" y2="200" />
        <line x1="320" y1="0" x2="320" y2="400" />
      </g>

      {/* headband */}
      <motion.path
        d="M210 214v-30c0-66 49-120 110-120s110 54 110 120v30"
        fill="none"
        stroke="#B9CBDD"
        strokeWidth={1.75}
        strokeLinecap="round"
        variants={draw}
        custom={0}
        initial="hidden"
        animate="visible"
      />

      {/* ear cups */}
      <motion.rect
        x="180" y="196" width="56" height="92" rx="18"
        fill="none" stroke="#B9CBDD" strokeWidth={1.75}
        variants={draw} custom={0.6} initial="hidden" animate="visible"
      />
      <motion.rect
        x="404" y="196" width="56" height="92" rx="18"
        fill="none" stroke="#B9CBDD" strokeWidth={1.75}
        variants={draw} custom={0.6} initial="hidden" animate="visible"
      />

      {/* yoke connectors */}
      <motion.path
        d="M208 210c-14 3-22 12-22 24"
        fill="none" stroke="#B9CBDD" strokeWidth={1.4} opacity={0.7}
        variants={draw} custom={1} initial="hidden" animate="visible"
      />
      <motion.path
        d="M432 210c14 3 22 12 22 24"
        fill="none" stroke="#B9CBDD" strokeWidth={1.4} opacity={0.7}
        variants={draw} custom={1} initial="hidden" animate="visible"
      />

      {/* driver rings inside cup */}
      <motion.circle
        cx="208" cy="242" r="16" fill="none" stroke="#D98A4E" strokeWidth={1.4}
        variants={draw} custom={1.3} initial="hidden" animate="visible"
      />
      <motion.circle
        cx="432" cy="242" r="16" fill="none" stroke="#D98A4E" strokeWidth={1.4}
        variants={draw} custom={1.3} initial="hidden" animate="visible"
      />

      {/* callouts */}
      {CALLOUTS.map((c, i) => (
        <motion.g key={c.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 + i * 0.15, duration: 0.5 }}>
          <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#7B8EA3" strokeWidth={1} />
          <circle cx={c.x1} cy={c.y1} r={2.5} fill="#D98A4E" />
          <text
            x={c.tx}
            y={c.ty}
            textAnchor={c.anchor}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10"
            letterSpacing="0.5"
            fill="#B9CBDD"
          >
            {c.label}
          </text>
        </motion.g>
      ))}

      {/* dimension line under product */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.5 }}>
        <line x1="180" y1="320" x2="180" y2="332" stroke="#7B8EA3" strokeWidth={1} />
        <line x1="460" y1="320" x2="460" y2="332" stroke="#7B8EA3" strokeWidth={1} />
        <line x1="180" y1="326" x2="460" y2="326" stroke="#7B8EA3" strokeWidth={1} />
        <text x="320" y="348" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7B8EA3">
          MB-02 &middot; HALCYON &middot; 240G
        </text>
      </motion.g>
    </svg>
  );
}
