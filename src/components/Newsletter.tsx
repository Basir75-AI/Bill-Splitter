import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-copper py-16 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center md:px-10">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            Get the next drop before the catalog does.
          </h2>
          <p className="mt-2 max-w-md font-sans text-sm text-navy/70">
            One email when a product ships, never more. We'll include the spec sheet, not just the marketing photo.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper">
            <Check className="h-3.5 w-3.5" />
            You're on the list
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-3 rounded-full bg-navy p-1.5 pl-5 shadow-inner">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-paper placeholder:text-chalk-dim focus:outline-none"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-copper px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-navy transition-colors hover:bg-copper-light"
            >
              Sign up
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
