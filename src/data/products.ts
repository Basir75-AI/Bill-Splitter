import { Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    code: "MB-01",
    slug: "aerofoil",
    name: "Aerofoil",
    category: "earbuds",
    tagline: "In-ear, out of the way",
    description:
      "A 4.8g titanium-coated driver housing tuned in our own chamber, not borrowed off a reference design. Aerofoil disappears in the ear and gets out of your way for 32 hours before it needs the case again.",
    price: 179,
    colorway: "Graphite / Copper trim",
    specs: [
      { label: "Driver", value: "10mm dynamic, titanium-coated" },
      { label: "ANC depth", value: "-35dB adaptive" },
      { label: "Battery", value: "8h + 32h case" },
      { label: "Weight", value: "4.8g per bud" },
      { label: "Rating", value: "IPX4 sweat & rain" },
    ],
    materials: ["Recycled aluminum shell", "Titanium-coated diaphragm", "Silicone tips, 4 sizes"],
  },
  {
    code: "MB-02",
    slug: "halcyon",
    name: "Halcyon",
    category: "headphones",
    tagline: "Sixty hours, zero compromise",
    description:
      "Halcyon is the pair we wear on the factory floor and on the plane home from it. Forged aluminum yokes, memory-foam cups, and a driver we spent fourteen months tuning against a wall of reference tracks.",
    price: 329,
    colorway: "Sand / Graphite",
    specs: [
      { label: "Driver", value: "40mm bio-cellulose" },
      { label: "ANC depth", value: "-42dB adaptive, 3 modes" },
      { label: "Battery", value: "60h ANC on" },
      { label: "Weight", value: "240g" },
      { label: "Charging", value: "USB-C, 10min = 6h" },
    ],
    materials: ["Forged aluminum yoke", "Memory-foam & protein-leather cups", "Bio-cellulose diaphragm"],
  },
  {
    code: "MB-03",
    slug: "monolith",
    name: "Monolith",
    category: "speaker",
    tagline: "Fills the room, not the shelf",
    description:
      "One driver array, two passive radiators, and a cabinet CNC-milled from a single billet so there's nothing loose to buzz at volume. Monolith is built to be the last speaker on your counter.",
    price: 249,
    colorway: "Warm charcoal",
    specs: [
      { label: "Output", value: "60W peak, dual passive radiators" },
      { label: "Battery", value: "20h at 70% volume" },
      { label: "Rating", value: "IP67 dust & submersion" },
      { label: "Range", value: "30m / 100ft, Bluetooth 5.3" },
      { label: "Pairing", value: "Stereo pair & multi-room" },
    ],
    materials: ["CNC-milled aluminum shell", "Marine-grade grille mesh", "Silicone base ring"],
  },
  {
    code: "MB-04",
    slug: "tempo",
    name: "Tempo",
    category: "watch",
    tagline: "Nine days on one charge",
    description:
      "Tempo strips the smartwatch back to what you actually check: time, heart rate, the next nine days without a charger. Sapphire glass over an always-on display that doesn't apologize for existing.",
    price: 299,
    colorway: "Brushed steel / Copper bezel",
    specs: [
      { label: "Display", value: "1.4in AMOLED, always-on" },
      { label: "Battery", value: "9 days typical use" },
      { label: "Sensors", value: "HR, SpO2, GPS, altimeter" },
      { label: "Rating", value: "5ATM water resistance" },
      { label: "Glass", value: "Sapphire crystal" },
    ],
    materials: ["316L stainless steel case", "Sapphire crystal lens", "Fluoroelastomer strap"],
  },
  {
    code: "MB-05",
    slug: "anchor",
    name: "Anchor",
    category: "dock",
    tagline: "Three devices, one cable to the wall",
    description:
      "Anchor charges a phone, a watch, and a pair of earbuds off a single 65W GaN brick, sequenced so the fastest-draining device always gets priority. No app, no subscription, just a smaller footprint on your desk.",
    price: 89,
    colorway: "Sand aluminum",
    specs: [
      { label: "Output", value: "65W GaN, 3 ports" },
      { label: "Charge time", value: "Phone 0-80% in 35min" },
      { label: "Compatibility", value: "USB-C PD & Qi2 pad" },
      { label: "Footprint", value: "9cm base diameter" },
      { label: "Material", value: "Machined aluminum" },
    ],
    materials: ["Machined aluminum base", "Woven-fabric cable", "Silicone device rests"],
  },
  {
    code: "MB-06",
    slug: "beacon",
    name: "Beacon",
    category: "powerbank",
    tagline: "A full laptop charge, in a jacket pocket",
    description:
      "Beacon carries 20,000mAh at 100W through a single USB-C port, enough to take a drained laptop past half in the time it takes to board a flight. The aluminum shell doubles as a heat sink, so it never throttles.",
    price: 69,
    colorway: "Graphite",
    specs: [
      { label: "Capacity", value: "20,000mAh / 74Wh" },
      { label: "Output", value: "100W PD, 2 ports" },
      { label: "Recharge", value: "0-100% in 65min at 100W" },
      { label: "Weight", value: "385g" },
      { label: "Display", value: "Digital % readout" },
    ],
    materials: ["Anodized aluminum shell", "LiPo cell stack", "Recycled-PET carry pouch"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
