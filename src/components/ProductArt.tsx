import { ReactElement } from "react";
import { ProductCategory } from "../types";

type ArtProps = {
  className?: string;
};

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Tick({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} {...common} strokeWidth={1} opacity={0.5} />;
}

export function EarbudsArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <g {...common}>
        <path d="M92 96c0-16 12-28 28-28s28 12 28 28v34c0 12-9 21-21 21h-4v18c0 7-6 12-13 12s-12-5-12-12v-52" />
        <circle cx="120" cy="98" r="9" opacity={0.6} />
        <path d="M148 100c14-3 24 4 24 16" opacity={0.7} />
        <path d="M136 44c0-10 8-18 18-18" opacity={0.4} strokeDasharray="1 6" />
      </g>
      <g {...common} opacity={0.35}>
        <rect x="66" y="150" width="52" height="38" rx="10" />
        <path d="M66 160h52" opacity={0.6} />
      </g>
      <Tick x1={92} y1={220} x2={92} y2={228} />
      <Tick x1={148} y1={220} x2={148} y2={228} />
      <line x1={92} y1={224} x2={148} y2={224} {...common} strokeWidth={1} opacity={0.5} />
    </svg>
  );
}

export function HeadphonesArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <g {...common}>
        <path d="M56 128v-8c0-38 29-69 64-69s64 31 64 69v8" />
        <rect x="38" y="118" width="30" height="52" rx="12" />
        <rect x="172" y="118" width="30" height="52" rx="12" />
        <path d="M53 130c-9 2-15 8-15 16" opacity={0.5} />
        <path d="M187 130c9 2 15 8 15 16" opacity={0.5} />
      </g>
      <Tick x1={53} y1={196} x2={53} y2={204} />
      <Tick x1={187} y1={196} x2={187} y2={204} />
      <line x1={53} y1={200} x2={187} y2={200} {...common} strokeWidth={1} opacity={0.5} />
      <circle cx="120" cy="59" r="2" fill="currentColor" opacity={0.6} />
    </svg>
  );
}

export function SpeakerArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <g {...common}>
        <rect x="72" y="48" width="96" height="140" rx="26" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <circle key={`${row}-${col}`} cx={98 + col * 22} cy={90 + row * 22} r="4" opacity={0.55} />
          )),
        )}
        <path d="M180 96c10 8 10 32 0 40" opacity={0.5} />
        <path d="M192 84c16 14 16 50 0 64" opacity={0.35} />
      </g>
      <Tick x1={72} y1={200} x2={72} y2={208} />
      <Tick x1={168} y1={200} x2={168} y2={208} />
      <line x1={72} y1={204} x2={168} y2={204} {...common} strokeWidth={1} opacity={0.5} />
    </svg>
  );
}

export function WatchArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <g {...common}>
        <path d="M92 60h56v34H92z" opacity={0.5} />
        <path d="M92 146h56v34H92z" opacity={0.5} />
        <rect x="80" y="86" width="80" height="68" rx="18" />
        <circle cx="120" cy="120" r="24" opacity={0.7} />
        <line x1="120" y1="120" x2="120" y2="104" opacity={0.7} />
        <line x1="120" y1="120" x2="132" y2="126" opacity={0.7} />
        <rect x="160" y="112" width="8" height="16" rx="2" opacity={0.6} />
      </g>
      <Tick x1={80} y1={172} x2={80} y2={180} />
      <Tick x1={160} y1={172} x2={160} y2={180} />
      <line x1={80} y1={176} x2={160} y2={176} {...common} strokeWidth={1} opacity={0.5} />
    </svg>
  );
}

export function DockArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <g {...common}>
        <rect x="52" y="164" width="136" height="14" rx="4" />
        <circle cx="88" cy="128" r="20" />
        <path d="M88 148v16" opacity={0.6} />
        <rect x="128" y="112" width="30" height="52" rx="6" />
        <circle cx="176" cy="140" r="14" opacity={0.7} />
        <path d="M176 154v10" opacity={0.6} />
        <path d="M120 178c0 14 40 14 40 0" opacity={0.3} strokeDasharray="1 6" />
      </g>
      <Tick x1={52} y1={192} x2={52} y2={200} />
      <Tick x1={188} y1={192} x2={188} y2={200} />
      <line x1={52} y1={196} x2={188} y2={196} {...common} strokeWidth={1} opacity={0.5} />
    </svg>
  );
}

export function PowerbankArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <g {...common}>
        <rect x="78" y="52" width="84" height="140" rx="20" />
        <line x1="78" y1="92" x2="162" y2="92" opacity={0.4} />
        <rect x="96" y="106" width="12" height="42" rx="2" opacity={0.6} />
        <rect x="132" y="106" width="12" height="42" rx="2" opacity={0.6} />
        <rect x="112" y="168" width="16" height="8" rx="2" opacity={0.7} />
      </g>
      <Tick x1={78} y1={200} x2={78} y2={208} />
      <Tick x1={162} y1={200} x2={162} y2={208} />
      <line x1={78} y1={204} x2={162} y2={204} {...common} strokeWidth={1} opacity={0.5} />
    </svg>
  );
}

const artByCategory: Record<ProductCategory, (props: ArtProps) => ReactElement> = {
  earbuds: EarbudsArt,
  headphones: HeadphonesArt,
  speaker: SpeakerArt,
  watch: WatchArt,
  dock: DockArt,
  powerbank: PowerbankArt,
};

export function ProductArt({ category, className }: { category: ProductCategory; className?: string }) {
  const Art = artByCategory[category];
  return <Art className={className} />;
}
