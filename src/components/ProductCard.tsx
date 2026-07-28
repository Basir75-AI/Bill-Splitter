import { Plus } from "lucide-react";
import { Product } from "../types";
import { ProductArt } from "./ProductArt";
import { useCart } from "../context/CartContext";

export function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-ink/12 bg-paper transition-shadow hover:shadow-[0_8px_32px_-16px_rgba(27,33,48,0.35)]">
      <button
        onClick={() => onOpen(product)}
        className="paper-grid relative flex aspect-square items-center justify-center bg-paper-2/60 p-8 text-ink/80 transition-colors group-hover:text-copper-dark"
      >
        <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
          {product.code}
        </span>
        <ProductArt category={product.category} className="h-full w-full" />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
            <span className="font-mono text-sm text-ink/70">${product.price}</span>
          </div>
          <p className="mt-1 font-sans text-sm text-ink/60">{product.tagline}</p>
        </div>

        <dl className="mt-1 space-y-1 border-t border-ink/10 pt-3">
          {product.specs.slice(0, 2).map((spec) => (
            <div key={spec.label} className="flex items-baseline justify-between gap-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">{spec.label}</dt>
              <dd className="truncate font-mono text-[11px] text-ink/70">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            onClick={() => onOpen(product)}
            className="flex-1 rounded-full border border-ink/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/70 transition-colors hover:border-copper hover:text-copper-dark"
          >
            Spec sheet
          </button>
          <button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-copper hover:text-navy"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
