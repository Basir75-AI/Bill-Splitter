import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductArt } from "./ProductArt";

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, removeFromCart, subtotal, itemCount } = useCart();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) setConfirmed(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-navy/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Cart <span className="font-mono text-sm text-ink/40">({itemCount})</span>
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="rounded-full border border-ink/15 p-1.5 text-ink/60 hover:border-copper hover:text-copper-dark">
                <X className="h-4 w-4" />
              </button>
            </div>

            {confirmed ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <div className="rounded-full bg-navy p-3">
                  <ShoppingBag className="h-5 w-5 text-copper" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink">Order confirmed</h3>
                <p className="font-sans text-sm text-ink/60">
                  A confirmation and spec sheet for every item is on its way to your
                  inbox. Thanks for building with us.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 rounded-full bg-navy px-6 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-paper hover:bg-copper hover:text-navy"
                >
                  Back to catalog
                </button>
              </div>
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <ShoppingBag className="h-8 w-8 text-ink/25" strokeWidth={1.3} />
                <p className="font-sans text-sm text-ink/50">Your cart is empty. The catalog is one scroll away.</p>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-full border border-ink/15 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/70 hover:border-copper hover:text-copper-dark"
                >
                  Browse catalog
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  <ul className="divide-y divide-ink/10">
                    {lines.map((line) => (
                      <li key={line.product.slug} className="flex gap-4 py-5">
                        <div className="paper-grid flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-paper-2/50 p-2 text-ink/70">
                          <ProductArt category={line.product.category} className="h-full w-full" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-display text-sm font-semibold text-ink">{line.product.name}</p>
                              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">{line.product.code}</p>
                            </div>
                            <span className="font-mono text-xs text-ink/70">
                              ${(line.product.price * line.quantity).toFixed(0)}
                            </span>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 rounded-full border border-ink/15 px-2.5 py-1">
                              <button
                                onClick={() => setQuantity(line.product.slug, line.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="text-ink/60 hover:text-copper-dark"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-3 text-center font-mono text-[11px] text-ink">{line.quantity}</span>
                              <button
                                onClick={() => setQuantity(line.product.slug, line.quantity + 1)}
                                aria-label="Increase quantity"
                                className="text-ink/60 hover:text-copper-dark"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(line.product.slug)}
                              className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40 hover:text-copper-dark"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-ink/10 px-6 py-6">
                  <div className="flex items-center justify-between font-mono text-sm text-ink">
                    <span className="text-ink/50">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                    Shipping & taxes calculated at checkout
                  </p>
                  <button
                    onClick={() => setConfirmed(true)}
                    className="mt-4 w-full rounded-full bg-navy px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-copper hover:text-navy"
                  >
                    Checkout &middot; ${subtotal.toFixed(2)}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
