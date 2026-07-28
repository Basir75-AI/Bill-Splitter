import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { Product } from "../types";
import { ProductArt } from "./ProductArt";
import { useCart } from "../context/CartContext";

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/70 backdrop-blur-sm md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-[92vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-t-2xl bg-paper md:grid-cols-2 md:rounded-2xl"
          >
            <div className="paper-grid relative flex items-center justify-center bg-paper-2/60 p-10">
              <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
                {product.code} &middot; {product.colorway}
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-5 top-5 rounded-full border border-ink/15 p-1.5 text-ink/60 hover:border-copper hover:text-copper-dark md:hidden"
              >
                <X className="h-4 w-4" />
              </button>
              <ProductArt category={product.category} className="h-56 w-56 text-ink/80 md:h-64 md:w-64" />
            </div>

            <div className="relative flex flex-col p-6 md:p-8">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-6 top-6 hidden rounded-full border border-ink/15 p-1.5 text-ink/60 hover:border-copper hover:text-copper-dark md:block"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="font-display text-2xl font-semibold text-ink">{product.name}</h3>
              <p className="mt-1 font-sans text-sm text-ink/60">{product.tagline}</p>
              <p className="mt-4 font-sans text-sm leading-relaxed text-ink/70">{product.description}</p>

              <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">{spec.label}</dt>
                    <dd className="font-mono text-xs text-ink/70">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                Materials &mdash; {product.materials.join(" / ")}
              </p>

              <div className="mt-auto flex items-center gap-4 pt-6">
                <div className="flex items-center gap-3 rounded-full border border-ink/15 px-3 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="text-ink/60 hover:text-copper-dark"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-4 text-center font-mono text-xs text-ink">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="text-ink/60 hover:text-copper-dark"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    addToCart(product, qty);
                    onClose();
                  }}
                  className="flex-1 rounded-full bg-navy px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-copper hover:text-navy"
                >
                  Add to cart &middot; ${(product.price * qty).toFixed(0)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
