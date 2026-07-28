import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const LINKS = [
  { label: "Catalog", href: "#catalog" },
  { label: "Engineering", href: "#engineering" },
  { label: "Story", href: "#story" },
  { label: "Field notes", href: "#field-notes" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-navy/95 backdrop-blur border-b border-chalk/10" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-baseline gap-2.5 group">
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            MR B <span className="text-copper">VENTURES</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-chalk transition-colors hover:text-copper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-full border border-chalk/25 px-3.5 py-2 text-chalk transition-colors hover:border-copper hover:text-copper"
            aria-label={`Open cart, ${itemCount} items`}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
            <span className="font-mono text-[11px]">{itemCount}</span>
          </button>
          <button
            className="rounded-full border border-chalk/25 p-2 text-chalk md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-chalk/10 bg-navy px-6 py-4 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 font-mono text-xs uppercase tracking-[0.16em] text-chalk hover:text-copper"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
