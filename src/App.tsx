import { CartProvider } from "./context/CartContext";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { Catalog } from "./components/Catalog";
import { Pillars } from "./components/Pillars";
import { Story } from "./components/Story";
import { Testimonials } from "./components/Testimonials";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-paper font-sans text-ink">
        <Nav />
        <main>
          <Hero />
          <TrustBar />
          <Catalog />
          <Pillars />
          <Story />
          <Testimonials />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
