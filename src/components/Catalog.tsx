import { useState } from "react";
import { PRODUCTS } from "../data/products";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

export function Catalog() {
  const [openProduct, setOpenProduct] = useState<Product | null>(null);

  return (
    <section id="catalog" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-ink/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-copper-dark">Index</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              The catalog
            </h2>
          </div>
          <p className="max-w-sm font-sans text-sm text-ink/60">
            Six products, six part numbers. Every spec on the card is the same one
            printed on the box &mdash; nothing rounds up.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.code} product={product} onOpen={setOpenProduct} />
          ))}
        </div>
      </div>

      <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
    </section>
  );
}
